package ai.matheo.app;

import android.os.CancellationSignal;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.credentials.Credential;
import androidx.credentials.CredentialManager;
import androidx.credentials.CredentialManagerCallback;
import androidx.credentials.CustomCredential;
import androidx.credentials.GetCredentialRequest;
import androidx.credentials.GetCredentialResponse;
import androidx.credentials.exceptions.GetCredentialException;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.libraries.identity.googleid.GetSignInWithGoogleOption;
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential;

import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

@CapacitorPlugin(name = "GoogleAuth")
public class GoogleAuthPlugin extends Plugin {
    private static final String TAG = "GoogleAuthPlugin";

    private final Executor executor = Executors.newSingleThreadExecutor();
    private CredentialManager credentialManager;

    @PluginMethod
    public void isAvailable(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("available", hasClientId());
        call.resolve(ret);
    }

    @PluginMethod
    public void signIn(PluginCall call) {
        if (!hasClientId()) {
            call.reject("Google OAuth web client ID is not configured in the Android bundle.");
            return;
        }
        if (getActivity() == null) {
            call.reject("Android activity is not ready.");
            return;
        }

        if (credentialManager == null) {
            credentialManager = CredentialManager.create(getContext());
        }

        GetSignInWithGoogleOption googleOption =
            new GetSignInWithGoogleOption.Builder(BuildConfig.GOOGLE_WEB_CLIENT_ID).build();
        GetCredentialRequest request = new GetCredentialRequest.Builder()
            .addCredentialOption(googleOption)
            .build();

        getActivity().runOnUiThread(() ->
            credentialManager.getCredentialAsync(
                getActivity(),
                request,
                new CancellationSignal(),
                executor,
                new CredentialManagerCallback<GetCredentialResponse, GetCredentialException>() {
                    @Override
                    public void onResult(GetCredentialResponse result) {
                        handleCredentialResult(call, result);
                    }

                    @Override
                    public void onError(@NonNull GetCredentialException e) {
                        Log.i(TAG, "Google sign-in was not completed", e);
                        call.reject(e.getMessage() != null ? e.getMessage() : "Google sign-in failed");
                    }
                }
            )
        );
    }

    private void handleCredentialResult(PluginCall call, GetCredentialResponse result) {
        Credential credential = result.getCredential();
        if (!(credential instanceof CustomCredential)) {
            call.reject("Unexpected credential type.");
            return;
        }

        CustomCredential customCredential = (CustomCredential) credential;
        if (!GoogleIdTokenCredential.TYPE_GOOGLE_ID_TOKEN_CREDENTIAL.equals(customCredential.getType())) {
            call.reject("Unexpected Google credential type.");
            return;
        }

        try {
            GoogleIdTokenCredential googleCredential =
                GoogleIdTokenCredential.createFrom(customCredential.getData());
            JSObject ret = new JSObject();
            ret.put("idToken", googleCredential.getIdToken());
            call.resolve(ret);
        } catch (RuntimeException e) {
            Log.e(TAG, "Received an invalid Google ID token response", e);
            call.reject("Invalid Google ID token response.");
        }
    }

    private boolean hasClientId() {
        return BuildConfig.GOOGLE_WEB_CLIENT_ID != null
            && !BuildConfig.GOOGLE_WEB_CLIENT_ID.trim().isEmpty();
    }
}
