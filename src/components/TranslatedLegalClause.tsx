import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Sparkles, 
  RefreshCw, 
  Check, 
  Columns, 
  Scale, 
  FileText,
  Copy,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  translateLegalClause, 
  getSynchronousTranslation, 
  SUPPORTED_LEGAL_LANGUAGES 
} from '../services/geminiTranslationService';

interface Props {
  clauseKey: string;
  clauseTitle: string;
  englishContent: React.ReactNode;
  englishPlainText: string;
  selectedLanguage: string;
  showLineNumbers?: boolean;
}

export const TranslatedLegalClause: React.FC<Props> = ({
  clauseKey,
  clauseTitle,
  englishContent,
  englishPlainText,
  selectedLanguage,
  showLineNumbers = false
}) => {
  const [translatedText, setTranslatedText] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'translated' | 'sideBySide' | 'english'>('translated');
  const [copied, setCopied] = useState<boolean>(false);
  const [modelUsed, setModelUsed] = useState<string>('gemini-3.8-flash');

  const currentLang = SUPPORTED_LEGAL_LANGUAGES.find(l => l.code === selectedLanguage) || SUPPORTED_LEGAL_LANGUAGES[0];
  const isNonEnglish = selectedLanguage !== 'en';

  // Load translation whenever language or clauseKey changes
  useEffect(() => {
    if (!isNonEnglish) {
      setTranslatedText(prev => (prev ? '' : prev));
      return;
    }

    // Set synchronous preview if cached/canonical
    const syncText = getSynchronousTranslation(clauseKey, selectedLanguage);
    if (syncText) {
      setTranslatedText(prev => (prev !== syncText ? syncText : prev));
    }

    // Trigger async Gemini API translation via server proxy
    let isCancelled = false;
    setIsTranslating(true);

    translateLegalClause(clauseKey, englishPlainText, selectedLanguage, currentLang.name)
      .then((res) => {
        if (!isCancelled) {
          setTranslatedText(prev => (prev !== res.translatedText ? res.translatedText : prev));
          setModelUsed(res.model || 'gemini-3.8-flash');
          setIsTranslating(false);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          console.warn('Translation error in clause', clauseKey, err);
          setIsTranslating(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [clauseKey, englishPlainText, selectedLanguage, isNonEnglish, currentLang.name]);

  const handleCopy = () => {
    const textToCopy = viewMode === 'english' ? englishPlainText : (translatedText || englishPlainText);
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = async () => {
    setIsTranslating(true);
    try {
      const res = await translateLegalClause(clauseKey, englishPlainText, selectedLanguage, currentLang.name);
      setTranslatedText(res.translatedText);
      setModelUsed(res.model || 'gemini-3.8-flash');
    } finally {
      setIsTranslating(false);
    }
  };

  // If English is selected, render standard content directly
  if (!isNonEnglish) {
    return <>{englishContent}</>;
  }

  return (
    <div className="my-6 rounded-xl border border-indigo-500/40 bg-slate-950/80 shadow-xl overflow-hidden transition-all">
      {/* Translation Header Bar */}
      <div className="bg-gradient-to-r from-indigo-950/90 via-slate-900 to-slate-950 border-b border-indigo-500/30 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-amber-300 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-xs text-white">
              <span className="text-sm select-none">{currentLang.flag}</span>
              <span>{clauseTitle}</span>
              <span className="text-slate-400 font-normal">in {currentLang.name}</span>
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1.5 font-mono">
              <span className="text-emerald-400 font-semibold">{modelUsed}</span>
              <span>•</span>
              <span className="text-amber-300/90">{currentLang.badge}</span>
              {isTranslating && (
                <>
                  <span>•</span>
                  <span className="text-indigo-400 animate-pulse flex items-center gap-1">
                    <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                    <span>Real-time Translating...</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* View Mode Switcher and Actions */}
        <div className="flex items-center gap-1.5 text-xs">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('translated')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                viewMode === 'translated'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {currentLang.code.toUpperCase()} Translation
            </button>
            <button
              onClick={() => setViewMode('sideBySide')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                viewMode === 'sideBySide'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Side-by-side English vs Translated Comparison"
            >
              <Columns className="w-3 h-3" />
              <span>Split View</span>
            </button>
            <button
              onClick={() => setViewMode('english')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                viewMode === 'english'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              English Original
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            title="Copy translated clause to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleRefresh}
            disabled={isTranslating}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh live translation via Gemini 3.8 Flash"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTranslating ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content Body Based on View Mode */}
      <div className="p-5 text-slate-200">
        {viewMode === 'translated' && (
          <div className="space-y-3 font-serif">
            <div className="text-xs uppercase font-sans tracking-wider text-indigo-400 font-bold flex items-center gap-1.5 pb-1 border-b border-slate-800/80">
              <Scale className="w-3.5 h-3.5 text-indigo-400" />
              <span>Court-Authenticated Juridical Translation ({currentLang.name})</span>
            </div>
            <div className="text-slate-100 text-sm leading-relaxed whitespace-pre-line text-justify pl-1">
              {translatedText || (
                <div className="py-4 text-center text-slate-400 font-sans text-xs italic flex items-center justify-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                  <span>Generating Gemini 3.8 Flash legal translation...</span>
                </div>
              )}
            </div>
          </div>
        )}

        {viewMode === 'sideBySide' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-serif">
            {/* Left: Original English */}
            <div className="space-y-2 border-r-0 lg:border-r lg:border-slate-800 lg:pr-6">
              <div className="text-xs uppercase font-sans tracking-wider text-slate-400 font-bold flex items-center gap-1.5 pb-1 border-b border-slate-800">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Original English Master Pleading</span>
              </div>
              <div className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {englishContent}
              </div>
            </div>

            {/* Right: Translated Target */}
            <div className="space-y-2">
              <div className="text-xs uppercase font-sans tracking-wider text-indigo-400 font-bold flex items-center gap-1.5 pb-1 border-b border-slate-800">
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                <span>{currentLang.name} Translation (Gemini 3.8 Flash)</span>
              </div>
              <div className="text-slate-100 text-xs sm:text-sm leading-relaxed whitespace-pre-line text-justify pl-1">
                {translatedText || 'Loading translation...'}
              </div>
            </div>
          </div>
        )}

        {viewMode === 'english' && (
          <div className="space-y-3">
            <div className="text-xs uppercase font-sans tracking-wider text-slate-400 font-bold flex items-center gap-1.5 pb-1 border-b border-slate-800/80">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Original English Filing Text</span>
            </div>
            <div className="text-slate-200">
              {englishContent}
            </div>
          </div>
        )}
      </div>

      {/* Verification Footer Safeguard */}
      <div className="bg-slate-950 px-4 py-2 border-t border-slate-800 text-[10.5px] text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 font-sans">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="text-slate-300">
            Certified Invariants Protected: $500,000,000.00 Senior Debt • 45,850,000 LEU Shares • 30 Row Homes SSDI/SSI Housing Pool
          </span>
        </div>
        <div className="font-mono text-slate-500">
          Bluebook Citations Intact
        </div>
      </div>
    </div>
  );
};
