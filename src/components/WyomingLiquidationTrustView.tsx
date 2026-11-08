import React, { useState } from 'react';
import { 
  Building2, 
  FileCheck, 
  Copy, 
  Check, 
  Download, 
  ShieldCheck, 
  Scale, 
  Clock, 
  TrendingDown, 
  CheckCircle2,
  Landmark,
  FileText
} from 'lucide-react';
import { WYOMING_LIQUIDATION_TRUST_DOCUMENTS, UNIFIED_DOCUMENT_METADATA } from '../data/unifiedDocumentData';
import { WyomingLiquidationTrustDashboard } from './WyomingLiquidationTrustDashboard';

export const WyomingLiquidationTrustView: React.FC = () => {
  const [activeSubView, setActiveSubView] = useState<'dashboard' | 'instruments'>('dashboard');
  const [selectedDocId, setSelectedDocId] = useState<string>(WYOMING_LIQUIDATION_TRUST_DOCUMENTS[0].id);
  const [copied, setCopied] = useState<boolean>(false);

  const currentDoc = WYOMING_LIQUIDATION_TRUST_DOCUMENTS.find(d => d.id === selectedDocId) || WYOMING_LIQUIDATION_TRUST_DOCUMENTS[0];

  const handleCopy = () => {
    const fullText = `${currentDoc.title}
Statutory Reference: ${currentDoc.statutoryReference}
Purpose: ${currentDoc.purpose}

${currentDoc.sections.map(s => `--- ${s.heading} ---\n${s.content}`).join('\n\n')}`;

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-indigo-950/70 border border-amber-500/40 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/30">
                WYOMING STATUTORY TRUST
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Americana Liquidation & Sovereign Purpose Trust (WY)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
              Organized under the <strong>Wyoming Statutory Trust Act (Wyo. Stat. Ann. § 17-23-101 et seq.)</strong> and the <strong>Uniform Directed Trust Act</strong> as a bankruptcy-remote, perpetual purpose trust for the orderly custody and programmatic liquidation of $500,000,000.00 in reorganized debt and 45,850,000 common shares of Centrus Energy Corp. (NYSE: LEU).
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-right shrink-0">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Jurisdiction of Formation</div>
            <div className="font-mono text-amber-400 font-bold text-sm">State of Wyoming (WY)</div>
            <div className="text-[10px] text-slate-500">1621 Central Ave, Cheyenne</div>
          </div>
        </div>
      </div>

      {/* Subview Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubView('dashboard')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubView === 'dashboard'
              ? 'bg-gradient-to-r from-amber-500/30 to-indigo-500/30 text-white border border-amber-500/50 shadow-lg shadow-indigo-950/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
          }`}
        >
          <Building2 className="w-4 h-4 text-amber-400" />
          <span>Beneficiary &amp; Settlement Dashboard</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
            Real-Time
          </span>
        </button>

        <button
          onClick={() => setActiveSubView('instruments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubView === 'instruments'
              ? 'bg-gradient-to-r from-amber-500/30 to-indigo-500/30 text-white border border-amber-500/50 shadow-lg shadow-indigo-950/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
          }`}
        >
          <FileText className="w-4 h-4 text-indigo-400" />
          <span>Statutory Trust Instruments</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono text-[10px]">
            4 Instruments
          </span>
        </button>
      </div>

      {/* Conditional Rendering: Dashboard View vs Instruments View */}
      {activeSubView === 'dashboard' ? (
        <WyomingLiquidationTrustDashboard />
      ) : (
        <>

      {/* Trust Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
          <div className="text-slate-500 uppercase tracking-wider text-[10px]">Statutory Form</div>
          <div className="font-bold text-white text-sm">Wyoming Statutory Trust</div>
          <div className="text-slate-400 text-[11px]">Wyo. Stat. Ann. § 17-23-101</div>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
          <div className="text-slate-500 uppercase tracking-wider text-[10px]">Trust Corpus Res</div>
          <div className="font-mono text-emerald-400 font-bold text-sm">$500,000,000.00 Face</div>
          <div className="text-slate-400 text-[11px]">45,850,000 LEU Common Shares</div>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
          <div className="text-slate-500 uppercase tracking-wider text-[10px]">Perpetuity Spending Cap</div>
          <div className="font-mono text-indigo-400 font-bold text-sm">D(t) ≤ 0.05 × A_5yr(t)</div>
          <div className="text-slate-400 text-[11px]">5% Trailing Moving Average Floor</div>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
          <div className="text-slate-500 uppercase tracking-wider text-[10px]">Fiduciary Structure</div>
          <div className="font-bold text-amber-400 text-sm">Quad-Cameral Separation</div>
          <div className="text-slate-400 text-[11px]">Director / Committee / Protector</div>
        </div>
      </div>

      {/* Main Document Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Document Tabs */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 mb-2">
            Formation & Governing Instruments:
          </div>

          {WYOMING_LIQUIDATION_TRUST_DOCUMENTS.map((doc) => {
            const isSelected = doc.id === selectedDocId;
            return (
              <div
                key={doc.id}
                onClick={() => setSelectedDocId(doc.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-950/40 border-amber-500 text-white shadow-md ring-1 ring-amber-500/40'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-bold text-xs sm:text-sm">{doc.title}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 pl-6">
                  {doc.statutoryReference}
                </div>
              </div>
            );
          })}

          {/* Quad-Cameral Governance Breakdown Box */}
          <div className="mt-4 p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
            <div className="font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-indigo-400" />
              <span>Quad-Cameral Governance Separation</span>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="p-2 rounded bg-slate-900/90 border border-slate-800">
                <span className="font-bold text-white block">1. Trust Director:</span>
                <span className="text-slate-400">Caustin Lee McLaughlin — Holds plenary investment, liquidation, and trading execution authority.</span>
              </div>
              <div className="p-2 rounded bg-slate-900/90 border border-slate-800">
                <span className="font-bold text-white block">2. Distribution Committee:</span>
                <span className="text-slate-400">Juan Jose Fernandez & Independent Manager — Authorizes daily yield sweeps (60/25/10/5).</span>
              </div>
              <div className="p-2 rounded bg-slate-900/90 border border-slate-800">
                <span className="font-bold text-white block">3. Trust Protector:</span>
                <span className="text-slate-400">Enforces the perpetuity rule, prevents drift, and can replace the corporate trustee.</span>
              </div>
              <div className="p-2 rounded bg-slate-900/90 border border-slate-800">
                <span className="font-bold text-white block">4. Independent Examiner:</span>
                <span className="text-slate-400">Annual forensic accounting and SEC Edgar CUSIP cross-reconciliation.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Document Viewer */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-white text-base sm:text-lg">{currentDoc.title}</h3>
              <div className="text-xs text-amber-400 font-mono mt-0.5">{currentDoc.statutoryReference}</div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Text!' : 'Copy Document'}</span>
              </button>
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 italic">
            "{currentDoc.purpose}"
          </div>

          <div className="space-y-4">
            {currentDoc.sections.map((sec, idx) => (
              <div key={idx} className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5">
                <h4 className="font-bold text-xs uppercase tracking-wider text-amber-300">
                  {sec.heading}
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-justify font-serif">
                  {sec.content}
                </p>
              </div>
            ))}
          </div>

          {/* Execution Sign-off for Wyoming Filing */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
            <div>
              <div className="text-indigo-400 font-bold">/s/ Caustin Lee McLaughlin</div>
              <div className="text-slate-400">Principal Trustee & Sovereign Architect</div>
            </div>
            <div>
              <div className="text-indigo-400 font-bold">/s/ Juan Jose Fernandez</div>
              <div className="text-slate-400">Co-Trustee & Spousal Representative</div>
            </div>
            <div className="text-right text-slate-500 text-[10px]">
              Executed at Baltimore, MD / Towson, MD<br />
              November 3, 2026
            </div>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
};
