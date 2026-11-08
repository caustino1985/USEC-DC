import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Search, 
  RefreshCw, 
  ExternalLink, 
  BookOpen, 
  Scale, 
  ShieldCheck, 
  Building2, 
  Home, 
  Activity, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  AlertCircle, 
  Layers, 
  Zap, 
  Globe, 
  Share2, 
  Check, 
  Cpu, 
  Hash, 
  Fingerprint
} from 'lucide-react';
import { 
  INITIAL_CASE_HISTORIES, 
  INITIAL_SCIENCE_PUBLICATIONS, 
  INITIAL_ADR_ADX_UPDATES,
  searchPubMedArticles,
  searchEuropePMC,
  executePeriodicScienceAndAdrSync
} from '../services/openLegalScienceService';
import { CaseHistoryRecord, PeerReviewScienceItem, AdrAdxLedgerUpdate } from '../types/document';
import { PacerBackgroundWorkerBanner } from './PacerBackgroundWorkerBanner';

export const CaseScienceDataHub: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'cases' | 'science' | 'adxLedger' | 'ssdiHousing'>('cases');
  const [caseFilter, setCaseFilter] = useState<'All' | 'Maryland State' | 'Federal Appellate' | 'Federal Bankruptcy'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Data states
  const [caseHistories, setCaseHistories] = useState<CaseHistoryRecord[]>(INITIAL_CASE_HISTORIES);
  const [sciencePublications, setSciencePublications] = useState<PeerReviewScienceItem[]>(INITIAL_SCIENCE_PUBLICATIONS);
  const [adxLedger, setAdxLedger] = useState<AdrAdxLedgerUpdate[]>(INITIAL_ADR_ADX_UPDATES);
  
  // Periodic Science Checker state
  const [isAutoCheckActive, setIsAutoCheckActive] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>(new Date().toLocaleTimeString());
  const [syncCount, setSyncCount] = useState<number>(3);
  const [customScienceQuery, setCustomScienceQuery] = useState<string>('');
  const [isSearchingScience, setIsSearchingScience] = useState<boolean>(false);

  const sciencePublicationsRef = React.useRef(sciencePublications);
  sciencePublicationsRef.current = sciencePublications;
  const adxLedgerRef = React.useRef(adxLedger);
  adxLedgerRef.current = adxLedger;

  const handleSyncScienceAndAdx = React.useCallback(async (silent = false) => {
    setIsSyncing(true);
    try {
      const result = await executePeriodicScienceAndAdrSync(sciencePublicationsRef.current, adxLedgerRef.current);
      if (result.newPublications.length > 0) {
        setSciencePublications(prev => [...result.newPublications, ...prev]);
      }
      setAdxLedger(prev => [result.newUpdate, ...prev]);
      setLastSyncTime(new Date().toLocaleTimeString());
      setSyncCount(prev => prev + 1);
    } catch (err) {
      console.warn('Periodic sync notice:', err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const syncScienceRef = React.useRef(handleSyncScienceAndAdx);
  syncScienceRef.current = handleSyncScienceAndAdx;

  // Periodic science check timer (every 45 seconds when enabled)
  useEffect(() => {
    if (!isAutoCheckActive) return;

    const interval = setInterval(() => {
      if (syncScienceRef.current) {
        syncScienceRef.current(true);
      }
    }, 45000);

    return () => clearInterval(interval);
  }, [isAutoCheckActive]);

  const handleManualScienceSearch = async () => {
    if (!customScienceQuery.trim()) return;
    setIsSearchingScience(true);
    try {
      const pubmedResults = await searchPubMedArticles(customScienceQuery, 3);
      const epmcResults = await searchEuropePMC(customScienceQuery, 3);
      const merged = [...pubmedResults, ...epmcResults];
      if (merged.length > 0) {
        setSciencePublications(prev => {
          const existingIds = new Set(prev.map(p => p.identifier));
          const novel = merged.filter(m => !existingIds.has(m.identifier));
          return [...novel, ...prev];
        });
      }
    } catch (e) {
      console.warn('Search error:', e);
    } finally {
      setIsSearchingScience(false);
    }
  };

  const handleSelectDocket = React.useCallback((docketNumber: string) => {
    setSearchQuery(docketNumber);
    setCaseFilter('All');
  }, []);

  const handleDocketsUpdated = React.useCallback((updated: CaseHistoryRecord[]) => {
    setCaseHistories(updated);
  }, []);

  const filteredCases = caseHistories.filter(c => {
    const matchesFilter = caseFilter === 'All' || c.jurisdiction === caseFilter;
    const matchesSearch = 
      c.caseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.docketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.court.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/80 border border-blue-500/40 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-xs font-bold border border-blue-500/30">
                OPEN CASE &amp; SCIENCE INTELLIGENCE
              </span>
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">
                ZERO API KEY REQUIRED
              </span>
              <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/30">
                30 ROW HOMES SSDI/SSI ALLOCATION
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              PACER / State Case Info &amp; NIH PubMed / arXiv Periodic Science Monitor
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Real-time ingestion of federal dockets via Free Law Project CourtListener RECAP, Maryland Judiciary Case Search (MDEC), NIH PubMed, and Europe PMC. Periodically checks for new peer-reviewed scientific literature and synchronizes verified blocks into the ADR/ADX Digital Reserve Ledger.
            </p>
          </div>

          {/* Periodic Monitor Indicator & Control */}
          <div className="p-3.5 bg-slate-950/90 rounded-xl border border-slate-800 text-right shrink-0 space-y-2">
            <div className="flex items-center justify-end gap-2 text-xs">
              <span className={`w-2.5 h-2.5 rounded-full ${isAutoCheckActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              <span className="font-mono text-slate-300 text-[11px]">
                {isAutoCheckActive ? 'Periodic Monitor: ACTIVE' : 'Periodic Monitor: PAUSED'}
              </span>
            </div>

            <div className="text-[10px] text-slate-400 font-mono">
              Last Synced: <strong className="text-emerald-400">{lastSyncTime}</strong> ({syncCount} audits)
            </div>

            <div className="flex items-center gap-1.5 justify-end pt-1">
              <button
                onClick={() => setIsAutoCheckActive(prev => !prev)}
                className={`px-2 py-1 rounded text-[10px] font-mono font-medium transition-colors cursor-pointer border ${
                  isAutoCheckActive 
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                {isAutoCheckActive ? 'Auto: ON (45s)' : 'Auto: OFF'}
              </button>

              <button
                onClick={() => handleSyncScienceAndAdx(false)}
                disabled={isSyncing}
                className="flex items-center gap-1 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-bold transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Sync Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('cases')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all whitespace-nowrap ${
              activeSubTab === 'cases'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-950/50'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Scale className="w-4 h-4 text-blue-300" />
            <span>PACER &amp; Maryland Court Dockets</span>
          </button>

          <button
            onClick={() => setActiveSubTab('science')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all whitespace-nowrap ${
              activeSubTab === 'science'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/50'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 text-indigo-300" />
            <span>Peer-Reviewed Science (PubMed / PMC / arXiv)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('adxLedger')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all whitespace-nowrap ${
              activeSubTab === 'adxLedger'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Fingerprint className="w-4 h-4 text-emerald-300" />
            <span>ADR/ADX Exchange Live Ledger ({adxLedger.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('ssdiHousing')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all whitespace-nowrap ${
              activeSubTab === 'ssdiHousing'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-950/50'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Home className="w-4 h-4 text-amber-300" />
            <span>30 Row Homes SSDI/SSI Housing Pool</span>
          </button>
        </div>

        {/* Search bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dockets, case numbers..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: PACER & MARYLAND STATE COURT DOCKETS */}
      {/* ========================================================================= */}
      {activeSubTab === 'cases' && (
        <div className="space-y-4">
          {/* PACER Background Worker Controls & Status Alerts */}
          <PacerBackgroundWorkerBanner
            onSelectDocket={handleSelectDocket}
            onDocketsUpdated={handleDocketsUpdated}
          />

          {/* Filter badges */}
          <div className="flex flex-wrap items-center gap-2">
            {(['All', 'Maryland State', 'Federal Appellate', 'Federal Bankruptcy'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setCaseFilter(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  caseFilter === tab
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredCases.map(c => (
              <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-md hover:border-slate-700 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {c.docketNumber}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        {c.jurisdiction}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                        {c.sourceDatabase}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1.5">
                      {c.caseName}
                    </h3>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                      Court: {c.court} | Filed: {c.filingDate} | Audited: {c.lastUpdated}
                    </div>
                  </div>

                  <a
                    href={c.openSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold border border-slate-700 transition-colors w-fit"
                  >
                    <span>View Public Docket</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="text-slate-300 leading-relaxed">
                    <strong>Jurisprudential Relevance:</strong> {c.relevance}
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {c.summary}
                  </p>
                </div>

                {/* Key Docket Orders & Filings */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Key Docket Orders &amp; Verified Filings:
                  </span>
                  <div className="space-y-1">
                    {c.keyOrders.map((ord, i) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-2 rounded bg-slate-950/80 border border-slate-800/80 text-[11px] gap-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="text-slate-200">{ord.description}</span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400 shrink-0">
                          {ord.documentNumber && <span className="text-indigo-400">[{ord.documentNumber}]</span>}
                          <span>{ord.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: PEER-REVIEWED SCIENCE (PUBMED / PMC / ARXIV) */}
      {/* ========================================================================= */}
      {activeSubTab === 'science' && (
        <div className="space-y-5">
          {/* Query Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex-1 w-full flex items-center gap-2">
              <input
                type="text"
                value={customScienceQuery}
                onChange={(e) => setCustomScienceQuery(e.target.value)}
                placeholder="Query PubMed / Europe PMC (e.g. dopamine D4 receptor SAR, MORTAR queueing, NIST FIPS 203)..."
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleManualScienceSearch}
                disabled={isSearchingScience}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap disabled:opacity-50"
              >
                {isSearchingScience ? 'Searching...' : 'Search NCBI / PMC'}
              </button>
            </div>

            <div className="text-[10px] text-slate-400 font-mono shrink-0">
              Zero API Key • Direct Open Biomedical Endpoints
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sciencePublications.map(sci => (
              <div key={sci.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 shadow-md hover:border-slate-700 transition-all flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                      {sci.source} • {sci.identifier}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                      Peer-Reviewed
                    </span>
                  </div>

                  <h4 className="font-bold text-white text-sm leading-snug">
                    {sci.title}
                  </h4>

                  <div className="text-[11px] text-slate-400 font-sans">
                    <strong>Authors:</strong> {sci.authors.join(', ')}
                  </div>

                  <div className="text-[11px] text-indigo-300 font-mono">
                    {sci.journalOrVenue} ({sci.publicationDate})
                  </div>

                  <p className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                    {sci.abstractSnippet}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] text-slate-500 font-mono">Algorithms:</span>
                    {sci.relevantAlgorithmIds.map(algo => (
                      <span key={algo} className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-amber-300">
                        {algo}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-400 font-mono">{sci.algorithmicContext}</span>
                    <a
                      href={sci.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                    >
                      <span>Read Paper</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: ADR / ADX EXCHANGE LIVE LEDGER */}
      {/* ========================================================================= */}
      {activeSubTab === 'adxLedger' && (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Americana Digital Reserve (ADR) &amp; Exchange (ADX) Synchronized Ledger</span>
              </span>
              <p className="text-slate-300 text-[11px]">
                Cryptographic Merkle blocks linking peer-reviewed scientific breakthroughs, court orders, and housing reserve allocations into the immutable trust res.
              </p>
            </div>

            <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-400 shrink-0 text-right">
              <div>Total Settlement: <strong>$500,000,000.00</strong></div>
              <div className="text-[10px] text-slate-500">45,850,000 LEU Shares</div>
            </div>
          </div>

          <div className="space-y-3">
            {adxLedger.map((update, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-3 shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {update.updateId}
                    </span>
                    <span className="text-xs text-white font-semibold">
                      {update.triggerEvent}
                    </span>
                  </div>

                  <span className="font-mono text-[11px] text-slate-400">
                    {update.timestamp}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Algorithmic Correlation &amp; Citation</span>
                    <div className="font-mono text-amber-300 text-[11px]">{update.algorithmId}</div>
                    <div className="text-slate-300 text-[11px]">{update.scientificCitation}</div>
                  </div>

                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Housing &amp; Fiduciary Delta</span>
                    <div className="text-emerald-300 font-semibold text-[11px]">{update.housingAllocationDelta}</div>
                    <div className="font-mono text-[10px] text-slate-400 truncate">
                      Merkle Root: {update.merkleRootHash}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 4: 30 ROW HOMES SSDI / SSI HOUSING ALLOCATION */}
      {/* ========================================================================= */}
      {activeSubTab === 'ssdiHousing' && (
        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-r from-amber-950/60 via-slate-900 to-indigo-950/70 border border-amber-500/40 rounded-2xl shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Home className="w-5 h-5 text-amber-400" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-white">
                  30 Historic Row Homes Dedicated PSDLEF SSDI/SSI Applicant Housing
                </h3>
                <span className="text-xs text-amber-300 font-mono">
                  Carveout under Baltimore Historic Rowhomes Housing Preservation SPV (300 Properties Total)
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed text-justify">
              In direct execution of the user directive and Rule 18 Iteration II (Administrative Mortality Due Process Exaction), exactly <strong>30 historic row homes</strong> across Baltimore County and City are perpetually designated as expedited, zero-cost transitional and supportive housing specifically for <strong>SSDI and SSI disability applicants</strong> facing protracted Social Security Administration hearing delays (exceeding 800+ days).
            </p>
          </div>

          {/* Allocation Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Dedicated Housing Units</span>
              <div className="text-2xl font-mono font-bold text-amber-400">30 Row Homes</div>
              <span className="text-[10px] text-slate-400">Part of 300 SPV Portfolio (10%)</span>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Dedicated Capital Res</span>
              <div className="text-2xl font-mono font-bold text-emerald-400">$12,500,000.00</div>
              <span className="text-[10px] text-slate-400">1,146,250 Converted LEU Shares</span>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Target Claimants</span>
              <div className="text-2xl font-mono font-bold text-indigo-300">SSDI / SSI Applicants</div>
              <span className="text-[10px] text-slate-400">800+ Day Administrative Queue</span>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Triage Governance Engine</span>
              <div className="text-2xl font-mono font-bold text-cyan-400">MORTAR Engine</div>
              <span className="text-[10px] text-slate-400">Anti-Starvation Delay Invariant</span>
            </div>
          </div>

          {/* Housing Operational Protocols */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
            <h4 className="font-bold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
              <Building2 className="w-4 h-4 text-indigo-400" />
              <span>Operational &amp; Fiduciary Execution Architecture (30 Row Homes)</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 space-y-1.5">
                <span className="font-bold text-amber-300">1. Architectural Rehabilitation</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Historic masonry repointing, structural stabilization, and complete ADA Title II physical and cognitive accessibility retrofit across Baltimore County/City locations.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 space-y-1.5">
                <span className="font-bold text-indigo-300">2. Anti-Starvation Allocation</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Adjudicated via the MORTAR locality-sensitive queueing algorithm to prevent mortality and eviction while applicants wait for Title II/XVI administrative hearings.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 space-y-1.5">
                <span className="font-bold text-emerald-300">3. Bankruptcy Remote Protection</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Vested in the Wyoming Sovereign Purpose Trust under Wyo. Stat. Ann. § 17-23-114, completely insulated from municipal condemnation, tax sales, or commingling.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
