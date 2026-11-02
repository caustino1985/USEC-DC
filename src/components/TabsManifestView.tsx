import React, { useState } from 'react';
import { EXECUTION_TABS, UNIFIED_DOCUMENT_METADATA } from '../data/unifiedDocumentData';
import { 
  FileCheck2, 
  PenTool, 
  Stamp, 
  CheckCircle, 
  ShieldCheck, 
  AlertCircle,
  Eye,
  FileSignature
} from 'lucide-react';

export const TabsManifestView: React.FC = () => {
  const [selectedTabId, setSelectedTabId] = useState<string>(EXECUTION_TABS[0].id);

  const selectedTab = EXECUTION_TABS.find(t => t.id === selectedTabId) || EXECUTION_TABS[0];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/30">
                EXECUTION SCHEDULE
              </span>
              <h2 className="text-xl font-bold text-white">
                Master Institutional Onboarding Package (Tabs A through I)
              </h2>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-3xl">
              Prepared for <strong>The Bank of New York Mellon Corporate Trust</strong> and <strong>D.C. Circuit Court Intake</strong>. Complete regulatory and signature documentation for PSDLEF-Americana-SSA-TRUST.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs">
              <span className="text-slate-400 block text-[10px] uppercase">Signatures Required:</span>
              <span className="font-mono text-amber-400 font-bold">9 Ink + 1 Notary Jurat</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs navigation and detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Tab list */}
        <div className="lg:col-span-5 space-y-2">
          {EXECUTION_TABS.map((tab) => {
            const isSelected = tab.id === selectedTabId;
            return (
              <div
                key={tab.id}
                onClick={() => setSelectedTabId(tab.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-950/40 border-indigo-500/80 shadow-md'
                    : 'bg-slate-900/80 border-slate-800 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-bold text-xs flex items-center justify-center font-mono">
                      {tab.tabLetter}
                    </span>
                    <span className="font-semibold text-xs sm:text-sm text-slate-100">{tab.title}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                    tab.status === 'Notarization Required'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {tab.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 pl-8">
                  {tab.inkRequirement}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Detailed Tab Document Sheet */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-amber-600 flex items-center justify-center font-bold text-white text-base">
                {selectedTab.tabLetter}
              </span>
              <div>
                <h3 className="font-bold text-white text-base sm:text-lg">{selectedTab.title}</h3>
                <span className="text-xs text-indigo-400 font-mono">
                  PSDLEF-Americana-SSA-TRUST / BNY Mellon Onboarding
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-lg">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Standardized Form</span>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-300">
            <div>
              <span className="text-slate-400 font-medium block mb-1">Operational Purpose:</span>
              <p className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-200">
                {selectedTab.description}
              </p>
            </div>

            <div>
              <span className="text-slate-400 font-medium block mb-1">Parties & Ink Signatories:</span>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5 font-mono text-xs text-indigo-300">
                {selectedTab.parties.map((party, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <PenTool className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{party}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="text-slate-400 font-medium block mb-1">Legal / Covenant Extract:</span>
              <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 font-serif text-slate-300 italic text-xs leading-relaxed">
                "{selectedTab.contentSnippet}"
              </div>
            </div>

            {/* Signature Block Preview */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="text-xs uppercase tracking-wider font-bold text-slate-400">
                Execution Sign-off Requirement:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-950 rounded border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">Primary Signatory</div>
                  <div className="font-bold text-white text-xs mt-0.5">Caustin Lee McLaughlin</div>
                  <div className="text-[11px] text-slate-400">Principal Trustee / Debtor-in-Possession</div>
                  <div className="mt-4 pt-2 border-t border-slate-700/60 font-mono text-[10px] text-indigo-400">
                    [ INK SIGNATURE REQUIRED ]
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">Co-Signatory</div>
                  <div className="font-bold text-white text-xs mt-0.5">Juan Jose Fernandez</div>
                  <div className="text-[11px] text-slate-400">Co-Trustee / Authorized Representative</div>
                  <div className="mt-4 pt-2 border-t border-slate-700/60 font-mono text-[10px] text-indigo-400">
                    [ INK SIGNATURE REQUIRED ]
                  </div>
                </div>
              </div>

              {selectedTab.id === 'tab-i' && (
                <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded text-xs text-amber-300 flex items-center gap-2">
                  <Stamp className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Requires personal appearance and physical jurat seal of a licensed Maryland Notary Public.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
