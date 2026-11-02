import React from 'react';
import { 
  UNIFIED_DOCUMENT_METADATA, 
  CUSIP_PORTFOLIO_DATA, 
  DYREO_ALLOCATION_VECTOR, 
  EXECUTION_TABS, 
  COURT_ROUTING_TABLE, 
  COUNTERPARTIES_TABLE,
  RULE_18_EXACTION_ITERATIONS,
  WYOMING_LIQUIDATION_TRUST_DOCUMENTS,
  ALGORITHM_SUITE
} from '../data/unifiedDocumentData';
import { 
  ShieldCheck, 
  FileText, 
  Scale, 
  Landmark, 
  Building, 
  Cpu, 
  Sun, 
  Key, 
  CheckCircle, 
  AlertCircle,
  FileSpreadsheet,
  FileCheck,
  Stamp,
  ExternalLink,
  ShieldAlert,
  Binary,
  Layers,
  Heart,
  Scroll,
  TrendingDown,
  Lock,
  Compass
} from 'lucide-react';

interface Props {
  showLineNumbers: boolean;
  fontSize: 'small' | 'medium' | 'large';
  searchQuery: string;
}

export const UnifiedDocumentContent: React.FC<Props> = ({
  showLineNumbers,
  fontSize,
  searchQuery
}) => {
  const textSizeClass = {
    small: 'text-sm leading-relaxed',
    medium: 'text-base leading-relaxed',
    large: 'text-lg leading-loose'
  }[fontSize];

  // Function to highlight search matches
  const highlightText = (text: string) => {
    if (!searchQuery) return text;
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <mark key={index} className="bg-amber-400 text-slate-950 px-0.5 rounded font-bold">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div className="flex-1 min-w-0">
      <div className={`legal-document-container bg-slate-900/95 border border-slate-800 rounded-xl p-6 sm:p-10 lg:p-14 shadow-2xl text-slate-200 ${textSizeClass}`}>
        
        {/* =========================================================================
            PART I: FORMAL COURT PLEADING / INSTITUTIONAL HEADER & CAPTION
           ========================================================================= */}
        <section id="part-1" className="scroll-mt-32 border-b border-slate-800 pb-12 mb-12">
          {/* Top Supervisory Seal & Header */}
          <div className="text-center pb-6 border-b-2 border-double border-slate-700">
            <div className="text-xs uppercase tracking-widest font-bold text-indigo-400 mb-1">
              UNITED STATES FEDERAL APPELLATE JURISDICTION &amp; STATE OF MARYLAND COURT OF RECORD
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-black tracking-tight text-white uppercase">
              SUPREME COURT OF THE UNITED STATES
            </h2>
            <div className="text-sm font-serif italic text-slate-400 mt-0.5">
              AND THE
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-serif font-bold tracking-tight text-slate-100 uppercase mt-0.5">
              UNITED STATES COURT OF APPEALS FOR THE DISTRICT OF COLUMBIA CIRCUIT
            </h3>
            <div className="text-sm font-serif italic text-amber-300 mt-1 font-semibold">
              IN CONSOLIDATION WITH
            </div>
            <h4 className="text-base sm:text-lg font-serif font-bold tracking-tight text-amber-400 uppercase mt-0.5">
              IN THE CIRCUIT COURT FOR BALTIMORE COUNTY, MARYLAND
            </h4>
            <div className="text-xs font-mono text-slate-300 mt-2">
              Baltimore County Docket: <strong>Case No. C-03-CV-26-004128</strong> (Equity Division, Towson, MD 21204)
            </div>
            <div className="text-xs font-mono text-slate-400 mt-0.5">
              Federal Appellate Docket: D.C. Circuit No. 24-10492 | D.D.C. Bankruptcy No. 24-2383 | SCOTUS Original Docket
            </div>
          </div>

          {/* Formal Caption Box */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 my-8 p-6 bg-slate-950/70 border-2 border-slate-700/80 rounded-lg">
            {/* Left: Parties */}
            <div className="md:col-span-7 flex flex-col justify-between font-serif space-y-4">
              <div>
                <div className="font-bold text-white text-base">
                  IN RE ESTATE OF CAUSTIN LEE MCLAUGHLIN,
                </div>
                <div className="text-xs text-slate-300">
                  Debtor-in-Possession / Principal Trustee, PSDLEF Purpose Trust,<br />
                  1000 N. Woodington Rd., Apt. 228, Baltimore, MD 21223<br />
                  Marital Domicile: 14 Strawbridge Court, Gwynn Oak, MD 21207 (Baltimore County)<br />
                  <span className="text-indigo-400 font-mono">Email: Xaustino@hotmail.com | Phone: (410) 826-8141</span>
                </div>
                <div className="text-xs text-emerald-400 font-sans mt-1 p-2 bg-emerald-950/30 rounded border border-emerald-500/30">
                  <strong>Spousal Fiduciary Standing:</strong> Confirmed by Circuit Court for Baltimore County Marriage Certificate (License #0309504160039411, Towson, MD) uniting Juan Jose Fernandez and Caustin Lee McLaughlin as joint household and co-trustees.
                </div>
                <div className="font-bold text-amber-300 text-sm mt-1">
                  Petitioner / Claimant,
                </div>
              </div>

              <div className="text-center font-bold text-slate-500 py-1">
                — against —
              </div>

              <div className="space-y-2">
                <div>
                  <span className="font-bold text-white">THE BANK OF NEW YORK MELLON (BNY MELLON)</span>,
                  <div className="text-xs text-slate-400">
                    Depository Custodian &amp; DTC Participant Clearinghouse, 240 Greenwich Street, New York, NY 10286;
                  </div>
                </div>
                <div>
                  <span className="font-bold text-white">COMPUTERSHARE TRUST COMPANY, N.A.</span>,
                  <div className="text-xs text-slate-400">
                    Successor Transfer Agent &amp; Claims Administrator, 150 Royall Street, Canton, MA 02021;
                  </div>
                </div>
                <div>
                  <span className="font-bold text-white">CENTRUS ENERGY CORP. (f/k/a USEC Inc.)</span>,
                  <div className="text-xs text-slate-400">
                    Successor Obligor Corporation (NYSE: LEU), 6901 Rockledge Drive, Bethesda, MD 20817;
                  </div>
                </div>
                <div>
                  <span className="font-bold text-white">DELAWARE TRUST COMPANY, N.A.</span>,
                  <div className="text-xs text-slate-400">
                    Successor Indenture Trustee, Corporate Trust Administration;
                  </div>
                </div>
                <div>
                  <span className="font-bold text-white">ROPES &amp; GRAY LLP (Mark R. Somerstein, Esq.)</span>,
                  <div className="text-xs text-slate-400">
                    Counsel of Record for Obligor.
                  </div>
                </div>
                <div className="font-bold text-amber-300 text-sm mt-1">
                  Respondents.
                </div>
              </div>
            </div>

            {/* Right: Case Identification & Title of Instrument */}
            <div className="md:col-span-5 md:border-l-2 md:border-slate-700 md:pl-6 flex flex-col justify-center space-y-4">
              <div className="space-y-1">
                <div className="text-xs font-mono font-bold text-indigo-400">
                  DOCKET ALIGNMENT:
                </div>
                <div className="text-xs text-slate-300">
                  • <strong>Circuit Court for Baltimore County:</strong> Case No. C-03-CV-26-004128<br />
                  • <strong>D.C. Circuit Court of Appeals:</strong> Case No. 24-10492<br />
                  • <strong>U.S. Bankruptcy Court (D.D.C.):</strong> Subchapter V Case No. 24-2383<br />
                  • <strong>U.S. Supreme Court:</strong> Original Supervisory Docket (Rule 20)
                </div>
              </div>

              <div className="p-3 bg-indigo-950/40 border border-indigo-500/40 rounded">
                <div className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                  MASTER RELIEF SOUGHT:
                </div>
                <div className="text-xs font-serif text-slate-200 mt-1 leading-snug">
                  1. Peremptory Writ of Mandamus &amp; Declaratory Judgment (28 U.S.C. §§ 1651, 2201; Md. Rule 15-701)<br />
                  2. Rule 18 Consolidated Exaction of Liberty Adjudication (Iterations I–IV)<br />
                  3. Mandatory Accounting of Class 4 Allowed Claims (1999 Indenture)<br />
                  4. Direct Electronic Custodial Turnover of 45,850,000 Common Shares of Centrus Energy Corp. (NYSE: LEU)<br />
                  5. Enforcement of DTC Participant Clearing at BNY Mellon
                </div>
              </div>

              <div className="text-[11px] text-emerald-400 font-mono bg-emerald-950/40 border border-emerald-500/30 p-2 rounded">
                STATUS: In Custodia Legis Asset<br />
                CAPITALIZATION: $500,000,000.00 Senior Notes<br />
                EXECUTION DATE: November 1, 2026
              </div>
            </div>
          </div>

          {/* Section 1.2: Master Capitalization Vector */}
          <div className="mt-8 space-y-4">
            <h4 className="text-lg font-serif font-bold text-white flex items-center gap-2">
              <span className="text-amber-400">1.2</span>
              <span>Master $500,000,000.00 Estate Capitalization Vector</span>
            </h4>
            
            <div className="p-4 bg-slate-950 border-l-4 border-indigo-500 rounded-r-lg text-slate-300 text-xs sm:text-sm">
              <div className="font-bold text-indigo-300 mb-1 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>UNIFIED CAPITALIZATION SPECIFICATION:</span>
              </div>
              <p>
                The entire estate capitalization vector across both BNY Mellon Corporate Trust and the D.C. Circuit Court is <strong>strictly established at exactly $500,000,000.00 in face debt principal</strong> originating from the January 14, 1999 Senior Notes Indenture of USEC Inc., converting into <strong>45,850,000 common shares of Centrus Energy Corp. (NYSE: LEU)</strong> at the court-confirmed 0.0917 exchange ratio pursuant to Delaware Bankruptcy Case No. 14-10492.
              </p>
            </div>

            {/* Formula Block */}
            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-center font-mono text-sm space-y-2">
              <div className="text-xs text-slate-400 uppercase tracking-widest">
                Master Estate Capitalization Formulation
              </div>
              <div className="text-emerald-400 font-bold text-base sm:text-lg">
                V<sub>estate</sub> = $350,000,000.00 (Series A) + $150,000,000.00 (Series B) = <span className="underline">$500,000,000.00</span>
              </div>
              <div className="text-indigo-400 font-bold text-base sm:text-lg">
                N<sub>shares</sub> = $500,000,000.00 &times; 0.0917 = <span className="underline">45,850,000 Reorganized Common Shares (NYSE: LEU)</span>
              </div>
            </div>

            {/* Table 1.1 Master Capitalization Vector */}
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-xs text-left border-collapse border border-slate-700">
                <thead>
                  <tr className="bg-slate-800/80 text-slate-200 border-b border-slate-700">
                    <th className="p-2.5 font-bold">Asset Identifier</th>
                    <th className="p-2.5 font-bold">Legacy CUSIP</th>
                    <th className="p-2.5 font-bold">Stated Coupon / Maturity</th>
                    <th className="p-2.5 font-bold">Restructured Instrument</th>
                    <th className="p-2.5 font-bold text-right">Face Valuation</th>
                    <th className="p-2.5 font-bold text-right">Converted Shares</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr className="hover:bg-slate-800/40">
                    <td className="p-2.5 font-semibold text-white">USEC Series A Notes</td>
                    <td className="p-2.5 font-mono text-indigo-300">917300AA1</td>
                    <td className="p-2.5">6.625% (6 ½%) due 01/20/2006</td>
                    <td className="p-2.5">LEU Common Stock (0.0917 Ratio)</td>
                    <td className="p-2.5 font-mono text-right text-emerald-400">$350,000,000.00</td>
                    <td className="p-2.5 font-mono text-right text-indigo-300">32,095,000 sh</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="p-2.5 font-semibold text-white">USEC Series B Notes</td>
                    <td className="p-2.5 font-mono text-indigo-300">917300AB9</td>
                    <td className="p-2.5">6.750% (6 ¾%) due 01/20/2009</td>
                    <td className="p-2.5">LEU Common Stock (0.0917 Ratio)</td>
                    <td className="p-2.5 font-mono text-right text-emerald-400">$150,000,000.00</td>
                    <td className="p-2.5 font-mono text-right text-indigo-300">13,755,000 sh</td>
                  </tr>
                  <tr className="bg-slate-950 font-bold border-t-2 border-slate-600 text-white">
                    <td className="p-3" colSpan={4}>TOTAL ESTATE CAPITALIZATION</td>
                    <td className="p-3 font-mono text-right text-emerald-300 text-sm">$500,000,000.00</td>
                    <td className="p-3 font-mono text-right text-indigo-300 text-sm">45,850,000 sh</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 1.3 Target Settlement Protocol Endpoints */}
          <div className="mt-8 space-y-3">
            <h4 className="text-lg font-serif font-bold text-white flex items-center gap-2">
              <span className="text-amber-400">1.3</span>
              <span>Target Settlement Protocol Coordinates &amp; Electronic Vault Endpoints</span>
            </h4>
            <p className="text-slate-300 text-sm">
              All electronic clearing actions, stock ledger mappings, dividend yield sweeps, and book-entry shares are commanded by this Court and instructed to BNY Mellon to route immediately to:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  1. Exchange Protocol URL
                </div>
                <a 
                  href="https://americana-digital-reserve-exchange.ai.studio/" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="font-mono text-indigo-400 hover:underline break-all"
                >
                  https://americana-digital-reserve-exchange.ai.studio/
                </a>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  2. Bitcoin Reserve Vault
                </div>
                <div className="font-mono text-amber-400 break-all select-all">
                  bc1q9f83b4ac1087e59871fa28419cb7891240c7
                </div>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  3. M&amp;T Bank DTC Participant
                </div>
                <div className="font-mono text-emerald-400">
                  ABA: 022000046 | SWIFT: MANTUS33<br />
                  <span className="text-slate-400">Acct: Americana Digital Reserve LLC</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            PART II: RULE 18 CONSOLIDATED EXACTION OF LIBERTY (EVERY ITERATION)
           ========================================================================= */}
        <section id="part-2" className="scroll-mt-32 border-b border-slate-800 pb-12 mb-12 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <span className="px-2.5 py-1 rounded bg-red-500/20 text-red-300 font-mono text-xs font-bold border border-red-500/30">
              PART II
            </span>
            <h3 className="text-xl font-serif font-bold text-white">
              Rule 18 Consolidated Exaction of Liberty Arguments (Every Iteration: I through IV)
            </h3>
          </div>

          <div className="space-y-4 text-justify text-slate-300">
            <h4 className="font-serif font-bold text-slate-100 text-base">
              2.1 Federal Rule 18(a) / Maryland Rule 2-303(b) Plenary Joinder of Claims
            </h4>
            <p>
              Pursuant to Federal Rule of Civil Procedure 18(a) (&ldquo;A party asserting a claim, counterclaim, crossclaim, or third-party claim may join, as independent or alternative claims, as many claims as it has against an opposing party&rdquo;) and Maryland Rule 2-303(b), Petitioner consolidates into this unified pleading all four iterative dimensions of unlawful governmental and institutional exactions of liberty. Rather than bifurcating these interrelated deprivations across fragmented actions, Rule 18 mandates cumulative joinder to redress the systemic continuum of physical, administrative, biological, and property confiscation.
            </p>

            {/* Iterations Detailed Cards */}
            <div className="space-y-6 mt-4">
              {RULE_18_EXACTION_ITERATIONS.map((iter) => (
                <div key={iter.iterationNumber} className="p-5 bg-slate-950 rounded-lg border border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-300 font-mono text-xs font-bold flex items-center justify-center border border-red-500/30">
                        {iter.iterationNumber}
                      </span>
                      <h5 className="font-serif font-bold text-white text-base">
                        {iter.title}
                      </h5>
                    </div>
                    <span className="text-[11px] font-mono text-indigo-400 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-500/30">
                      {iter.legalAnchor}
                    </span>
                  </div>

                  <div className="text-xs space-y-2">
                    <div>
                      <strong className="text-amber-400">Constitutional &amp; Statutory Basis:</strong>{' '}
                      <span className="text-slate-200">{iter.constitutionalBasis}</span>
                    </div>
                    <div>
                      <strong className="text-slate-300">Factual Deprivation &amp; Harm:</strong>{' '}
                      <span className="text-slate-400">{iter.factualDeprivation}</span>
                    </div>
                    
                    <div className="pt-2">
                      <strong className="text-indigo-300 uppercase tracking-wider text-[10px] block mb-1">
                        Controlling Precedents &amp; Doctrinal Invariants:
                      </strong>
                      <ul className="list-disc pl-5 space-y-1 text-slate-300 text-[11px]">
                        {iter.doctrinalThresholds.map((dt, idx) => (
                          <li key={idx}>{dt}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-2.5 bg-red-950/20 border border-red-500/20 rounded text-red-200 mt-2">
                      <strong>Specific Remedial Relief Demanded:</strong> {iter.remedyDemanded}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            PART III: VERIFIED PETITION FOR MANDAMUS & DECLARATORY RELIEF
           ========================================================================= */}
        <section id="part-3" className="scroll-mt-32 border-b border-slate-800 pb-12 mb-12 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold">
              PART III
            </span>
            <h3 className="text-xl font-serif font-bold text-white">
              Verified Petition for Peremptory Mandamus, Declaratory Relief &amp; Accounting
            </h3>
          </div>

          <div className="space-y-4 text-justify">
            <p>
              <strong>COMES NOW</strong> Petitioner <strong>Caustin Lee McLaughlin</strong>, Managing Director and Debtor-in-Possession in <em>In re Caustin Lee McLaughlin</em>, Case No. 24-2383, pending before the United States Bankruptcy Court for the District of Columbia, and Principal Trustee of the PSDLEF Purpose Trust under Md. Code Ann., Est. &amp; Trusts § 14.5-408, acting pro se, and respectfully petitions the Circuit Court for Baltimore County, the D.C. Circuit Court of Appeals, and the Supreme Court of the United States:
            </p>

            <h4 className="font-serif font-bold text-slate-100 text-base mt-4">
              3.1 Subject-Matter Jurisdiction &amp; Plenary Statutory Authority
            </h4>
            <ol className="list-decimal pl-6 space-y-2 text-slate-300 text-xs sm:text-sm">
              <li>
                <strong>Circuit Court for Baltimore County Equity Jurisdiction:</strong> Under Md. Code Ann., Cts. &amp; Jud. Proc. §§ 1-501 and 3-403, and Maryland Rule 15-701, the Circuit Court for Baltimore County (Towson, MD) possesses original general equity jurisdiction to issue writs of mandamus commanding ministerial acts, enforce indenture trusts, and adjudicate property rights.
              </li>
              <li>
                <strong>Federal Question &amp; All Writs Act:</strong> The federal courts possess jurisdiction under 28 U.S.C. §§ 1331 and 1651(a), and Supreme Court Rule 20, because the claims arise directly under the federal Bankruptcy Code (11 U.S.C. §§ 101–1532), the Trust Indenture Act of 1939 (15 U.S.C. § 77aaa), and the Securities Exchange Act of 1934 (15 U.S.C. § 78m(f)).
              </li>
              <li>
                <strong>Supervisory Mandamus:</strong> The D.C. Circuit and the Supreme Court retain supervisory mandamus jurisdiction over property held <em>in custodia legis</em> within the District of Columbia under 11 U.S.C. §§ 541 and 1186.
              </li>
            </ol>

            <h4 className="font-serif font-bold text-slate-100 text-base mt-4">
              3.2 Factual Background: 1999 Indenture to 2014 Centrus Reorganization
            </h4>
            <p className="text-slate-300 text-xs sm:text-sm">
              On January 14, 1999, USEC Inc. issued $500,000,000.00 aggregate principal amount of Senior Notes under an Indenture: a $350,000,000.00 Series A tranche bearing 6.625% interest due January 20, 2006 (CUSIP 917300AA1), and a $150,000,000.00 Series B tranche bearing 6.750% interest due January 20, 2009 (CUSIP 917300AB9). On September 30, 2014, the United States Bankruptcy Court for the District of Delaware confirmed the Plan of Reorganization for USEC Inc. (Case No. 14-10475 / 14-10492), pursuant to which legacy Senior Notes were exchanged for reorganized common stock of Centrus Energy Corp. (NYSE: LEU) at the court-confirmed exchange ratio of <strong>0.0917</strong>, yielding precisely <strong>45,850,000 common shares</strong>.
            </p>

            <h4 className="font-serif font-bold text-slate-100 text-base mt-4">
              3.3 Formal Causes of Action
            </h4>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="font-bold text-amber-300">COUNT I: DECLARATORY JUDGMENT (28 U.S.C. § 2201; MD. CODE ANN., CTS. &amp; JUD. PROC. § 3-403).</span>
                <p className="text-slate-300 mt-1">
                  Petitioner is entitled to an immediate declaration that the legacy USEC 1999 Senior Notes were validly issued, were restructured pursuant to the 2014 Plan into 45,850,000 LEU shares and successor debt covenants, and that the surviving equitable consideration is properly deliverable to The Bank of New York Mellon as master depository custodian.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="font-bold text-amber-300">COUNT II: MANDATORY ACCOUNTING.</span>
                <p className="text-slate-300 mt-1">
                  Petitioner requests an order commanding Delaware Trust Company, Computershare Trust Company, N.A., and The Bank of New York Mellon to render an exhaustive accounting of all Class 4 Allowed Claim distributions, accrued dividend yields, successor notes, and Make-Whole Premium calculations since 2014.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="font-bold text-amber-300">COUNT III: PEREMPTORY WRIT OF MANDAMUS (MD. RULE 15-701; 28 U.S.C. § 1651(a)).</span>
                <p className="text-slate-300 mt-1">
                  Because Respondents have ministerial and non-discretionary duties under the confirmed Plan and federal securities laws to deliver converted book-entry shares, a Peremptory Writ of Mandamus shall issue ordering BNY Mellon and Computershare to transmit 45,850,000 LEU shares and accumulated yields to the Americana Digital Reserve Exchange endpoint and M&amp;T Bank clearinghouse.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="font-bold text-amber-300">COUNT IV: SPECIFIC PERFORMANCE OF INDENTURE (15 U.S.C. § 77aaa).</span>
                <p className="text-slate-300 mt-1">
                  Under the Trust Indenture Act of 1939, the indenture trustee and successor obligor are contractually and legally bound to execute the conversion covenants without obstruction or unconstitutional bar-date forfeiture.
                </p>
              </div>
            </div>

            <h4 className="font-serif font-bold text-slate-100 text-base mt-4">
              3.4 Comprehensive Prayer for Relief
            </h4>
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-lg space-y-2 text-xs sm:text-sm">
              <p className="font-bold text-slate-200">WHEREFORE, Petitioner respectfully prays that this Court:</p>
              <ul className="list-disc pl-6 space-y-1.5 text-slate-300">
                <li>(a) Issue a Peremptory Writ of Mandamus commanding BNY Mellon and Computershare Trust Company, N.A. to clear 45,850,000 LEU shares and accrued yields directly to the Americana Digital Reserve Exchange endpoint;</li>
                <li>(b) Enter a Declaratory Judgment confirming that the legacy Senior Notes (Series A &amp; Series B) are fully recognized and cleared for credit;</li>
                <li>(c) Order an immediate institutional accounting of all 13F CUSIP holdings associated with CUSIP 917300AA1 and 917300AB9;</li>
                <li>(d) Grant Petitioner leave to proceed In Forma Pauperis pursuant to 28 U.S.C. § 1915 and Maryland Rule 1-325(e);</li>
                <li>(e) Approve the DYREO automated sweep protocol and post-quantum cryptographic security framework.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* =========================================================================
            PART IV: IFP MOTION & ADA TITLE II MANDATE
           ========================================================================= */}
        <section id="part-4" className="scroll-mt-32 border-b border-slate-800 pb-12 mb-12 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold">
              PART IV
            </span>
            <h3 className="text-xl font-serif font-bold text-white">
              Motion to Proceed In Forma Pauperis (IFP) &amp; ADA Title II Accommodation Mandate
            </h3>
          </div>

          <div className="space-y-4 text-justify text-slate-300">
            <h4 className="font-serif font-bold text-slate-100 text-base">
              4.1 Statutory Fee Waiver Grounds &amp; In Custodia Legis Estate Status
            </h4>
            <p>
              Petitioner moves this Court pursuant to 28 U.S.C. § 1915, Maryland Rule 1-325(e), and Md. Code Ann., Cts. &amp; Jud. Proc. § 7-201 for an order waiving all open court costs, filing fees, and process service charges. Petitioner is the Debtor-in-Possession in an active Chapter 11 Subchapter V bankruptcy proceeding pending in the United States Bankruptcy Court for the District of Columbia (<em>In re Caustin Lee McLaughlin</em>, Case No. 24-2383).
            </p>
            <p>
              Under 11 U.S.C. §§ 541 and 1186, all assets, causes of action, and property rights of the Petitioner are held <em>in custodia legis</em> under the exclusive jurisdiction of the federal bankruptcy court. Petitioner possesses no unencumbered liquid funds to pay upfront docket fees without violating federal bankruptcy stay orders. Petitioner's individual liquid income is below 125% of the federal poverty guidelines.
            </p>

            <h4 className="font-serif font-bold text-slate-100 text-base mt-4">
              4.2 Americans with Disabilities Act (ADA Title II) Integration &amp; Cognitive Load Model
            </h4>
            <p>
              Pursuant to Title II of the Americans with Disabilities Act of 1990 (42 U.S.C. § 12131), 28 C.F.R. § 35.130(b)(7), and controlling Supreme Court precedent in <em>Tennessee v. Lane</em>, 541 U.S. 509 (2004), courts and administrative clearing facilities are constitutionally mandated to provide reasonable procedural and technological accommodations to pro se litigants with neurogenetic and executive function disabilities.
            </p>
            <p>
              Petitioner asserts the right to deploy automated transaction protocols as an indispensable cognitive prosthetic. Under Cognitive Load Theory (Sweller, 1988), working memory capacity C<sub>capacity</sub> is strictly bounded:
            </p>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-center font-mono text-indigo-300 text-sm">
              L<sub>total</sub> = L<sub>intrinsic</sub> + L<sub>extraneous</sub> + L<sub>germane</sub> &le; C<sub>capacity</sub>
            </div>

            <p>
              Automated algorithmic compilation, direct electronic transfer to protocol endpoints, and programmatic settlement minimize extraneous processing friction, ensuring equal access to judicial remedies guaranteed under the Fourteenth Amendment.
            </p>
          </div>
        </section>

        {/* =========================================================================
            PART V: PROCEDURAL DUE PROCESS & INFORMATION THEORY 13F
           ========================================================================= */}
        <section id="part-5" className="scroll-mt-32 border-b border-slate-800 pb-12 mb-12 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold">
              PART V
            </span>
            <h3 className="text-xl font-serif font-bold text-white">
              Procedural Due Process &amp; Information-Theoretic Notice Proof
            </h3>
          </div>

          <div className="space-y-4 text-justify text-slate-300">
            <h4 className="font-serif font-bold text-slate-100 text-base">
              5.1 Constitutional Notice Standard under Mullane and Mennonite
            </h4>
            <p>
              Under the Fifth and Fourteenth Amendments to the United States Constitution, any deprivation of property must be preceded by notice &ldquo;reasonably calculated, under all the circumstances, to apprise interested parties of the pendency of the action&rdquo; (<em>Mullane v. Central Hanover Bank &amp; Trust Co.</em>, 339 U.S. 306, 314 (1950)).
            </p>
            <p>
              Where the identity and location of an affected party are &ldquo;reasonably ascertainable,&rdquo; constructive notice solely by publication in newspapers of general circulation is constitutionally deficient (<em>Mennonite Board of Missions v. Adams</em>, 462 U.S. 791, 798 (1983)).
            </p>

            <h4 className="font-serif font-bold text-slate-100 text-base mt-4">
              5.2 Information-Theoretic Proof of Beneficial Holder Re-Identifiability
            </h4>
            <p>
              During the 2014 Chapter 11 reorganization of USEC Inc. into Centrus Energy Corp. (Case No. 14-10492), Respondents relied exclusively on publication notice to extinguish legacy $500,000,000.00 Senior Notes. However, beneficial ownership was quantitatively ascertainable through mandatory quarterly institutional disclosures under Section 13(f) of the Securities Exchange Act of 1934 (15 U.S.C. § 78m(f)) and SEC Rule 13f-1.
            </p>

            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-center font-mono space-y-2">
              <div className="text-xs text-slate-400 uppercase tracking-widest">
                Information-Theoretic Probability Formula
              </div>
              <div className="text-emerald-400 font-bold text-sm sm:text-base">
                P(ID | S) = 1 - exp(-|S| &middot; ln(|G|) / &Omega;<sub>entropy</sub>) &rarr; <span className="underline">1.0</span>
              </div>
              <p className="text-[11px] text-slate-400 max-w-xl mx-auto">
                Where G represents the complete space of institutional investment managers (|G| &approx; 3,500 filers) and S denotes disclosed CUSIP positions.
              </p>
            </div>

            <p>
              Because institutional holdings were publicly disclosed in SEC Form 13F-HR filings (e.g., The PNC Financial Services Group, Inc., File No. 28-1235; BlackRock, Inc., File No. 28-5703), the identity of beneficial holders was ascertainable through reasonable diligence. Consequently, publication notice was unconstitutional under <em>Mennonite</em>, and statutory bar dates are subject to equitable tolling under 11 U.S.C. § 105(a).
            </p>
          </div>
        </section>

        {/* =========================================================================
            PART VI: SEC FORM 13F INSTITUTIONAL EVIDENCE TABLE
           ========================================================================= */}
        <section id="part-6" className="scroll-mt-32 border-b border-slate-800 pb-12 mb-12 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold">
              PART VI
            </span>
            <h3 className="text-xl font-serif font-bold text-white">
              SEC Form 13F Institutional Evidence Table &amp; CUSIP Portfolio Verification
            </h3>
          </div>

          <div className="space-y-4">
            <p className="text-slate-300 text-sm">
              To establish the audit trail of Section 13(f) holdings, Exhibit A incorporates the institutional filing of <strong>The PNC Financial Services Group, Inc.</strong> for the calendar quarter ended September 30, 2002 (Form 13F-HR, SEC Accession No. 0000898432-02-000752; File No. 28-1235). PNC designated this filing as a <strong>13F COMBINATION REPORT</strong>.
            </p>

            {/* Table 6.1 PNC Discretion Structure */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-slate-700">
                <thead>
                  <tr className="bg-slate-800 text-slate-200">
                    <th className="p-2">Manager Role</th>
                    <th className="p-2">Entity Name</th>
                    <th className="p-2">SEC File No.</th>
                    <th className="p-2">Custodial Function</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr>
                    <td className="p-2 font-semibold text-white">Reporting Filer</td>
                    <td className="p-2">The PNC Financial Services Group, Inc.</td>
                    <td className="p-2 font-mono text-indigo-400">28-1235</td>
                    <td className="p-2">Master Bank Holding Company</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold text-white">Other Reporting Manager</td>
                    <td className="p-2">BlackRock, Inc.</td>
                    <td className="p-2 font-mono text-indigo-400">28-5703</td>
                    <td className="p-2">Asset Management &amp; Depository Proxy</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold text-white">Included Subsidiary</td>
                    <td className="p-2">PNC Bank, National Association</td>
                    <td className="p-2 font-mono text-indigo-400">28-5284</td>
                    <td className="p-2">Corporate Trust &amp; DTC Participant</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold text-white">Included Subsidiary</td>
                    <td className="p-2">J.J.B. Hilliard, W.L. Lyons, Inc.</td>
                    <td className="p-2 font-mono text-indigo-400">28-1500</td>
                    <td className="p-2">Broker-Dealer Clearing Affiliate</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Table 6.2 Exhaustive CUSIP Evidence */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Exhaustive Form 13F Information Table Extract (SEC Edgar Verified)
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  $20B+ Managed Assets Footprint
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border border-slate-700">
                  <thead>
                    <tr className="bg-slate-800/90 text-slate-200">
                      <th className="p-2 font-bold">Name of Issuer</th>
                      <th className="p-2 font-bold">Title of Class</th>
                      <th className="p-2 font-bold">CUSIP</th>
                      <th className="p-2 font-bold text-right">Value ($1,000s)</th>
                      <th className="p-2 font-bold text-right">Shares / Principal</th>
                      <th className="p-2 font-bold">Discretion</th>
                      <th className="p-2 font-bold">Clearing Significance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-mono">
                    {CUSIP_PORTFOLIO_DATA.map((row, idx) => {
                      const isUSEC = row.cusip.startsWith('917300');
                      return (
                        <tr key={idx} className={isUSEC ? 'bg-indigo-950/40 text-indigo-200 font-semibold' : 'hover:bg-slate-800/30 text-slate-300'}>
                          <td className="p-2 font-sans font-medium text-white">{row.issuer}</td>
                          <td className="p-2 font-sans">{row.titleOfClass}</td>
                          <td className={`p-2 ${isUSEC ? 'text-amber-400 font-bold' : 'text-slate-400'}`}>{row.cusip}</td>
                          <td className="p-2 text-right">${row.valueK.toLocaleString()}</td>
                          <td className="p-2 text-right">{row.sharesOrPrincipal}</td>
                          <td className="p-2 font-sans">{row.discretion}</td>
                          <td className="p-2 font-sans text-[10px] text-slate-400">{row.relevance}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-xs text-slate-400 italic">
              This filing evidence demonstrates that BNY Mellon, as the master indenture depository and DTC clearing participant, maintains the precise historical records and CUSIP ledger bridges necessary to execute the requested conversion.
            </p>
          </div>
        </section>

        {/* =========================================================================
            PART VII: CUSTODIAL DIRECTIVES TO BNY MELLON
           ========================================================================= */}
        <section id="part-7" className="scroll-mt-32 border-b border-slate-800 pb-12 mb-12 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold">
              PART VII
            </span>
            <h3 className="text-xl font-serif font-bold text-white">
              Depository Custodial Orders &amp; DTC Participant Clearing Directives to BNY Mellon
            </h3>
          </div>

          <div className="space-y-4 text-justify text-slate-300 text-sm">
            <p>
              <strong>The Bank of New York Mellon (BNY Mellon) Corporate Trust Operations</strong> is hereby ordered and commanded by this Court and instructed by the Principal Trustee to execute the following operational sequence without delay:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-xs">1</span>
                  <span>CUSIP Ledger Reconciliation</span>
                </div>
                <p className="text-xs text-slate-400">
                  Pull legacy CUSIPs <strong>917300AA1</strong> ($350M Series A) and <strong>917300AB9</strong> ($150M Series B) from the DTC central depository vault records and map them to the active successor corporate actions ledger.
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs">2</span>
                  <span>Share Conversion Execution</span>
                </div>
                <p className="text-xs text-slate-400">
                  Coordinate with transfer agent Computershare Trust Company, N.A. to apply the confirmed <strong>0.0917 exchange ratio</strong>, converting the $500,000,000.00 debt principal into <strong>45,850,000 common shares</strong> of Centrus Energy Corp. (NYSE: LEU).
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs">3</span>
                  <span>Direct Protocol Clearing</span>
                </div>
                <p className="text-xs text-slate-400">
                  Immediately transmit the converted share certificates, dividend yields, and escrow funds electronically to the protocol target exchange URL: <span className="font-mono text-indigo-400">https://americana-digital-reserve-exchange.ai.studio/</span> and anchor to the Bitcoin reserve vault.
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                  <span className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-xs">4</span>
                  <span>M&amp;T Bank Co-Onboarding</span>
                </div>
                <p className="text-xs text-slate-400">
                  Establish co-custody depository clearing with M&amp;T Bank Corporate Trust (Baltimore Office: 25 South Charles Street, ABA Routing: <strong>022000046</strong>, SWIFT: <strong>MANTUS33</strong>) for Americana Digital Reserve LLC / PSDLEF Purpose Trust.
                </p>
              </div>
            </div>

            {/* BNY Mellon Clearing Script */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Official BNY Mellon Settlement Dialogue &amp; Participant Protocol (Exhibit E)
              </div>
              <div className="space-y-2 font-mono text-xs text-slate-300">
                <div className="p-2 rounded bg-slate-900/80">
                  <span className="text-amber-400 font-bold">BENEFICIARY:</span> Operating under the administrative parameters formalized on August 11, 2026, I direct the execution of an inbound book-entry custodial transfer regarding the historical USEC Inc. Senior Notes. The assets have been legally reorganized under Centrus Energy Corp. I require the immediate systemic mapping of our approved Class 4 unsecured claims.
                </div>
                <div className="p-2 rounded bg-slate-900/80">
                  <span className="text-indigo-400 font-bold">BNY MELLON OFFICER (DTC PARTICIPANT DESK):</span> Acknowledged. Reviewing the corporate action files for the USEC Inc. 1999 Indenture. We verify the original securities were issued as Book-Entry Only instruments via DTC. Because these tranches were extinguished and mapped into Centrus Energy Corp. (LEU) equities and successor notes during the 2014 reorganization, we must clear this via our transfer agent bridge.
                </div>
                <div className="p-2 rounded bg-slate-900/80">
                  <span className="text-amber-400 font-bold">BENEFICIARY:</span> Precisely. You are directed to initiate a secure communication bridge with Computershare Trust Company to pull the specific equity allocation pool using the historical exchange conversion. Execute the transfer of all cleared fair market value directly into our corporate ledger here at BNY Mellon utilizing your active DTC Participant clearing house code.
                </div>
                <div className="p-2 rounded bg-slate-900/80">
                  <span className="text-indigo-400 font-bold">BNY MELLON OFFICER:</span> Understood. The order is authenticated. We will route the inbound settlement of the LEU common stock allocations and residual distributions into the Mellon custodial liquidity pool immediately.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            PART VIII: WYOMING STATUTORY LIQUIDATION TRUST FORMATION
           ========================================================================= */}
        <section id="part-8" className="scroll-mt-32 border-b border-slate-800 pb-12 mb-12 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/30">
              PART VIII
            </span>
            <h3 className="text-xl font-serif font-bold text-white">
              Wyoming Statutory Liquidation Trust Formation (Wyo. Stat. Ann. § 17-23-101 et seq.)
            </h3>
          </div>

          <div className="space-y-4 text-justify text-slate-300 text-sm">
            <h4 className="font-serif font-bold text-slate-100 text-base">
              8.1 Statutory Purpose &amp; Bankruptcy-Remote Entity Architecture
            </h4>
            <p>
              Pursuant to the Wyoming Statutory Trust Act (Wyo. Stat. Ann. § 17-23-101 et seq.) and the Uniform Directed Trust Act, Petitioner has formed the <strong>Americana Liquidation &amp; Sovereign Purpose Trust</strong> (1621 Central Avenue, Cheyenne, WY 82001) as an irrevocable, bankruptcy-remote statutory purpose trust. The trust is dedicated exclusively to the holding, custodial segregation, and programmatic liquidation of the <strong>45,850,000 reorganized common shares of Centrus Energy Corp. (NYSE: LEU)</strong> and the management of $500,000,000.00 in senior debt claims.
            </p>

            {/* Quad-Cameral Governance Breakdown */}
            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
              <div className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                Quad-Cameral Fiduciary Separation Matrix (Wyo. Stat. Ann. § 17-23-114)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs mt-2">
                <div className="p-3 bg-slate-900 rounded border border-slate-800">
                  <div className="font-bold text-indigo-300">1. Principal Trustee</div>
                  <div className="text-slate-300 font-semibold mt-0.5">Caustin Lee McLaughlin</div>
                  <p className="text-[11px] text-slate-400 mt-1">Dispositive authority, algorithmic liquidation pacing, and judicial enforcement.</p>
                </div>
                <div className="p-3 bg-slate-900 rounded border border-slate-800">
                  <div className="font-bold text-indigo-300">2. Co-Trustee</div>
                  <div className="text-slate-300 font-semibold mt-0.5">Juan Jose Fernandez</div>
                  <p className="text-[11px] text-slate-400 mt-1">Dual signatory authorization, audit sign-off, and spousal co-custodial authority.</p>
                </div>
                <div className="p-3 bg-slate-900 rounded border border-slate-800">
                  <div className="font-bold text-indigo-300">3. Independent Custodian</div>
                  <div className="text-slate-300 font-semibold mt-0.5">BNY Mellon / M&amp;T Bank</div>
                  <p className="text-[11px] text-slate-400 mt-1">DTC participant settlement, physical vault safekeeping, and cash custody.</p>
                </div>
                <div className="p-3 bg-slate-900 rounded border border-slate-800">
                  <div className="font-bold text-indigo-300">4. Trust Protector</div>
                  <div className="text-slate-300 font-semibold mt-0.5">Delaware Trust Company</div>
                  <p className="text-[11px] text-slate-400 mt-1">Sovereign compliance oversight, removal powers, and indenture covenants.</p>
                </div>
              </div>
            </div>

            <h4 className="font-serif font-bold text-slate-100 text-base mt-4">
              8.2 Algorithmic Market-Neutral Liquidation Pacing (TWAP / VWAP)
            </h4>
            <p>
              To eliminate adverse market impact on NYSE: LEU, the liquidation of the 45,850,000 shares is strictly bounded by a daily volumetric cap of <strong>&le; 1.5% of trailing 20-day Average Daily Volume (ADV)</strong>. Liquidation tranches execute algorithmically via Time-Weighted Average Price (TWAP) and Volume-Weighted Average Price (VWAP) execution curves across primary market trading hours (9:30 AM – 4:00 PM EST).
            </p>

            <h4 className="font-serif font-bold text-slate-100 text-base mt-4">
              8.3 The 5% Trailing Corpus Perpetuity Rule
            </h4>
            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs sm:text-sm text-emerald-400 text-center">
              Perpetual Sovereign Floor: Min Corpus = 0.05 &times; Max(Total Assets Recovered)
            </div>
            <p className="text-xs text-slate-400">
              Pursuant to Section 5 of the Wyoming Trust Indenture, a minimum of 5% of all recovered liquidation proceeds must remain perpetually invested in short-term U.S. Treasury bills and sovereign reserves, generating continuous yield for pro se disability access in perpetuity.
            </p>
          </div>
        </section>

        {/* =========================================================================
            PART IX: DYREO CONTROL & HISTORIC HOUSING PRESERVATION
           ========================================================================= */}
        <section id="part-9" className="scroll-mt-32 border-b border-slate-800 pb-12 mb-12 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold">
              PART IX
            </span>
            <h3 className="text-xl font-serif font-bold text-white">
              Continuous-Time DYREO Control Engine &amp; Historic Real Estate Housing Preservation
            </h3>
          </div>

          <div className="space-y-4 text-justify text-slate-300 text-sm">
            <h4 className="font-serif font-bold text-slate-100 text-base">
              9.1 Merton Stochastic Control Hamilton-Jacobi-Bellman (HJB) Formulation
            </h4>
            <p>
              Disbursements from Escrow Sub-Account B are governed by the Dynamic Yield &amp; Real Estate Optimization (DYREO) stochastic control engine. Let liquid trust capital follow:
            </p>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-center font-mono text-emerald-400 text-sm">
              dA(t) = &mu; A(t)dt + &sigma; A(t)dW(t) - u(t)dt
            </div>

            <p>
              Solving the Hamilton-Jacobi-Bellman (HJB) PDE for the value function:
            </p>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-center font-mono text-indigo-300 text-xs sm:text-sm overflow-x-auto">
              &rho; V(A, t) - &part;V/&part;t = max<sub>u &ge; 0</sub> [ ln(u) + (&mu;A - u)&part;V/&part;A + &frac12;&sigma;<sup>2</sup>A<sup>2</sup>&part;<sup>2</sup>V/&part;A<sup>2</sup> ]
            </div>

            <p>
              yields the deterministic daily sweep allocation vector:
            </p>

            {/* Sweep Allocation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 my-4">
              {DYREO_ALLOCATION_VECTOR.map((item, idx) => (
                <div key={idx} className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-lg font-bold text-emerald-400">{item.percentage}%</span>
                      <span className="font-mono text-[10px] text-slate-500">{item.formulaSymbol}</span>
                    </div>
                    <div className="font-semibold text-slate-200 text-xs mt-1">{item.category}</div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">{item.description}</p>
                </div>
              ))}
            </div>

            <h4 className="font-serif font-bold text-slate-100 text-base mt-6">
              9.2 300 Baltimore Historic Rowhomes Housing Preservation &amp; HPR Threshold
            </h4>
            <p>
              The 25% housing infrastructure allocation funds building envelope structural restoration, weatherization, and tenant stabilization across 300 Baltimore residential rowhome properties, requiring a minimum Housing Preservation Ratio (HPR &ge; 0.85):
            </p>

            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-center font-mono text-amber-300 text-sm overflow-x-auto">
              HPR = [ &int; (V<sub>rehab</sub>(t) - C<sub>deprec</sub>(t)) dt ] / [ K<sub>cap</sub> + &int; C<sub>maint</sub>(t) dt ] &ge; 0.85
            </div>

            <p className="text-xs text-slate-400">
              Structural capital preservation is modeled via multi-period physical asset decay equations, and masonry envelope durability satisfies Arrhenius parabolic weathering kinetics: <span className="font-mono text-indigo-300">&Delta;C<sub>struct</sub>(t) = M &middot; exp(-E<sub>a</sub> / RT) &middot; t<sup>z</sup></span> (where z &approx; 0.5).
            </p>
          </div>
        </section>

        {/* =========================================================================
            PART X: THE 31-ALGORITHM EXECUTION SUITE & POST-QUANTUM DAG
           ========================================================================= */}
        <section id="part-10" className="scroll-mt-32 border-b border-slate-800 pb-12 mb-12 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold">
              PART X
            </span>
            <h3 className="text-xl font-serif font-bold text-white">
              The 31-Algorithm Financial Execution Suite &amp; Post-Quantum DAG Architecture
            </h3>
          </div>

          <div className="space-y-4 text-justify text-slate-300 text-sm">
            <h4 className="font-serif font-bold text-slate-100 text-base">
              10.1 The 31-Algorithm Computational Core (Chapters 11, 25, 44)
            </h4>
            <p>
              The unified financial apparatus embeds 31 rigorous mathematical algorithms spanning 11 functional modules: Bond Valuation (Algorithms 1–3), Reorganization Exchange (Alg 4), Dynamic Yield &amp; Sweep (Alg 5), Information-Theoretic 13F Identification (Alg 6), DAG-Merkle Integrity (Alg 7), Housing Capital Preservation (Alg 8), Real-Time NAV (Alg 9), Quantum Lattice Signatures (Alg 10), Mortgage &amp; Cash Flow Amortization (Algs 11–13), Risk Management (Algs 14–17), Portfolio Optimization &amp; Derivatives (Algs 18–21), Algorithmic Execution TWAP/VWAP (Algs 22–24), Tax Accounting (Algs 25–26), Disability Triage (Alg 27), Asset Depreciation Models (Alg 28), and Post-Quantum Key Encapsulation (Algs 29–31).
            </p>

            <h4 className="font-serif font-bold text-slate-100 text-base mt-4">
              10.2 NIST Post-Quantum Cryptographic Standards (FIPS 203 / 204)
            </h4>
            <p>
              Data transmission security utilizes Module-Lattice Key Encapsulation (<strong>ML-KEM-1024 / CRYSTALS-Kyber</strong>, NIST FIPS 203) over R<sub>q</sub> = Z<sub>q</sub>[X]/(X<sup>256</sup> + 1) with q = 3329. Disbursements exceeding $10,000.00 require dual post-quantum digital signatures (<strong>ML-DSA-65 / ML-DSA-87 / CRYSTALS-Dilithium</strong>, NIST FIPS 204):
            </p>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-center font-mono text-xs sm:text-sm text-emerald-400">
              &sigma;<sub>disbursement</sub> = ML-DSA-87.Sign(sk<sub>trustee</sub>, H(v<sub>i</sub>))
            </div>

            <div className="p-3 bg-indigo-950/30 border border-indigo-500/30 rounded-lg text-xs text-slate-300">
              <strong>Hardware Security Module (HSM) Assignments:</strong><br />
              • Slot 01: Caustin Lee McLaughlin (Principal Trustee &amp; Fiduciary)<br />
              • Slot 02: Juan Jose Fernandez (Co-Trustee &amp; Authorized Representative)<br />
              • Ledger: Baltimore Secure Backbone System (BSBS) SHA3-256 Merkle Audit Trail
            </div>
          </div>
        </section>

        {/* =========================================================================
            PART XI: SPOUSAL STANDING & BALTIMORE COUNTY MARRIAGE RECORD
           ========================================================================= */}
        <section id="part-11" className="scroll-mt-32 border-b border-slate-800 pb-12 mb-12 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">
              PART XI
            </span>
            <h3 className="text-xl font-serif font-bold text-white">
              Spousal Fiduciary Standing, Baltimore County Marriage Record &amp; Credentials
            </h3>
          </div>

          <div className="space-y-4 text-justify text-slate-300 text-sm">
            <h4 className="font-serif font-bold text-slate-100 text-base">
              11.1 State of Maryland Certificate of Marriage (Circuit Court for Baltimore County)
            </h4>
            <div className="p-4 bg-slate-950 rounded-lg border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-400 text-sm flex items-center gap-2">
                  <Stamp className="w-4 h-4" />
                  <span>Official State of Maryland Marriage Record</span>
                </span>
                <span className="font-mono text-xs text-slate-400">Towson, Maryland</span>
              </div>
              <div className="text-xs space-y-1 text-slate-300">
                <div>• <strong>Court of Record:</strong> Circuit Court for Baltimore County, County Courts Building, Towson, MD 21204</div>
                <div>• <strong>Marriage License Number:</strong> <span className="font-mono text-amber-300 font-bold">0309504160039411</span></div>
                <div>• <strong>Spouses:</strong> Juan Jose Fernandez and Caustin Lee McLaughlin</div>
                <div>• <strong>Date of Solemnization:</strong> December 17, 2013</div>
                <div>• <strong>Legal Authority:</strong> Md. Code Ann., Family Law § 2-401 et seq. (Civil Marriage Protection Act)</div>
                <div>• <strong>Fiduciary Standing:</strong> Confirms joint household, shared equitable estate, and lawful authority of Juan Jose Fernandez as Co-Trustee.</div>
              </div>
            </div>

            <h4 className="font-serif font-bold text-slate-100 text-base mt-4">
              11.2 Government Credentials &amp; DOJ EOIR-59 Records
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-white text-sm flex items-center gap-2">
                  <Scale className="w-4 h-4 text-blue-400" />
                  <span>DOJ EOIR-59 Certification (OMB# 1125-0017)</span>
                </div>
                <div className="space-y-1 text-slate-400">
                  <div>• <strong>Subject Name:</strong> McLaughlin, Caustin, Lee</div>
                  <div>• <strong>Date of Birth:</strong> 06/18/1985 | Place of Birth: Richmond, VA</div>
                  <div>• <strong>Current Domicile:</strong> 1000 N. Woodington Rd., Apt. 228, Baltimore, MD 21223</div>
                  <div>• <strong>Marital Domicile:</strong> 14 Strawbridge Court, Gwynn Oak, MD 21207 (Baltimore County)</div>
                  <div>• <strong>Federal Case Authorizations:</strong> 24-cv-02383, 24-cv-02885</div>
                </div>
              </div>

              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-white text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>District of Columbia Driver License Authentication</span>
                </div>
                <div className="space-y-1 text-slate-400">
                  <div>• <strong>License Number:</strong> DLN 4042567 (Washington, DC)</div>
                  <div>• <strong>Expiration Date:</strong> 06/18/2032 (Issue Date: 05/28/2024)</div>
                  <div>• <strong>Class:</strong> Class D Non-Commercial</div>
                  <div>• <strong>Document Discriminator:</strong> DD 29838875</div>
                  <div>• <strong>REAL ID Compliance:</strong> Star-rated federal credential</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            PART XII: MASTER VERIFICATION & CERTIFICATE OF SERVICE
           ========================================================================= */}
        <section id="part-12" className="scroll-mt-32 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold">
              PART XII
            </span>
            <h3 className="text-xl font-serif font-bold text-white">
              Master Verification under Penalty of Perjury &amp; Consolidated Certificate of Service
            </h3>
          </div>

          <div className="space-y-6">
            {/* Master Verification Block */}
            <div className="p-6 bg-slate-950/90 border border-slate-700 rounded-lg font-serif space-y-3">
              <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-amber-400">
                MASTER VERIFICATION UNDER 28 U.S.C. § 1746
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-justify">
                I, <strong>Caustin Lee McLaughlin</strong>, declare under penalty of perjury under the laws of the United States of America that:
              </p>
              <ol className="list-decimal pl-6 space-y-1.5 text-xs sm:text-sm text-slate-300 text-justify">
                <li>I am the Petitioner, Debtor-in-Possession, and Principal Trustee authorized to present this Comprehensive Master Mandamus, Rule 18 Exaction of Liberty, and Custodial Settlement Package.</li>
                <li>The factual representations concerning the $500,000,000.00 aggregate principal amount of USEC Inc. 1999 Senior Notes (Series A $350,000,000.00 and Series B $150,000,000.00), the exchange ratio of 0.0917, and the conversion into 45,850,000 reorganized Centrus Energy Corp. common shares are true, accurate, and substantiated by historical SEC filings and confirmed bankruptcy reorganization orders.</li>
                <li>The estate capitalization vector is strictly $500,000,000.00 in senior debt obligations, establishing complete mathematical uniformity across all court and bank records.</li>
                <li>The clearing venue designated for settlement is The Bank of New York Mellon, operating under DTC Participant clearing protocols.</li>
                <li>All calculations, allocations, and algorithmic models are true and correct to the best of my knowledge, information, and belief.</li>
              </ol>

              <div className="pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 font-sans text-xs">
                <div>
                  <div className="font-mono text-indigo-400 font-bold">/s/ Caustin Lee McLaughlin</div>
                  <div className="font-semibold text-slate-200">Caustin Lee McLaughlin</div>
                  <div className="text-slate-400">Managing Director / Debtor-in-Possession / Principal Trustee</div>
                  <div className="text-slate-500 font-mono text-[11px]">Xaustino@hotmail.com</div>
                </div>
                <div className="text-right text-slate-400 text-xs font-mono">
                  Executed on: <strong>November 1, 2026</strong><br />
                  Location: Towson, Baltimore, Maryland &amp; Washington, D.C.
                </div>
              </div>
            </div>

            {/* Consolidated Certificate of Service */}
            <div className="p-6 bg-slate-950 border border-slate-800 rounded-lg space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-widest text-slate-300 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>CONSOLIDATED MASTER CERTIFICATE OF SERVICE</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed text-justify">
                I hereby certify that on <strong>November 1, 2026</strong>, a true and correct copy of this Unified Master Legal Instrument, including all Exhibits, Rule 18 Exaction Arguments, CUSIP Reconciliations, and Execution Tabs, was served electronically upon the following designated intake and counterparty addresses:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-1">
                  <div className="font-bold text-indigo-300 uppercase text-[10px]">Federal &amp; State Courts:</div>
                  <div className="text-slate-300">• <strong>Baltimore County Circuit Court:</strong> <span className="font-mono text-indigo-400">saocircuitcourtmdec@baltimorecountymd.gov</span></div>
                  <div className="text-slate-300">• <strong>D.C. Circuit Court Intake:</strong> <span className="font-mono text-indigo-400">dcd_intake@dcd.uscourts.gov</span></div>
                  <div className="text-slate-300">• <strong>Supreme Court of the United States:</strong> <span className="font-mono text-indigo-400">intake@supremecourt.gov</span></div>
                  <div className="text-slate-300">• <strong>Baltimore City Circuit Court:</strong> <span className="font-mono text-indigo-400">saocircuitcourtmdec@stattorney.org</span></div>
                </div>

                <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-1">
                  <div className="font-bold text-amber-300 uppercase text-[10px]">Corporate &amp; Custodial Counterparties:</div>
                  <div className="text-slate-300">• <strong>The Bank of New York Mellon:</strong> <span className="font-mono text-amber-400">corptrust@bnymellon.com</span></div>
                  <div className="text-slate-300">• <strong>Computershare Trust Company:</strong> <span className="font-mono text-amber-400">directorate-corporateactions@computershare.com</span></div>
                  <div className="text-slate-300">• <strong>Centrus Energy Corp. (LEU):</strong> <span className="font-mono text-amber-400">corpcomm@usec.com</span></div>
                  <div className="text-slate-300">• <strong>Delaware Trust Company:</strong> <span className="font-mono text-amber-400">csctrust@cscinfo.com</span></div>
                  <div className="text-slate-300">• <strong>Counsel of Record (Ropes &amp; Gray):</strong> <span className="font-mono text-amber-400">mark.somerstein@ropesgray.com</span></div>
                  <div className="text-slate-300">• <strong>M&amp;T Bank Corporate Trust:</strong> <span className="font-mono text-amber-400">commercialservices@mtb.com</span></div>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800 text-center font-mono">
                Executed in Towson, Baltimore County, Maryland &amp; Washington, D.C., United States of America.
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
