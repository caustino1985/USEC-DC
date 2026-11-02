import React from 'react';
import { 
  FileCheck, 
  ChevronRight, 
  Scale, 
  Building, 
  Landmark, 
  Mail, 
  ExternalLink,
  ShieldAlert,
  Hash,
  Database
} from 'lucide-react';
import { UNIFIED_DOCUMENT_PARTS, COURT_ROUTING_TABLE, COUNTERPARTIES_TABLE, UNIFIED_DOCUMENT_METADATA } from '../data/unifiedDocumentData';

interface Props {
  activePartId: string;
  onSelectPart: (partId: string) => void;
  searchFilter: string;
}

export const NavigationSidebar: React.FC<Props> = ({
  activePartId,
  onSelectPart,
  searchFilter
}) => {
  const [showCourtsList, setShowCourtsList] = React.useState(false);
  const [showCounterparties, setShowCounterparties] = React.useState(false);

  const filteredParts = UNIFIED_DOCUMENT_PARTS.filter(part => {
    if (!searchFilter) return true;
    const query = searchFilter.toLowerCase();
    return (
      part.title.toLowerCase().includes(query) ||
      part.roman.toLowerCase().includes(query) ||
      part.subsections.some(sub => sub.toLowerCase().includes(query))
    );
  });

  return (
    <aside className="w-full md:w-80 lg:w-96 bg-slate-900/90 border-r border-slate-800 shrink-0 p-4 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-120px)] sticky top-28 no-print custom-scrollbar">
      {/* Table of contents header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-indigo-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Unified Master Table of Contents
          </h2>
        </div>
        <span className="text-[11px] font-mono text-indigo-400 px-1.5 py-0.5 rounded bg-indigo-500/10">
          12 Parts
        </span>
      </div>

      {/* Part list */}
      <div className="flex flex-col gap-1.5">
        {filteredParts.length === 0 ? (
          <div className="text-xs text-slate-500 italic p-3 text-center">
            No sections match "{searchFilter}"
          </div>
        ) : (
          filteredParts.map((part) => {
            const isActive = activePartId === part.id;
            return (
              <div key={part.id} className="flex flex-col">
                <button
                  onClick={() => onSelectPart(part.id)}
                  className={`text-left p-2.5 rounded-lg text-xs transition-all flex items-start gap-2.5 cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-200 border border-indigo-500/50 shadow-sm font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <span className="font-serif font-bold text-amber-400/90 shrink-0 min-w-[28px] pt-0.5">
                    Part {part.roman}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-medium">{part.title}</div>
                    <div className="text-[10px] text-slate-500 truncate mt-0.5">
                      {part.subsections[0]}
                    </div>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 mt-0.5 text-slate-500 shrink-0 transition-transform ${isActive ? 'rotate-90 text-indigo-400' : ''}`} />
                </button>

                {/* Subsections when active */}
                {isActive && (
                  <div className="ml-8 my-1 pl-2.5 border-l border-indigo-500/30 flex flex-col gap-1 py-1">
                    {part.subsections.map((sub, idx) => (
                      <div
                        key={idx}
                        className="text-[11px] text-slate-400 hover:text-indigo-300 py-0.5 transition-colors cursor-pointer"
                        onClick={() => onSelectPart(part.id)}
                      >
                        {sub}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Accordion 1: Court Intake Routing List */}
      <div className="border border-slate-800 rounded-lg p-3 bg-slate-950/50 mt-2">
        <button
          onClick={() => setShowCourtsList(!showCourtsList)}
          className="w-full flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Landmark className="w-3.5 h-3.5 text-blue-400" />
            <span>Court Electronic Intake Endpoints</span>
          </div>
          <span className="text-[10px] text-slate-500">{showCourtsList ? 'Hide' : 'Show'}</span>
        </button>

        {showCourtsList && (
          <div className="mt-2.5 pt-2 border-t border-slate-800 flex flex-col gap-2">
            {COURT_ROUTING_TABLE.map((court, i) => (
              <div key={i} className="text-[11px] bg-slate-900/60 p-2 rounded border border-slate-800/80">
                <div className="font-semibold text-slate-200">{court.courtName}</div>
                <div className="text-indigo-400 font-mono text-[10px] break-all mt-0.5">{court.email}</div>
                <div className="text-slate-500 text-[10px] mt-0.5">{court.jurisdiction}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Accordion 2: Counterparties and Depository Desks */}
      <div className="border border-slate-800 rounded-lg p-3 bg-slate-950/50">
        <button
          onClick={() => setShowCounterparties(!showCounterparties)}
          className="w-full flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Building className="w-3.5 h-3.5 text-amber-400" />
            <span>BNY Mellon & Counterparties</span>
          </div>
          <span className="text-[10px] text-slate-500">{showCounterparties ? 'Hide' : 'Show'}</span>
        </button>

        {showCounterparties && (
          <div className="mt-2.5 pt-2 border-t border-slate-800 flex flex-col gap-2">
            {COUNTERPARTIES_TABLE.map((item, i) => (
              <div key={i} className="text-[11px] bg-slate-900/60 p-2 rounded border border-slate-800/80">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400/90">{item.role}</div>
                <div className="font-semibold text-slate-200">{item.name}</div>
                <div className="text-slate-400 text-[10px]">{item.address}</div>
                <div className="text-indigo-400 font-mono text-[10px] break-all">{item.email}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Spousal Co-Trustee Standing Badge (Baltimore County) */}
      <div className="border border-indigo-500/30 rounded-lg p-3 bg-indigo-950/30 text-[11px] space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-amber-300">
          <Scale className="w-3.5 h-3.5" />
          <span>Baltimore County Marriage Record</span>
        </div>
        <div className="text-slate-300">
          License: <span className="font-mono text-white font-semibold">0309504160039411</span>
        </div>
        <div className="text-slate-400 text-[10px]">
          Issued by Circuit Court for Baltimore County (Towson, MD). Conclusive proof of spousal co-trustee authority for C.L. McLaughlin &amp; J.J. Fernandez.
        </div>
      </div>

      {/* On-chain endpoint badge */}
      <div className="p-3 bg-slate-950 border border-slate-800/90 rounded-lg text-[11px]">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="flex items-center gap-1.5 font-medium text-slate-300">
            <Database className="w-3 h-3 text-emerald-400" />
            <span>Digital Reserve Vault</span>
          </span>
          <span className="font-mono text-[10px] text-emerald-400">ACTIVE</span>
        </div>
        <div className="font-mono text-[10px] text-slate-400 break-all bg-slate-900 p-1.5 rounded border border-slate-800">
          {UNIFIED_DOCUMENT_METADATA.onChainBitcoinReserveAddress}
        </div>
        <div className="text-[10px] text-slate-500 mt-1">
          M&T DTC ABA: <span className="font-mono text-slate-400">{UNIFIED_DOCUMENT_METADATA.abaRouting}</span> | SWIFT: <span className="font-mono text-slate-400">{UNIFIED_DOCUMENT_METADATA.swiftCode}</span>
        </div>
      </div>
    </aside>
  );
};
