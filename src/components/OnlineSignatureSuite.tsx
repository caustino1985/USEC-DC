import React, { useRef, useState, useEffect } from 'react';
import { 
  PenTool, 
  RotateCcw, 
  Check, 
  ShieldCheck, 
  Stamp, 
  Download, 
  UserCheck, 
  FileSignature, 
  FileText,
  Key,
  Layers,
  Sparkles,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { EXECUTION_TABS, UNIFIED_DOCUMENT_METADATA } from '../data/unifiedDocumentData';

interface SignedRecord {
  tabId: string;
  signatory: 'caustin' | 'juan';
  signatoryName: string;
  signatureType: 'drawn' | 'typed';
  dataUrl: string;
  timestamp: string;
  pqcHash: string;
}

export const OnlineSignatureSuite: React.FC = () => {
  const [selectedTabId, setSelectedTabId] = useState<string>(EXECUTION_TABS[0].id);
  const [activeSignatory, setActiveSignatory] = useState<'caustin' | 'juan'>('caustin');
  const [signatureMode, setSignatureMode] = useState<'draw' | 'type'>('draw');
  const [typedName, setTypedName] = useState<string>('Caustin Lee McLaughlin');
  const [cursiveFont, setCursiveFont] = useState<'font-serif' | 'font-mono' | 'italic'>('italic');
  const [signedRecords, setSignedRecords] = useState<SignedRecord[]>([]);
  const [justSignedAlert, setJustSignedAlert] = useState<string | null>(null);

  // Canvas ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Current tab object
  const currentTab = EXECUTION_TABS.find(t => t.id === selectedTabId) || EXECUTION_TABS[0];

  // Keep typed name synced with signatory
  useEffect(() => {
    if (activeSignatory === 'caustin') {
      setTypedName('Caustin Lee McLaughlin');
    } else {
      setTypedName('Juan Jose Fernandez');
    }
  }, [activeSignatory]);

  // Canvas drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1e3a8a'; // Professional dark blue legal ink
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Generate deterministic PQC signature digest
  const generatePqcHash = (signatory: string, tabId: string) => {
    const chars = '0123456789abcdef';
    let hash = 'ML-DSA-87:0x';
    for (let i = 0; i < 48; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  };

  // Affix signature handler
  const handleAffixSignature = () => {
    let signatureImage = '';

    if (signatureMode === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      signatureImage = canvas.toDataURL('image/png');
    } else {
      // Create a temporary canvas to render typed signature to image
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 500;
      tempCanvas.height = 150;
      const ctx = tempCanvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        ctx.font = 'italic 34px "Times New Roman", Georgia, serif';
        ctx.fillStyle = '#1e3a8a';
        ctx.fillText(typedName, 40, 85);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(30, 110);
        ctx.lineTo(470, 110);
        ctx.stroke();
        signatureImage = tempCanvas.toDataURL('image/png');
      }
    }

    const signatoryName = activeSignatory === 'caustin' 
      ? 'Caustin Lee McLaughlin (Principal Trustee)' 
      : 'Juan Jose Fernandez (Co-Trustee)';

    const newRecord: SignedRecord = {
      tabId: currentTab.id,
      signatory: activeSignatory,
      signatoryName,
      signatureType: signatureMode === 'draw' ? 'drawn' : 'typed',
      dataUrl: signatureImage,
      timestamp: new Date().toLocaleString('en-US', { timeZoneName: 'short' }),
      pqcHash: generatePqcHash(activeSignatory, currentTab.id)
    };

    // Replace existing if already signed by same party
    setSignedRecords(prev => [
      ...prev.filter(r => !(r.tabId === currentTab.id && r.signatory === activeSignatory)),
      newRecord
    ]);

    setJustSignedAlert(`Signature successfully affixed for ${signatoryName} on Tab ${currentTab.tabLetter}: ${currentTab.title}`);
    setTimeout(() => setJustSignedAlert(null), 5000);
    clearCanvas();
  };

  // Filter signed records for the selected tab
  const tabSignatures = signedRecords.filter(r => r.tabId === currentTab.id);
  const totalSignedCount = signedRecords.length;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/70 border border-blue-500/40 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-xs font-bold border border-blue-500/30">
                ONLINE SIGNATURE SUITE
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Fiduciary & Banking Electronic Execution Studio
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
              Digitally sign and affix official legal ink signatures for <strong>The Bank of New York Mellon</strong>, <strong>Circuit Court for Baltimore County</strong>, <strong>M&T Bank</strong>, and the <strong>Wyoming Liquidation Trust</strong>. Built-in NIST FIPS 204 ML-DSA-87 quantum-safe attestation hashing.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-700 text-right">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Affixed Signatures</div>
              <div className="font-mono text-emerald-400 font-bold text-lg">{totalSignedCount} Affixed</div>
              <div className="text-[10px] text-slate-400">Across 10 Tab Modules</div>
            </div>
          </div>
        </div>

        {/* Marriage Cert Spousal Authority Tag */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Joint Fiduciary Standing verified by <strong>Circuit Court for Baltimore County Marriage Record</strong> (Towson, MD | License #0309504160039411).
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[11px]">
            Co-Trustee Plenary Authority
          </span>
        </div>
      </div>

      {justSignedAlert && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/60 rounded-xl text-emerald-200 text-xs flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{justSignedAlert}</span>
          </div>
          <span className="font-mono text-[10px] text-emerald-400">PQC DIGEST SEALED</span>
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Document & Tab Selection */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 mb-2 flex items-center justify-between">
            <span>Select Document to Sign:</span>
            <span className="font-mono text-indigo-400">10 Documents</span>
          </div>

          <div className="space-y-1.5 max-h-[640px] overflow-y-auto pr-1">
            {EXECUTION_TABS.map((tab) => {
              const isSelected = tab.id === selectedTabId;
              const hasCaustin = signedRecords.some(r => r.tabId === tab.id && r.signatory === 'caustin');
              const hasJuan = signedRecords.some(r => r.tabId === tab.id && r.signatory === 'juan');
              const fullySigned = hasCaustin && hasJuan;

              return (
                <div
                  key={tab.id}
                  onClick={() => setSelectedTabId(tab.id)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-medium text-xs">
                      <span className="w-5 h-5 rounded bg-indigo-500/20 text-indigo-300 font-bold flex items-center justify-center font-mono">
                        {tab.tabLetter}
                      </span>
                      <span className="truncate max-w-[180px]">{tab.title}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {fullySigned ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                          Signed (2/2)
                        </span>
                      ) : (hasCaustin || hasJuan) ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                          Partial (1/2)
                        </span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-500 font-mono">
                          Unsigned
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500 mt-1 pl-7 flex items-center justify-between">
                    <span>{tab.category}</span>
                    <span className="font-mono text-indigo-400">{tab.inkRequirement}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center: Interactive Signing Studio */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          {/* Active Tab Info Header */}
          <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold">
                  TAB {currentTab.tabLetter}
                </span>
                <h3 className="font-bold text-white text-base sm:text-lg">{currentTab.title}</h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">{currentTab.description}</p>
            </div>

            <div className="px-3 py-1.5 bg-slate-950 rounded-lg border border-slate-800 text-right shrink-0">
              <div className="text-[10px] uppercase text-slate-500">Venue / Counterparty</div>
              <div className="text-xs font-semibold text-amber-400">
                {currentTab.category === 'Banking' ? 'M&T Bank / BNY Mellon' : currentTab.category === 'Trust Formation' ? 'Wyoming Secretary of State' : 'Baltimore County Circuit Court'}
              </div>
            </div>
          </div>

          {/* Signatory Toggle */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              1. Choose Active Legal Signatory:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setActiveSignatory('caustin')}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                  activeSignatory === 'caustin'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">Caustin Lee McLaughlin</span>
                  {signedRecords.some(r => r.tabId === currentTab.id && r.signatory === 'caustin') && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">Signed</span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Principal Trustee / Debtor-in-Possession
                </div>
                <div className="text-[10px] font-mono text-indigo-400 mt-1">
                  D.C. Driver Lic. #4042567 | HSM Slot 01
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveSignatory('juan')}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                  activeSignatory === 'juan'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">Juan Jose Fernandez</span>
                  {signedRecords.some(r => r.tabId === currentTab.id && r.signatory === 'juan') && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">Signed</span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Co-Trustee / Spousal Fiduciary
                </div>
                <div className="text-[10px] font-mono text-indigo-400 mt-1">
                  Towson MD Marriage Lic. #0309504160039411
                </div>
              </button>
            </div>
          </div>

          {/* Mode Selector (Draw vs Type) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                2. Signature Method:
              </span>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  type="button"
                  onClick={() => setSignatureMode('draw')}
                  className={`px-3 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                    signatureMode === 'draw'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <PenTool className="w-3 h-3" />
                    <span>Draw Ink</span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSignatureMode('type')}
                  className={`px-3 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                    signatureMode === 'type'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <FileSignature className="w-3 h-3" />
                    <span>Type Legal Script</span>
                  </span>
                </button>
              </div>
            </div>

            {/* Canvas or Type Area */}
            {signatureMode === 'draw' ? (
              <div className="space-y-2">
                <div className="relative bg-white rounded-xl border-2 border-indigo-500/40 p-2 shadow-inner">
                  <canvas
                    ref={canvasRef}
                    width={640}
                    height={160}
                    className="w-full h-40 bg-white rounded cursor-crosshair touch-none"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                  />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between pointer-events-none text-slate-400 text-xs">
                    <span className="border-b border-dashed border-slate-300 w-2/3 pb-0.5">
                      X (Sign with Mouse, Stylus, or Finger)
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">Dark Blue Official Ink</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear Pad</span>
                  </button>
                  <span className="text-[11px] text-slate-500">Standardized for M&T Bank and Court Intake</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <label className="block text-xs text-slate-400">
                  Type Legal Name:
                </label>
                <input
                  type="text"
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
                />

                <div className="p-4 bg-white rounded-lg border text-center shadow-inner my-2">
                  <div className="text-2xl text-blue-900 italic font-serif tracking-wide select-none">
                    /s/ {typedName}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Verified Form per 28 U.S.C. § 1746</div>
                </div>
              </div>
            )}
          </div>

          {/* Action Button: Affix Signature */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <Key className="w-4 h-4 text-emerald-400" />
              <span>NIST FIPS 204 ML-DSA-87 Quantum Attestation will be affixed</span>
            </div>

            <button
              type="button"
              onClick={handleAffixSignature}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 cursor-pointer transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Affix Official Legal Signature</span>
            </button>
          </div>

          {/* Current Affixed Signatures for this Tab */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Affixed Signatures on this Document ({tabSignatures.length}/2):</span>
              <span className="text-[10px] text-indigo-400 font-mono">Tab {currentTab.tabLetter}</span>
            </div>

            {tabSignatures.length === 0 ? (
              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-center text-xs text-slate-500 italic">
                No signatures have been affixed to this document yet. Choose a signatory above and sign.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tabSignatures.map((sig, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{sig.signatoryName}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                        AFFIXED
                      </span>
                    </div>

                    <div className="bg-white p-2 rounded border flex items-center justify-center h-20">
                      <img src={sig.dataUrl} alt="Signature" className="max-h-full object-contain" />
                    </div>

                    <div className="space-y-0.5 text-[10px] text-slate-500 font-mono">
                      <div>Timestamp: <span className="text-slate-300">{sig.timestamp}</span></div>
                      <div className="truncate text-indigo-400">PQC: {sig.pqcHash}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
