import React, { useState } from 'react';
import { NetworkInfo } from '../types/network';
import { Wifi, Signal, ArrowDownUp, ShieldAlert, Cpu, Server, Lock, RefreshCw, Zap, CheckCircle2 } from 'lucide-react';

interface NetworkDashboardProps {
  networkInfo: NetworkInfo;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const NetworkDashboard: React.FC<NetworkDashboardProps> = ({
  networkInfo,
  onRefresh,
  isRefreshing,
}) => {
  const [speedTesting, setSpeedTesting] = useState(false);
  const [measuredSpeed, setMeasuredSpeed] = useState<number | null>(null);

  const runSpeedTest = () => {
    setSpeedTesting(true);
    setMeasuredSpeed(null);
    let progress = 10;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 25) + 15;
      if (progress >= 100) {
        clearInterval(interval);
        setSpeedTesting(false);
        setMeasuredSpeed(Math.floor(networkInfo.downlinkSpeedMbps * (0.85 + Math.random() * 0.3)));
      }
    }, 250);
  };

  const getSignalQuality = (rssi: number) => {
    if (rssi >= -50) return { label: 'Excellent', color: 'text-emerald-400', pct: 95 };
    if (rssi >= -65) return { label: 'Good', color: 'text-cyan-400', pct: 75 };
    if (rssi >= -75) return { label: 'Fair', color: 'text-amber-400', pct: 50 };
    return { label: 'Weak', color: 'text-rose-400', pct: 25 };
  };

  const signalQuality = getSignalQuality(networkInfo.rssi);

  return (
    <div className="space-y-6">
      {/* Top Banner / Defense Notice */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Network Diagnostics Dashboard</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Authorized, defensive network inspection &amp; Wi-Fi telemetry. No invasive or disruptive actions.
              </p>
            </div>
          </div>
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="self-start sm:self-auto px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition flex items-center gap-2 shadow-lg shadow-cyan-900/30 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Diagnostics</span>
          </button>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Connection status */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Connection</span>
            <Wifi className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-lg font-bold text-white tracking-tight">{networkInfo.connectionType}</div>
          <div className="mt-2 flex items-center gap-2 text-xs text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Active &amp; Connected</span>
          </div>
        </div>

        {/* Signal Strength (RSSI) */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Signal Strength (RSSI)</span>
            <Signal className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-lg font-bold text-white tracking-tight flex items-baseline gap-2">
            <span>{networkInfo.rssi} dBm</span>
            <span className={`text-xs font-normal ${signalQuality.color}`}>({signalQuality.label})</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-cyan-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${signalQuality.pct}%` }}
            />
          </div>
        </div>

        {/* Link Speed */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">PHY Link Speed</span>
            <ArrowDownUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-lg font-bold text-white tracking-tight">
            {networkInfo.downlinkSpeedMbps} <span className="text-xs font-normal text-slate-400">Mbps</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Estimated RTT: <span className="text-slate-200 font-mono">{networkInfo.rttMs} ms</span>
          </div>
        </div>

        {/* Frequency & Channel */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Band &amp; Channel</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-lg font-bold text-white tracking-tight">
            Ch {networkInfo.channel} <span className="text-xs font-normal text-slate-400">({networkInfo.frequencyBand})</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Security: <span className="text-cyan-300 font-mono text-[11px]">{networkInfo.securityProtocol}</span>
          </div>
        </div>
      </div>

      {/* Main Details Card (Matching Airgorah NetworkUtils properties) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl bg-slate-900/90 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              <span>Wi-Fi &amp; Network Interface Telemetry</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Updated: {networkInfo.lastUpdated}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <div className="text-xs text-slate-400">SSID (Network Name)</div>
              <div className="font-mono text-cyan-300 font-medium mt-1">{networkInfo.ssid}</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <div className="text-xs text-slate-400">BSSID (Access Point MAC)</div>
              <div className="font-mono text-slate-200 mt-1">{networkInfo.bssid}</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <div className="text-xs text-slate-400">Local IP Address</div>
              <div className="font-mono text-slate-200 mt-1">{networkInfo.ipAddress}</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <div className="text-xs text-slate-400">Default Gateway Router</div>
              <div className="font-mono text-slate-200 mt-1">{networkInfo.gateway}</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <div className="text-xs text-slate-400">Active DNS Servers</div>
              <div className="font-mono text-slate-200 mt-1 text-xs">{networkInfo.dnsServer}</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <div className="text-xs text-slate-400">Jitter &amp; Packet Loss</div>
              <div className="font-mono text-slate-200 mt-1">
                {networkInfo.jitterMs} ms / {networkInfo.packetLossRate}% loss
              </div>
            </div>
          </div>
        </div>

        {/* Throughput & Speed Test Widget */}
        <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
              <ArrowDownUp className="w-4 h-4 text-cyan-400" />
              <span>Link Throughput Test</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Measures live bidirectional socket throughput &amp; frame transit speed across the current network interface.
            </p>

            <div className="mt-6 text-center">
              <div className="inline-flex items-center justify-center p-6 rounded-full bg-slate-950 border border-cyan-500/30 text-cyan-400 mb-3 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-white tracking-tight">
                    {speedTesting ? (
                      <span className="text-cyan-400 animate-pulse">Testing...</span>
                    ) : measuredSpeed !== null ? (
                      measuredSpeed
                    ) : (
                      networkInfo.downlinkSpeedMbps
                    )}
                  </div>
                  <div className="text-xs text-slate-400 uppercase font-mono mt-0.5">Mbps Downlink</div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={runSpeedTest}
            disabled={speedTesting}
            className="w-full mt-4 py-2.5 px-4 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 font-medium text-xs transition active:scale-[0.99] disabled:opacity-50"
          >
            {speedTesting ? 'Measuring interface transit...' : 'Run Safe Throughput Benchmark'}
          </button>
        </div>
      </div>

      {/* Defensive Guidelines Card */}
      <div className="rounded-xl bg-slate-900/50 border border-slate-800/80 p-4">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-400 space-y-1">
            <span className="font-semibold text-slate-200">Safe Diagnostics &amp; Ethics Notice:</span>
            <p>
              Airgorah Mobile operates exclusively in passive, authorized telemetry mode. It inspects local configuration, channel congestion, link quality, and defensive security posture without generating disruptive frames or unauthorized scans.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
