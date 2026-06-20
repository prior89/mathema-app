// =============================================================
//  Mathēma — Azure infrastructure (Bicep)
//
//  배포 자원 (Central India 권장):
//    - Log Analytics + Application Insights
//    - Azure Container Registry (ACR)
//    - Azure Container Apps Environment + Container App (backend NestJS)
//    - PostgreSQL Flexible Server 16 + 'mathema' database
//    - Azure Cache for Redis (Basic C0 — PoC)
//    - Azure Key Vault (secrets: DB url, Redis key, JWT secrets, LLM keys)
//    - Azure Static Web App (frontend Vite SPA)
//    - Azure OpenAI account (opt-in — provisionAzureOpenAi=true)
//
//  배포:
//    az deployment group create \
//      --resource-group mathema-rg \
//      --template-file infra/bicep/main.bicep \
//      --parameters @infra/bicep/main.parameters.json
//
//  PoC 예상 월 비용 (Central India, sustained):
//    Container Apps (1 replica, 0.5 vCPU/1Gi):  ~$25
//    PostgreSQL Flexible B1ms 32GB:             ~$25
//    Cache for Redis Basic C0:                  ~$16
//    Static Web App Free:                       $0
//    Application Insights (5 GB/mo):            ~$10
//    Azure OpenAI (GPT-4o, 1M tokens/mo):       ~$15
//    ACR Basic:                                 ~$5
//    Total:                                     ~$96 → $10k 크레딧으로 100개월
// =============================================================

@description('Resource prefix — also used as DNS-safe parts of resource names.')
param namePrefix string = 'mathema'

@description('Azure region. Central India recommended for India PoC.')
param location string = 'centralindia'

@description('Container image tag (set by CI: e.g. \\$(Build.BuildId) or git short SHA).')
param containerImageTag string = 'latest'

@description('Bootstrap mode — first deploy when ACR has no image yet. When true, the Container App runs a Microsoft hello-world placeholder so the resource can be provisioned. After you push the real mathema-backend image to ACR, redeploy with bootstrapMode=false (or run `az containerapp update --image ...`).')
param bootstrapMode bool = true

@description('PostgreSQL admin login.')
param dbAdminUsername string = 'mathemaadmin'

@secure()
@description('PostgreSQL admin password — must satisfy Azure complexity rules. IMPORTANT: avoid the URL-reserved characters @ : / ? # & % since this value is interpolated directly into the database-url KeyVault secret; Bicep has no URL-encoding helper. If you must use them, manually URL-encode the password in the KeyVault secret after deploy.')
param dbAdminPassword string

@description('Initial backend container CPU.')
param containerCpu string = '0.5'

@description('Initial backend container memory.')
param containerMemory string = '1.0Gi'

@description('Min replicas — scale-to-zero=0, always-on=1.')
param minReplicas int = 1

@description('Max replicas — auto-scale ceiling on HTTP concurrency.')
param maxReplicas int = 5

@description('Static Web Apps region — must be one of: centralus, eastus2, westus2, westeurope, eastasia. SWA is not yet available in Central India.')
@allowed([
  'centralus'
  'eastus2'
  'westus2'
  'westeurope'
  'eastasia'
])
param swaLocation string = 'eastasia'

@description('Provision Azure OpenAI account in this RG. Default false — we use platform.openai.com directly.')
param provisionAzureOpenAi bool = false

@description('OpenAI platform API key (sk-proj-...). Stored in Key Vault and injected as AI_LLM_API_KEY.')
@secure()
param openaiApiKey string

@description('Mathpix app id for primary image OCR. Leave empty to keep OpenAI-only OCR.')
@secure()
param mathpixAppId string = ''

@description('Mathpix app key for primary image OCR. Leave empty to keep OpenAI-only OCR.')
@secure()
param mathpixAppKey string = ''

@description('Anthropic API key (optional — fallback LLM provider).')
@secure()
param anthropicApiKey string = ''

@description('JWT access token secret (32+ chars, random).')
@secure()
param jwtAccessSecret string

@description('JWT refresh token secret (32+ chars, random — different from access).')
@secure()
param jwtRefreshSecret string

@description('Google Play Developer API service-account JSON (entire file content). Used by BillingService to verify purchaseTokens. Leave empty on redeploy if already seeded out-of-band — the secret will not be overwritten.')
@secure()
param playServiceAccountJson string = ''

