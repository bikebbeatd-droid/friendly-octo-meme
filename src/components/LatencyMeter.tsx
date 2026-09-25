import React, { useState, useEffect } from 'react';
import { measureLatency } from '../utils/networkUtils';
import { PingDataPoint } from '../types/network';
import { Activity, Play, Square, RefreshCw, BarChart2, CheckCircle2, Clock } from 'lucide-react';

export const LatencyMeter: React.FC = () => {
  const [history, setHistory] = useState<PingDataPoint[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [targetEndpoint, setTargetEndpoint] = useState<string>('Google Edge (8.8.8.8)');
  const [selectedTargetUrl, setSelectedTargetUrl] = useState<string>('https://www.google.com/favicon.ico');

  const targets = [
    { name: 'Google Edge (8.8.8.8)', url: 'https://www.google.com/favicon.ico' },
    { name: 'Cloudflare Edge (1.1.1.1)', url: 'https://1.1.1.1/cdn-cgi/trace' },
    { name: 'Quad9 Security DNS (9.9.9.9)', url: 'https://dns.quad9.net/dns-query' },
  ];

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isRunning) {
      const probe = async () => {
        const ms = await measureLatency(selectedTargetUrl);
        const status: 'ok' | 'slow' | 'fail' = ms < 45 ? 'ok' : ms < 110 ? 'slow' : 'fail';
        setHistory((prev) => {
          const next: PingDataPoint[] = [
            ...prev,
            {
              id: Date.now(),
              timestamp: new Date().toLocaleTimeString(),
              latencyMs: ms,
              status,
              target: targetEndpoint,
            },
          ];
          return next.slice(-20); // Keep last 20 probes
        });
      };

      probe();
      timer = setInterval(probe, 2000);
    }
    return () => clearInterval(timer);
  }, [isRunning, selectedTargetUrl, targetEndpoint]);

  const latencies = history.map((h) => h.latencyMs);
  const minLatency = latencies.length > 0 ? Math.min(...latencies) : 0;
  const maxLatency = latencies.length > 0 ? Math.max(...latencies) : 0;
  const avgLatency = latencies.length > 0 ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) : 0;
  const jitter = latencies.length > 1 ? Math.round(Math.abs(latencies[latencies.length - 1] - latencies[latencies.length - 2])) : 0;

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <span>Real-Time Latency &amp; Jitter Meter</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Continuous defensive RTT ping probes to verify transport stability and packet transit consistency.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={targetEndpoint}
              onChange={(e) => {
                const found = targets.find((t) => t.name === e.target.value);
                if (found) {
                  setTargetEndpoint(found.name);
                  setSelectedTargetUrl(found.url);
                  setHistory([]);
                }
              }}
              className="bg-slate-950 border border-slate-800 text-xs rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {targets.map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                isRunning
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
              }`}
            >
              {isRunning ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isRunning ? 'Pause' : 'Start'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Latency Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Current Latency</div>
          <div className="text-2xl font-bold text-cyan-400 font-mono mt-1">
            {latencies.length > 0 ? latencies[latencies.length - 1] : 0}{' '}
            <span className="text-xs text-slate-400 font-normal">ms</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Average RTT</div>
          <div className="text-2xl font-bold text-white font-mono mt-1">
            {avgLatency} <span className="text-xs text-slate-400 font-normal">ms</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Jitter (Variance)</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
            {jitter} <span className="text-xs text-slate-400 font-normal">ms</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Min / Max Range</div>
          <div className="text-lg font-bold text-slate-200 font-mono mt-1.5">
            {minLatency} - {maxLatency} <span className="text-xs text-slate-400 font-normal">ms</span>
          </div>
        </div>
      </div>

      {/* Latency Visual Graph */}
      <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-medium text-slate-300 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-cyan-400" />
            <span>RTT Latency Histogram (Last {history.length} samples)</span>
          </h3>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interval: 2000ms</span>
          </div>
        </div>

        {/* Visual Bar chart */}
        <div className="h-44 flex items-end gap-1.5 pt-6 pb-2 border-b border-slate-800 px-2">
          {history.map((point) => {
            const heightPct = Math.min(100, Math.max(12, (point.latencyMs / Math.max(120, maxLatency * 1.2)) * 100));
            const barColor =
              point.status === 'ok'
                ? 'bg-cyan-500 hover:bg-cyan-400'
                : point.status === 'slow'
                ? 'bg-amber-500 hover:bg-amber-400'
                : 'bg-rose-500 hover:bg-rose-400';

            return (
              <div
                key={point.id}
                className="flex-1 flex flex-col items-center group relative h-full justify-end"
              >
                {/* Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 transition pointer-events-none absolute -top-8 px-2 py-1 rounded bg-slate-950 text-[10px] text-cyan-300 font-mono border border-slate-700 shadow whitespace-nowrap z-10">
                  {point.latencyMs} ms ({point.timestamp})
                </div>
                <div
                  className={`w-full rounded-t transition-all duration-300 ${barColor}`}
                  style={{ height: `${heightPct}%` }}
                />
              </div>
            );
          })}
          {history.length === 0 && (
            <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
              Probing target endpoint...
            </div>
          )}
        </div>

        {/* Recent Probe Log List */}
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {history.slice().reverse().map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${item.status === 'ok' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                <span className="text-slate-300 font-mono">{item.timestamp}</span>
                <span className="text-slate-500 hidden sm:inline">• {item.target}</span>
              </div>
              <div className="font-mono font-semibold text-cyan-300">{item.latencyMs} ms</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
