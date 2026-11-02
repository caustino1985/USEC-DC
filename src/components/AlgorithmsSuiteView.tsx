import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  Cpu, 
  Search, 
  Calculator, 
  TrendingUp, 
  ShieldCheck, 
  ChevronRight, 
  Binary, 
  Terminal,
  Activity,
  Layers,
  Sparkles,
  PieChart as PieIcon,
  BarChart3,
  LineChart as AreaIcon,
  Building2,
  DollarSign,
  Scale,
  Award,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { ALGORITHM_SUITE, UNIFIED_DOCUMENT_METADATA } from '../data/unifiedDocumentData';
import { AlgorithmDefinition } from '../types/document';

// Beneficiary Distribution Dataset ($500M Senior Notes / 45,850,000 LEU Common Shares)
export interface BeneficiaryAllocation {
  id: string;
  name: string;
  shortName: string;
  percentage: number;
  dollars: number;
  shares: number;
  color: string;
  secondaryColor: string;
  mandate: string;
  statutoryBasis: string;
  annualDistributionCeiling: number;
  dtcClearingEndpoint: string;
}

export const BENEFICIARY_ALLOCATIONS: BeneficiaryAllocation[] = [
  {
    id: 'psdlef',
    name: 'PSDLEF Perpetual Trust Corpus',
    shortName: 'PSDLEF Perpetual Corpus',
    percentage: 60,
    dollars: 300000000,
    shares: 27510000,
    color: '#10B981', // emerald-500
    secondaryColor: '#059669',
    mandate: 'Sovereign capital floor invested in U.S. Treasury equivalents. Perpetual research endowment for computational biology, dopamine D4/D5 SAR explorer, and NIST FIPS 203/204 post-quantum infrastructure.',
    statutoryBasis: 'Wyo. Stat. Ann. § 17-23-114 / 15 U.S.C. § 77aaa',
    annualDistributionCeiling: 15000000, // 5% trailing cap
    dtcClearingEndpoint: 'M&T Bank Escrow Sub-Account 2 (ABA 022000046)'
  },
  {
    id: 'housing-spv',
    name: 'Baltimore Historic Rowhomes Housing Preservation SPV',
    shortName: 'Baltimore Rowhomes SPV',
    percentage: 25,
    dollars: 125000000,
    shares: 11462500,
    color: '#6366F1', // indigo-500
    secondaryColor: '#4f46e5',
    mandate: 'Acquisition, deep architectural preservation, and perpetual community land trust custody of 300 historic rowhomes across Baltimore County & City communities to prevent speculative displacement.',
    statutoryBasis: 'Md. Code, Real Prop. § 14-120 / Wyo. Stat. Ann. § 17-23-106',
    annualDistributionCeiling: 6250000,
    dtcClearingEndpoint: 'Baltimore Regional Escrow & Land Trust Fiduciary Desk'
  },
  {
    id: 'pro-se-grant',
    name: 'Pro Se Litigant AI & Cognitive Grant Pool',
    shortName: 'Pro Se Litigant Grant Pool',
    percentage: 10,
    dollars: 50000000,
    shares: 4585000,
    color: '#F59E0B', // amber-500
    secondaryColor: '#d97706',
    mandate: 'ADA Title II cognitive accommodations, real-time docket parity algorithms, automated in forma pauperis generators, and pro se litigant open-access AI legal infrastructure.',
    statutoryBasis: '42 U.S.C. § 12132 / Tennessee v. Lane, 541 U.S. 509',
    annualDistributionCeiling: 2500000,
    dtcClearingEndpoint: 'ADA Title II Special Master Sub-Account'
  },
  {
    id: 'legal-defense',
    name: 'Legal Defense & Emergency Operational Reserves',
    shortName: 'Legal & Escrow Reserves',
    percentage: 5,
    dollars: 25000000,
    shares: 2292500,
    color: '#EC4899', // pink-500
    secondaryColor: '#db2777',
    mandate: 'Quad-cameral Trust Protector enforcement, independent examiner audits, fiduciary bond surety, and appellate enforcement of Rule 18 exaction remedies.',
    statutoryBasis: 'Uniform Directed Trust Act § 8 / Fed. R. Civ. P. 18',
    annualDistributionCeiling: 1250000,
    dtcClearingEndpoint: 'Fiduciary Surety & Regulatory Compliance Depository'
  }
];