@description('Bootstrap mode for math-helper Container App — true on first deploy (placeholder image), false after the real Python image is pushed to ACR.')
param mathHelperBootstrap bool = true

var uniqueSuffix = uniqueString(resourceGroup().id)
var registryName = toLower('${namePrefix}acr${uniqueSuffix}')
var logAnalyticsName = '${namePrefix}-logs'
var appInsightsName = '${namePrefix}-ai'
var containerEnvName = '${namePrefix}-cae'
var backendAppName = '${namePrefix}-backend'
var mathHelperAppName = '${namePrefix}-math-helper'
var dbServerName = '${namePrefix}-pg-${uniqueSuffix}'
var dbName = 'mathema'
var redisName = '${namePrefix}-redis-${uniqueSuffix}'
var keyVaultName = '${namePrefix}-kv-${take(uniqueSuffix, 6)}'
var aoaiName = '${namePrefix}-aoai-${take(uniqueSuffix, 4)}'
var swaName = '${namePrefix}-swa'
var hasMathpix = !empty(mathpixAppId) && !empty(mathpixAppKey)

// ---------- Log Analytics + Application Insights ----------

resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: logAnalyticsName
  location: location
  properties: {
    sku: { name: 'PerGB2018' }
    retentionInDays: 30
  }
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: appInsightsName
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalytics.id
  }
}

// ---------- ACR ----------

resource acr 'Microsoft.ContainerRegistry/registries@2023-11-01-preview' = {
  name: registryName
  location: location
  sku: { name: 'Basic' }
  properties: {
    adminUserEnabled: false   // AcrPull role on Container App managed identities handles auth; admin user is not needed.
  }
}

// ---------- PostgreSQL Flexible Server ----------

resource pgServer 'Microsoft.DBforPostgreSQL/flexibleServers@2023-12-01-preview' = {
  name: dbServerName
  location: location
  sku: {
    name: 'Standard_B1ms'
    tier: 'Burstable'
  }
  properties: {
    administratorLogin: dbAdminUsername
    administratorLoginPassword: dbAdminPassword
    version: '16'
    storage: { storageSizeGB: 32 }
    backup: { backupRetentionDays: 7, geoRedundantBackup: 'Disabled' }
    highAvailability: { mode: 'Disabled' }
    // publicNetworkAccess: 'Disabled' would block Container Apps' shared-pool
    // outbound (no VNet integration, no private endpoint). Revert until we
    // add a real private network. See infra/README.md hardening notes.
    network: { publicNetworkAccess: 'Enabled' }
  }
}

resource pgFirewallAllowAzure 'Microsoft.DBforPostgreSQL/flexibleServers/firewallRules@2023-12-01-preview' = {
  parent: pgServer
  name: 'AllowAzureServices'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'   // (special: Azure-services-only — required while publicAccess is Enabled)
  }
}

resource pgDatabase 'Microsoft.DBforPostgreSQL/flexibleServers/databases@2023-12-01-preview' = {
  parent: pgServer
  name: dbName
  properties: { charset: 'UTF8', collation: 'en_US.utf8' }
}

// ---------- Redis ----------

resource redis 'Microsoft.Cache/redis@2024-03-01' = {
  name: redisName
  location: location
  properties: {
    sku: { name: 'Basic', family: 'C', capacity: 0 }
    enableNonSslPort: false
    minimumTlsVersion: '1.2'
    redisVersion: '6'
  }
}

// ---------- Azure OpenAI (optional) ----------

resource aoai 'Microsoft.CognitiveServices/accounts@2024-10-01' = if (provisionAzureOpenAi) {
  name: aoaiName
  location: location
  kind: 'OpenAI'
  sku: { name: 'S0' }
  properties: {
    customSubDomainName: aoaiName
    publicNetworkAccess: 'Disabled'
    networkAcls: {
      defaultAction: 'Deny'
      virtualNetworkRules: []
      ipRules: []
    }
  }
}

resource aoaiGpt4o 'Microsoft.CognitiveServices/accounts/deployments@2024-10-01' = if (provisionAzureOpenAi) {
  parent: aoai
  name: 'gpt-4o'
  sku: { name: 'Standard', capacity: 10 }   // 10 K TPM — PoC
  properties: {
    model: { format: 'OpenAI', name: 'gpt-4o', version: '2024-08-06' }
  }
}

// ---------- Key Vault ----------

resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: keyVaultName
  location: location
  properties: {
    sku: { family: 'A', name: 'standard' }
    tenantId: subscription().tenantId
    enableRbacAuthorization: true
    enableSoftDelete: true
    softDeleteRetentionInDays: 7
    // 'Disabled' + bypass:AzureServices does NOT include Container Apps'
    // shared-pool outbound (Microsoft trusted-services list is narrower).
    // Revert until we add VNet integration + a KV private endpoint.
    publicNetworkAccess: 'Enabled'
    networkAcls: {
      bypass: 'AzureServices'
      defaultAction: 'Allow'
      ipRules: []
      virtualNetworkRules: []
    }
  }
}

// Secrets (RBAC-protected — Container App 의 managed identity 가 읽음)
resource kvDbUrl 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'database-url'
  properties: {
    value: 'postgresql://${dbAdminUsername}:${dbAdminPassword}@${pgServer.properties.fullyQualifiedDomainName}:5432/${dbName}?sslmode=require'
  }
}

resource kvRedisUrl 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'redis-url'
  properties: {
    value: 'rediss://:${redis.listKeys().primaryKey}@${redis.properties.hostName}:${redis.properties.sslPort}'
  }
}

resource kvJwtAccess 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'jwt-access-secret'
  properties: { value: jwtAccessSecret }
}

resource kvJwtRefresh 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'jwt-refresh-secret'
  properties: { value: jwtRefreshSecret }
}

resource kvOpenai 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'openai-api-key'
  properties: { value: openaiApiKey }
}

resource kvMathpixAppId 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = if (hasMathpix) {
  parent: keyVault
  name: 'mathpix-app-id'
  properties: { value: mathpixAppId }
}

resource kvMathpixAppKey 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = if (hasMathpix) {
  parent: keyVault
  name: 'mathpix-app-key'
  properties: { value: mathpixAppKey }
}

resource kvAnthropic 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = if (!empty(anthropicApiKey)) {
  parent: keyVault
  name: 'anthropic-api-key'
  properties: { value: anthropicApiKey }
}

resource kvAoaiKey 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = if (provisionAzureOpenAi) {
  parent: keyVault
  name: 'aoai-api-key'
  properties: { value: aoai.listKeys().key1 }
}

// Admin email allowlist – comma-separated. Default seeded here; rotate via
// `az keyvault secret set --vault-name <kv> --name admin-emails --value ...`
// in the Azure portal/CLI without redeploying the template. Container App
// reads the latest revision on next restart.
resource kvAdminEmails 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'admin-emails'
  properties: { value: 'VeraStudy01@gmail.com,polopot123@gmail.com' }
}

// Google Play Developer API service-account JSON. Pre-seeded out-of-band via
// `az keyvault secret set --vault-name <kv> --name play-service-account-json
// --file matheo-play-billing-verify-<id>.json`. We declare the resource as
// a stub so Bicep tracks it for backend secretRef wiring — the actual value
// stays under operator control (don't blow it away on redeploy).
// The `existing` modifier on the parent keyVault would be cleaner but the
// rest of the template treats `keyVault` as a fresh resource, so we keep
// this consistent: the secret is overwritten with a placeholder if redeployed
// without the JSON, hence the `playServiceAccountJson` parameter (default
// empty string — empty means "leave whatever's there", but Bicep can't
// truly skip; see backend env block for the safe wiring).
resource kvPlayServiceAccount 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = if (!empty(playServiceAccountJson)) {
  parent: keyVault
  name: 'play-service-account-json'
  properties: { value: playServiceAccountJson }
}

// ---------- Container Apps Environment ----------

resource containerEnv 'Microsoft.App/managedEnvironments@2024-03-01' = {
  name: containerEnvName
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalytics.properties.customerId
        sharedKey: logAnalytics.listKeys().primarySharedKey
      }
    }
  }
}

// ---------- Backend Container App ----------

