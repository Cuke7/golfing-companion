package com.google.android.gms.location.sample.locationupdatesforegroundservice;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.webkit.WebView;
import android.widget.Button;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;



public class MapActivity extends AppCompatActivity {

    private String getValue(){
        SharedPreferences prefs = getSharedPreferences("toto", MODE_PRIVATE);
        String data = prefs.getString("data", "No name defined");//"No name defined" is the default value.
        return data;
    }
    private static final String TAG = MainActivity.class.getSimpleName();

    WebView maps;

    Button mSaveButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_map);


        maps = findViewById(R.id.MyMaps);

        maps.getSettings().setJavaScriptEnabled(true);

        String data = getValue();
        data = data.replaceAll("/\n/g", "%0A");
        String params = Uri.encode(data,",:");
        maps.loadUrl("https://cuke7.github.io/golfing-map/index.html?data="+params);


        mSaveButton = findViewById(R.id.save_button);

        mSaveButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String data = getValue();
                data = data.replaceAll("/\n/g", "%0A");
                String params = Uri.encode(data,",:");

                ClipboardManager clipboard = (ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
                ClipData clip = ClipData.newPlainText("game_data", params);
                assert clipboard != null;
                clipboard.setPrimaryClip(clip);
                Toast.makeText(MapActivity.this, "Copied to clipboard", Toast.LENGTH_SHORT).show();
            }
        });

    }
}
