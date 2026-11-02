import React from 'react';
import { 
  Printer, 
  Download, 
  FileText, 
  Search, 
  Mail,
  PenTool,
  Building2,
  Cpu,
  Calculator,
  Layers,
  BookOpen,
  Gavel,
  ShieldCheck,
  HardDrive,
  Zap
} from 'lucide-react';
import { UNIFIED_DOCUMENT_METADATA } from '../data/unifiedDocumentData';

export type AppTab = 
  | 'document' 
  | 'workspace'
  | 'rule18' 
  | 'onlineSign' 
  | 'wyomingTrust' 
  | 'algorithms' 
  | 'verification' 
  | 'tabsManifest' 
  | 'summary';

interface Props {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  showLineNumbers: boolean;
  setShowLineNumbers: (v: boolean) => void;
  fontSize: 'small' | 'medium' | 'large';
  setFontSize: (s: 'small' | 'medium' | 'large') => void;
  onOpenExportModal: () => void;
  onOpenEmailModal: () => void;
}

export const Header: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  showLineNumbers,
  setShowLineNumbers,
  fontSize,
  setFontSize,
  onOpenExportModal,
  onOpenEmailModal
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-xl no-print">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Title and institution logos / labels */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-600 to-amber-600 flex items-center justify-center text-white shadow-md shadow-indigo-900/30 font-serif font-black text-xl shrink-0">
              §
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  BALTIMORE COUNTY CIRCUIT COURT
                </span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  D.C. CIRCUIT
                </span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  BNY MELLON CORPORATE TRUST
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight leading-tight mt-0.5">
                Master Mandamus, Custodial Settlement & Rule 18 Exaction of Liberty Omnibus
              </h1>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search input */}
            <div className="relative min-w-[170px] sm:min-w-[210px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search CUSIP, Rule 18, counts..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-700/80 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* 1-Click Send All Button */}
            <button
              onClick={onOpenEmailModal}
              title="1-Click Batch Send All Messages, Correspondence, and Exhibits"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 via-indigo-600 to-emerald-600 hover:brightness-110 text-white text-xs font-bold shadow-md shadow-indigo-950/40 transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-200" />
              <span>⚡ 1-Click Send All</span>
            </button>

            {/* Send Out Emails Button */}
            <button
              onClick={onOpenEmailModal}
              title="Open Official Email Transmission & Document Presentation Hub"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Review Emails</span>
            </button>

            {/* Print / Save PDF */}
            <button
              onClick={handlePrint}
              title="Print official court pleading or save to PDF"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>

            {/* Export Markdown / LaTeX */}
            <button
              onClick={onOpenExportModal}
              title="Export complete merged document in LaTeX, Markdown or Plain Text"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Sub-bar with view tabs & reading controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-800/80">
          {/* Navigation view modes */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0">
            <button
              onClick={() => setActiveTab('document')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'document'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-xs font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Master Pleading (12 Parts)</span>
            </button>

            <button
              onClick={() => setActiveTab('workspace')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'workspace'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-xs font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5 text-blue-400" />
              <span>Google Workspace Hub</span>
            </button>

            <button
              onClick={() => setActiveTab('rule18')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'rule18'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-xs font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Gavel className="w-3.5 h-3.5 text-red-400" />
              <span>Rule 18 Exaction (All Iterations)</span>
            </button>

            <button
              onClick={() => setActiveTab('onlineSign')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'onlineSign'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <PenTool className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sign Online</span>
            </button>

            <button
              onClick={() => setActiveTab('wyomingTrust')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'wyomingTrust'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Liquidation Trust (WY)</span>
            </button>

            <button
              onClick={() => setActiveTab('algorithms')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'algorithms'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>31 Algorithms</span>
            </button>

            <button
              onClick={() => setActiveTab('tabsManifest')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'tabsManifest'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Execution Tabs (A–J)</span>
            </button>

            <button
              onClick={() => setActiveTab('verification')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'verification'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-xs font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Auditor & Math</span>
            </button>

            <button
              onClick={() => setActiveTab('summary')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'summary'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-xs font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Synthesis</span>
            </button>
          </div>

          {/* Reading & pleading view controls */}
          <div className="flex items-center gap-2 text-xs text-slate-400 self-end lg:self-auto">
            <label className="flex items-center gap-1.5 cursor-pointer select-none text-[11px] hover:text-slate-200">
              <input
                type="checkbox"
                checked={showLineNumbers}
                onChange={(e) => setShowLineNumbers(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-0 focus:ring-offset-0"
              />
              <span>Pleading Lines</span>
            </label>

            <div className="h-3 w-px bg-slate-800"></div>

            <div className="flex items-center gap-1 text-[11px]">
              <span className="text-slate-500">Text:</span>
              <button
                onClick={() => setFontSize('small')}
                className={`px-1.5 py-0.5 rounded cursor-pointer ${fontSize === 'small' ? 'bg-slate-700 text-white font-bold' : 'hover:text-slate-200'}`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('medium')}
                className={`px-1.5 py-0.5 rounded cursor-pointer text-xs ${fontSize === 'medium' ? 'bg-slate-700 text-white font-bold' : 'hover:text-slate-200'}`}
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-1.5 py-0.5 rounded cursor-pointer text-sm ${fontSize === 'large' ? 'bg-slate-700 text-white font-bold' : 'hover:text-slate-200'}`}
              >
                A++
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
