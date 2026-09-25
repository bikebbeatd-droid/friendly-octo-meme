package com.airgorah.mobile

import android.net.wifi.WifiManager
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                Surface(modifier = Modifier.fillMaxSize()) { NetworkScreen() }
            }
        }
    }

    @androidx.compose.runtime.Composable
    private fun NetworkScreen() {
        var status by remember { mutableStateOf("Ready") }
        Column(modifier = Modifier.fillMaxSize().padding(24.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
            Text("Airgorah Mobile", style = MaterialTheme.typography.headlineMedium)
            Text("Safe mobile network-auditing foundation")
            Button(onClick = {
                val manager = applicationContext.getSystemService(WIFI_SERVICE) as WifiManager
                val info = manager.connectionInfo
                status = "Wi-Fi: ${info.ssid ?: "unknown"}\nSignal: ${info.rssi} dBm"
            }) { Text("Read current Wi-Fi") }
            Text(status)
        }
    }
}
