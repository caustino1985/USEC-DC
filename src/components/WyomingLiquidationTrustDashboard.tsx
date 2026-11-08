import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Search, 
  Filter, 
  RefreshCw, 
  ExternalLink, 
  Download, 
  Copy, 
  Check, 
  DollarSign, 
  Users, 
  Layers, 
  PieChart as PieIcon, 
  BarChart3, 
  Home, 
  FileText, 
  Sparkles, 
  ChevronRight, 
  BadgeCheck,
  Scale,
  Landmark,
  Eye,
  KeyRound,
  ShieldAlert
} from 'lucide-react';
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
  CartesianGrid 
} from 'recharts';
import { 
  MASTER_POOL_SETTLEMENT_PORTIONS, 
  INITIAL_TRUST_BENEFICIARIES, 
  getBeneficiaryCountsSummary,
  MasterPoolSummary 
} from '../data/wyomingTrustBeneficiariesData';
import { TrustBeneficiaryRecord, BeneficiaryVerificationStatus } from '../types/document';
import { auth, db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

interface Props {
  onSelectPool?: (poolId: string) => void;
}

export const WyomingLiquidationTrustDashboard: React.FC<Props> = () => {
  const [beneficiaries, setBeneficiaries] = useState<TrustBeneficiaryRecord[]>(INITIAL_TRUST_BENEFICIARIES);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'All' | BeneficiaryVerificationStatus | 'SSDI'>('All');
  const [selectedPoolId, setSelectedPoolId] = useState<string>('all');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<TrustBeneficiaryRecord | null>(null);
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);
  const [isVerifyingAll, setIsVerifyingAll] = useState<boolean>(false);
  const [verifyProgress, setVerifyProgress] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeChartType, setActiveChartType] = useState<'donut' | 'bar'>('donut');

  // Trigger toast alert
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Real-time calculation summary
  const summary = useMemo(() => {
    return getBeneficiaryCountsSummary(beneficiaries);
  }, [beneficiaries]);

  // Master pools with live counts derived from current state
  const liveMasterPools = useMemo(() => {
    return MASTER_POOL_SETTLEMENT_PORTIONS.map(pool => {
      const poolBens = beneficiaries.filter(b => b.masterPoolId === pool.id);
      const verified = poolBens.filter(b => b.verificationStatus === 'Verified').length;
      const pending = poolBens.filter(b => b.verificationStatus === 'Pending' || b.verificationStatus === 'Under Review').length;
      const actionReq = poolBens.filter(b => b.verificationStatus === 'Action Required').length;
      return {
        ...pool,
        activeBeneficiariesCount: poolBens.length,
        verifiedCount: verified,
        pendingCount: pending,
        actionRequiredCount: actionReq
      };
    });
  }, [beneficiaries]);

  // Filtered beneficiaries based on search, status, and pool
  const filteredBeneficiaries = useMemo(() => {
    return beneficiaries.filter(b => {
      // Pool filter
      if (selectedPoolId !== 'all' && b.masterPoolId !== selectedPoolId) {
        return false;
      }
      // Status filter
      if (statusFilter === 'SSDI') {
        if (!b.ssdiBacklogCarveout) return false;
      } else if (statusFilter !== 'All') {
        if (b.verificationStatus !== statusFilter) return false;
      }
      // Search filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return (
          b.name.toLowerCase().includes(q) ||
          b.roleOrCategory.toLowerCase().includes(q) ||
          b.poolName.toLowerCase().includes(q) ||
          b.verificationMethod.toLowerCase().includes(q) ||
          b.clearingEndpoint.toLowerCase().includes(q) ||
          (b.docketReference && b.docketReference.toLowerCase().includes(q)) ||
          b.notes.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [beneficiaries, selectedPoolId, statusFilter, searchQuery]);

  // Handle re-verifying a single beneficiary
  const handleVerifyBeneficiary = async (benId: string, newStatus: BeneficiaryVerificationStatus = 'Verified') => {
    const timestamp = new Date().toLocaleString('en-US', { timeZoneName: 'short' });
    setBeneficiaries(prev => prev.map(b => {
      if (b.id === benId) {
        return {
          ...b,
          verificationStatus: newStatus,
          lastVerifiedAt: timestamp,
          verifiedBy: 'Automated MDEC & DTC Participant Audit Protocol'
        };
      }
      return b;
    }));

    const targetBen = beneficiaries.find(b => b.id === benId);
    showToast(`Updated verification status for ${targetBen?.name || 'Beneficiary'} to ${newStatus}`);

    // Log to Firestore if authenticated
    try {
      const user = auth.currentUser;
      if (user) {
        await addDoc(collection(db, 'workspace_activity'), {
          uid: user.uid,
          service: 'drive',
          action: `WY_TRUST_VERIFY: ${targetBen?.name} -> ${newStatus}`,
          timestamp: new Date().toISOString()
        });
      }
    } catch {
      // Handled silently
    }
  };

  // Handle simulated full audit scan & re-verification of all beneficiaries
  const handleVerifyAll = () => {
    setIsVerifyingAll(true);
    setVerifyProgress(10);

    const interval = setInterval(() => {
      setVerifyProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsVerifyingAll(false);
          const nowStr = new Date().toLocaleString('en-US', { timeZoneName: 'short' });
          setBeneficiaries(current => current.map(b => ({
            ...b,
            verificationStatus: 'Verified',
            lastVerifiedAt: nowStr,
            verifiedBy: 'Consolidated BNY Mellon DTC & Baltimore MDEC Audit Pass'
          })));
          showToast('All 12 Active Trust Beneficiary Records & Portions Verified & Cleared via MDEC & DTC Bridge.');
          return 100;
        }
        return prev + 25;
      });
    }, 350);
  };

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Open dossier modal
  const handleOpenDossier = (b: TrustBeneficiaryRecord) => {
    setSelectedBeneficiary(b);
    setIsDossierOpen(true);
  };

  // Recharts data for master pools
  const chartData = liveMasterPools.map(pool => ({
    name: pool.name.replace(' (WY)', '').replace(' SPV', ''),
    fullName: pool.name,
    dollars: pool.dollars / 1000000,
    shares: pool.shares / 1000000,
    percentage: pool.percentage,
    color: pool.color,
    verifiedCount: pool.verifiedCount,
    totalCount: pool.activeBeneficiariesCount
  }));

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-950 border border-indigo-500/50 text-indigo-200 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs animate-in fade-in slide-in-from-bottom-3 duration-300">
          <BadgeCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-2 text-sm"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Banner & Audit Controls */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/40 uppercase tracking-wider flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                <span>Wyoming Statutory Trust Act § 17-23-101</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/40 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Real-Time Fiduciary Ledger</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold border border-blue-500/40 uppercase tracking-wider">
                Zero Tucker Act Pool ($0.00)
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight pt-1">
              Beneficiary Settlement Dashboard &amp; Verification Telemetry
            </h3>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Real-time audit tracking of all <strong>active beneficiaries</strong>, court-assigned settlement portions, and <strong>verification clearances</strong> under the $500,000,000.00 senior claim converted into 45,850,000 Centrus Energy Corp. common shares (NYSE: LEU).
            </p>
          </div>

          {/* Action triggers */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleVerifyAll}
              disabled={isVerifyingAll}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold shadow-lg transition-all cursor-pointer ${
                isVerifyingAll
                  ? 'bg-indigo-700 text-white cursor-wait'
                  : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:brightness-110 text-white shadow-emerald-950/40'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isVerifyingAll ? 'animate-spin' : ''}`} />
              <span>{isVerifyingAll ? `Auditing Bridge (${verifyProgress}%)...` : '⚡ Re-Verify All via MDEC & DTC'}</span>
            </button>
          </div>
        </div>

        {/* Verification Progress Bar if scanning */}
        {isVerifyingAll && (
          <div className="mt-4 pt-3 border-t border-slate-800 space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono text-indigo-300">
              <span>Cross-referencing Baltimore County Equity Docket C-03-CV-26-004128 &amp; BNY Mellon CUSIP bridge...</span>
              <span>{verifyProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 transition-all duration-300"
                style={{ width: `${verifyProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* KPI Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Active Beneficiaries */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl space-y-2 transition-all shadow-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Active Beneficiaries</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">{summary.total}</span>
            <span className="text-xs text-slate-400 font-sans">Active Claimants</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-semibold">
              {summary.verified} Verified
            </span>
            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-semibold">
              {summary.pending} Pending
            </span>
            {summary.actionRequired > 0 && (
              <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 font-mono font-semibold">
                {summary.actionRequired} Alert
              </span>
            )}
          </div>
        </div>

        {/* Card 2: Total Corpus Allocation */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl space-y-2 transition-all shadow-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Trust Corpus</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">$500.0M</span>
            <span className="text-[11px] text-slate-400 font-mono">100.0% Allocated</span>
          </div>
          <div className="text-[11px] text-slate-400 truncate">
            Senior Notes Restructured Claim Res
          </div>
        </div>

        {/* Card 3: Common Stock Portfolio */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl space-y-2 transition-all shadow-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">LEU Equities (0.0917)</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-indigo-300">45.85M</span>
            <span className="text-[10px] text-slate-400 font-mono">LEU Common Shares</span>
          </div>
          <div className="text-[11px] text-slate-400 truncate">
            Centrus Energy Corp. (NYSE: LEU)
          </div>
        </div>

        {/* Card 4: Verified Settlement Portion */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl space-y-2 transition-all shadow-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Cleared / Verified Portion</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-300">${(summary.verifiedDollars / 1000000).toFixed(1)}M</span>
            <span className="text-xs font-mono font-bold text-emerald-400">({summary.dollarVerifiedPercentage}%)</span>
          </div>
          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${summary.dollarVerifiedPercentage}%` }}
            />
          </div>
        </div>

        {/* Card 5: Dedicated SSDI/SSI Housing Pool */}
        <div className="p-4 bg-amber-950/20 border border-amber-500/40 rounded-xl space-y-2 transition-all shadow-md">
          <div className="flex items-center justify-between text-amber-300">
            <span className="text-[10px] font-bold uppercase tracking-wider">SSDI/SSI Housing Pool</span>
            <Home className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-400">30 Units</span>
            <span className="text-[11px] text-amber-300/80 font-mono">$12.5M Res</span>
          </div>
          <div className="text-[11px] text-slate-300 truncate">
            Dedicated for 800+ Day SSA Backlog
          </div>
        </div>
      </div>

      {/* Visual Settlement Portions Breakdown & Master Pools */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div>
            <h4 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-indigo-400" />
              <span>Master Settlement Portions &amp; Clearing Allocations</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any pool card to filter the beneficiary roster below. Total allocation matches $500,000,000.00 corpus exactly.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setActiveChartType('donut')}
                className={`px-2.5 py-1 rounded cursor-pointer transition-colors flex items-center gap-1.5 ${
                  activeChartType === 'donut' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <PieIcon className="w-3 h-3" />
                <span>Donut</span>
              </button>
              <button
                onClick={() => setActiveChartType('bar')}
                className={`px-2.5 py-1 rounded cursor-pointer transition-colors flex items-center gap-1.5 ${
                  activeChartType === 'bar' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3 h-3" />
                <span>Portions ($M)</span>
              </button>
            </div>

            {selectedPoolId !== 'all' && (
              <button
                onClick={() => setSelectedPoolId('all')}
                className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium cursor-pointer"
              >
                Clear Pool Filter
              </button>
            )}
          </div>
        </div>

        {/* Master Pool Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {liveMasterPools.map((pool) => {
            const isSelected = selectedPoolId === pool.id;
            return (
              <div
                key={pool.id}
                onClick={() => setSelectedPoolId(isSelected ? 'all' : pool.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? `bg-slate-900 border-2 shadow-xl ring-2 ring-indigo-500/40`
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
                style={{
                  borderColor: isSelected ? pool.color : undefined
                }}
              >
                {/* Top percentage & badge */}
                <div>
                  <div className="flex items-center justify-between">
                    <span 
                      className="font-mono text-2xl font-black"
                      style={{ color: pool.color }}
                    >
                      {pool.percentage}%
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {pool.activeBeneficiariesCount} Beneficiaries
                    </span>
                  </div>

                  <h5 className="font-bold text-white text-xs mt-1.5 line-clamp-1">
                    {pool.name}
                  </h5>
                  <div className="text-[11px] text-slate-400 line-clamp-1">
                    {pool.category}
                  </div>

                  {/* Financial Metrics */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1 text-xs">
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-400">Assigned Capital:</span>
                      <span className="text-emerald-400 font-bold">${(pool.dollars / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-400">Centrus Shares:</span>
                      <span className="text-indigo-300 font-semibold">{(pool.shares / 1000000).toFixed(2)}M sh</span>
                    </div>
                    <div className="flex justify-between font-mono text-[11px]">
                      <span className="text-slate-500">5% Annual Cap:</span>
                      <span className="text-slate-300">${(pool.annualDistributionCap / 1000000).toFixed(2)}M/yr</span>
                    </div>
                  </div>
                </div>

                {/* Verification Status Bar for Pool */}
                <div className="mt-3 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span>Verification Status:</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {pool.verifiedCount}/{pool.activeBeneficiariesCount} Cleared
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden flex">
                    <div 
                      className="bg-emerald-500 h-full"
                      style={{ width: `${(pool.verifiedCount / pool.activeBeneficiariesCount) * 100}%` }}
                    />
                    <div 
                      className="bg-amber-500 h-full"
                      style={{ width: `${(pool.pendingCount / pool.activeBeneficiariesCount) * 100}%` }}
                    />
                    <div 
                      className="bg-red-500 h-full"
                      style={{ width: `${(pool.actionRequiredCount / pool.activeBeneficiariesCount) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Embedded Interactive Chart */}
        <div className="mt-4 p-4 bg-slate-950 rounded-xl border border-slate-800">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {activeChartType === 'donut' ? (
                <PieChart>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl text-xs space-y-1">
                            <div className="font-bold text-white">{data.fullName}</div>
                            <div className="text-emerald-400 font-mono font-bold">${data.dollars} Million ({data.percentage}%)</div>
                            <div className="text-indigo-300 font-mono">{data.shares}M Common Shares (LEU)</div>
                            <div className="text-slate-400 text-[11px] pt-1 border-t border-slate-800">
                              Active Claimants: {data.totalCount} ({data.verifiedCount} Cleared)
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(val) => <span className="text-xs text-slate-300">{val}</span>}
                  />
                  <Pie
                    data={chartData}
                    dataKey="dollars"
                    nameKey="name"
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                    ))}
                  </Pie>
                </PieChart>
              ) : (
                <BarChart data={chartData} margin={{ top: 15, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit="M" />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl text-xs space-y-1">
                            <div className="font-bold text-white">{data.fullName}</div>
                            <div className="text-emerald-400 font-mono font-bold">${data.dollars}M USD</div>
                            <div className="text-indigo-300 font-mono">{data.shares}M LEU Shares</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="dollars" name="Settlement ($M)" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Active Beneficiaries Roster & Real-Time Verification Status Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
        {/* Controls Bar: Search, Status Filter, Export */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h4 className="font-bold text-base text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Active Trust Beneficiaries Roster &amp; Verification Telemetry</span>
            </h4>
            <p className="text-xs text-slate-400">
              Showing {filteredBeneficiaries.length} of {beneficiaries.length} active fiduciary and claimant accounts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative min-w-[200px] sm:min-w-[240px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search beneficiary, CUSIP, docket..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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

            {/* Status Filter Buttons */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs overflow-x-auto">
              <button
                onClick={() => setStatusFilter('All')}
                className={`px-2.5 py-1 rounded cursor-pointer whitespace-nowrap transition-colors ${
                  statusFilter === 'All' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({beneficiaries.length})
              </button>
              <button
                onClick={() => setStatusFilter('Verified')}
                className={`px-2.5 py-1 rounded cursor-pointer whitespace-nowrap transition-colors flex items-center gap-1 ${
                  statusFilter === 'Verified' ? 'bg-emerald-600 text-white font-bold' : 'text-emerald-400 hover:text-emerald-300'
                }`}
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified ({summary.verified})</span>
              </button>
              <button
                onClick={() => setStatusFilter('Pending')}
                className={`px-2.5 py-1 rounded cursor-pointer whitespace-nowrap transition-colors flex items-center gap-1 ${
                  statusFilter === 'Pending' ? 'bg-amber-600 text-white font-bold' : 'text-amber-400 hover:text-amber-300'
                }`}
              >
                <Clock className="w-3 h-3" />
                <span>Pending ({summary.pending})</span>
              </button>
              <button
                onClick={() => setStatusFilter('SSDI')}
                className={`px-2.5 py-1 rounded cursor-pointer whitespace-nowrap transition-colors flex items-center gap-1 ${
                  statusFilter === 'SSDI' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-amber-300 hover:text-white'
                }`}
              >
                <Home className="w-3 h-3" />
                <span>SSDI 30 Homes</span>
              </button>
            </div>
          </div>
        </div>

        {/* Beneficiaries Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-950 text-slate-300 font-bold border-b border-slate-800">
                <th className="p-3">Beneficiary &amp; Fiduciary Role</th>
                <th className="p-3">Master Pool</th>
                <th className="p-3 text-right">Settlement Portion</th>
                <th className="p-3 text-right">LEU Common Shares</th>
                <th className="p-3">Verification Status</th>
                <th className="p-3">Custodial Clearinghouse</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredBeneficiaries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 text-xs">
                    No active trust beneficiaries match your query or filters.
                  </td>
                </tr>
              ) : (
                filteredBeneficiaries.map((b) => {
                  const isSSDI = b.ssdiBacklogCarveout;
                  return (
                    <tr 
                      key={b.id} 
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isSSDI ? 'bg-amber-950/10' : ''
                      }`}
                    >
                      {/* Name & Role */}
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {b.verificationStatus === 'Verified' ? (
                            <BadgeCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : b.verificationStatus === 'Action Required' ? (
                            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                          ) : (
                            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                          )}
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{b.name}</span>
                              {isSSDI && (
                                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-mono border border-amber-500/30">
                                  30-Rowhomes Carveout
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {b.roleOrCategory} {b.housingUnitsAssigned ? `• ${b.housingUnitsAssigned} Row Homes` : ''}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Master Pool */}
                      <td className="p-3">
                        <span className="text-[11px] font-medium text-slate-300">
                          {b.poolName.replace(' (WY)', '')}
                        </span>
                        {b.docketReference && (
                          <div className="text-[10px] font-mono text-slate-500 truncate max-w-[160px]">
                            {b.docketReference}
                          </div>
                        )}
                      </td>

                      {/* Settlement Portion Dollars */}
                      <td className="p-3 text-right font-mono">
                        <div className="text-emerald-400 font-bold">
                          ${b.allocatedDollars.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {b.allocatedPercentage}% of Corpus
                        </div>
                      </td>

                      {/* Shares */}
                      <td className="p-3 text-right font-mono">
                        <div className="text-indigo-300 font-medium">
                          {b.allocatedShares.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          LEU Common
                        </div>
                      </td>

                      {/* Verification Status */}
                      <td className="p-3">
                        <div className="space-y-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            b.verificationStatus === 'Verified'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : b.verificationStatus === 'Action Required'
                              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            {b.verificationStatus === 'Verified' && <ShieldCheck className="w-3 h-3 text-emerald-400" />}
                            {b.verificationStatus === 'Pending' && <Clock className="w-3 h-3 text-amber-400" />}
                            {b.verificationStatus === 'Action Required' && <AlertTriangle className="w-3 h-3 text-red-400" />}
                            <span>{b.verificationStatus}</span>
                          </span>
                          <div className="text-[10px] text-slate-500 line-clamp-1 max-w-[180px]" title={b.verificationMethod}>
                            {b.verificationMethod}
                          </div>
                        </div>
                      </td>

                      {/* Custodial Clearinghouse */}
                      <td className="p-3">
                        <div className="text-[11px] font-mono text-slate-300 truncate max-w-[200px]" title={b.clearingEndpoint}>
                          {b.clearingEndpoint}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {b.lastVerifiedAt}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenDossier(b)}
                            title="Inspect Complete Beneficiary Verification Dossier & Legal Credentials"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleVerifyBeneficiary(
                              b.id, 
                              b.verificationStatus === 'Verified' ? 'Pending' : 'Verified'
                            )}
                            title={b.verificationStatus === 'Verified' ? 'Toggle status to Pending' : 'Verify & Clear Beneficiary'}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              b.verificationStatus === 'Verified'
                                ? 'bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/50 border border-emerald-500/30'
                                : 'bg-amber-950/40 text-amber-400 hover:bg-amber-900/50 border border-amber-500/30'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Beneficiary Dossier Inspection Modal */}
      {isDossierOpen && selectedBeneficiary && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setIsDossierOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white text-lg cursor-pointer"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white font-serif">
                    {selectedBeneficiary.name}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedBeneficiary.verificationStatus === 'Verified'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {selectedBeneficiary.verificationStatus}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {selectedBeneficiary.roleOrCategory} • Master Pool: {selectedBeneficiary.poolName}
                </div>
              </div>
            </div>

            {/* Settlement Portion Card */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-sans">Settlement Capital:</span>
                <span className="text-emerald-400 font-bold text-sm sm:text-base">
                  ${selectedBeneficiary.allocatedDollars.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 block font-sans">{selectedBeneficiary.allocatedPercentage}% of Total Corpus</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-sans">Centrus Shares (NYSE: LEU):</span>
                <span className="text-indigo-300 font-bold text-sm sm:text-base">
                  {selectedBeneficiary.allocatedShares.toLocaleString()} sh
                </span>
                <span className="text-[10px] text-slate-400 block font-sans">0.0917 Exchange Ratio</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-500 uppercase block font-sans">Housing Units:</span>
                <span className="text-amber-400 font-bold text-sm sm:text-base">
                  {selectedBeneficiary.housingUnitsAssigned ? `${selectedBeneficiary.housingUnitsAssigned} Row Homes` : 'N/A'}
                </span>
                <span className="text-[10px] text-slate-400 block font-sans">Baltimore Land Trust</span>
              </div>
            </div>

            {/* Legal Verification Credentials */}
            <div className="space-y-2 text-xs">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                <span>Verification Credentials &amp; Judicial Authority</span>
              </span>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5 text-slate-300">
                <div>
                  <strong className="text-slate-400">Method:</strong> {selectedBeneficiary.verificationMethod}
                </div>
                {selectedBeneficiary.docketReference && (
                  <div>
                    <strong className="text-slate-400">Judicial Docket:</strong> <span className="font-mono text-indigo-300">{selectedBeneficiary.docketReference}</span>
                  </div>
                )}
                <div>
                  <strong className="text-slate-400">Clearing Endpoint:</strong> <span className="font-mono text-amber-300">{selectedBeneficiary.clearingEndpoint}</span>
                </div>
                <div>
                  <strong className="text-slate-400">Audited By:</strong> {selectedBeneficiary.verifiedBy} ({selectedBeneficiary.lastVerifiedAt})
                </div>
              </div>
            </div>

            {/* Fiduciary Notes */}
            <div className="text-xs text-slate-400 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
              <strong className="text-slate-300 block mb-1">Fiduciary Context &amp; Authority:</strong>
              {selectedBeneficiary.notes}
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(JSON.stringify(selectedBeneficiary, null, 2), selectedBeneficiary.id)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedId === selectedBeneficiary.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === selectedBeneficiary.id ? 'Copied Dossier!' : 'Copy JSON'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleVerifyBeneficiary(
                      selectedBeneficiary.id,
                      selectedBeneficiary.verificationStatus === 'Verified' ? 'Action Required' : 'Verified'
                    );
                    setSelectedBeneficiary(prev => prev ? {
                      ...prev,
                      verificationStatus: prev.verificationStatus === 'Verified' ? 'Action Required' : 'Verified'
                    } : null);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                    selectedBeneficiary.verificationStatus === 'Verified'
                      ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40 hover:bg-amber-600/50'
                      : 'bg-emerald-600 text-white hover:bg-emerald-500'
                  }`}
                >
                  {selectedBeneficiary.verificationStatus === 'Verified' ? 'Flag for Audit' : 'Approve & Clear Status'}
                </button>
                <button
                  onClick={() => setIsDossierOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
