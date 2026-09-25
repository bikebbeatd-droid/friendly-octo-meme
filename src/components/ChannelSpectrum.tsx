import React, { useState } from 'react';
import { generateChannelSpectrum } from '../utils/networkUtils';
import { Radio, CheckCircle, AlertTriangle, Info, Layers } from 'lucide-react';

export const ChannelSpectrum: React.FC = () => {
  const [selectedBand, setSelectedBand] = useState<'2.4 GHz' | '5 GHz'>('2.4 GHz');
  const channels = generateChannelSpectrum();

  const filteredChannels = channels.filter((c) => c.band === selectedBand);

  return (
    <div className="space-y-6">
      {/* Header & Band selector */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-cyan-400" />
              <span>Wi-Fi Channel Spectrum &amp; Congestion Analyzer</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Visualizes 2.4 GHz / 5 GHz channel overlap, co-channel interference, and highlights optimal clear frequencies.
            </p>
          </div>

          <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800 self-start">
            <button
              onClick={() => setSelectedBand('2.4 GHz')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition ${
                selectedBand === '2.4 GHz'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              2.4 GHz Band
            </button>
            <button
              onClick={() => setSelectedBand('5 GHz')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition ${
                selectedBand === '5 GHz'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              5 GHz Band (UNII-1/2/3)
            </button>
          </div>
        </div>
      </div>

      {/* Visual Spectrum Bars */}
      <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-xs font-medium text-slate-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Channel Utilization &amp; Interference Level</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-slate-400">Low Congestion</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="text-slate-400">Moderate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <span className="text-slate-400">High / Saturated</span>
            </div>
          </div>
        </div>

        {/* Channels Grid / Bars */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {filteredChannels.map((item) => {
            const isHigh = item.interferenceLevel === 'High';
            const isMod = item.interferenceLevel === 'Moderate';
            const barColor = isHigh ? 'bg-rose-500' : isMod ? 'bg-amber-500' : 'bg-emerald-500';
            const badgeBg = isHigh ? 'bg-rose-950 text-rose-300 border-rose-800' : isMod ? 'bg-amber-950 text-amber-300 border-amber-800' : 'bg-emerald-950 text-emerald-300 border-emerald-800';

            return (
              <div
                key={item.channel}
                className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                  item.recommended
                    ? 'bg-slate-950/80 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                    : 'bg-slate-950/40 border-slate-800/80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-white font-mono">Ch {item.channel}</span>
                    {item.recommended && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-700 font-semibold">
                        Clear
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">{item.frequencyMhz} MHz</div>
                </div>

                <div className="my-4">
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Load</span>
                    <span>{item.utilizationPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${barColor}`}
                      style={{ width: `${item.utilizationPercent}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className={`text-[10px] px-2 py-0.5 rounded border text-center font-medium ${badgeBg}`}>
                    {item.activeNetworksCount} APs • {item.interferenceLevel}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Guidance tip box */}
        <div className="rounded-lg bg-slate-950/60 border border-slate-800 p-4 text-xs text-slate-400 space-y-2">
          <div className="flex items-center gap-2 text-slate-200 font-medium">
            <Info className="w-4 h-4 text-cyan-400" />
            <span>Optimal Channel Allocation Recommendations</span>
          </div>
          {selectedBand === '2.4 GHz' ? (
            <p>
              In 2.4 GHz, use non-overlapping channels <span className="text-cyan-300 font-mono font-semibold">1, 6, or 11</span> (20 MHz width). Setting channels between them (e.g. Ch 2, 3, 4) causes adjacent channel interference that degrades throughput for all neighboring devices.
            </p>
          ) : (
            <p>
              In 5 GHz, wider channels (40/80/160 MHz) provide significantly higher bandwidth with lower co-channel interference. Use DFS or UNII-1 channels (<span className="text-cyan-300 font-mono font-semibold">36, 40, 48, 149, 161</span>) for high reliability.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
