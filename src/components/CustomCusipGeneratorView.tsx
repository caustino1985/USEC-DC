import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Copy, 
  Check, 
  Download, 
  Printer, 
  FileText, 
  Building2, 
  Scale, 
  Cpu, 
  DollarSign, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  FileSpreadsheet, 
  Send, 
  Database,
  Search,
  RotateCcw,
  BookOpen,
  Landmark,
  HardDrive
} from 'lucide-react';
import { 
  CustomCusipItem, 
  CustomPartyConfig, 
  GeneratedDocument,
  calculatePortfolioSummary,
  generateAllCustomDocuments,
  PRESET_BENCHMARK_USEC,
  PRESET_CORPORATE_RESTRUCTURING,
  PRESET_MUNICIPAL_DEFAULT
} from '../services/customDocumentGenerator';
import { validateCusip, calculateCusipCheckDigit, formatCusipSpaced } from '../utils/cusipValidator';

export const CustomCusipGeneratorView: React.FC = () => {
  // Active state for CUSIPs and configuration
  const [cusips, setCusips] = useState<CustomCusipItem[]>(PRESET_BENCHMARK_USEC.cusips);
  const [config, setConfig] = useState<CustomPartyConfig>(PRESET_BENCHMARK_USEC.config);
  const [activePreset, setActivePreset] = useState<'usec' | 'corp' | 'muni' | 'custom'>('usec');
  const [isConfigExpanded, setIsConfigExpanded] = useState<boolean>(false);
  const [selectedDocId, setSelectedDocId] = useState<string>('doc-state-mandamus');
  const [viewMode, setViewMode] = useState<'formatted' | 'latex'>('formatted');
  const [docSearchQuery, setDocSearchQuery] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [showLineNumbers, setShowLineNumbers] = useState<boolean>(false);
  
  // Modal / Form state for adding/editing a CUSIP
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editingCusipId, setEditingCusipId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CustomCusipItem>({
    id: '',
    cusip: '',
    issuer: '',
    seriesDescription: '',
    principalAmount: 100000000,
    couponRatePercent: 6.5,
    maturityDate: 'January 15, 2028',
    exchangeRatio: 0.0917,
    tickerSymbol: 'LEU'
  });

  // Calculate live portfolio summary
  const summary = useMemo(() => calculatePortfolioSummary(cusips), [cusips]);

  // Generate all 6 custom documents whenever cusips or config changes
  const generatedDocs = useMemo<GeneratedDocument[]>(() => {
    return generateAllCustomDocuments(cusips, config);
  }, [cusips, config]);

  // Current selected generated document
  const activeDoc = useMemo(() => {
    return generatedDocs.find(d => d.id === selectedDocId) || generatedDocs[0];
  }, [generatedDocs, selectedDocId]);

  // Preset switch handler
  const handleSelectPreset = (preset: 'usec' | 'corp' | 'muni' | 'custom') => {
    setActivePreset(preset);
    if (preset === 'usec') {
      setCusips(PRESET_BENCHMARK_USEC.cusips);
      setConfig(PRESET_BENCHMARK_USEC.config);
    } else if (preset === 'corp') {
      setCusips(PRESET_CORPORATE_RESTRUCTURING.cusips);
      setConfig(PRESET_CORPORATE_RESTRUCTURING.config);
    } else if (preset === 'muni') {
      setCusips(PRESET_MUNICIPAL_DEFAULT.cusips);
      setConfig(PRESET_MUNICIPAL_DEFAULT.config);
    } else if (preset === 'custom') {
      setCusips([
        {
          id: 'custom-1',
          cusip: '037833100', // Apple benchmark stem
          issuer: 'Custom Enterprise Holdings Inc.',
          seriesDescription: '7.00% Senior Convertible Debentures',
          principalAmount: 50000000,
          couponRatePercent: 7.0,
          maturityDate: 'December 31, 2029',
          exchangeRatio: 0.085,
          tickerSymbol: 'CEH'
        }
      ]);
      setConfig({
        ...config,
        caseNumber: 'NEW-FILING-2026',
        filingDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      });
    }
  };

  // Open editor for new CUSIP
  const handleAddNewCusip = () => {
    setEditingCusipId(null);
    setFormData({
      id: `cusip-${Date.now()}`,
      cusip: '',
      issuer: 'New Corporate Issuer',
      seriesDescription: '6.75% Senior Notes Due 2030',
      principalAmount: 25000000,
      couponRatePercent: 6.75,
      maturityDate: 'June 30, 2030',
      exchangeRatio: 0.0917,
      tickerSymbol: 'CORP'
    });
    setIsEditorOpen(true);
  };

  // Open editor for existing CUSIP
  const handleEditCusip = (item: CustomCusipItem) => {
    setEditingCusipId(item.id);
    setFormData({ ...item });
    setIsEditorOpen(true);
  };

  // Delete CUSIP
  const handleDeleteCusip = (id: string) => {
    if (cusips.length <= 1) {
      alert('Portfolio must contain at least one CUSIP claim.');
      return;
    }
    setCusips(cusips.filter(c => c.id !== id));
    setActivePreset('custom');
  };

  // Auto-fix check digit for a given CUSIP
  const handleAutoFixCheckDigit = (cusipId: string, stem: string) => {
    const checkDigit = calculateCusipCheckDigit(stem.slice(0, 8));
    if (checkDigit !== null) {
      const fixedCusip = `${stem.slice(0, 8)}${checkDigit}`;
      setCusips(cusips.map(c => c.id === cusipId ? { ...c, cusip: fixedCusip } : c));
      setActivePreset('custom');
    }
  };

  // Save from form editor
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.cusip.trim()) {
      alert('Please enter a valid CUSIP.');
      return;
    }

    if (editingCusipId) {
      setCusips(cusips.map(c => c.id === editingCusipId ? formData : c));
    } else {
      setCusips([...cusips, formData]);
    }
    setIsEditorOpen(false);
    setActivePreset('custom');
  };

  // Copy document to clipboard
  const handleCopy = () => {
    const textToCopy = viewMode === 'latex' ? activeDoc.latexText : activeDoc.plainText;
    navigator.clipboard.writeText(textToCopy);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  // Download document
  const handleDownload = (format: 'tex' | 'txt') => {
    const content = format === 'tex' ? activeDoc.latexText : activeDoc.plainText;
    const extension = format === 'tex' ? '.tex' : '.txt';
    const filename = `${activeDoc.id}_${new Date().toISOString().split('T')[0]}${extension}`;
    const blob = new Blob([content], { type: format === 'tex' ? 'text/x-tex;charset=utf-8;' : 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Print current document
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${activeDoc.title}</title>
            <style>
              body { font-family: 'Times New Roman', serif; margin: 40px; color: #111; line-height: 1.5; font-size: 12pt; }
              pre { font-family: 'Times New Roman', serif; white-space: pre-wrap; word-break: break-word; }
              h1, h2, h3 { font-family: 'Times New Roman', serif; text-align: center; }
              table { border-collapse: collapse; width: 100%; margin: 16px 0; }
              th, td { border: 1px solid #333; padding: 6px 10px; font-size: 10pt; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <pre>${activeDoc.plainText}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero / Studio Header */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                CUSIP &amp; INDENTURE AUTO-GENERATOR
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                UCC § 8-401 &amp; UDTA §§ 101–118
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              Custom CUSIP Generator &amp; Court Document Assembly Studio
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl mt-1.5 leading-relaxed">
              Enter custom CUSIP numbers, issuer credentials, par values, and equity conversion ratios. The engine automatically validates the modified Luhn check-digit formula and auto-generates the entire 6-instrument suite of court mandamus pleadings, statutory trust indentures, DTC depository directives, SEC workpapers, and ADR/ADX scientific supplements.
            </p>
          </div>

          {/* Quick Preset Selector Buttons */}
          <div className="flex flex-wrap lg:flex-col gap-2 shrink-0">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Load Benchmark Profile:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleSelectPreset('usec')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activePreset === 'usec'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50 border border-indigo-400'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                USEC $500M Benchmark
              </button>
              <button
                type="button"
                onClick={() => handleSelectPreset('corp')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activePreset === 'corp'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50 border border-indigo-400'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                Corporate High-Yield
              </button>
              <button
                type="button"
                onClick={() => handleSelectPreset('muni')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activePreset === 'muni'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50 border border-indigo-400'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                Municipal Default
              </button>
              <button
                type="button"
                onClick={() => handleSelectPreset('custom')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activePreset === 'custom'
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-900/50 border border-amber-400'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                Custom Portfolio
              </button>
            </div>
          </div>
        </div>

        {/* Financial Capitalization Summary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Aggregate Par Claim</span>
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-300">
              ${summary.totalPrincipal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Across {summary.cusipCount} verified CUSIP issue{summary.cusipCount > 1 ? 's' : ''}
            </div>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Equity Conversion Entitlement</span>
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-blue-300">
              {summary.totalShares.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Common Shares ({cusips.map(c => c.tickerSymbol).filter((v, i, a) => a.indexOf(v) === i).join(', ')})
            </div>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Annual Accrued Coupon</span>
              <Scale className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-amber-300">
              ${summary.totalAnnualCoupon.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Annual contractual cash flow obligation
            </div>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>UDTA 5% Smoothed Payout Cap</span>
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-purple-300">
              ${summary.udtaAnnualDistributionCap.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Maximum lawful annual corpus distribution
            </div>
          </div>
        </div>

        {/* 4 Beneficiary Allocations Bar */}
        <div className="mt-4 bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 mb-2 gap-1">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              Statutory Trust Quad-Cameral Fund Allocation
            </span>
            <span className="text-[11px] text-slate-500">
              Housing Allocation: {config.housingUnitsCount} Units in {config.housingLocation}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
            <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-lg p-2">
              <div className="flex items-center justify-between text-emerald-400 font-bold">
                <span>Perpetual Corpus (60%)</span>
                <span>${(summary.perpetualCorpusAmount / 1000000).toFixed(1)}M</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Research &amp; Post-Quantum Security
              </div>
            </div>

            <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-lg p-2">
              <div className="flex items-center justify-between text-indigo-400 font-bold">
                <span>Housing SPV (25%)</span>
                <span>${(summary.housingSpvAmount / 1000000).toFixed(1)}M</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {config.housingUnitsCount} Rowhomes for SSDI/SSI
              </div>
            </div>

            <div className="bg-amber-950/30 border border-amber-500/20 rounded-lg p-2">
              <div className="flex items-center justify-between text-amber-400 font-bold">
                <span>Litigant AI Grant (10%)</span>
                <span>${(summary.grantPoolAmount / 1000000).toFixed(1)}M</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Pro Se Parity &amp; Cognitive Access
              </div>
            </div>

            <div className="bg-purple-950/30 border border-purple-500/20 rounded-lg p-2">
              <div className="flex items-center justify-between text-purple-400 font-bold">
                <span>Fiduciary Reserve (5%)</span>
                <span>${(summary.fiduciaryReserveAmount / 1000000).toFixed(1)}M</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Statutory Auditing &amp; Custody
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CUSIP Portfolio Management Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-400" />
              <span>CUSIP Portfolio &amp; Luhn Mod-10 Verification Table</span>
            </h2>
            <p className="text-xs text-slate-400">
              Each CUSIP is parsed into 6-character Issuer Code, 2-character Issue Code, and 9th check digit.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddNewCusip}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-900/40 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom CUSIP</span>
            </button>
          </div>
        </div>

        {/* Table of CUSIPs */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">#</th>
                <th className="py-3 px-3">CUSIP Number</th>
                <th className="py-3 px-3">Check Digit Status</th>
                <th className="py-3 px-3">Issuer &amp; Series Description</th>
                <th className="py-3 px-3 text-right">Par Claim ($)</th>
                <th className="py-3 px-3 text-right">Coupon</th>
                <th className="py-3 px-3">Maturity</th>
                <th className="py-3 px-3 text-right">Exchange Ratio</th>
                <th className="py-3 px-3 text-right">Converted Shares</th>
                <th className="py-3 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900/60 font-sans">
              {cusips.map((item, index) => {
                const validation = validateCusip(item.cusip);
                const convertedShares = item.exchangeRatio > 0 
                  ? Math.round(item.principalAmount * item.exchangeRatio) 
                  : 0;

                return (
                  <tr key={item.id} className="hover:bg-slate-850 transition-colors">
                    <td className="py-3 px-3 text-slate-500 font-mono">{index + 1}</td>
                    
                    {/* CUSIP with badge */}
                    <td className="py-3 px-3 font-mono font-bold text-white whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-700 text-indigo-300">
                          {formatCusipSpaced(item.cusip)}
                        </span>
                      </div>
                    </td>

                    {/* Luhn Validation Badge */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      {validation.isValid ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Luhn Valid (Digit: {validation.actualCheckDigit})</span>
                        </span>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-500/20 text-red-300 border border-red-500/30">
                            <AlertCircle className="w-3 h-3 text-red-400" />
                            <span>Check Digit Mismatch</span>
                          </span>
                          {validation.expectedCheckDigit !== null && (
                            <button
                              type="button"
                              onClick={() => handleAutoFixCheckDigit(item.id, item.cusip)}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 cursor-pointer font-bold"
                              title={`Auto-fix check digit to ${validation.expectedCheckDigit}`}
                            >
                              Fix to {validation.expectedCheckDigit}
                            </button>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Issuer & Series */}
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-100">{item.issuer}</div>
                      <div className="text-[11px] text-slate-400">{item.seriesDescription}</div>
                    </td>

                    {/* Par Claim Amount */}
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-300 whitespace-nowrap">
                      ${item.principalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>

                    {/* Coupon */}
                    <td className="py-3 px-3 text-right font-mono text-amber-300 whitespace-nowrap">
                      {item.couponRatePercent}%
                    </td>

                    {/* Maturity */}
                    <td className="py-3 px-3 text-slate-300 whitespace-nowrap">
                      {item.maturityDate}
                    </td>

                    {/* Ratio */}
                    <td className="py-3 px-3 text-right font-mono text-slate-300 whitespace-nowrap">
                      {item.exchangeRatio}
                    </td>

                    {/* Converted Shares */}
                    <td className="py-3 px-3 text-right font-mono font-bold text-blue-300 whitespace-nowrap">
                      {convertedShares.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">{item.tickerSymbol}</span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleEditCusip(item)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="Edit this CUSIP"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCusip(item.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-300 transition-colors cursor-pointer"
                          title="Delete this CUSIP"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CUSIP Inline/Modal Editor */}
      {isEditorOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                <span>{editingCusipId ? 'Edit CUSIP Entry' : 'Add New Custom CUSIP'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="text-slate-400 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  CUSIP Number (9 characters or 8-char stem):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.cusip}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase();
                      setFormData({ ...formData, cusip: val });
                    }}
                    placeholder="e.g. 917300AA1 or 037833100"
                    maxLength={9}
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
                    required
                  />
                  {formData.cusip.length >= 8 && (
                    <button
                      type="button"
                      onClick={() => {
                        const check = calculateCusipCheckDigit(formData.cusip.slice(0, 8));
                        if (check !== null) {
                          setFormData({ ...formData, cusip: `${formData.cusip.slice(0, 8)}${check}` });
                        }
                      }}
                      className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer shrink-0"
                    >
                      Compute Check Digit
                    </button>
                  )}
                </div>
                {formData.cusip.length > 0 && (
                  <div className="mt-1.5 text-xs">
                    {(() => {
                      const res = validateCusip(formData.cusip);
                      return res.isValid ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Valid CUSIP (Issuer: {res.issuerCode}, Issue: {res.issueCode}, Check: {res.actualCheckDigit})
                        </span>
                      ) : (
                        <span className="text-amber-400 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {res.errorMessage}
                        </span>
                      );
                    })()}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Issuer Entity Name:
                  </label>
                  <input
                    type="text"
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Series / Class Description:
                  </label>
                  <input
                    type="text"
                    value={formData.seriesDescription}
                    onChange={(e) => setFormData({ ...formData, seriesDescription: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Par / Principal Claim ($):
                  </label>
                  <input
                    type="number"
                    step="1000"
                    value={formData.principalAmount}
                    onChange={(e) => setFormData({ ...formData, principalAmount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs font-mono focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Coupon Rate (%):
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={formData.couponRatePercent}
                    onChange={(e) => setFormData({ ...formData, couponRatePercent: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs font-mono focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Maturity Date:
                  </label>
                  <input
                    type="text"
                    value={formData.maturityDate}
                    onChange={(e) => setFormData({ ...formData, maturityDate: e.target.value })}
                    placeholder="e.g. January 20, 2028"
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Exchange Ratio (Shares / $):
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.exchangeRatio}
                    onChange={(e) => setFormData({ ...formData, exchangeRatio: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs font-mono focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                  <div className="text-[10px] text-slate-400 mt-1">
                    Yields {Math.round(formData.principalAmount * formData.exchangeRatio).toLocaleString()} shares
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Equity Ticker Symbol:
                  </label>
                  <input
                    type="text"
                    value={formData.tickerSymbol}
                    onChange={(e) => setFormData({ ...formData, tickerSymbol: e.target.value.toUpperCase() })}
                    placeholder="e.g. LEU, AAPL, GRC"
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs font-mono uppercase focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-900/40 cursor-pointer"
                >
                  {editingCusipId ? 'Update CUSIP' : 'Add to Portfolio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Parties, Jurisdiction & Housing Preservation Configuration (Expandable) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <button
          type="button"
          onClick={() => setIsConfigExpanded(!isConfigExpanded)}
          className="w-full p-4 flex items-center justify-between bg-slate-900 hover:bg-slate-850 transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-2.5">
            <Landmark className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>Parties, Court Jurisdictions &amp; Housing Parameters</span>
                <span className="text-[11px] font-normal text-slate-400 font-mono">
                  ({config.stateCourtVenue} • {config.depositoryBank})
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Customize petitioners, depository banks, transfer agents, case docket numbers, and housing SPV targets
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold">
            <span>{isConfigExpanded ? 'Collapse Settings' : 'Expand & Edit Parameters'}</span>
            {isConfigExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {isConfigExpanded && (
          <div className="p-5 border-t border-slate-800 bg-slate-950/40 space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Petitioner Info */}
              <div className="space-y-2.5 bg-slate-900/70 p-3.5 rounded-xl border border-slate-800">
                <div className="font-bold text-slate-200 border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Petitioners &amp; Fiduciary Settlors</span>
                </div>
                <div>
                  <label className="block text-slate-400 mb-0.5">Primary Petitioner Name &amp; Role:</label>
                  <input
                    type="text"
                    value={config.petitionerName}
                    onChange={(e) => setConfig({ ...config, petitionerName: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-0.5">Petitioner Address &amp; Jurisdiction:</label>
                  <input
                    type="text"
                    value={config.petitionerAddress}
                    onChange={(e) => setConfig({ ...config, petitionerAddress: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-0.5">Co-Petitioner / Co-Trustee Name:</label>
                  <input
                    type="text"
                    value={config.coPetitionerName}
                    onChange={(e) => setConfig({ ...config, coPetitionerName: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              {/* Custodial & Depository Endpoints */}
              <div className="space-y-2.5 bg-slate-900/70 p-3.5 rounded-xl border border-slate-800">
                <div className="font-bold text-slate-200 border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Depository Bank &amp; Transfer Agent (UCC § 8-401)</span>
                </div>
                <div>
                  <label className="block text-slate-400 mb-0.5">Depository Bank &amp; Custodian:</label>
                  <input
                    type="text"
                    value={config.depositoryBank}
                    onChange={(e) => setConfig({ ...config, depositoryBank: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-0.5">Transfer Agent (FAST/DWAC):</label>
                  <input
                    type="text"
                    value={config.transferAgent}
                    onChange={(e) => setConfig({ ...config, transferAgent: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-0.5">Respondent Debtor Corporation:</label>
                  <input
                    type="text"
                    value={config.respondentCorporation}
                    onChange={(e) => setConfig({ ...config, respondentCorporation: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              {/* Court Venues & Case No */}
              <div className="space-y-2.5 bg-slate-900/70 p-3.5 rounded-xl border border-slate-800">
                <div className="font-bold text-slate-200 border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
                  <Landmark className="w-3.5 h-3.5 text-amber-400" />
                  <span>Court Jurisdictions &amp; Case Dockets</span>
                </div>
                <div>
                  <label className="block text-slate-400 mb-0.5">State Mandamus Court Venue:</label>
                  <input
                    type="text"
                    value={config.stateCourtVenue}
                    onChange={(e) => setConfig({ ...config, stateCourtVenue: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-0.5">Federal Appellate Circuit (28 U.S.C. § 1651):</label>
                  <input
                    type="text"
                    value={config.federalCourtVenue}
                    onChange={(e) => setConfig({ ...config, federalCourtVenue: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 mb-0.5">Case / Docket Number:</label>
                    <input
                      type="text"
                      value={config.caseNumber}
                      onChange={(e) => setConfig({ ...config, caseNumber: e.target.value })}
                      placeholder="e.g. C-03-CV-26-004128"
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-0.5">Filing / Effective Date:</label>
                    <input
                      type="text"
                      value={config.filingDate}
                      onChange={(e) => setConfig({ ...config, filingDate: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Housing Preservation & ADR/ADX Parameters */}
              <div className="space-y-2.5 bg-slate-900/70 p-3.5 rounded-xl border border-slate-800">
                <div className="font-bold text-slate-200 border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Housing Preservation (25% SPV) &amp; SSDI/SSI Target</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 mb-0.5">Preserved Housing Units:</label>
                    <input
                      type="number"
                      value={config.housingUnitsCount}
                      onChange={(e) => setConfig({ ...config, housingUnitsCount: parseInt(e.target.value, 10) || 0 })}
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-0.5">Dedicated Corpus (25%):</label>
                    <input
                      type="text"
                      readOnly
                      value={`$${summary.housingSpvAmount.toLocaleString()}`}
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-purple-300 font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-400 mb-0.5">Housing Geographic Location / District:</label>
                  <input
                    type="text"
                    value={config.housingLocation}
                    onChange={(e) => setConfig({ ...config, housingLocation: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div className="text-[11px] text-slate-500 italic">
                  Preserved for SSDI/SSI applicant housing and PSDLEF community land trust perpetual custody.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Generated Documents Workspace */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Document Selection Tabs */}
        <div className="bg-slate-950 border-b border-slate-800 p-3">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Auto-Generated Court Pleadings &amp; Statutory Indentures (6 Instruments)
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Live Synchronized with {cusips.length} CUSIP{cusips.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {generatedDocs.map((doc) => {
              const isSelected = doc.id === selectedDocId;
              return (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-indigo-950/80 border-indigo-500/80 text-white shadow-md shadow-indigo-900/40 ring-1 ring-indigo-500'
                      : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {doc.badge}
                    </span>
                    <div className="font-bold mt-1.5 leading-snug line-clamp-2">
                      {doc.title}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-2 flex items-center justify-between">
                    <span>{doc.pageEstimate}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Document Viewer Controls Sub-Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-900 border-b border-slate-800 gap-3">
          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('formatted')}
                className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  viewMode === 'formatted'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Court Rendered View
              </button>
              <button
                type="button"
                onClick={() => setViewMode('latex')}
                className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer font-mono ${
                  viewMode === 'latex'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                LaTeX Source (.tex)
              </button>
            </div>

            {/* Line numbers toggle */}
            <button
              type="button"
              onClick={() => setShowLineNumbers(!showLineNumbers)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                showLineNumbers
                  ? 'bg-indigo-950 text-indigo-300 border-indigo-700'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-300'
              }`}
            >
              Line #s {showLineNumbers ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Action buttons (Copy, Download, Print) */}
          <div className="flex items-center gap-2">
            {/* In-document search */}
            <div className="relative min-w-[150px] sm:min-w-[180px]">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={docSearchQuery}
                onChange={(e) => setDocSearchQuery(e.target.value)}
                placeholder="Find in document..."
                className="w-full pl-8 pr-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                copySuccess
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              {copySuccess ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copySuccess ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleDownload('tex')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer"
              title="Download LaTeX source (.tex) for Overleaf / TeXLive"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>.tex</span>
            </button>

            <button
              type="button"
              onClick={() => handleDownload('txt')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer"
              title="Download plain text file"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>.txt</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer"
              title="Print document or save to PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>
          </div>
        </div>

        {/* Document Content Display Area */}
        <div className="p-6 bg-slate-950/70 overflow-x-auto max-h-[750px] overflow-y-auto">
          {viewMode === 'latex' ? (
            <pre className="font-mono text-xs text-indigo-300 leading-relaxed whitespace-pre-wrap select-all">
              {activeDoc.latexText}
            </pre>
          ) : (
            <div className="max-w-4xl mx-auto bg-white text-slate-900 rounded-lg p-8 sm:p-12 shadow-2xl font-serif text-[13.5px] leading-relaxed border border-slate-200">
              <div className="text-right text-[10px] text-slate-400 uppercase font-sans tracking-widest border-b pb-2 mb-6">
                Automated Drafting Instrument • {activeDoc.badge} • Ref: {activeDoc.id}
              </div>

              {activeDoc.plainText.split('\n').map((line, idx) => {
                const isHeading1 = line.startsWith('# ');
                const isHeading2 = line.startsWith('## ');
                const isHeading3 = line.startsWith('### ');
                const isHeading4 = line.startsWith('#### ');
                const isDivider = line.startsWith('---');
                const isTable = line.startsWith('|');

                if (isHeading1) {
                  return (
                    <h1 key={idx} className="text-lg sm:text-xl font-bold text-center tracking-tight text-slate-950 my-4 uppercase">
                      {line.replace('# ', '')}
                    </h1>
                  );
                }
                if (isHeading2) {
                  return (
                    <h2 key={idx} className="text-base sm:text-lg font-bold text-slate-900 my-3 text-center border-b border-slate-300 pb-1">
                      {line.replace('## ', '')}
                    </h2>
                  );
                }
                if (isHeading3) {
                  return (
                    <h3 key={idx} className="text-sm sm:text-base font-bold text-slate-900 mt-4 mb-2">
                      {line.replace('### ', '')}
                    </h3>
                  );
                }
                if (isHeading4) {
                  return (
                    <h4 key={idx} className="text-xs sm:text-sm font-bold text-slate-800 mt-3 mb-1">
                      {line.replace('#### ', '')}
                    </h4>
                  );
                }
                if (isDivider) {
                  return <hr key={idx} className="my-4 border-slate-300" />;
                }
                if (isTable) {
                  return (
                    <div key={idx} className="font-mono text-xs bg-slate-50 p-1 border-x border-slate-200 overflow-x-auto whitespace-pre">
                      {line}
                    </div>
                  );
                }

                return (
                  <div key={idx} className="flex items-start gap-3 my-1">
                    {showLineNumbers && (
                      <span className="font-mono text-[10px] text-slate-400 select-none w-8 text-right shrink-0 pt-0.5">
                        {idx + 1}
                      </span>
                    )}
                    <p className={`flex-1 ${line.startsWith('**') ? 'font-bold' : ''}`}>
                      {line || '\u00A0'}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