resource backendApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: backendAppName
  location: location
  identity: { type: 'SystemAssigned' }
  properties: {
    environmentId: containerEnv.id
    configuration: {
      ingress: {
        external: true
        targetPort: 4000
        transport: 'auto'
        corsPolicy: {
          allowedOrigins: [ 'https://app.matheo.verastudy.net', 'https://*.azurestaticapps.net', 'http://localhost:5173' ]
          allowedMethods: [ 'GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS' ]
          allowedHeaders: [ '*' ]
          allowCredentials: true
        }
      }
      registries: [
        {
          server: acr.properties.loginServer
          identity: 'system'
        }
      ]
      secrets: concat([
        { name: 'database-url',         keyVaultUrl: kvDbUrl.properties.secretUri,         identity: 'system' }
        { name: 'redis-url',            keyVaultUrl: kvRedisUrl.properties.secretUri,      identity: 'system' }
        { name: 'jwt-access-secret',    keyVaultUrl: kvJwtAccess.properties.secretUri,     identity: 'system' }
        { name: 'jwt-refresh-secret',   keyVaultUrl: kvJwtRefresh.properties.secretUri,    identity: 'system' }
        { name: 'openai-api-key',       keyVaultUrl: kvOpenai.properties.secretUri,        identity: 'system' }
        { name: 'admin-emails',         keyVaultUrl: kvAdminEmails.properties.secretUri,   identity: 'system' }
        // Play Developer API service-account JSON (seeded out-of-band)
        { name: 'play-service-account-json', keyVaultUrl: '${keyVault.properties.vaultUri}secrets/play-service-account-json', identity: 'system' }
      ], hasMathpix ? [
        { name: 'mathpix-app-id',  keyVaultUrl: '${keyVault.properties.vaultUri}secrets/mathpix-app-id',  identity: 'system' }
        { name: 'mathpix-app-key', keyVaultUrl: '${keyVault.properties.vaultUri}secrets/mathpix-app-key', identity: 'system' }
      ] : [])
    }
    template: {
      containers: [
        {
          name: 'backend'
          // First deploy: ACR is empty, so use a Microsoft hello-world image
          // to bootstrap the Container App. After `az acr build` pushes the
          // real mathema-backend image, redeploy with bootstrapMode=false
          // (or `az containerapp update --image ...`).
          image: bootstrapMode ? 'mcr.microsoft.com/azuredocs/containerapps-helloworld:latest' : '${acr.properties.loginServer}/mathema-backend:${containerImageTag}'
          resources: { cpu: json(containerCpu), memory: containerMemory }
          env: concat([
            { name: 'NODE_ENV',            value: 'production' }
            { name: 'PORT',                value: '4000' }
            { name: 'DATABASE_URL',        secretRef: 'database-url' }
            { name: 'REDIS_URL',           secretRef: 'redis-url' }
            { name: 'JWT_ACCESS_SECRET',   secretRef: 'jwt-access-secret' }
            { name: 'JWT_REFRESH_SECRET',  secretRef: 'jwt-refresh-secret' }
            { name: 'APPINSIGHTS_CONNECTION_STRING', value: appInsights.properties.ConnectionString }
            { name: 'AI_LLM_PROVIDER',     value: 'openai' }
            { name: 'AI_LLM_MODEL',        value: 'gpt-4o-mini' }
            { name: 'AI_LLM_API_KEY',      secretRef: 'openai-api-key' }
            // OCR (ocr.service.ts) + hint walkthrough (problems.service.ts)
            // read OPENAI_API_KEY directly. Gemini API was removed 2026-06-12:
            // its terms prohibit API clients directed at under-18 users.
            { name: 'OPENAI_API_KEY',      secretRef: 'openai-api-key' }
            { name: 'AI_OCR_MODEL',        value: 'gpt-4o-mini' }
            { name: 'AI_OCR_FALLBACK_MODEL', value: 'gpt-5.4-mini' }
            { name: 'AI_OCR_GRAPH_MODEL',  value: 'gpt-5.4-mini' }
            { name: 'OCR_GRAPH_ENHANCEMENT', value: 'true' }
            { name: 'MATHPIX_TIMEOUT_MS',  value: '180000' }
            { name: 'AI_VISION_PROVIDER',  value: 'openai' }
            { name: 'AI_VISION_MODEL',     value: 'gpt-4o-mini' }
            { name: 'AI_VISION_API_KEY',   secretRef: 'openai-api-key' }
            { name: 'AI_EMBEDDING_PROVIDER', value: 'openai' }
            { name: 'AI_EMBEDDING_MODEL',    value: 'text-embedding-3-large' }
            { name: 'AI_EMBEDDING_API_KEY',  secretRef: 'openai-api-key' }
            { name: 'ADMIN_EMAILS',        secretRef: 'admin-emails' }
            // Google Play Developer API service-account credentials (full JSON
            // body in the secret). BillingService parses it at boot.
            { name: 'PLAY_SERVICE_ACCOUNT_JSON', secretRef: 'play-service-account-json' }
            // Android package name BillingService passes to purchases.subscriptionsv2.get.
            { name: 'PLAY_PACKAGE_NAME',   value: 'ai.matheo.app' }
            // Play RTDN (Real-Time Developer Notifications) — Pub/Sub push auth.
            // Both values are left EMPTY at first deploy; the RTDN endpoint
            // refuses every request until the operator fills them in (after
            // creating the Pub/Sub topic + push subscription + dedicated
            // service account, then re-deploying with these values set, or
            // editing the Container App env directly). RTDN_AUDIENCE should
            // be the public RTDN URL (the value Pub/Sub uses as the OIDC
            // `aud` claim), and RTDN_SERVICE_ACCOUNT_EMAIL is the SA Pub/Sub
            // signs with — RtdnService pins the OIDC `email` claim to it.
            { name: 'RTDN_AUDIENCE',               value: '' }
            { name: 'RTDN_SERVICE_ACCOUNT_EMAIL',  value: '' }
            // Billing UI runtime switch — flip to true via GitHub secret
            // BILLING_UI_ENABLED or `az containerapp update --set-env-vars`.
            { name: 'BILLING_UI_ENABLED',          value: 'false' }
            { name: 'STORAGE_DRIVER',      value: 'local' }
            { name: 'LLM_DRAFT_CONCURRENCY', value: '5' }
            // SPA origins for the backend's CORS allowlist. Both point at the
            // Primary origin is the custom domain (app.matheo.verastudy.net).
// SWA default hostname is kept in allowedOrigins for fallback / internal use.
            { name: 'WEB_ORIGIN',          value: 'https://app.matheo.verastudy.net' }
            { name: 'ADMIN_ORIGIN',        value: 'https://app.matheo.verastudy.net' }
            // Math-helper Python sidecar (internal ingress, same Container Apps Environment).
            // https:// 필수 — http 로 가면 ACA ingress 가 301 redirect 하고 Node fetch 가
            // redirect 시 POST→GET 으로 메서드 변환해 Python /solve 가 405 반환. ACA 내부
            // 호출도 TLS 자동 인증서 발급되므로 https 가 정상 경로.
            { name: 'MATH_HELPER_URL',         value: 'https://${mathHelperApp.properties.configuration.ingress.fqdn}' }
            { name: 'MATH_HELPER_TIMEOUT_MS',  value: '120000' }
          ], hasMathpix ? [
            { name: 'OCR_PRIMARY_PROVIDER', value: 'mathpix' }
            { name: 'MATHPIX_APP_ID',       secretRef: 'mathpix-app-id' }
            { name: 'MATHPIX_APP_KEY',      secretRef: 'mathpix-app-key' }
          ] : [
            { name: 'OCR_PRIMARY_PROVIDER', value: 'openai' }
          ])
          probes: [
            {
              type: 'liveness'
              httpGet: { path: '/api/v1/health/live', port: 4000 }
              initialDelaySeconds: 20
              periodSeconds: 30
            }
            {
              type: 'readiness'
              httpGet: { path: '/api/v1/health/ready', port: 4000 }
              initialDelaySeconds: 10
              periodSeconds: 15
            }
          ]
        }
      ]
      scale: {
        minReplicas: minReplicas
        maxReplicas: maxReplicas
        rules: [
          {
            name: 'http-scale'
            http: { metadata: { concurrentRequests: '50' } }
          }
        ]
      }
    }
  }
}