// 5-Year Trailing Perpetuity Growth & Distribution Simulation Data (Algorithm 12 / Section 3)
const PERPETUITY_SIMULATION_DATA = [
  { year: 'Year 1', corpusPrincipal: 500.0, treasuryYield: 20.0, annualDistributionCap: 25.0, cumulativeDistributed: 25.0, endingReserve: 495.0 },
  { year: 'Year 2', corpusPrincipal: 495.0, treasuryYield: 24.8, annualDistributionCap: 24.8, cumulativeDistributed: 49.8, endingReserve: 495.0 },
  { year: 'Year 3', corpusPrincipal: 495.0, treasuryYield: 34.6, annualDistributionCap: 25.5, cumulativeDistributed: 75.3, endingReserve: 504.1 },
  { year: 'Year 4', corpusPrincipal: 504.1, treasuryYield: 40.3, annualDistributionCap: 26.2, cumulativeDistributed: 101.5, endingReserve: 518.2 },
  { year: 'Year 5', corpusPrincipal: 518.2, treasuryYield: 46.6, annualDistributionCap: 27.4, cumulativeDistributed: 128.9, endingReserve: 537.4 }
];

export const AlgorithmsSuiteView: React.FC = () => {
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [selectedModule, setSelectedModule] = useState<string>('All');
  const [selectedAlgoNum, setSelectedAlgoNum] = useState<number>(4);
  const [activeChartTab, setActiveChartTab] = useState<'donut' | 'bar' | 'projection'>('donut');
  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState<string>('psdlef');
  const [chartMetric, setChartMetric] = useState<'dollars' | 'shares'>('dollars');

  // Filter modules list
  const modules = ['All', ...Array.from(new Set(ALGORITHM_SUITE.map(a => a.module)))];

  const filteredAlgos = ALGORITHM_SUITE.filter(a => {
    const matchesSearch = 
      a.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      a.purpose.toLowerCase().includes(searchFilter.toLowerCase()) ||
      a.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
      a.module.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesModule = selectedModule === 'All' || a.module === selectedModule;

    return matchesSearch && matchesModule;
  });

  const activeAlgo = ALGORITHM_SUITE.find(a => a.num === selectedAlgoNum) || ALGORITHM_SUITE[3];
  const activeBeneficiary = BENEFICIARY_ALLOCATIONS.find(b => b.id === selectedBeneficiaryId) || BENEFICIARY_ALLOCATIONS[0];

  // Recharts custom tooltip
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-lg shadow-xl text-xs space-y-1 z-50">
          <div className="font-bold text-white flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
            {data.name}
          </div>
          <div className="text-emerald-400 font-mono font-bold">
            ${(data.dollars / 1000000).toFixed(1)} Million ({data.percentage}%)
          </div>
          <div className="text-indigo-300 font-mono text-[11px]">
            {data.shares.toLocaleString()} Common Shares (NYSE: LEU)
          </div>
          <div className="text-slate-400 text-[10px] max-w-xs pt-1 border-t border-slate-800">
            {data.statutoryBasis}
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-lg shadow-xl text-xs space-y-1">
          <div className="font-bold text-white">{label}</div>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center gap-2 font-mono text-[11px]" style={{ color: entry.color }}>
              <span>{entry.name}:</span>
              <span className="font-bold">
                {entry.dataKey === 'dollars' ? `$${(entry.value / 1000000).toFixed(1)}M` : `${(entry.value / 1000000).toFixed(2)}M Shs`}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/70 border border-emerald-500/40 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">
                31-ALGORITHM EXECUTION SUITE
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Integrated Algorithmic Architecture & Financial Infrastructure
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
              From Chapter 11 and Chapter 25 of <em>Rights, Genomes, and Algorithms</em>. Spanning Bond Valuation, Reorganized Conversion, GARCH Volatility, Black-Scholes, Duration/Convexity, Uniswap AMM Constant-Product, Markowitz/Black-Litterman MVO, NIST FIPS 203/204 Post-Quantum primitives, and Cognitive Telemetry.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-right shrink-0">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Settlement</div>
              <div className="font-mono text-emerald-400 font-bold text-lg">$500,000,000.00</div>
              <div className="text-[10px] text-slate-500">45,850,000 LEU Shares</div>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-right shrink-0 hidden sm:block">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Algorithms</div>
              <div className="font-mono text-indigo-400 font-bold text-lg">31 Engines</div>
              <div className="text-[10px] text-slate-500">11 Specialized Modules</div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION: RECHARTS DATA VISUALIZATION — $500M SETTLEMENT BENEFICIARY VECTOR */}
      {/* ========================================================================= */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <PieIcon className="w-4 h-4" />
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight">
                $500M Settlement Distribution Across Trust Beneficiaries (Recharts Visualizer)
              </h3>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl">
              Deterministic allocation of the $500,000,000.00 Senior Debt corpus and 45,850,000 converted Centrus Energy Corp. (NYSE: LEU) common shares across four non-commingled trust beneficiaries pursuant to Wyo. Stat. Ann. § 17-23-114, Md. Real Prop. § 14-120, and the confirmed Delaware Bankruptcy Order.
            </p>
          </div>

          {/* Visualization Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Chart Type Selector */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveChartTab('donut')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  activeChartTab === 'donut'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <PieIcon className="w-3.5 h-3.5" />
                <span>Donut Breakdown</span>
              </button>

              <button
                onClick={() => setActiveChartTab('bar')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  activeChartTab === 'bar'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Capital vs Shares</span>
              </button>

              <button
                onClick={() => setActiveChartTab('projection')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  activeChartTab === 'projection'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <AreaIcon className="w-3.5 h-3.5" />
                <span>5-Yr Perpetuity Cap</span>
              </button>
            </div>

            {/* Metric Switcher (Dollars vs Shares) */}
            {activeChartTab === 'donut' && (
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setChartMetric('dollars')}
                  className={`px-2.5 py-1 rounded-lg font-mono font-medium transition-colors ${
                    chartMetric === 'dollars' ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  USD ($)
                </button>
                <button
                  onClick={() => setChartMetric('shares')}
                  className={`px-2.5 py-1 rounded-lg font-mono font-medium transition-colors ${
                    chartMetric === 'shares' ? 'bg-slate-800 text-indigo-400 font-bold' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  LEU Shares
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Visualizer Chart & Active Details Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Main Chart Container */}
          <div className="lg:col-span-7 bg-slate-950/80 border border-slate-800 rounded-xl p-4 sm:p-5 relative min-h-[380px] flex flex-col justify-center">
            {/* Invariant Badge */}
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-mono">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Zero Tucker Pool Invariant: $0.00</span>
            </div>

            {/* CHART 1: DONUT PIE CHART */}
            {activeChartTab === 'donut' && (
              <div className="w-full h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={BENEFICIARY_ALLOCATIONS}
                      dataKey={chartMetric === 'dollars' ? 'dollars' : 'shares'}
                      nameKey="shortName"
                      cx="50%"
                      cy="50%"
                      innerRadius={68}
                      outerRadius={115}
                      onClick={(entry: any) => setSelectedBeneficiaryId(entry?.payload?.id || entry?.id)}
                      cursor="pointer"
                    >
                      {BENEFICIARY_ALLOCATIONS.map((entry) => (
                        <Cell 
                          key={`cell-${entry.id}`} 
                          fill={entry.color} 
                          stroke={selectedBeneficiaryId === entry.id ? '#ffffff' : '#0f172a'}
                          strokeWidth={selectedBeneficiaryId === entry.id ? 2.5 : 1}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                    <Legend 
                      verticalAlign="bottom" 
                      align="center"
                      iconSize={8}
                      wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* CHART 2: BAR CHART */}
            {activeChartTab === 'bar' && (
              <div className="w-full h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={BENEFICIARY_ALLOCATIONS}
                    margin={{ top: 20, right: 30, left: 10, bottom: 25 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis 
                      dataKey="shortName" 
                      tick={{ fill: '#94a3b8', fontSize: 10 }}
                      angle={-10}
                      textAnchor="end"
                    />
                    <YAxis 
                      yAxisId="left" 
                      orientation="left" 
                      stroke="#10b981" 
                      tick={{ fill: '#10b981', fontSize: 10 }}
                      tickFormatter={(v) => `$${v / 1000000}M`}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      stroke="#6366f1" 
                      tick={{ fill: '#6366f1', fontSize: 10 }}
                      tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
                    />
                    <Tooltip content={<CustomBarTooltip />} />
                    <Legend 
                      verticalAlign="top"
                      wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
                    />
                    <Bar 
                      yAxisId="left" 
                      dataKey="dollars" 
                      name="Allocated Principal ($)" 
                      fill="#10b981" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      yAxisId="right" 
                      dataKey="shares" 
                      name="Centrus Common Shares (LEU)" 
                      fill="#6366f1" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* CHART 3: AREA CHART (5-YEAR PERPETUITY SIMULATION) */}
            {activeChartTab === 'projection' && (
              <div className="w-full h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={PERPETUITY_SIMULATION_DATA}
                    margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="corpusGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="capGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="year" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} tickFormatter={(v) => `$${v}M`} />
                    <Tooltip 
                      formatter={(val: any, name: any) => [`$${val}M`, name]}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                    />
                    <Legend 
                      verticalAlign="top"
                      wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="endingReserve" 
                      name="Compounded Perpetual Reserve ($M)" 
                      stroke="#10b981" 
                      fillOpacity={1} 
                      fill="url(#corpusGrad)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="annualDistributionCap" 
                      name="5% Trailing Annual Sweep Cap ($M)" 
                      stroke="#f59e0b" 
                      fillOpacity={1} 
                      fill="url(#capGrad)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Selected Beneficiary Detail Card */}
          <div className="lg:col-span-5 bg-slate-950/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span 
                  className="w-3 h-3 rounded-full shrink-0" 
                  style={{ backgroundColor: activeBeneficiary.color }}
                />
                <span className="font-mono text-xs font-bold text-slate-300">
                  {activeBeneficiary.percentage}% ALLOCATION VECTOR
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-emerald-400">
                Active Selection
              </span>
            </div>

            <div>
              <h4 className="text-base font-bold text-white">
                {activeBeneficiary.name}
              </h4>
              <div className="flex items-center gap-4 mt-2">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Allocated Dollars</div>
                  <div className="text-lg font-mono font-bold text-emerald-400">
                    ${(activeBeneficiary.dollars).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="border-l border-slate-800 pl-4">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Common Shares (LEU)</div>
                  <div className="text-lg font-mono font-bold text-indigo-300">
                    {activeBeneficiary.shares.toLocaleString()} Shs
                  </div>
                </div>
              </div>
            </div>

            {/* Fiduciary Mandate */}
            <div className="space-y-1 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Fiduciary Mandate & Preservation Purpose:
              </span>
              <p className="p-3 bg-slate-900 rounded-lg border border-slate-800/80 text-slate-300 leading-relaxed text-[11px]">
                {activeBeneficiary.mandate}
              </p>
            </div>

            {/* Operational Specs */}
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800/80">
                <span className="text-[10px] uppercase text-slate-500 block">5% Trailing Cap</span>
                <span className="font-mono text-amber-400 font-bold">
                  ${(activeBeneficiary.annualDistributionCeiling).toLocaleString()}/yr
                </span>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800/80">
                <span className="text-[10px] uppercase text-slate-500 block">Statutory Anchor</span>
                <span className="font-mono text-slate-300 font-semibold truncate block">
                  {activeBeneficiary.statutoryBasis.split('/')[0]}
                </span>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
              <span>Clearing Target:</span>
              <span className="font-mono text-indigo-300">{activeBeneficiary.dtcClearingEndpoint}</span>
            </div>
          </div>
        </div>

        {/* 4 Interactive Beneficiary Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {BENEFICIARY_ALLOCATIONS.map((b) => {
            const isSelected = b.id === selectedBeneficiaryId;
            return (
              <div
                key={b.id}
                onClick={() => setSelectedBeneficiaryId(b.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border-emerald-500 shadow-md ring-1 ring-emerald-500/40'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span 
                    className="w-2.5 h-2.5 rounded-full" 
                    style={{ backgroundColor: b.color }} 
                  />
                  <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-slate-900 text-white">
                    {b.percentage}%
                  </span>
                </div>
                <div className="font-semibold text-xs text-white mt-2 line-clamp-1">
                  {b.shortName}
                </div>
                <div className="font-mono text-emerald-400 font-bold text-sm mt-0.5">
                  ${(b.dollars / 1000000).toFixed(1)}M
                </div>
                <div className="text-[10px] text-indigo-300/80 font-mono">
                  {(b.shares / 1000000).toFixed(2)}M LEU Shares
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search algorithms, opcodes, math..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {modules.map((mod, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedModule(mod)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors whitespace-nowrap ${
                selectedModule === mod
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {mod.replace(/^Module [I|V|X]+: /, '')}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search algorithms, opcodes, math..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {modules.map((mod, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedModule(mod)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors whitespace-nowrap ${
                selectedModule === mod
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {mod.replace(/^Module [I|V|X]+: /, '')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Suite Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Algorithm Catalog List */}
        <div className="lg:col-span-5 space-y-2 max-h-[680px] overflow-y-auto pr-1">
          {filteredAlgos.map((algo) => {
            const isSelected = algo.num === selectedAlgoNum;
            return (
              <div
                key={algo.num}
                onClick={() => setSelectedAlgoNum(algo.num)}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-md'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      {algo.id}
                    </span>
                    <span className="font-semibold text-xs sm:text-sm">{algo.name}</span>
                  </div>

                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                    algo.register === 'Adopted' 
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {algo.register}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                  {algo.purpose}
                </div>

                <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>{algo.module}</span>
                  <span className="text-indigo-400">Time: {algo.complexity}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Algorithm Deep Dive */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold">
                  {activeAlgo.id}
                </span>
                <span className="text-xs text-slate-400 font-mono">{activeAlgo.module}</span>
              </div>
              <h3 className="font-bold text-white text-lg sm:text-xl mt-1">
                Algorithm {activeAlgo.num}: {activeAlgo.name}
              </h3>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase text-slate-500 block">Register Status</span>
              <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-700 text-xs font-mono text-amber-300">
                [{activeAlgo.register.toUpperCase()}]
              </span>
            </div>
          </div>

          {/* Purpose */}
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Operational Purpose:</span>
            <p className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-200 text-xs sm:text-sm">
              {activeAlgo.purpose}
            </p>
          </div>

          {/* Mathematical Formulation */}
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Mathematical & Algorithmic Formulation:</span>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-emerald-300 text-xs sm:text-sm overflow-x-auto leading-relaxed">
              {activeAlgo.formulation}
            </div>
          </div>

          {/* Execution Complexity */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-500 uppercase text-[10px] block">Asymptotic Complexity</span>
              <span className="font-mono text-indigo-400 font-bold text-sm">{activeAlgo.complexity}</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-500 uppercase text-[10px] block">Execution Pipeline</span>
              <span className="font-mono text-amber-400 font-bold text-sm">HSPA v3.0 / MMIO</span>
            </div>
          </div>

          {/* Specific Algorithm Highlight Notes */}
          {activeAlgo.num === 4 && (
            <div className="p-4 bg-indigo-950/40 border border-indigo-500/40 rounded-xl space-y-2 text-xs">
              <div className="font-bold text-indigo-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Primary Reorganized Indenture Conversion Check (NYSE: LEU)</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Applies the 0.0917 ratio confirmed in Delaware Bankruptcy Case No. 14-10492 to the $500,000,000.00 senior debt principal, yielding exactly <strong>45,850,000 common shares</strong>. Delivered to The Bank of New York Mellon under DTC Participant protocols.
              </p>
            </div>
          )}

          {activeAlgo.num === 20 && (
            <div className="p-4 bg-indigo-950/40 border border-indigo-500/40 rounded-xl space-y-2 text-xs">
              <div className="font-bold text-indigo-300 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                <span>Duration and Convexity Sensitivity Analysis</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Macaulay and Modified Duration gauge first-order interest rate risk; convexity accounts for second-order curvature, optimizing immunization for the $350M Series A (2006) and $150M Series B (2009) tranches.
              </p>
            </div>
          )}

          {activeAlgo.num === 27 && (
            <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl space-y-2 text-xs">
              <div className="font-bold text-emerald-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>NIST FIPS 203 Post-Quantum Security Profile</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                ML-KEM-1024 provides 256-bit post-quantum security over module lattices, defeating harvest-now-decrypt-later adversaries to permanently protect clinical, genomic, and trust custody transfers.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
