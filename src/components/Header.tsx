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
  Zap,
  Database,
  Globe,
  Sparkles,
  ChevronDown,
  Check,
  RotateCcw,
  Loader2
} from 'lucide-react';
import { UNIFIED_DOCUMENT_METADATA } from '../data/unifiedDocumentData';
import { SUPPORTED_LEGAL_LANGUAGES, LegalLanguage } from '../services/geminiTranslationService';

export type AppTab = 
  | 'document' 
  | 'customCusip'
  | 'workspace'
  | 'dataHub'
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
  selectedLanguage: string;
  onSelectLanguage: (lang: string) => void;
  isTranslating?: boolean;
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
  onOpenEmailModal,
  selectedLanguage,
  onSelectLanguage,
  isTranslating = false
}) => {
  const [isLangDropdownOpen, setIsLangDropdownOpen] = React.useState<boolean>(false);
  const langDropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = SUPPORTED_LEGAL_LANGUAGES.find(l => l.code === selectedLanguage) || SUPPORTED_LEGAL_LANGUAGES[0];

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
                <span className="text-xs text-slate-500">•</span>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  FILING: NOV 3, 2026
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

            {/* Language Toggle with Gemini 3.8 Flash Juridical Translation */}
            <div className="relative" ref={langDropdownRef}>
              <button
                type="button"
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                title="Translate key legal clauses in real time using Google Gemini 3.8 Flash"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  selectedLanguage !== 'en'
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-900/50'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                {isTranslating ? (
                  <Loader2 className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                ) : (
                  <Globe className={`w-3.5 h-3.5 ${selectedLanguage !== 'en' ? 'text-amber-300' : 'text-indigo-400'}`} />
                )}
                <span>{currentLang.flag} {currentLang.code.toUpperCase()}</span>
                <Sparkles className="w-3 h-3 text-amber-300 hidden sm:inline" />
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Translation Dropdown Menu */}
              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* Dropdown Header */}
                  <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-amber-300">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>Gemini 3.8 Flash Translation</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                            v3.8
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Real-time multilingual jurist for key master pleading clauses
                        </div>
                      </div>
                    </div>

                    {selectedLanguage !== 'en' && (
                      <button
                        onClick={() => {
                          onSelectLanguage('en');
                          setIsLangDropdownOpen(false);
                        }}
                        className="flex items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-200 px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-800/80 cursor-pointer"
                        title="Revert to English Master Pleading"
                      >
                        <RotateCcw className="w-2.5 h-2.5" />
                        <span>Reset EN</span>
                      </button>
                    )}
                  </div>

                  {/* Language Options List */}
                  <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                    {SUPPORTED_LEGAL_LANGUAGES.map((lang) => {
                      const isSelected = selectedLanguage === lang.code;
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => {
                            onSelectLanguage(lang.code);
                            setIsLangDropdownOpen(false);
                          }}
                          className={`w-full text-left p-2 rounded-lg text-xs transition-colors cursor-pointer flex items-start justify-between gap-2 border ${
                            isSelected
                              ? 'bg-indigo-950/80 border-indigo-500/60 text-white shadow-xs'
                              : 'bg-slate-950/50 hover:bg-slate-850 border-slate-800/80 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <span className="text-base select-none shrink-0 pt-0.5">{lang.flag}</span>
                            <div>
                              <div className="flex items-center gap-1.5 font-bold">
                                <span className={isSelected ? 'text-indigo-300' : 'text-slate-100'}>
                                  {lang.name}
                                </span>
                                <span className="text-[11px] font-normal text-slate-400">
                                  ({lang.localName})
                                </span>
                                <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                                  {lang.badge}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                                {lang.significance}
                              </p>
                            </div>
                          </div>

                          {isSelected && (
                            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Dropdown Footer Safeguards */}
                  <div className="mt-2.5 pt-2 border-t border-slate-800 text-[10px] text-slate-400 space-y-1">
                    <div className="flex items-center gap-1 text-emerald-400 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                      <span>Model: gemini-3.8-flash (Server-Side Proxy)</span>
                    </div>
                    <p className="text-[9.5px] text-slate-500 leading-tight">
                      Preserves canonical Bluebook legal citations, $500M / 45.85M LEU share capitalization, 30 row homes SSDI/SSI carveout, and court docket numbers verbatim across all translations.
                    </p>
                  </div>
                </div>
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
              onClick={() => setActiveTab('customCusip')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'customCusip'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>CUSIP Studio &amp; Docs</span>
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
              onClick={() => setActiveTab('dataHub')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'dataHub'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Case &amp; Science Hub (PACER/PubMed)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" title="PACER Background Worker Active" />
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

          {/* Reading & pleading view controls + Quick Language Switch */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 self-end lg:self-auto">
            {/* Quick Language Toggle Pills */}
            <div className="flex items-center gap-1 bg-slate-950/80 p-0.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 font-mono pl-1.5 pr-0.5 hidden sm:inline flex items-center gap-1">
                <Globe className="w-3 h-3 text-slate-400" />
                <span>Lang:</span>
              </span>
              {SUPPORTED_LEGAL_LANGUAGES.map((lang) => {
                const isActive = selectedLanguage === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => onSelectLanguage(lang.code)}
                    title={`${lang.name} (${lang.localName}) — ${lang.significance}`}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs font-mono'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 font-mono'
                    }`}
                  >
                    {lang.code.toUpperCase()}
                  </button>
                );
              })}
              {selectedLanguage !== 'en' && (
                <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30 ml-0.5 flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                  <span className="hidden md:inline">Gemini 3.8</span>
                </span>
              )}
            </div>

            <div className="h-3 w-px bg-slate-800 hidden sm:block"></div>

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
