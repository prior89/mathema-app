package ai.matheo.app;

import android.graphics.Color;
import android.os.Build;
import android.view.Window;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Keeps native system-bar backdrops aligned with Matheo's in-app theme.
 *
 * Android 15+ renders edge-to-edge and the WebView paints behind transparent
 * bars. Older versions still expose opaque native bar colors, which otherwise
 * follow the device uiMode even when the user explicitly selects the opposite
 * Matheo theme.
 */
@CapacitorPlugin(name = "MatheoTheme")
public class MatheoThemePlugin extends Plugin {
    @PluginMethod
    public void setSystemBarBackground(PluginCall call) {
        String value = call.getString("color");
        if (value == null) {
            call.reject("A system-bar color is required.");
            return;
        }

        final int color;
        try {
            color = Color.parseColor(value);
        } catch (IllegalArgumentException error) {
            call.reject("Invalid system-bar color.");
            return;
        }

        if (getActivity() == null) {
            call.reject("Android activity is not ready.");
            return;
        }

        getActivity().runOnUiThread(() -> {
            Window window = getActivity().getWindow();
            window.getDecorView().setBackgroundColor(color);

            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.VANILLA_ICE_CREAM) {
                window.setStatusBarColor(color);
                int navigationColor = Build.VERSION.SDK_INT < Build.VERSION_CODES.O
                    ? Color.rgb(17, 22, 42)
                    : color;
                window.setNavigationBarColor(navigationColor);
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    window.setStatusBarContrastEnforced(false);
                    window.setNavigationBarContrastEnforced(false);
                }
            }
            call.resolve();
        });
    }
}
