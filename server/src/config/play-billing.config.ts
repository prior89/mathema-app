import { registerAs } from '@nestjs/config';

interface PlayServiceAccountKey {
  client_email: string;
  private_key: string;
  project_id: string;
  // ... other fields exist but unused
}

export default registerAs('playBilling', () => {
  const raw = process.env.PLAY_SERVICE_ACCOUNT_JSON;
  const packageName = process.env.PLAY_PACKAGE_NAME ?? '';

  const obfuscatedAccountSecret = process.env.PLAY_OBFUSCATED_ACCOUNT_SECRET ?? '';

  if (!raw || !packageName) {
    // dev / test allows missing values; production guard happens in PlayApiClient.onModuleInit.
    return { credentials: null as PlayServiceAccountKey | null, packageName, obfuscatedAccountSecret };
  }

  let credentials: PlayServiceAccountKey;
  try {
    credentials = JSON.parse(raw) as PlayServiceAccountKey;
  } catch (e) {
    throw new Error('PLAY_SERVICE_ACCOUNT_JSON is not valid JSON: ' + (e as Error).message);
  }
  if (!credentials.client_email || !credentials.private_key) {
    throw new Error('PLAY_SERVICE_ACCOUNT_JSON missing client_email or private_key');
  }

  return { credentials, packageName, obfuscatedAccountSecret };
});
