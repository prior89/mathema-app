package ai.matheo.app;

import android.os.Bundle;
import android.util.Log;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.IntentSenderRequest;
import androidx.activity.result.contract.ActivityResultContracts;

import com.google.android.play.core.appupdate.AppUpdateInfo;
import com.google.android.play.core.appupdate.AppUpdateManager;
import com.google.android.play.core.appupdate.AppUpdateManagerFactory;
import com.google.android.play.core.appupdate.AppUpdateOptions;
import com.google.android.play.core.install.model.AppUpdateType;
import com.google.android.play.core.install.model.UpdateAvailability;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private static final String TAG = "MainActivity";

    private AppUpdateManager appUpdateManager;

    private final ActivityResultLauncher<IntentSenderRequest> appUpdateLauncher =
        registerForActivityResult(
            new ActivityResultContracts.StartIntentSenderForResult(),
            result -> {
                if (result.getResultCode() != RESULT_OK) {
                    Log.i(TAG, "In-app update flow ended with resultCode=" + result.getResultCode());
                }
            }
        );

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(BillingPlugin.class);
        registerPlugin(GoogleAuthPlugin.class);
        super.onCreate(savedInstanceState);
        appUpdateManager = AppUpdateManagerFactory.create(this);
        checkForImmediateUpdate();
    }

    @Override
    public void onResume() {
        super.onResume();
        resumeImmediateUpdateIfNeeded();
    }

    private void checkForImmediateUpdate() {
        appUpdateManager
            .getAppUpdateInfo()
            .addOnSuccessListener(appUpdateInfo -> {
                if (
                    appUpdateInfo.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE
                        && appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.IMMEDIATE)
                ) {
                    startImmediateUpdate(appUpdateInfo);
                }
            })
            .addOnFailureListener(error -> Log.i(TAG, "In-app update check skipped", error));
    }

    private void resumeImmediateUpdateIfNeeded() {
        appUpdateManager
            .getAppUpdateInfo()
            .addOnSuccessListener(appUpdateInfo -> {
                if (
                    appUpdateInfo.updateAvailability()
                        == UpdateAvailability.DEVELOPER_TRIGGERED_UPDATE_IN_PROGRESS
                ) {
                    startImmediateUpdate(appUpdateInfo);
                }
            })
            .addOnFailureListener(error -> Log.i(TAG, "In-app update resume skipped", error));
    }

    private void startImmediateUpdate(AppUpdateInfo appUpdateInfo) {
        appUpdateManager.startUpdateFlowForResult(
            appUpdateInfo,
            appUpdateLauncher,
            AppUpdateOptions.newBuilder(AppUpdateType.IMMEDIATE).build()
        );
    }
}
