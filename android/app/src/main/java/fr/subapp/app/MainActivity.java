package fr.subapp.app;

import android.Manifest;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.Settings;

import androidx.annotation.RequiresApi;
import androidx.core.app.ActivityCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {


  @Override
  protected void load() {
    super.load();
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      this.requestPermissions(new String[]{
          Manifest.permission.READ_EXTERNAL_STORAGE},
        1);
    }
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
      if (Environment.isExternalStorageManager()) {
        // If you don't have access, launch a new activity to show the user the system's dialog
        // to allow access to the external storage
      } else {
        Intent intent = new Intent();
        intent.setAction(Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION);
        Uri uri = Uri.fromParts("package", this.getPackageName(), null);
        intent.setData(uri);
        startActivity(intent);
      }
    }
  }
}
