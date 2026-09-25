import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { NetworkDashboard } from './components/NetworkDashboard';
import { ChannelSpectrum } from './components/ChannelSpectrum';
import { LatencyMeter } from './components/LatencyMeter';
import { SecurityAudit } from './components/SecurityAudit';
import { DnsLookupTool } from './components/DnsLookupTool';
import { getLiveNetworkInfo } from './utils/networkUtils';
import { NetworkInfo } from './types/network';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>(getLiveNetworkInfo());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshDiagnostics = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setNetworkInfo(getLiveNetworkInfo());
      setIsRefreshing(false);
    }, 600);
  };

  useEffect(() => {
    const handleOnline = () => refreshDiagnostics();
    const handleOffline = () => refreshDiagnostics();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOnline={networkInfo.onlineStatus}
        onRefresh={refreshDiagnostics}
        isRefreshing={isRefreshing}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <NetworkDashboard
            networkInfo={networkInfo}
            onRefresh={refreshDiagnostics}
            isRefreshing={isRefreshing}
          />
        )}
        {activeTab === 'spectrum' && <ChannelSpectrum />}
        {activeTab === 'latency' && <LatencyMeter />}
        {activeTab === 'security' && <SecurityAudit />}
        {activeTab === 'dns' && <DnsLookupTool networkInfo={networkInfo} />}
      </main>

      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Airgorah Mobile &amp; Defensive Network Diagnostics</span>
          <span>Authorized, safe telemetry &amp; channel monitoring</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
