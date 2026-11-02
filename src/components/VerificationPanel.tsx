import React, { useState } from 'react';
import { 
  Calculator, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Sun, 
  Search, 
  Database,
  ArrowRight,
  TrendingUp,
  Percent,
  Check,
  Building
} from 'lucide-react';
import { UNIFIED_DOCUMENT_METADATA, CUSIP_PORTFOLIO_DATA, DYREO_ALLOCATION_VECTOR, EXECUTION_TABS } from '../data/unifiedDocumentData';

export const VerificationPanel: React.FC = () => {
  // Simulator state
  const [mockYield, setMockYield] = useState<number>(1000000);
  const [exchangeRatio, setExchangeRatio] = useState<number>(0.0917);
  const [cusipSearch, setCusipSearch] = useState<string>('');

  // Housing Preservation (HPR) calculator state
  const [rehabValueDollars, setRehabValueDollars] = useState<number>(450000);
  const [deprecExpenseDollars, setDeprecExpenseDollars] = useState<number>(45000);
  const [capexDollars, setCapexDollars] = useState<number>(380000);
  const [opexDollars, setOpexDollars] = useState<number>(40000);

  const netPreservationValue = Math.max(0, rehabValueDollars - deprecExpenseDollars);
  const totalCost = capexDollars + opexDollars;
  const calculatedHPR = totalCost > 0 ? (netPreservationValue / totalCost) : 0;
  const isHPRValid = calculatedHPR >= 0.85;

  // Capital calculation
  const seriesAPrincipal = UNIFIED_DOCUMENT_METADATA.seriesAPrincipal;
  const seriesBPrincipal = UNIFIED_DOCUMENT_METADATA.seriesBPrincipal;
  const totalPrincipal = seriesAPrincipal + seriesBPrincipal;
  const seriesAShares = Math.round(seriesAPrincipal * exchangeRatio);
  const seriesBShares = Math.round(seriesBPrincipal * exchangeRatio);
  const calculatedShares = seriesAShares + seriesBShares;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 p-6 rounded-xl border border-emerald-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">
                AUDIT ENGINE
              </span>
              <h2 className="text-xl font-bold text-white">
                Interactive Capitalization & Mathematical Auditor
              </h2>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-3xl">
              Audit the $500,000,000.00 senior debt capitalization vector, test exchange ratio conversions, simulate continuous Merton HJB DYREO daily sweeps, and explore SEC Edgar Form 13F CUSIP holdings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-700 text-right">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Master Vector</div>
              <div className="font-mono text-emerald-400 font-bold text-lg">$500,000,000.00</div>
              <div className="text-[10px] text-slate-400">45,850,000 LEU Shs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid 1: Master Capitalization & Share Conversion Auditor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm sm:text-base">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Master $500,000,000.00 Indenture Capitalization Auditor</span>
            </h3>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-mono">
              100% Harmonized
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Directly cross-checks the two Senior Note tranches from the 1999 Indenture and their conversion into Centrus Energy Corp. (NYSE: LEU) reorganized common stock under Delaware Case No. 14-10492.
          </p>

          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-3">
            <div className="space-y-2 pt-1 text-xs font-mono">
              <div className="flex justify-between items-center p-2 rounded bg-slate-900/60 border border-slate-800">
                <div>
                  <span className="text-white font-semibold">Series A 6.625% Notes (917300AA1)</span>
                  <div className="text-[10px] text-slate-400 font-sans">Maturity: Jan 20, 2006</div>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 font-bold">$350,000,000.00</span>
                  <div className="text-[10px] text-indigo-300">{seriesAShares.toLocaleString()} shs</div>
                </div>
              </div>

              <div className="flex justify-between items-center p-2 rounded bg-slate-900/60 border border-slate-800">
                <div>
                  <span className="text-white font-semibold">Series B 6.750% Notes (917300AB9)</span>
                  <div className="text-[10px] text-slate-400 font-sans">Maturity: Jan 20, 2009</div>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 font-bold">$150,000,000.00</span>
                  <div className="text-[10px] text-indigo-300">{seriesBShares.toLocaleString()} shs</div>
                </div>
              </div>

              <div className="flex justify-between pt-2 border-t border-slate-700 text-sm font-bold">
                <span className="text-slate-200">Total Estate Capitalization:</span>
                <span className="text-emerald-400">
                  ${totalPrincipal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Fully uniform across BNY Mellon & D.C. Circuit Court filings: strictly $500,000,000.00.</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-200">Exchange Ratio Conversion:</span>
              <span className="font-mono text-indigo-400 font-bold">{exchangeRatio}</span>
            </div>
            <div className="font-mono text-xs text-indigo-300 bg-slate-900 p-2 rounded border border-slate-800">
              $500,000,000.00 &times; {exchangeRatio} = <strong>{calculatedShares.toLocaleString()} Common Shares</strong> (NYSE: LEU)
            </div>
          </div>
        </div>

        {/* DYREO Dynamic Yield Sweep Engine */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm sm:text-base">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <span>DYREO Continuous Sweep Calculator</span>
            </h3>
            <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
              Merton HJB Policy
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Deterministic daily yield distribution vector <span className="font-mono text-indigo-300">D(t) = Y(t) · [0.60, 0.25, 0.10, 0.05]^T</span>. Enter any credited dividend or coupon yield to test the automated disbursement:
          </p>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-300">
              Test Yield Amount Credited ($):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                step="10000"
                value={mockYield}
                onChange={(e) => setMockYield(Math.max(0, Number(e.target.value)))}
                className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg font-mono text-sm text-emerald-400 focus:outline-none focus:border-indigo-500"
              />
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => setMockYield(500000)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 rounded cursor-pointer"
                >
                  $500k
                </button>
                <button
                  onClick={() => setMockYield(1000000)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 rounded cursor-pointer"
                >
                  $1M
                </button>
                <button
                  onClick={() => setMockYield(5000000)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 rounded cursor-pointer"
                >
                  $5M
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            {DYREO_ALLOCATION_VECTOR.map((item, idx) => {
              const allocated = (mockYield * item.percentage) / 100;
              return (
                <div key={idx} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-indigo-400 w-10 text-right">{item.percentage}%</span>
                    <span className="text-slate-300 font-medium">{item.category}</span>
                  </div>
                  <div className="font-mono font-bold text-emerald-400">
                    ${allocated.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid 2: Microgrid Physics & CUSIP Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 300 Baltimore Rowhomes Housing Preservation Physics */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm sm:text-base">
              <Building className="w-4 h-4 text-amber-400" />
              <span>300 Baltimore Rowhomes Housing Preservation (HPR Validator)</span>
            </h3>
            <span className={`text-xs px-2 py-0.5 rounded font-mono ${isHPRValid ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
              {isHPRValid ? 'QUALIFIED (≥ 0.85 Ratio)' : 'NON-COMPLIANT'}
            </span>
          </div>

          <p className="text-xs text-slate-300">
            Escrow Sub-Account B mandates that disbursements for historic rowhome building envelope rehabilitation and tenant stabilization satisfy the minimum Housing Preservation Ratio:
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Rehab Value ($):</label>
              <input 
                type="number" 
                value={rehabValueDollars} 
                onChange={(e) => setRehabValueDollars(Number(e.target.value))}
                className="w-full p-1.5 bg-slate-950 border border-slate-700 rounded font-mono text-slate-200"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Deprec Expense ($):</label>
              <input 
                type="number" 
                value={deprecExpenseDollars} 
                onChange={(e) => setDeprecExpenseDollars(Number(e.target.value))}
                className="w-full p-1.5 bg-slate-950 border border-slate-700 rounded font-mono text-slate-200"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">CapEx ($):</label>
              <input 
                type="number" 
                value={capexDollars} 
                onChange={(e) => setCapexDollars(Number(e.target.value))}
                className="w-full p-1.5 bg-slate-950 border border-slate-700 rounded font-mono text-slate-200"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Lifetime Maint ($):</label>
              <input 
                type="number" 
                value={opexDollars} 
                onChange={(e) => setOpexDollars(Number(e.target.value))}
                className="w-full p-1.5 bg-slate-950 border border-slate-700 rounded font-mono text-slate-200"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Calculated HPR:</span>
            <div className="flex items-center gap-2">
              <span className={`font-mono font-bold text-base ${isHPRValid ? 'text-emerald-400' : 'text-red-400'}`}>
                {calculatedHPR.toFixed(3)} Ratio
              </span>
              <span className="text-xs text-slate-500">(Target: ≥ 0.850)</span>
            </div>
          </div>
        </div>

        {/* SEC Form 13F CUSIP Matcher */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm sm:text-base">
              <Database className="w-4 h-4 text-indigo-400" />
              <span>SEC Form 13F Institutional CUSIP Explorer</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">File No. 28-1235</span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={cusipSearch}
              onChange={(e) => setCusipSearch(e.target.value)}
              placeholder="Search CUSIP (e.g. 917300AA1) or Issuer..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-200"
            />
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {CUSIP_PORTFOLIO_DATA.filter(item => 
              item.cusip.toLowerCase().includes(cusipSearch.toLowerCase()) ||
              item.issuer.toLowerCase().includes(cusipSearch.toLowerCase())
            ).map((item, idx) => (
              <div key={idx} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-medium text-white">{item.issuer}</div>
                  <div className="text-[10px] text-slate-400 font-mono">CUSIP: {item.cusip} | {item.titleOfClass}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-emerald-400 font-semibold">{item.sharesOrPrincipal}</div>
                  <div className="text-[10px] text-indigo-400 font-sans">{item.discretion}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