// Key Vault 접근 권한 — managed identity 에 Key Vault Secrets User 부여
resource kvSecretsUserRole 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  scope: keyVault
  name: guid(keyVault.id, backendApp.id, 'kv-secrets-user')
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '4633458b-17de-408a-b874-0445c86b69e6') // Key Vault Secrets User
    principalId: backendApp.identity.principalId
    principalType: 'ServicePrincipal'
  }
}

// NOTE: acrPullRoleBackend resource removed — already granted out-of-band via
// `az role assignment create --assignee <backend-MI> --role AcrPull --scope <ACR>`
// after our first Bicep deploy partially failed and the deterministic GUID
// here started colliding (ARM's RoleAssignmentExists quirk on redeploy of
// the same role+principal+scope tuple). Bicep can't easily re-declare an
// existing role assignment idempotently — see Microsoft Q&A "RoleAssignmentExists"
// thread. The runtime permission is intact (verified via `az role assignment
// list --assignee <backend-MI> --scope <acr>`); we just don't re-create it
// in Bicep. If you ever do a *fresh* RG deploy, restore this resource OR
// run the manual `az role assignment create` again after the deploy.

// ---------- Math-helper Container App (Python FastAPI · internal) ----------
//
// Karvy 의 LangGraph 서비스. /math-helper/solve, /assessments/* 호출 시
// NestJS backend 가 internal FQDN 으로 HTTP 호출.
//
// - ingress.external: false  → 인터넷 노출 X, 같은 ACA Environment 안에서만 도달.
// - minReplicas: 0          → idle 시 scale-to-zero (cold start ~3s).
// - OPENAI_API_KEY          → backend 와 동일한 KV secret 재사용 (Karvy llm.py 가
//                              langchain-openai.ChatOpenAI 로 호출).
resource mathHelperApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: mathHelperAppName
  location: location
  identity: { type: 'SystemAssigned' }
  properties: {
    environmentId: containerEnv.id
    configuration: {
      ingress: {
        external: false
        targetPort: 8000
        transport: 'http'
      }
      registries: [
        {
          server: acr.properties.loginServer
          identity: 'system'
        }
      ]
      secrets: [
        { name: 'openai-api-key', keyVaultUrl: kvOpenai.properties.secretUri, identity: 'system' }
      ]
    }
    template: {
      containers: [
        {
          name: 'math-helper'
          // bootstrap: first deploy 시 ACR 에 mathema-math-helper 이미지가 없으니
          // hello-world 로 자원 provision 만 하고, az acr build 후 image 스왑.
          image: mathHelperBootstrap ? 'mcr.microsoft.com/azuredocs/containerapps-helloworld:latest' : '${acr.properties.loginServer}/mathema-math-helper:${containerImageTag}'
          resources: { cpu: json('0.5'), memory: '1.0Gi' }
          env: [
            { name: 'OPENAI_API_KEY',   secretRef: 'openai-api-key' }
            { name: 'MATH_HELPER_MODEL', value: 'gpt-5.4-mini' }
            { name: 'MATH_HELPER_FALLBACK_MODEL', value: 'gpt-5.5' }
            { name: 'PYTHONUNBUFFERED', value: '1' }
          ]
          probes: [
            {
              type: 'liveness'
              httpGet: { path: '/health', port: 8000 }
              initialDelaySeconds: 20
              periodSeconds: 30
            }
            {
              type: 'readiness'
              httpGet: { path: '/health', port: 8000 }
              initialDelaySeconds: 5
              periodSeconds: 15
            }
          ]
        }
      ]
      scale: {
        minReplicas: 0
        maxReplicas: 3
        rules: [
          {
            name: 'http-scale'
            http: { metadata: { concurrentRequests: '20' } }
          }
        ]
      }
    }
  }
}

