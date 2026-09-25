package com.airgorah.mobile

import android.content.Context
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.net.wifi.WifiManager

object NetworkUtils {
    fun wifiInfo(context: Context): Map<String, String> {
        val wm = context.applicationContext.getSystemService(Context.WIFI_SERVICE) as WifiManager
        val info = wm.connectionInfo
        return linkedMapOf(
            "SSID" to (info.ssid ?: "<unknown>").trim('"'),
            "BSSID" to (info.bssid ?: "<unknown>"),
            "RSSI" to "${info.rssi} dBm",
            "Link speed" to "${info.linkSpeed} Mbps",
            "Frequency" to "${info.frequency} MHz"
        )
    }
    fun connectivity(context: Context): String {
        val cm = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        val n = cm.activeNetwork ?: return "Offline"
        val c = cm.getNetworkCapabilities(n) ?: return "Offline"
        return when {
            c.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) -> "Wi-Fi connected"
            c.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) -> "Mobile data connected"
            c.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET) -> "Ethernet connected"
            else -> "Connected"
        }
    }
}