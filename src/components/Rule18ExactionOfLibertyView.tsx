import React, { useState } from 'react';
import { 
  Scale, 
  ShieldAlert, 
  FileText, 
  CheckCircle2, 
  Layers, 
  AlertTriangle, 
  ChevronRight,
  BookOpen,
  Gavel,
  Shield,
  ArrowRight
} from 'lucide-react';
import { RULE_18_EXACTION_ITERATIONS, UNIFIED_DOCUMENT_METADATA } from '../data/unifiedDocumentData';

export const Rule18ExactionOfLibertyView: React.FC = () => {
  const [selectedIteration, setSelectedIteration] = useState<number>(1);

  const currentIteration = RULE_18_EXACTION_ITERATIONS.find(it => it.iterationNumber === selectedIteration) || RULE_18_EXACTION_ITERATIONS[0];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-red-950/60 via-slate-900 to-indigo-950/70 border border-red-500/40 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-red-500/20 text-red-300 font-mono text-xs font-bold border border-red-500/30">
                RULE 18 CONSOLIDATION
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Consolidated Exaction of Liberty Arguments (Every Iteration)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
              Pursuant to Federal Rule of Civil Procedure 18(a) and Maryland Rule 2-303(b), all independent and alternative claims for relief, constitutional injuries, administrative deprivations, and illegal exactions of liberty are joined into a single coherent pleading for the <strong>Circuit Court for Baltimore County</strong> and <strong>Federal Appellate Forums</strong>.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-right shrink-0">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Pleading Standard</div>
            <div className="font-mono text-red-400 font-bold text-sm">FRCP 18(a) & Md. Rule 2-303</div>
            <div className="text-[10px] text-slate-500">4 Iterations Consolidated</div>
          </div>
        </div>
      </div>

      {/* Iteration Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {RULE_18_EXACTION_ITERATIONS.map((it) => {
          const isSelected = it.iterationNumber === selectedIteration;
          return (
            <div
              key={it.iterationNumber}
              onClick={() => setSelectedIteration(it.iterationNumber)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-red-950/40 border-red-500/80 shadow-lg ring-1 ring-red-500/50'
                  : 'bg-slate-900 border-slate-800 hover:bg-slate-800/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`w-6 h-6 rounded-md font-mono text-xs font-bold flex items-center justify-center ${
                    isSelected ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {it.iterationNumber}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Iteration {it.iterationNumber}
                  </span>
                </div>
                <div className="font-bold text-xs sm:text-sm text-white line-clamp-2">
                  {it.title.replace(/^Iteration [I|V|X]+: /, '')}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400 font-mono truncate">
                {it.legalAnchor}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Iteration In-Depth Doctrinal Sheet */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center text-white font-black font-serif text-lg">
              §
            </div>
            <div>
              <h3 className="font-bold text-white text-base sm:text-lg">
                {currentIteration.title}
              </h3>
              <div className="text-xs text-indigo-400 font-mono">
                {currentIteration.legalAnchor}
              </div>
            </div>
          </div>

          <div className="px-3 py-1.5 bg-slate-950 rounded-lg border border-slate-800 text-right">
            <span className="text-[10px] uppercase text-slate-500 block">Constitutional Basis</span>
            <span className="font-medium text-amber-300 text-xs">{currentIteration.constitutionalBasis}</span>
          </div>
        </div>

        {/* Factual Deprivation & Harm Narrative */}
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Factual Predicate & Nature of Liberty Exaction:
          </div>
          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-slate-200 text-xs sm:text-sm leading-relaxed text-justify">
            {currentIteration.factualDeprivation}
          </div>
        </div>

        {/* Controlling Doctrinal Thresholds & Case Law */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Gavel className="w-3.5 h-3.5 text-indigo-400" />
            <span>Controlling Doctrinal Thresholds & Case Law Precedents:</span>
          </div>

          <div className="space-y-2">
            {currentIteration.doctrinalThresholds.map((threshold, idx) => (
              <div key={idx} className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
                <ChevronRight className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{threshold}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Remedy Demanded */}
        <div className="p-4 bg-red-950/20 border-l-4 border-red-500 rounded-r-lg space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" />
            <span>Remedy Demanded under Rule 18 Joinder:</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {currentIteration.remedyDemanded}
          </p>
        </div>

        {/* Theoretical Framework Note */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-400">
          <div className="font-bold text-slate-300 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Harmonized Jurisprudential Principle: The Four Faces of One Defect</span>
          </div>
          <p className="leading-relaxed text-justify">
            As articulated in <em>Rights, Genomes, and Algorithms</em> (2026 Integrated Master Portfolio Edition), institutional failure in personal data processing manifests simultaneously as:
            (1) a civil rights injury in the courthouse, (2) an evidentiary failure in the administrative hearing, (3) an algorithmic starvation defect in the queue, and (4) an unlawful exaction of property in the financial clearinghouse. 
            Under Federal Rule 18(a) and Maryland Rule 2-303, these are not disjoint lawsuits; they represent the exact same transactional nucleus of facts and must be adjudicated together.
          </p>
        </div>
      </div>
    </div>
  );
};