// math-helper managed identity 에도 Key Vault Secrets User 부여 (OPENAI_API_KEY 읽기 위해)
resource kvSecretsUserRoleForMathHelper 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  scope: keyVault
  name: guid(keyVault.id, mathHelperApp.id, 'kv-secrets-user')
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '4633458b-17de-408a-b874-0445c86b69e6')
    principalId: mathHelperApp.identity.principalId
    principalType: 'ServicePrincipal'
  }
}

// NOTE: acrPullRoleMathHelper resource removed for the same reason as
// acrPullRoleBackend above. Permission was granted out-of-band and the
// Bicep re-declaration was triggering RoleAssignmentExists conflicts.

// ---------- Static Web App (frontend Vite SPA) ----------

resource swa 'Microsoft.Web/staticSites@2023-12-01' = {
  name: swaName
  // SWA is not available in centralindia (2026-05). Pinned to swaLocation
  // (default eastasia — closest to India). All other resources stay in
  // centralindia for DPDP data-residency on the user-data side.
  location: swaLocation
  sku: { name: 'Free', tier: 'Free' }
  properties: {
    repositoryUrl: 'https://github.com/prior89/mathema-app'  // GitHub Actions builds & deploys
    branch: 'main'
    buildProperties: {
      appLocation: 'app'
      apiLocation: ''
      outputLocation: 'dist'
    }
  }
}

// ---------- Outputs ----------

output backendUrl       string = 'https://${backendApp.properties.configuration.ingress.fqdn}'
output mathHelperInternalUrl string = 'http://${mathHelperApp.properties.configuration.ingress.fqdn}'
output appInsightsKey   string = appInsights.properties.ConnectionString
output acrLoginServer   string = acr.properties.loginServer
output keyVaultName     string = keyVault.name
output swaDefaultHostname string = swa.properties.defaultHostname
