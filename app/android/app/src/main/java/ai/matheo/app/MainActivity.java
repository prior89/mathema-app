package ai.matheo.app;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Register custom plugins BEFORE super.onCreate so Capacitor sees them
        // during the bridge bootstrap (Capacitor 6+ pattern).
        registerPlugin(BillingPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
