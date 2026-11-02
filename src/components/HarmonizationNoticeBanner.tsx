import React from 'react';
import { ShieldCheck, CheckCircle2, Scale, Building2, AlertTriangle, ArrowRight } from 'lucide-react';
import { UNIFIED_DOCUMENT_METADATA } from '../data/unifiedDocumentData';

interface Props {
  onJumpToSection: (sectionId: string) => void;
}

export const HarmonizationNoticeBanner: React.FC<Props> = ({ onJumpToSection }) => {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border-b border-indigo-500/30 px-4 py-3 text-xs md:text-sm">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 shrink-0 mt-0.5">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 font-semibold text-slate-100">
              <span className="text-amber-300 font-bold tracking-wide uppercase text-xs px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40">
                Harmonized Master Dataset
              </span>
              <span>BNY Mellon Corporate Trust & D.C. Circuit Federal Court Alignment</span>
            </div>
            <p className="text-slate-300 mt-1 leading-relaxed">
              Consolidated unified pleading &amp; custodial settlement omnibus. Establishes 100% mathematical and jurisdictional consistency across all tables, petitions, and orders for BNY Mellon Corporate Trust and D.C. Circuit Federal Court filings.
            </p>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
          <div className="bg-slate-900/80 border border-emerald-500/40 rounded-lg px-3 py-1.5 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400">Total Capitalization</div>
              <div className="font-mono font-bold text-emerald-300 text-xs">
                ${UNIFIED_DOCUMENT_METADATA.totalPrincipal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-indigo-500/40 rounded-lg px-3 py-1.5 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-400" />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400">Reorganized LEU Equity</div>
              <div className="font-mono font-bold text-indigo-300 text-xs">
                {UNIFIED_DOCUMENT_METADATA.totalShares.toLocaleString()} Shs
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-amber-500/40 rounded-lg px-3 py-1.5 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400">Exchange Ratio</div>
              <div className="font-mono font-bold text-amber-300 text-xs">0.0917 (92:1000)</div>
            </div>
          </div>

          <button
            onClick={() => onJumpToSection('part-5')}
            className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>View 13F Table</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
