package com.airgorah.mobile

import android.Manifest
import android.content.pm.PackageManager
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.core.app.ActivityCompat

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        if (android.os.Build.VERSION.SDK_INT >= 23 &&
            checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, arrayOf(Manifest.permission.ACCESS_FINE_LOCATION), 100)
        }
        setContent { AirgorahApp() }
    }
}

@Composable
fun AirgorahApp() {
    var refresh by remember { mutableIntStateOf(0) }
    val context = LocalContext.current
    val info = remember(refresh) { NetworkUtils.wifiInfo(context) }
    val status = remember(refresh) { NetworkUtils.connectivity(context) }
    MaterialTheme {
        Scaffold(topBar = { TopAppBar(title = { Text("Airgorah Mobile") }) }) { pad ->
            Column(
                Modifier.padding(pad).padding(16.dp).verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Text("Network dashboard", style = MaterialTheme.typography.headlineSmall)
                Card(Modifier.fillMaxWidth()) {
                    Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text("Connection: $status")
                        info.forEach { (k,v) -> Text("$k: $v") }
                    }
                }
                Button(onClick = { refresh++ }, modifier = Modifier.fillMaxWidth()) {
                    Text("Refresh network information")
                }
                Text("Safe diagnostics", style = MaterialTheme.typography.titleMedium)
                Text("Authorized, defensive network information and diagnostics only. No password cracking or disruptive Wi-Fi actions.")
            }
        }
    }
}