# ===============================================================
#  matheo — R8 / Proguard rules for release builds
# ===============================================================
#
#  minifyEnabled + shrinkResources are on in app/build.gradle release
#  buildType. Without explicit keep rules R8 strips reflective-only paths
#  that Capacitor, Sentry, Firebase, and JavaScript-bridge classes rely on.
#
#  Add a rule any time R8 reports `missing class` against a known plugin.

# Keep line numbers in stack traces so Sentry can deobfuscate cleanly.
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# Capacitor + Cordova bridge — reflective access to plugins from JS.
-keep class com.getcapacitor.** { *; }
-keep class org.apache.cordova.** { *; }
-keep class ai.matheo.app.** { *; }

# androidx.webkit + WebView JavaScript bridge interfaces.
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
-keep class androidx.webkit.** { *; }

# Sentry — sample rate / breadcrumb classes accessed via reflection.
-keep class io.sentry.** { *; }
-dontwarn io.sentry.**

# Firebase Cloud Messaging + Google Play Services (only present when
# google-services.json is dropped in by the FCM setup task).
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.firebase.**
-dontwarn com.google.android.gms.**

# OkHttp / Retrofit — emitted by some Capacitor plugins, R8 sometimes
# strips coroutine continuations.
-dontwarn okhttp3.internal.platform.**
-dontwarn org.conscrypt.**
-dontwarn org.bouncycastle.**
-dontwarn org.openjsse.**

# Kotlin coroutines (Capacitor 8 native side).
-keepnames class kotlinx.coroutines.internal.MainDispatcherFactory {}
-keepnames class kotlinx.coroutines.CoroutineExceptionHandler {}
-dontwarn kotlinx.coroutines.**

# Suppress R8 warnings for classes referenced only at runtime.
-dontnote **
-dontwarn javax.annotation.**
