package com.nexa.app;

import android.Manifest;
import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.core.app.ActivityCompat;
import androidx.webkit.WebSettingsCompat;

public class MainActivity extends Activity {
    private static final String START_URL = "https://123mudassirali546-byte.github.io/fds-worker-system/nexa-direct-login.html";
    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        WebView web = new WebView(this);
        setContentView(web);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        s.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        web.setWebViewClient(new WebViewClient());
        if (android.os.Build.VERSION.SDK_INT >= 33) ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.POST_NOTIFICATIONS}, 100);
        web.loadUrl(START_URL);
    }
    @Override public void onBackPressed() { WebView w=(WebView)findViewById(android.R.id.content); super.onBackPressed(); }
}
