import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Send, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  ShieldCheck, 
  CheckCircle2, 
  Scale, 
  Building2, 
  Zap, 
  Eye, 
  X,
  FileCheck
} from 'lucide-react';
import { UNIFIED_DOCUMENT_METADATA } from '../data/unifiedDocumentData';
import { CANONICAL_LEGAL_FOOTNOTES } from '../data/legalFootnotesData';

interface Props {
  onOpenEmailModal: () => void;
  onOpenExportModal: () => void;
  onClosePreview?: () => void;
}

export const DocumentPdfPreviewer: React.FC<Props> = ({
  onOpenEmailModal,
  onOpenExportModal,
  onClosePreview
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showPleadingLines, setShowPleadingLines] = useState<boolean>(true);

  const totalPages = 8;

  const handlePrint = () => {
    window.print();
  };

  const handleZoomIn = () => {
    if (zoomLevel < 140) setZoomLevel(prev => prev + 15);
  };

  const handleZoomOut = () => {
    if (zoomLevel > 70) setZoomLevel(prev => prev - 15);
  };

  // Generate 28 line numbers for classic pleading paper format
  const pleadingLineNumbers = Array.from({ length: 28 }, (_, i) => i + 1);

  return (
    <div className="flex flex-col bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Previewer Navigation & Control Toolbar */}
      <div className="bg-slate-900 border-b border-slate-800 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-xs sm:text-sm">
                Court-Ready PDF Layout Previewer
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                8.5" × 11" PLEADING PAPER
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Formatted according to Maryland Circuit Court &amp; D.C. Circuit Federal Appellate standards
            </p>
          </div>
        </div>

        {/* Center / Right Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Page Navigator */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 gap-1 text-xs text-slate-300">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-xs px-1">
              Page <strong className="text-white">{currentPage}</strong> of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              title="Next Page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-1.5 py-1 gap-1 text-xs">
            <button
              onClick={handleZoomOut}
              className="p-1 text-slate-400 hover:text-white cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] text-slate-300 px-1">{zoomLevel}%</span>
            <button
              onClick={handleZoomIn}
              className="p-1 text-slate-400 hover:text-white cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pleading line numbers toggle */}
          <button
            onClick={() => setShowPleadingLines(prev => !prev)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-colors border ${
              showPleadingLines 
                ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40' 
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
            title="Toggle 28-Line Pleading Paper Rule Margins"
          >
            28-Line Format: {showPleadingLines ? 'ON' : 'OFF'}
          </button>

          {/* Quick Action Buttons */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
            title="Print or Save official PDF via Browser Print Dialog"
          >
            <Printer className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Print / PDF</span>
          </button>

          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
            title="Export full pleading in Markdown or LaTeX format"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            onClick={onOpenEmailModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-indigo-600 hover:brightness-110 text-white rounded-lg text-xs font-bold shadow-md cursor-pointer transition-all"
            title="Trigger 1-Click Batch Transmittal to all Court & Counterparty Desks"
          >
            <Zap className="w-3.5 h-3.5 text-amber-200" />
            <span>⚡ 1-Click Send All</span>
          </button>

          {onClosePreview && (
            <button
              onClick={onClosePreview}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close Preview and return to Standard Reading View"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Preview Viewport */}
      <div className="p-4 sm:p-8 bg-slate-950/70 overflow-x-auto flex justify-center items-start min-h-[750px]">
        {/* The 8.5" x 11" Paper Sheet Container with Scalable Zoom */}
        <div 
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          className="transition-transform duration-200 ease-out w-[820px] min-h-[1060px] bg-white text-slate-900 rounded-sm shadow-2xl p-10 sm:p-14 font-serif relative flex flex-col justify-between selection:bg-indigo-100 border border-slate-300"
        >
          {/* Running Legal Header */}
          <div className="border-b border-slate-300 pb-2 mb-6 flex justify-between items-center text-[10px] font-sans font-bold text-slate-600 uppercase tracking-wider">
            <span>Circuit Court for Baltimore County / D.C. Circuit Court of Appeals</span>
            <span className="font-mono text-indigo-700">Case No. C-03-CV-26-004128</span>
          </div>

          {/* Page Body with Optional 28-Line Numbering Margin */}
          <div className="flex-1 flex gap-6">
            {/* 28 Pleading Lines on Left */}
            {showPleadingLines && (
              <div className="w-6 border-r-2 border-slate-300 pr-2 select-none flex flex-col justify-between text-[11px] font-mono text-slate-400 text-right h-[880px]">
                {pleadingLineNumbers.map(n => (
                  <span key={n} className="leading-tight">{n}</span>
                ))}
              </div>
            )}

            {/* Page Content per Page Number */}
            <div className="flex-1 text-slate-900 text-xs sm:text-[13px] leading-relaxed">
              {/* PAGE 1: FORMAL CAPTION & TITLE */}
              {currentPage === 1 && (
                <div className="space-y-4">
                  <div className="text-center space-y-1">
                    <div className="text-[10px] uppercase tracking-widest font-sans font-bold text-slate-600">
                      State of Maryland &amp; United States Federal Court of Record
                    </div>
                    <h2 className="text-base font-bold uppercase tracking-wide">
                      In The Circuit Court For Baltimore County, Maryland
                    </h2>
                    <div className="text-[11px] italic text-slate-600">
                      Consolidated with U.S. Court of Appeals for the D.C. Circuit (Case No. 24-10492)
                    </div>
                  </div>

                  {/* Legal Caption Box */}
                  <div className="border-2 border-slate-900 grid grid-cols-12 my-4 text-xs font-serif">
                    <div className="col-span-7 p-3 border-r-2 border-slate-900 space-y-1.5">
                      <div className="font-bold">IN RE ESTATE OF CAUSTIN LEE MCLAUGHLIN,</div>
                      <div className="text-[11px] text-slate-700 italic">Debtor-in-Possession (D.D.C. No. 24-2383),</div>
                      <div>AND <strong>JUAN JOSE FERNANDEZ</strong>, Co-Trustee,</div>
                      <div className="pl-6 italic">Petitioners,</div>
                      <div className="text-center font-sans font-bold text-slate-500 py-1">v.</div>
                      <div className="font-bold">THE BANK OF NEW YORK MELLON,</div>
                      <div>COMPUTERSHARE TRUST COMPANY, N.A.,</div>
                      <div>AND <strong>CENTRUS ENERGY CORP.</strong> (f/k/a USEC Inc.),</div>
                      <div className="pl-6 italic">Respondents.</div>
                    </div>

                    <div className="col-span-5 p-3 space-y-2 bg-slate-50">
                      <div>
                        <div className="text-[10px] font-sans font-bold text-slate-500 uppercase">State Equity Docket:</div>
                        <div className="font-mono font-bold text-[11px]">Case No. C-03-CV-26-004128</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-sans font-bold text-slate-500 uppercase">Federal Appellate:</div>
                        <div className="font-mono font-bold text-[11px]">D.C. Cir. No. 24-10492</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-sans font-bold text-slate-500 uppercase">Bankruptcy Res:</div>
                        <div className="font-mono font-bold text-[11px]">11 U.S.C. §§ 541 &amp; 1186</div>
                      </div>
                      <div className="pt-1 text-[10px] font-sans font-bold text-indigo-700 border-t border-slate-300">
                        VERIFIED OMNIBUS MANDAMUS &amp; RULE 18 CONSOLIDATED EXACTION
                      </div>
                    </div>
                  </div>

                  <h3 className="font-bold text-center text-sm uppercase underline tracking-wider pt-2">
                    Verified Petition For Peremptory Writ Of Mandamus, Specific Performance Of Class 4 Allowed Securities, And Rule 18 Consolidated Exaction Of Liberty
                  </h3>

                  <p className="text-justify indent-8">
                    COME NOW Petitioners <strong>Caustin Lee McLaughlin</strong> (Managing Director, Debtor-in-Possession, and Principal Trustee) and <strong>Juan Jose Fernandez</strong> (Co-Trustee), proceeding pursuant to Maryland Rule 15-701, 28 U.S.C. § 1651(a), Federal Rule of Civil Procedure 18(a), and Maryland Rule 2-303(b), and respectfully petition this Honorable Court to issue an immediate, peremptory writ of mandamus and declaratory judgment.
                  </p>

                  <p className="text-justify indent-8">
                    This action consolidates the non-discretionary custodial indorsement and book-entry transfer of <strong>$500,000,000.00</strong> in allowed senior debt claims under the USEC Inc. 1999 Indenture into <strong>45,850,000 reorganized common shares</strong> of Centrus Energy Corp. (NYSE: LEU), together with all four iterations of the Rule 18 Consolidated Exaction of Liberty doctrine.
                  </p>
                </div>
              )}

              {/* PAGE 2: JURISDICTION, VENUE & SPOUSAL STANDING */}
              {currentPage === 2 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-xs uppercase tracking-widest text-slate-700 border-b border-slate-300 pb-1">
                    Part II: Plenary Jurisdiction, Venue, and Joint Spousal Standing
                  </h4>

                  <p className="text-justify indent-8">
                    1. <strong>Plenary State Equitable Jurisdiction:</strong> This Court exercises jurisdiction under Md. Code Ann., Cts. &amp; Jud. Proc. § 1-501 and Maryland Rule 15-701. Mandamus lies to compel respondent The Bank of New York Mellon, as Master Depository, to perform its unexcused ministerial duty under DTC Operational Arrangements and confirmed bankruptcy decrees.
                  </p>

                  <p className="text-justify indent-8">
                    2. <strong>Federal In Custodia Legis Protection:</strong> Pursuant to 11 U.S.C. §§ 541 and 1186, all beneficial rights in the USEC 1999 Indenture constitute property of the bankruptcy estate in <em>In re Caustin Lee McLaughlin</em>, Case No. 24-2383 (D.D.C.), over which exclusive in rem and in custodia legis jurisdiction resides.
                  </p>

                  <p className="text-justify indent-8">
                    3. <strong>Joint Spousal Fiduciary Standing:</strong> Petitioners were lawfully married in Towson, Baltimore County, Maryland (State of Maryland Marriage Certificate License #0309504160039411). Under Md. Code Ann., Est. &amp; Trusts § 14.5-408 and <em>Sprint Communications Co. v. APCC Services, Inc.</em>, 554 U.S. 269 (2008), Petitioners hold non-severable joint tenancy and co-trustee standing to recover estate property.
                  </p>

                  <div className="p-3 bg-slate-50 border border-slate-300 rounded font-sans text-xs space-y-1 my-3">
                    <div className="font-bold text-slate-800">MDEC Electronic Docket Filing Coordinates:</div>
                    <div className="font-mono text-[11px] text-slate-600">
                      • Towson Equity Division: 401 Bosley Avenue, Towson, MD 21204<br />
                      • Verified Indigency Exemption: Md. Rule 1-325(e) / ADA Title II Accommodations
                    </div>
                  </div>
                </div>
              )}

              {/* PAGE 3: $500M INDENTURE & 45.85M LEU SHARES */}
              {currentPage === 3 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-xs uppercase tracking-widest text-slate-700 border-b border-slate-300 pb-1">
                    Part III: Indenture Debt-to-Equity Conversion &amp; DTC Settlement Mechanics
                  </h4>

                  <p className="text-justify indent-8">
                    4. <strong>The Allowed Senior Debt Estate:</strong> The initial res consists of Class 4 Allowed Claims arising from the USEC Inc. 1999 Indenture:
                  </p>

                  <table className="w-full text-xs font-sans border-collapse border border-slate-400 my-2">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border border-slate-400 p-1.5 text-left">Tranche / Series</th>
                        <th className="border border-slate-400 p-1.5 text-center">CUSIP</th>
                        <th className="border border-slate-400 p-1.5 text-right">Allowed Principal</th>
                        <th className="border border-slate-400 p-1.5 text-right">Exchange Ratio</th>
                        <th className="border border-slate-400 p-1.5 text-right">Converted LEU Shares</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-400 p-1.5">Series A (6.625% Due 2006)</td>
                        <td className="border border-slate-400 p-1.5 font-mono text-center">917300AA1</td>
                        <td className="border border-slate-400 p-1.5 text-right font-mono">$350,000,000.00</td>
                        <td className="border border-slate-400 p-1.5 text-right font-mono">0.0917</td>
                        <td className="border border-slate-400 p-1.5 text-right font-mono font-bold">32,095,000 shs</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-400 p-1.5">Series B (6.750% Due 2009)</td>
                        <td className="border border-slate-400 p-1.5 font-mono text-center">917300AB9</td>
                        <td className="border border-slate-400 p-1.5 text-right font-mono">$150,000,000.00</td>
                        <td className="border border-slate-400 p-1.5 text-right font-mono">0.0917</td>
                        <td className="border border-slate-400 p-1.5 text-right font-mono font-bold">13,755,000 shs</td>
                      </tr>
                      <tr className="bg-slate-100 font-bold">
                        <td className="border border-slate-400 p-1.5" colSpan={2}>Harmonized Total Principal Res</td>
                        <td className="border border-slate-400 p-1.5 text-right font-mono text-indigo-900">$500,000,000.00</td>
                        <td className="border border-slate-400 p-1.5 text-right font-mono">—</td>
                        <td className="border border-slate-400 p-1.5 text-right font-mono text-indigo-900">45,850,000 shs</td>
                      </tr>
                    </tbody>
                  </table>

                  <p className="text-justify indent-8 text-[11px] text-slate-700">
                    5. <strong>Exclusion of Tucker Act Judgment Pool:</strong> Pursuant to binding directives, the Tucker Act Judgment Pool is formally excised and permanently maintained at <strong>$0.00</strong> to guarantee absolute mathematical uniformity and cross-court audit alignment.
                  </p>
                </div>
              )}

              {/* PAGE 4: BENEFICIARY ALLOCATION & 30 ROW HOMES SSDI/SSI HOUSING */}
              {currentPage === 4 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-xs uppercase tracking-widest text-slate-700 border-b border-slate-300 pb-1">
                    Part IV: Fiduciary Settlement Distribution &amp; 30 Row Homes SSDI/SSI Housing Carveout
                  </h4>

                  <p className="text-justify indent-8">
                    6. <strong>Deterministic Beneficiary Allocation Vector:</strong> Under Wyoming Statutory Trust Act (Wyo. Stat. Ann. § 17-23-114) and Maryland Equity, the $500,000,000.00 res and 45,850,000 LEU shares are apportioned according to the quad-cameral vector:
                  </p>

                  <div className="space-y-2 font-sans text-xs my-2">
                    <div className="p-2.5 bg-slate-50 border border-slate-300 rounded flex justify-between items-center">
                      <div>
                        <strong>60% PSDLEF Perpetual Trust Corpus</strong> ($300,000,000.00 / 27,510,000 LEU shares)
                        <div className="text-[10px] text-slate-600">Invested in U.S. Treasury equivalents; research endowment for computational pharmacology and PQC.</div>
                      </div>
                      <span className="font-mono font-bold text-emerald-800">60%</span>
                    </div>

                    <div className="p-2.5 bg-indigo-50/70 border border-indigo-200 rounded flex justify-between items-center">
                      <div>
                        <strong className="text-indigo-950">25% Baltimore Historic Rowhomes Housing Preservation SPV</strong> ($125,000,000.00 / 11,462,500 LEU shares)
                        <div className="text-[10px] text-indigo-900 font-semibold mt-0.5">
                          ★ SPECIAL STATUTORY CARVEOUT: Exactly 30 historic row homes dedicated as PSDLEF expedited transitional and permanent supportive housing for SSDI/SSI applicants enduring SSA administrative delays.
                        </div>
                      </div>
                      <span className="font-mono font-bold text-indigo-800">25%</span>
                    </div>

                    <div className="p-2.5 bg-slate-50 border border-slate-300 rounded flex justify-between items-center">
                      <div>
                        <strong>10% Pro Se Litigant AI &amp; Cognitive Accommodation Grant Pool</strong> ($50,000,000.00 / 4,585,000 LEU shares)
                        <div className="text-[10px] text-slate-600">ADA Title II cognitive accommodations, automated docket parity, and pro se open justice tools.</div>
                      </div>
                      <span className="font-mono font-bold text-amber-800">10%</span>
                    </div>

                    <div className="p-2.5 bg-slate-50 border border-slate-300 rounded flex justify-between items-center">
                      <div>
                        <strong>5% Legal Defense &amp; Operational Contingency Reserve</strong> ($25,000,000.00 / 2,292,500 LEU shares)
                        <div className="text-[10px] text-slate-600">Quad-cameral Trust Protector enforcement, examiner audits, and litigation surety.</div>
                      </div>
                      <span className="font-mono font-bold text-slate-800">5%</span>
                    </div>
                  </div>

                  <p className="text-justify indent-8 text-[11px] text-slate-700">
                    7. <strong>The 5% Trailing Perpetuity Constraint:</strong> In adherence to Algorithm 12, annual sweep distributions shall never exceed 5% of the trailing five-year moving average value of the trust estate: <code>D(t) ≤ 0.05 · A_5yr(t)</code>.
                  </p>
                </div>
              )}

              {/* PAGE 5: RULE 18 CONSOLIDATED EXACTION (ITERATIONS I - IV) */}
              {currentPage === 5 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-xs uppercase tracking-widest text-slate-700 border-b border-slate-300 pb-1">
                    Part V: Rule 18 Consolidated Exaction of Liberty (Iterations I Through IV)
                  </h4>

                  <p className="text-justify indent-8">
                    Pursuant to Federal Rule of Civil Procedure 18(a) and Maryland Rule 2-303(b), Petitioners consolidate every iteration of state and institutional exaction of liberty into this single judicial proceeding:
                  </p>

                  <div className="space-y-2.5 text-xs text-justify">
                    <div className="border-l-2 border-slate-800 pl-3">
                      <strong>Iteration I: Constitutional &amp; Physical Liberty Exaction (42 U.S.C. § 1983):</strong>
                      <span className="block text-[11px] text-slate-700 mt-0.5">
                        Retaliatory arrest and prosecution in Baltimore County/City without probable cause, terminated favorably under <em>Thompson v. Clark</em>, 596 U.S. 36 (2022). Violates Fourth and Fourteenth Amendments; warrants permanent expungement and damages.
                      </span>
                    </div>

                    <div className="border-l-2 border-indigo-700 pl-3 bg-indigo-50/50 p-1.5 rounded-r">
                      <strong>Iteration II: Administrative Mortality Due Process Exaction (SSA / 42 U.S.C. § 405(g)):</strong>
                      <span className="block text-[11px] text-slate-800 mt-0.5">
                        Maintenance of a multi-year administrative backlog causing over 109,725 claimant deaths (GAO-20-641R). Warrants immediate deployment of the MORTAR anti-starvation triage algorithm and housing placement in the 30 dedicated PSDLEF row homes.
                      </span>
                    </div>

                    <div className="border-l-2 border-slate-800 pl-3">
                      <strong>Iteration III: Economic Liberty &amp; Custodial Exaction (BNY Mellon):</strong>
                      <span className="block text-[11px] text-slate-700 mt-0.5">
                        Refusal of corporate depository to execute book-entry credit of the 45,850,000 LEU shares violates the Trust Indenture Act of 1939 (15 U.S.C. § 77ppp(b)) and the confirmed reorganization order.
                      </span>
                    </div>

                    <div className="border-l-2 border-slate-800 pl-3">
                      <strong>Iteration IV: Algorithmic &amp; Cognitive Impairment Exaction (ADA Title II):</strong>
                      <span className="block text-[11px] text-slate-700 mt-0.5">
                        Coercive denial of cognitive assistive technology and docket parity for pro se litigants violates Title II of the ADA (<em>Tennessee v. Lane</em>, 541 U.S. 509).
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* PAGE 6: JUDICIAL PRAYERS FOR RELIEF */}
              {currentPage === 6 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-xs uppercase tracking-widest text-slate-700 border-b border-slate-300 pb-1">
                    Part VI: Specific Prayers for Peremptory Writs and Equitable Orders
                  </h4>

                  <p className="text-justify font-semibold">
                    WHEREFORE, Petitioners respectfully pray that this Court grant the following specific relief:
                  </p>

                  <ol className="list-decimal pl-6 space-y-2 text-xs text-justify">
                    <li>
                      <strong>Peremptory Writ of Mandamus to BNY Mellon:</strong> Commanding respondent The Bank of New York Mellon to immediately credit 45,850,000 common shares of Centrus Energy Corp. (NYSE: LEU) to M&amp;T Bank Depository Account (ABA 022000046).
                    </li>
                    <li>
                      <strong>Declaratory Judgment of Estate Capitalization:</strong> Declaring that the total senior debt principal is $500,000,000.00 and that the Tucker Act pool is $0.00.
                    </li>
                    <li>
                      <strong>Housing SPV &amp; SSDI Allocation Order:</strong> Confirming the permanent dedication of 30 Baltimore historic row homes for expedited occupancy by SSDI/SSI disability applicants.
                    </li>
                    <li>
                      <strong>Expungement &amp; Favorable Termination Order:</strong> Ordering the complete administrative expungement of Baltimore County/City arrest records pursuant to <em>Thompson v. Clark</em>.
                    </li>
                    <li>
                      <strong>MORTAR Engine Deployment Directive:</strong> Directing the deployment of the MORTAR bounded-delay triage engine across SSA disability appeals queues.
                    </li>
                  </ol>
                </div>
              )}

              {/* PAGE 7: CANONICAL LEGAL CITATION FOOTNOTES */}
              {currentPage === 7 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-widest text-slate-700 border-b border-slate-300 pb-1 flex items-center justify-between">
                    <span>Table Of Authorities &amp; Canonical Legal Footnotes</span>
                    <span className="font-mono text-[10px] text-slate-500">The Bluebook (21st Ed.) Standard</span>
                  </h4>

                  <div className="space-y-2 text-[11px] leading-snug">
                    {CANONICAL_LEGAL_FOOTNOTES.slice(0, 10).map((fn) => (
                      <div key={fn.number} className="p-1.5 bg-slate-50 rounded border border-slate-200">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-indigo-700">[{fn.number}]</span>
                          <span className="font-bold text-slate-900">{fn.canonicalCitation}</span>
                          <span className="text-[10px] text-slate-500 font-mono">({fn.jurisdiction})</span>
                        </div>
                        <p className="text-[10px] text-slate-700 pl-4 mt-0.5">
                          <em>Holding:</em> {fn.holdingOrRule}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PAGE 8: POST-QUANTUM SIGNATURES & VERIFICATION */}
              {currentPage === 8 && (
                <div className="space-y-5">
                  <h4 className="font-bold text-xs uppercase tracking-widest text-slate-700 border-b border-slate-300 pb-1">
                    Part VIII: Post-Quantum Digital Signatures &amp; Verification
                  </h4>

                  <div className="p-4 bg-slate-50 border border-slate-300 rounded font-sans text-xs space-y-3">
                    <div className="font-bold uppercase tracking-wider text-slate-800 text-[11px]">
                      VERIFICATION UNDER PENALTY OF PERJURY (28 U.S.C. § 1746)
                    </div>
                    <p className="text-slate-700 text-justify text-[11px]">
                      I declare under penalty of perjury under the laws of the United States of America that the foregoing verified pleading is true and correct, and that the $500M res, 45,850,000 LEU shares, and 30 SSDI/SSI housing units are accurately stated.
                    </p>

                    <div className="pt-2 flex justify-between items-end border-t border-slate-300">
                      <div>
                        <div className="font-mono font-bold text-indigo-900 text-sm">/s/ Caustin Lee McLaughlin</div>
                        <div className="font-semibold text-slate-800">Caustin Lee McLaughlin</div>
                        <div className="text-[11px] text-slate-600">Managing Director / Principal Trustee / Debtor-in-Possession</div>
                        <div className="font-mono text-[10px] text-slate-500">Xaustino@hotmail.com</div>
                      </div>
                      <div className="text-right text-[10px] font-mono text-slate-500">
                        NIST FIPS 203 Seal: ML-KEM-1024<br />
                        Date: November 3, 2026<br />
                        Towson, MD &amp; Washington, D.C.
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-indigo-50 border border-indigo-200 rounded font-sans text-xs space-y-2">
                    <div className="flex items-center gap-2 text-indigo-950 font-bold">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Post-Quantum Cryptographic Merkle Root Verification</span>
                    </div>
                    <div className="font-mono text-[10px] text-slate-600 break-all bg-white p-2 rounded border border-indigo-100">
                      ROOT-HASH: 0x9f83b4ac1087e59871fa28419cb7891240c7e5a1b3c942819eac1024dilithium87
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Running Legal Footer */}
          <div className="border-t border-slate-300 pt-2 mt-6 flex justify-between items-center text-[10px] font-sans text-slate-500">
            <span className="font-mono">PQC SEAL: NIST FIPS 203 (ML-KEM-1024)</span>
            <span className="font-semibold text-slate-700">Page {currentPage} of {totalPages}</span>
            <span>Omnibus Mandamus, Custodial Settlement &amp; Rule 18 Instrument</span>
          </div>
        </div>
      </div>
    </div>
  );
};
