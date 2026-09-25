import React, { useState } from 'react';
import { initialSecurityChecks } from '../utils/networkUtils';
import { ShieldCheck, AlertTriangle, CheckCircle2, Info, XCircle, ChevronDown, ChevronUp, Lock } from 'lucide-react';

export const SecurityAudit: React.FC = () => {
  const [checks, setChecks] = useState(initialSecurityChecks);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const passedCount = checks.filter((c) => c.status === 'passed').length;
  const warningCount = checks.filter((c) => c.status === 'warning').length;
  const scorePct = Math.round((passedCount / checks.length) * 100);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Header & Score */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Defensive Wi-Fi &amp; Network Posture Audit</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Evaluates encryption standards, management frame protection (PMF), DNS security, and gateway isolation.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="text-right">
              <div className="text-xs text-slate-400 font-medium">Security Score</div>
              <div className="text-xl font-bold text-emerald-400 font-mono">{scorePct}%</div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Passed Checks</div>
            <div className="text-lg font-bold text-white">{passedCount}</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Warnings</div>
            <div className="text-lg font-bold text-amber-300">{warningCount}</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Total Evaluated</div>
            <div className="text-lg font-bold text-slate-200">{checks.length}</div>
          </div>
        </div>
      </div>

      {/* Audit items list */}
      <div className="rounded-xl bg-slate-900/90 border border-slate-800 divide-y divide-slate-800 overflow-hidden">
        {checks.map((check) => {
          const isExpanded = expandedId === check.id;
          const statusIcon =
            check.status === 'passed' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : check.status === 'warning' ? (
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            ) : (
              <Info className="w-4 h-4 text-cyan-400" />
            );

          const statusBadge =
            check.status === 'passed'
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80'
              : check.status === 'warning'
              ? 'bg-amber-950/80 text-amber-300 border-amber-800/80'
              : 'bg-cyan-950/80 text-cyan-300 border-cyan-800/80';

          return (
            <div key={check.id} className="p-4 hover:bg-slate-850/50 transition">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleExpand(check.id)}
              >
                <div className="flex items-center gap-3">
                  {statusIcon}
                  <div>
                    <span className="text-sm font-semibold text-white">{check.title}</span>
                    <span className="ml-2 text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {check.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium uppercase ${statusBadge}`}>
                    {check.status}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-slate-800/60 text-xs space-y-2 pl-7">
                  <p className="text-slate-300 leading-relaxed">{check.description}</p>
                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-slate-300">
                    <span className="font-semibold text-cyan-300 block mb-1">Defensive Best Practice:</span>
                    {check.recommendation}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
