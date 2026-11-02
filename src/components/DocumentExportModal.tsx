import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  FileCode, 
  FileText, 
  FileSpreadsheet, 
  Terminal,
  ShieldCheck
} from 'lucide-react';
import { UNIFIED_DOCUMENT_METADATA } from '../data/unifiedDocumentData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentExportModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [format, setFormat] = useState<'markdown' | 'latex' | 'text'>('markdown');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const generateMarkdown = () => {
    return `# UNITED STATES COURT OF APPEALS FOR THE DISTRICT OF COLUMBIA CIRCUIT
## AND THE SUPREME COURT OF THE UNITED STATES
### In re Estate of Caustin Lee McLaughlin, Debtor-in-Possession / Petitioner
**D.C. Circuit Case No. 24-10492 | D.D.C. Case No. 24-2383 | SCOTUS Original Docket**
**Settlement Venue: The Bank of New York Mellon (Corporate Trust & DTC Participant Clearing)**

---

## OMNIBUS CONSOLIDATED PETITION FOR WRIT OF MANDAMUS, DECLARATORY RELIEF, EMERGENCY CUSTODIAL SETTLEMENT, AND SEC FORM 13F ASSET RECONCILIATION

### Execution Date: October 18, 2026
### Status: In Custodia Legis Asset (Subchapter V Chapter 11, Case No. 24-2383)
### Total Capitalization: $500,000,000.00 (Senior Notes 1999 Indenture)

---

### PART I: MASTER CAPITALIZATION VECTOR & SETTLEMENT ROUTING

1. **USEC Series A Senior Notes (6.625% due 01/20/2006)**
   - CUSIP: 917300AA1
   - Face Principal: $350,000,000.00
   - Converted LEU Common Stock (0.0917 Ratio): 32,095,000 Shares

2. **USEC Series B Senior Notes (6.750% due 01/20/2009)**
   - CUSIP: 917300AB9
   - Face Principal: $150,000,000.00
   - Converted LEU Common Stock (0.0917 Ratio): 13,755,000 Shares

**TOTAL ESTATE CAPITALIZATION VECTOR: $500,000,000.00**
**TOTAL REORGANIZED COMMON STOCK: 45,850,000 Common Shares of Centrus Energy Corp. (NYSE: LEU)**

#### Mandatory Settlement Endpoints:
- Primary Protocol Exchange Target URL: https://americana-digital-reserve-exchange.ai.studio/
- On-Chain Bitcoin Reserve Address: bc1q9f83b4ac1087e59871fa28419cb7891240c7
- M&T Bank DTC Depository Coordinates: ABA Routing: 022000046 | SWIFT: MANTUS33 | Account: Americana Digital Reserve LLC / PSDLEF Purpose Trust

---

### PART II: CAUSES OF ACTION & STATUTORY JURISDICTION

- **Jurisdiction:** 28 U.S.C. § 1331 (federal question), 28 U.S.C. § 1651(a) (All Writs Act), 28 U.S.C. §§ 2201–2202 (declaratory relief), 11 U.S.C. §§ 541 & 1186 (in custodia legis).
- **Count I — Declaratory Judgment:** Valid issuance and reorganization of $500M 1999 Indenture into 45,850,000 LEU shares.
- **Count II — Mandatory Accounting:** Directing BNY Mellon, Delaware Trust Co., and Computershare Trust Co. to render complete accounting of Class 4 distributions.
- **Count III — Peremptory Writ of Mandamus:** Compelling BNY Mellon and Computershare to execute direct electronic book-entry turnover.
- **Count IV — Specific Performance of Indenture:** Enforcing covenants pursuant to Trust Indenture Act of 1939 (15 U.S.C. § 77aaa et seq.).

---

### PART III: IN FORMA PAUPERIS & ADA TITLE II MANDATE
- Grounded under 28 U.S.C. § 1915, Md. Rule 1-325(e), and 42 U.S.C. § 12131 (Tennessee v. Lane).
- Cognitive Load Theory formulation: L_total = L_intrinsic + L_extraneous + L_germane <= C_capacity.

---

### PART IV: PROCEDURAL DUE PROCESS & INFORMATION-THEORETIC PROOF
- Mullane v. Central Hanover Bank & Trust Co., 339 U.S. 306 (1950); Mennonite Board of Missions v. Adams, 462 U.S. 791 (1983).
- Conditional probability: P(ID | S) = 1 - exp(-(|S| * ln(|G|)) / Omega_entropy) -> 1.0.

---

### PART V: SEC FORM 13F INSTITUTIONAL EVIDENCE
- PNC Financial Services Group, Inc. Q3 2002 13F-HR (Accession No. 0000898432-02-000752, File No. 28-1235).
- Confirmed CUSIPs 917300AA1 ($350M) and 917300AB9 ($150M) held in DTC Vault.

---

### PART VI: BNY MELLON CUSTODIAL DIRECTIVES
1. Pull legacy CUSIPs 917300AA1 and 917300AB9.
2. Convert into 45,850,000 LEU common shares via Computershare bridge.
3. Transmit to protocol URL and Bitcoin reserve address.
4. Establish co-custody with M&T Bank Corporate Trust (ABA: 022000046).

---

### PART VII: DYREO STOCHASTIC OPTIMAL CONTROL
- Hamilton-Jacobi-Bellman (HJB) formulation with deterministic daily sweep vector:
  [0.60 Treasury, 0.25 Housing Preservation SPV, 0.10 ADA Grant Pool, 0.05 Operational Reserve]
- 300 Baltimore Rowhomes Historic Housing Preservation: HPR >= 0.85.

---

### PART VIII: NIST POST-QUANTUM CRYPTOGRAPHY
- NIST FIPS 203: ML-KEM-1024 / Kyber
- NIST FIPS 204: ML-DSA-65 / Dilithium signatures for disbursements > $10,000.00
- Baltimore Secure Backbone System (BSBS) SHA3-256 Merkle Ledger.

---

### PART IX: FINANCIAL & TAX REPORTING PORTFOLIO
- August 2026 Monthly Custody Statement Shell
- Q3 2026 Net Asset Value (NAV) Workpaper Model: NAV = sum(Vi) + C + R - L - E
- 2025 Tax Documentation Framework: Form 1099-B & Schedule K-1 Intake Register

---

### PART X: EXECUTION PACKAGE (TABS A THROUGH I)
- Tab A: Master Authority Matrix & Signature Card (Dual ink signatures > $10k)
- Tab B: IRS Form W-9 Grantor Trust Certification
- Tab C: Certificate of Incumbency
- Tab D: BNY Mellon Trust / Custody Agreement
- Tab E: Automated Daily Sweep Authorization
- Tab F: Post-Quantum Cryptographic Access Agreement
- Tab G: DTC Clearing & Conversion Directive
- Tab H: Escrow Sub-Account B Rider
- Tab I: Official Notary Acknowledgment Pages (City of Baltimore, State of Maryland)

---

### PART XI: IDENTITY & CREDENTIAL SUBSTANTIATION
- Department of Justice EOIR-59 Certification (OMB# 1125-0017, Caustin Lee McLaughlin, DOB 06/18/1985)
- District of Columbia Driver License Authentication (DLN #4042567, Exp 06/18/2032)

---

### PART XII: MASTER VERIFICATION & CERTIFICATE OF SERVICE
I declare under penalty of perjury pursuant to 28 U.S.C. § 1746 that the foregoing is true, correct, and complete.

Executed on October 18, 2026 at Baltimore, Maryland & Washington, D.C.

/s/ Caustin Lee McLaughlin
Managing Director / Debtor-in-Possession / Principal Trustee
Xaustino@hotmail.com
`;
  };

  const generateLatex = () => {
    return `\\documentclass[11pt,letterpaper]{article}
\\usepackage[margin=1in]{geometry}
\\usepackage{amsmath,amssymb,amsfonts}
\\usepackage{booktabs}
\\usepackage{hyperref}

\\title{\\textbf{OMNIBUS CONSOLIDATED PETITION FOR WRIT OF MANDAMUS, DECLARATORY RELIEF, EMERGENCY CUSTODIAL SETTLEMENT, AND SEC FORM 13F ASSET RECONCILIATION}\\\\
\\large \\textit{United States Court of Appeals for the District of Columbia Circuit}\\\\
\\large \\textit{and The Bank of New York Mellon Corporate Trust}}
\\author{Caustin Lee McLaughlin, Debtor-in-Possession}
\\date{October 18, 2026}

\\begin{document}
\\maketitle

\\begin{abstract}
Unified master pleading and institutional depository directive harmonizing federal court mandamus demands (D.C. Circuit Docket No. 24-10492, D.D.C. Case No. 24-2383) and BNY Mellon DTC participant clearing, establishing total estate capitalization to \\$500,000,000.00 converting into 45,850,000 common shares of Centrus Energy Corp. (NYSE: LEU).
\\end{abstract}

\\section{Master Capitalization Vector}
\\begin{equation}
V_{\\text{estate}} = \\$350,000,000.00 + \\$150,000,000.00 = \\mathbf{\\$500,000,000.00}
\\end{equation}
\\begin{equation}
N_{\\text{shares}} = \\$500,000,000.00 \\times 0.0917 = \\mathbf{45,850,000\\text{ Common Shares (LEU)}}
\\end{equation}

\\section{DYREO Continuous Control Formulation}
\\begin{equation}
\\vec{D}(Y_t) = Y(t) \\cdot \\begin{bmatrix} 0.60 \\\\ 0.25 \\\\ 0.10 \\\\ 0.05 \\end{bmatrix}
\\end{equation}

\\section{Post-Quantum Cryptography}
Enforces NIST FIPS 203 (ML-KEM-1024) and NIST FIPS 204 (ML-DSA-65/87) digital signatures.

\\section{Verification}
Pursuant to 28 U.S.C. \\S\\,1746, I declare under penalty of perjury that the foregoing is true and correct.

\\bigskip
\\noindent /s/ Caustin Lee McLaughlin\\\\
Managing Director / Debtor-in-Possession\\\\
\\texttt{Xaustino@hotmail.com}

\\end{document}
`;
  };

  const contentToDisplay = format === 'markdown' ? generateMarkdown() : format === 'latex' ? generateLatex() : generateMarkdown();

  const handleCopy = () => {
    navigator.clipboard.writeText(contentToDisplay);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const extension = format === 'latex' ? 'tex' : format === 'markdown' ? 'md' : 'txt';
    const blob = new Blob([contentToDisplay], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BNY_Mellon_DC_Circuit_Unified_Master_Instrument.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in no-print">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm sm:text-base">
                Export Unified Master Legal & Custodial Instrument
              </h3>
              <p className="text-xs text-slate-400">
                Harmonized for BNY Mellon & D.C. Circuit Courts ($500,000,000.00 Capitalization)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector Tabs */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFormat('markdown')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                format === 'markdown'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              Markdown (.md)
            </button>
            <button
              onClick={() => setFormat('latex')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                format === 'latex'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              LaTeX (.tex)
            </button>
            <button
              onClick={() => setFormat('text')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                format === 'text'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              Plain Text (.txt)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>

        {/* Content Preview */}
        <div className="flex-1 p-5 overflow-y-auto bg-slate-950 font-mono text-xs text-slate-300">
          <pre className="whitespace-pre-wrap select-all leading-relaxed">
            {contentToDisplay}
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Harmonized & Ready for CM/ECF and DTC Participant Submission</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
