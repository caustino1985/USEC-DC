import React from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  Scale, 
  Building2, 
  FileCheck, 
  Layers, 
  ShieldCheck, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { UNIFIED_DOCUMENT_METADATA } from '../data/unifiedDocumentData';

export const HarmonizationSummaryView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Harmonization Synthesis & Dataset Reconciliation
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Technical report on merging BNY Mellon custodial instructions and D.C. Circuit Court filings into a single unified instrument.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800/90 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Directive 1</span>
            <div className="font-bold text-slate-200 text-sm">Dual-Forum Merge</div>
            <p className="text-xs text-slate-400">
              Unified BNY Mellon Corporate Trust depository directives with D.C. Circuit Court mandamus pleadings.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-lg border border-emerald-500/40 space-y-1">
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Directive 2</span>
            <div className="font-bold text-slate-200 text-sm">Capitalization Uniformity</div>
            <p className="text-xs text-slate-400">
              Harmonized to strictly $500,000,000.00 Senior Notes principal and 45,850,000 LEU shares across all filings.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-lg border border-indigo-500/40 space-y-1">
            <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Directive 3</span>
            <div className="font-bold text-slate-200 text-sm">Format Consistency</div>
            <p className="text-xs text-slate-400">
              Harmonized font hierarchy, pleading lines, CUSIP tables, math equations, and execution signature cards.
            </p>
          </div>
        </div>
      </div>

      {/* Dataset Comparison Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
          <Scale className="w-5 h-5 text-indigo-400" />
          <span>Cross-Dataset Harmonization Matrix</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border border-slate-700">
            <thead>
              <tr className="bg-slate-800 text-slate-200">
                <th className="p-3 font-bold">Element</th>
                <th className="p-3 font-bold text-red-300">Dataset A (D.C. Courts Filing)</th>
                <th className="p-3 font-bold text-amber-300">Dataset B (Baltimore / BNY Mellon)</th>
                <th className="p-3 font-bold text-emerald-300">Unified Merged Master Document</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr className="hover:bg-slate-800/40">
                <td className="p-3 font-semibold text-white">Total Capitalization</td>
                <td className="p-3 font-mono text-slate-300">$500,000,000.00</td>
                <td className="p-3 font-mono text-red-300">$500,000,000.00</td>
                <td className="p-3 font-mono text-emerald-400 font-bold bg-emerald-950/20">
                  $500,000,000.00 (Harmonized)
                </td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="p-3 font-semibold text-white">1999 Indenture Tranches</td>
                <td className="p-3 text-slate-300">Series A ($350M) + Series B ($150M)</td>
                <td className="p-3 text-slate-300">Series A ($350M) + Series B ($150M)</td>
                <td className="p-3 text-emerald-400 font-semibold bg-emerald-950/20">
                  Series A ($350M) + Series B ($150M) = $500M
                </td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="p-3 font-semibold text-white">Reorganized Equity</td>
                <td className="p-3 font-mono">45,850,000 LEU common shares</td>
                <td className="p-3 font-mono">45,850,000 LEU common shares</td>
                <td className="p-3 font-mono text-emerald-400 font-bold bg-emerald-950/20">
                  45,850,000 LEU shares (Exact match)
                </td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="p-3 font-semibold text-white">Primary Depository</td>
                <td className="p-3">The Bank of New York Mellon</td>
                <td className="p-3">The Bank of New York Mellon</td>
                <td className="p-3 text-emerald-300 bg-emerald-950/20">
                  BNY Mellon Corporate Trust & DTC Participant
                </td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="p-3 font-semibold text-white">Court Venues Addressed</td>
                <td className="p-3">D.C. District Court, SCOTUS, Fed. Cir.</td>
                <td className="p-3">Circuit Court for Baltimore City</td>
                <td className="p-3 text-emerald-300 bg-emerald-950/20">
                  D.C. Circuit Court, D.D.C., SCOTUS & Baltimore City
                </td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="p-3 font-semibold text-white">SEC Form 13F CUSIP Match</td>
                <td className="p-3 text-slate-400">Referenced in Exhibits</td>
                <td className="p-3 text-slate-300">PNC Q3 2002 13F Table Included</td>
                <td className="p-3 text-emerald-300 bg-emerald-950/20">
                  Exhaustive Form 13F Table embedded in Part V
                </td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="p-3 font-semibold text-white">DYREO Sweep Vectors</td>
                <td className="p-3">60/25/10/5 PSDLEF Matrix</td>
                <td className="p-3">Merton HJB continuous formulation</td>
                <td className="p-3 text-emerald-300 bg-emerald-950/20">
                  Fully integrated continuous math + daily sweep
                </td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="p-3 font-semibold text-white">Cryptographic Standards</td>
                <td className="p-3 text-slate-400">Basic digital protocols</td>
                <td className="p-3 text-slate-300">NIST ML-KEM-1024 & ML-DSA-65/87</td>
                <td className="p-3 text-emerald-300 bg-emerald-950/20">
                  NIST FIPS 203 / 204 post-quantum architecture
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Sign-off Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
          <CheckCircle2 className="w-5 h-5" />
          <span>Fiduciary Verification & Harmonization Certification</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-justify">
          The undersigned confirms that this unified master document has resolved all cross-dataset discrepancies. The $500,000,000.00 senior indebtedness aligns with the 45,850,000 common shares of Centrus Energy Corp. (NYSE: LEU) at the 0.0917 ratio. All filing channels, BNY Mellon custodial instructions, M&T Bank co-custody parameters, and post-quantum cryptographic access keys are synchronized into one court-ready pleading.
        </p>
        <div className="pt-2 font-mono text-xs text-indigo-400">
          Certified under 28 U.S.C. § 1746 — Ready for ECF / DTC Submission.
        </div>
      </div>
    </div>
  );
};
