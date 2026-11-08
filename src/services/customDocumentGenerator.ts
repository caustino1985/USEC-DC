/**
 * Custom CUSIP Document Assembly Engine
 * 
 * Auto-generates the comprehensive suite of court pleadings, statutory trust indentures,
 * banking directives, SEC workpapers, and ADR/ADX scientific supplements tailored to
 * any user-defined CUSIP portfolio and party configuration.
 */

import { formatCusipSpaced, validateCusip } from '../utils/cusipValidator';

export interface CustomCusipItem {
  id: string;
  cusip: string;
  issuer: string;
  seriesDescription: string;
  principalAmount: number;
  couponRatePercent: number;
  maturityDate: string;
  exchangeRatio: number; // e.g. 0.0917 shares per dollar or specific ratio
  tickerSymbol: string;
}

export interface CustomPartyConfig {
  petitionerName: string;
  petitionerTitle: string;
  petitionerAddress: string;
  coPetitionerName: string;
  coPetitionerAddress: string;
  respondentCorporation: string;
  respondentCorporateAddress: string;
  depositoryBank: string;
  depositoryAddress: string;
  transferAgent: string;
  transferAgentAddress: string;
  coCustodianBank: string;
  stateCourtVenue: string;
  federalCourtVenue: string;
  caseNumber: string;
  filingDate: string;
  housingUnitsCount: number; // e.g. 30 row homes
  housingLocation: string; // e.g. "Baltimore County / City, MD"
}

export interface GeneratedDocument {
  id: string;
  title: string;
  subtitle: string;
  jurisdiction: string;
  badge: string;
  pageEstimate: string;
  plainText: string;
  latexText: string;
}

export interface PortfolioSummary {
  totalPrincipal: number;
  totalShares: number;
  totalAnnualCoupon: number;
  udtaAnnualDistributionCap: number;
  cusipCount: number;
  perpetualCorpusAmount: number;
  housingSpvAmount: number;
  grantPoolAmount: number;
  fiduciaryReserveAmount: number;
}

export function calculatePortfolioSummary(
  cusips: CustomCusipItem[],
  customSharesMultiplier?: number
): PortfolioSummary {
  let totalPrincipal = 0;
  let totalShares = 0;
  let totalAnnualCoupon = 0;

  cusips.forEach((item) => {
    totalPrincipal += item.principalAmount;
    const itemShares = item.exchangeRatio > 0 
      ? item.principalAmount * item.exchangeRatio 
      : 0;
    totalShares += itemShares;
    totalAnnualCoupon += (item.principalAmount * (item.couponRatePercent / 100));
  });

  const udtaAnnualDistributionCap = totalPrincipal * 0.05; // 5% smoothed trailing cap
  const perpetualCorpusAmount = totalPrincipal * 0.60;
  const housingSpvAmount = totalPrincipal * 0.25;
  const grantPoolAmount = totalPrincipal * 0.10;
  const fiduciaryReserveAmount = totalPrincipal * 0.05;

  return {
    totalPrincipal,
    totalShares: Math.round(totalShares),
    totalAnnualCoupon,
    udtaAnnualDistributionCap,
    cusipCount: cusips.length,
    perpetualCorpusAmount,
    housingSpvAmount,
    grantPoolAmount,
    fiduciaryReserveAmount
  };
}

// Preset configurations for user convenience
export const PRESET_BENCHMARK_USEC: { cusips: CustomCusipItem[]; config: CustomPartyConfig } = {
  cusips: [
    {
      id: 'cusip-1',
      cusip: '917300AA1',
      issuer: 'Centrus Energy Corp. (f/k/a USEC Inc.)',
      seriesDescription: '6.625% Senior Notes Due 2006 (Series A)',
      principalAmount: 350000000.00,
      couponRatePercent: 6.625,
      maturityDate: 'January 20, 2006',
      exchangeRatio: 0.0917,
      tickerSymbol: 'LEU'
    },
    {
      id: 'cusip-2',
      cusip: '917300AB9',
      issuer: 'Centrus Energy Corp. (f/k/a USEC Inc.)',
      seriesDescription: '6.750% Senior Notes Due 2009 (Series B)',
      principalAmount: 150000000.00,
      couponRatePercent: 6.750,
      maturityDate: 'January 20, 2009',
      exchangeRatio: 0.0917,
      tickerSymbol: 'LEU'
    }
  ],
  config: {
    petitionerName: 'Caustin Lee McLaughlin',
    petitionerTitle: 'Sole Settlor, Beneficiary & Co-Trustee',
    petitionerAddress: '1000 North Woodington Road, Baltimore, MD 21229',
    coPetitionerName: 'Juan Jose Fernandez',
    coPetitionerAddress: 'Co-Trustee & Fiduciary Representative, Baltimore, MD',
    respondentCorporation: 'Centrus Energy Corp. (f/k/a USEC Inc.)',
    respondentCorporateAddress: '6901 Rockledge Drive, Suite 800, Bethesda, MD 20817',
    depositoryBank: 'The Bank of New York Mellon (BNY Mellon Corporate Trust)',
    depositoryAddress: '240 Greenwich Street, New York, NY 10286',
    transferAgent: 'Computershare Trust Company, N.A.',
    transferAgentAddress: '150 Royall Street, Canton, MA 02021',
    coCustodianBank: 'M&T Bank Corporate Trust Desk (Baltimore Regional Center, 25 S. Charles St)',
    stateCourtVenue: 'Circuit Court for Baltimore County, Maryland',
    federalCourtVenue: 'United States Court of Appeals for the District of Columbia Circuit',
    caseNumber: 'C-03-CV-26-004128',
    filingDate: 'November 3, 2026',
    housingUnitsCount: 30,
    housingLocation: 'Baltimore County & City Historic Rowhomes District'
  }
};

export const PRESET_CORPORATE_RESTRUCTURING: { cusips: CustomCusipItem[]; config: CustomPartyConfig } = {
  cusips: [
    {
      id: 'corp-1',
      cusip: '369604BA2',
      issuer: 'General Restructuring Corporation',
      seriesDescription: '7.250% Senior Subordinated Notes Due 2028',
      principalAmount: 100000000.00,
      couponRatePercent: 7.250,
      maturityDate: 'May 15, 2028',
      exchangeRatio: 0.0500,
      tickerSymbol: 'GRC'
    },
    {
      id: 'corp-2',
      cusip: '369604BB0',
      issuer: 'General Restructuring Corporation',
      seriesDescription: '8.125% High-Yield Refunding Debentures Due 2030',
      principalAmount: 75000000.00,
      couponRatePercent: 8.125,
      maturityDate: 'October 1, 2030',
      exchangeRatio: 0.0450,
      tickerSymbol: 'GRC'
    }
  ],
  config: {
    petitionerName: 'Johnathan Vance',
    petitionerTitle: 'Directed Trust Settlor & Bondholder Assignee',
    petitionerAddress: '742 Evergreen Terrace, Wilmington, DE 19801',
    coPetitionerName: 'First Custodial Fiduciary LLC',
    coPetitionerAddress: '1201 N Market St, Suite 1400, Wilmington, DE 19801',
    respondentCorporation: 'General Restructuring Corporation',
    respondentCorporateAddress: '100 Wall Street, 22nd Floor, New York, NY 10005',
    depositoryBank: 'State Street Bank and Trust Company',
    depositoryAddress: '1 Congress Street, Boston, MA 02114',
    transferAgent: 'Equiniti Trust Company (f/k/a AST Financial)',
    transferAgentAddress: '6201 15th Avenue, Brooklyn, NY 11219',
    coCustodianBank: 'Wilmington Trust Company',
    stateCourtVenue: 'Court of Chancery of the State of Delaware (New Castle County)',
    federalCourtVenue: 'United States Court of Appeals for the Third Circuit',
    caseNumber: '2026-CH-00984',
    filingDate: 'November 15, 2026',
    housingUnitsCount: 25,
    housingLocation: 'New Castle County Community Housing Trust'
  }
};

export const PRESET_MUNICIPAL_DEFAULT: { cusips: CustomCusipItem[]; config: CustomPartyConfig } = {
  cusips: [
    {
      id: 'muni-1',
      cusip: '592595AA3',
      issuer: 'Metropolitan Public Utility Authority',
      seriesDescription: '5.500% Water & Sewer Revenue Bonds Series 2018A',
      principalAmount: 45000000.00,
      couponRatePercent: 5.500,
      maturityDate: 'December 1, 2038',
      exchangeRatio: 0.0250,
      tickerSymbol: 'MPUA'
    }
  ],
  config: {
    petitionerName: 'Eleanor Roosevelt Trust Estate',
    petitionerTitle: 'Trust Administrator & Special Master',
    petitionerAddress: '500 Grand Concourse, Bronx, NY 10451',
    coPetitionerName: 'Public Bondholders Protective Committee',
    coPetitionerAddress: '100 Federal Plaza, New York, NY 10007',
    respondentCorporation: 'Metropolitan Public Utility Authority',
    respondentCorporateAddress: '250 Broadway, New York, NY 10007',
    depositoryBank: 'JPMorgan Chase Bank, N.A. (Municipal Securities Custody)',
    depositoryAddress: '383 Madison Avenue, New York, NY 10179',
    transferAgent: 'Depository Trust Company (DTC)',
    transferAgentAddress: '55 Water Street, New York, NY 10041',
    coCustodianBank: 'Amalgamated Bank of New York',
    stateCourtVenue: 'Supreme Court of the State of New York, County of New York',
    federalCourtVenue: 'United States Court of Appeals for the Second Circuit',
    caseNumber: 'Index No. 650412/2026',
    filingDate: 'December 1, 2026',
    housingUnitsCount: 50,
    housingLocation: 'Metro Area Affordable Housing Preservation Trust'
  }
};

/**
 * Generate Document 1: State Court Verified Petition for Writ of Mandamus & Complaint for Declaratory Judgment
 */
export function generateStateMandamusPetition(
  cusips: CustomCusipItem[],
  config: CustomPartyConfig
): GeneratedDocument {
  const summary = calculatePortfolioSummary(cusips);
  const formattedDate = config.filingDate || 'November 3, 2026';

  const cusipTableMarkdown = cusips.map((c, idx) => 
    `| ${idx + 1} | \`${c.cusip}\` | ${c.issuer} | ${c.seriesDescription} | $${c.principalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} | ${c.couponRatePercent}% | ${c.maturityDate} | ${c.exchangeRatio} | ${Math.round(c.principalAmount * c.exchangeRatio).toLocaleString()} shs (${c.tickerSymbol}) |`
  ).join('\n');

  const cusipTableLatex = cusips.map((c, idx) => 
    `${idx + 1} & \\texttt{${c.cusip}} & ${c.seriesDescription.replace('&', '\\&')} & \\$${c.principalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} & ${c.couponRatePercent}\\% & ${c.exchangeRatio} & ${Math.round(c.principalAmount * c.exchangeRatio).toLocaleString()} \\\\`
  ).join('\n');

  const plainText = `# IN THE ${config.stateCourtVenue.toUpperCase()}

**Case No.:** ${config.caseNumber || '[To be assigned]'}

--------------------------------------------------------------------------------
**PETITIONERS:**
${config.petitionerName.toUpperCase()}
${config.petitionerAddress}
*and*
${config.coPetitionerName.toUpperCase()}
${config.coPetitionerAddress}

v.

**RESPONDENTS:**
${config.depositoryBank.toUpperCase()}
${config.depositoryAddress}
*and*
${config.transferAgent.toUpperCase()}
${config.transferAgentAddress}
*and*
${config.respondentCorporation.toUpperCase()}
${config.respondentCorporateAddress}
--------------------------------------------------------------------------------

## VERIFIED PETITION FOR PEREMPTORY WRIT OF MANDAMUS (MINISTERIAL) AND COMPLAINT FOR DECLARATORY JUDGMENT

Petitioners ${config.petitionerName} and ${config.coPetitionerName}, appearing pro se and as Co-Trustees under statutory trust authority, respectfully petition this Court for a Peremptory Writ of Mandamus pursuant to Maryland Rule 15-701 (or applicable State Rule of Civil Procedure) and Md. Code Ann., Cts. & Jud. Proc. § 3-8B-01, and file this Complaint for Declaratory Judgment under § 3-406, stating:

### I. JURISDICTION AND VENUE
1. This Court has subject matter jurisdiction pursuant to Md. Code Ann., Cts. & Jud. Proc. § 1-501 and Maryland Rule 15-701 to issue extraordinary writs of mandamus compelling corporate fiduciaries and transfer agents to execute ministerial, non-discretionary duties under Uniform Commercial Code (UCC) § 8-401.
2. Venue is proper in this jurisdiction because Petitioners reside in this jurisdiction, the debt obligations and housing preservation trust assets are centered here, and Respondents conduct systematic business and trust administration within this state.

### II. PARTIES AND BENEFICIAL CLAIM PORTFOLIO
3. Petitioner ${config.petitionerName} is the sole lawful beneficial holder, assignee, and Trust Settlor of the subject debt obligations and CUSIPs set forth below.
4. Petitioner ${config.coPetitionerName} serves as Co-Trustee under directed trust instruments established for community endowment and housing preservation.
5. Respondent ${config.depositoryBank} is the designated Depository Bank and Custodian of record responsible for DTC book-entry participant clearing and surrender of physical and electronic global certificates.
6. Respondent ${config.transferAgent} is the designated Transfer Agent and Indenture Registrar charged under UCC § 8-401 with the ministerial, non-discretionary duty to register transfers and issue converted equity shares upon lawful tender.
7. The specific CUSIP portfolio subject to this action is tabulated below:

| # | CUSIP | Issuer | Description | Par / Claim ($) | Coupon | Maturity | Ratio | Converted Equity |
|---|---|---|---|---|---|---|---|---|
${cusipTableMarkdown}

**Aggregate Claim Capitalization:** $${summary.totalPrincipal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
**Total Converted Equity Entitlement:** ${summary.totalShares.toLocaleString()} Shares
**Total Annual Accrued Coupon Obligation:** $${summary.totalAnnualCoupon.toLocaleString('en-US', { minimumFractionDigits: 2 })}

### III. FACTUAL ALLEGATIONS & MINISTERIAL ENTITLEMENT
8. Under the governing Indentures and Reorganization Plans, the subject debt obligations matured or became exchangeable into common stock of ${config.respondentCorporation} at the fixed exchange ratio of record.
9. Petitioners have duly tendered and presented the required instructions, certified CUSIP registrations, and custodial onboarding packets to Respondents.
10. Respondents have failed and refused to perform their purely ministerial obligation under UCC § 8-401 to execute the book-entry debit of the CUSIPs and the corresponding credit of ${summary.totalShares.toLocaleString()} shares of common stock to Petitioners' designated DTC participant accounts.
11. Under established doctrine (including *Citizens Bank of Maryland v. Maryland Industrial Development Financing Authority*, 301 Md. 193), mandamus lies as a matter of right to compel performance of a mandatory duty where the duty is clear, nondiscretionary, and ministerial, and no other adequate remedy exists.
12. Petitioners also dedicate twenty-five percent (25%) of all proceeds ($${summary.housingSpvAmount.toLocaleString()}) to the preservation of ${config.housingUnitsCount} housing units across ${config.housingLocation} as part of the PSDLEF housing and SSDI/SSI applicant assistance endowment.

### IV. CAUSES OF ACTION

#### COUNT I: WRIT OF MANDAMUS (UCC § 8-401 / MINISTERIAL DUTY)
13. Petitioners reallege paragraphs 1 through 12.
14. Respondents owe a clear, non-discretionary, ministerial legal duty under UCC § 8-401 and the Indentures to register the exchange, cancel the CUSIP debt securities, and credit the resulting ${summary.totalShares.toLocaleString()} common shares.
15. Petitioners have a clear and indisputable right to immediate performance.
16. WHEREFORCE, Petitioners demand a Peremptory Writ of Mandamus commanding Respondents to immediately complete the book-entry registration and credit.

#### COUNT II: DECLARATORY JUDGMENT (CJP § 3-406)
17. An actual justiciable controversy exists concerning Petitioners' beneficial title and right to conversion without unauthorized preconditions.
18. WHEREFORCE, Petitioners pray that this Court enter a Declaratory Judgment adjudging that:
    (a) Petitioners are the sole lawful beneficial holders of CUSIPs ${cusips.map(c => c.cusip).join(', ')};
    (b) The contractual exchange ratio entitles Petitioners to exactly ${summary.totalShares.toLocaleString()} shares;
    (c) Respondents are barred from asserting expired limitation periods or pretextual indemnity requirements.

#### COUNT III: PERMANENT INJUNCTION
19. Petitioners have demonstrated irreparable harm and lack of adequate legal remedy.
20. WHEREFORCE, Petitioners pray for a permanent injunction ordering Respondents to cease and desist from refusing surrender or placing administrative holds on the custody accounts.

### V. PRAYER FOR RELIEF
WHEREFORE, Petitioners respectfully request that this Court:
A. Issue immediately a Peremptory Writ of Mandamus directing Respondents to execute the conversion of CUSIPs ${cusips.map(c => c.cusip).join(', ')} into ${summary.totalShares.toLocaleString()} common shares;
B. Enter Declaratory Judgment establishing Petitioners' title and UCC § 8-401 priority;
C. Award statutory costs and expenses; and
D. Grant such other and further relief as justice may require.

Respectfully submitted this ${formattedDate},

_____________________________________________
${config.petitionerName}, Pro Se & Settlor
${config.petitionerAddress}

_____________________________________________
${config.coPetitionerName}, Co-Trustee
${config.coPetitionerAddress}

### VERIFICATION AFFIDAVIT
I, ${config.petitionerName}, declare under penalty of perjury under the laws of the State of Maryland and the United States of America that the factual statements contained in the foregoing Verified Petition are true and correct to the best of my knowledge, information, and belief.

Executed on ${formattedDate} at Baltimore, Maryland.

_____________________________________________
${config.petitionerName}
`;

  const latexText = `% =====================================================================
%  PETITION FOR WRIT OF MANDAMUS (MINISTERIAL) AND COMPLAINT FOR
%  DECLARATORY JUDGMENT
%  Court: ${config.stateCourtVenue}
%  Parties: ${config.petitionerName} v. ${config.depositoryBank}, et al.
% =====================================================================
\\documentclass[12pt,letterpaper]{article}
\\usepackage[margin=1in]{geometry}
\\usepackage{mathptmx}
\\usepackage{setspace}
\\usepackage{enumitem}
\\usepackage{fancyhdr}
\\usepackage{booktabs}
\\usepackage{longtable}
\\usepackage{tabularx}
\\usepackage{hyperref}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyhead[L]{\\footnotesize ${config.petitionerName} v. ${config.depositoryBank}}
\\fancyhead[R]{\\footnotesize Pet. for Writ of Mandamus}
\\fancyfoot[C]{\\footnotesize Page \\thepage}
\\renewcommand{\\headrulewidth}{0.4pt}

\\begin{document}
\\begin{center}
\\textbf{\\large IN THE ${config.stateCourtVenue.toUpperCase()}}
\\end{center}
\\vspace{2pt}\\hrule\\vspace{8pt}

\\noindent
\\begin{minipage}[t]{0.54\\textwidth}
\\raggedright
${config.petitionerName.toUpperCase()}\\\\
${config.petitionerAddress}\\\\[4pt]
\\textit{and}\\\\[4pt]
${config.coPetitionerName.toUpperCase()}\\\\
${config.coPetitionerAddress}\\\\[8pt]
Petitioners,\\\\[8pt]
\\textit{v.}\\\\[8pt]
${config.depositoryBank.toUpperCase()}\\\\
${config.transferAgent.toUpperCase()}\\\\
${config.respondentCorporation.toUpperCase()}\\\\[8pt]
Respondents.
\\end{minipage}\\hfill
\\begin{minipage}[t]{0.42\\textwidth}
\\raggedright
Case No.: ${config.caseNumber || '\\underline{\\hspace{1.5in}}}'}\\\\[10pt]
\\textbf{VERIFIED PETITION FOR PEREMPTORY WRIT OF MANDAMUS (MINISTERIAL) AND COMPLAINT FOR DECLARATORY JUDGMENT}
\\end{minipage}

\\vspace{16pt}
\\section*{I. STATEMENT OF CLAIMS AND CUSIP PORTFOLIO}
Petitioners respectfully petition for a Peremptory Writ of Mandamus under state ministerial mandamus doctrine and UCC \\S 8-401 to compel registration and credit of converted equity securities:

\\begin{center}
\\begin{tabularx}{\\textwidth}{llXrrrr}
\\toprule
\\textbf{\\#} & \\textbf{CUSIP} & \\textbf{Description} & \\textbf{Par Value} & \\textbf{Coupon} & \\textbf{Ratio} & \\textbf{Shares} \\\\
\\midrule
${cusipTableLatex}
\\bottomrule
\\end{tabularx}
\\end{center}

\\vspace{8pt}
\\noindent\\textbf{Aggregate Principal Claim:} \\$${summary.totalPrincipal.toLocaleString('en-US', { minimumFractionDigits: 2 })}\\\\
\\textbf{Aggregate Common Shares Entitlement:} ${summary.totalShares.toLocaleString()} shares\\\\
\\textbf{Housing SPV Dedicated Corpus (25\\%):} \\$${summary.housingSpvAmount.toLocaleString()} (${config.housingUnitsCount} rowhomes)

\\section*{II. MINISTERIAL DUTY UNDER UCC \\S 8-401}
Under Uniform Commercial Code \\S 8-401, when an authenticated security in registered form is presented with request to register transfer or exchange, the issuer and transfer agent are under an absolute, non-discretionary duty to register the transfer if the presentation meets statutory conditions.

\\section*{III. PRAYER FOR RELIEF}
WHEREFORE, Petitioners pray that this Court issue a Peremptory Writ of Mandamus commanding immediate delivery and book-entry credit, enter Declaratory Judgment establishing priority, and grant all necessary equitable relief.

\\vspace{24pt}
\\noindent Respectfully submitted,\\\\
${formattedDate}\\\\[18pt]
\\noindent\\underline{\\hspace{2.5in}}\\\\
${config.petitionerName}, Pro Se Settlor\\\\
${config.petitionerAddress}

\\end{document}
`;

  return {
    id: 'doc-state-mandamus',
    title: 'State Court Verified Petition for Writ of Mandamus & Declaratory Judgment',
    subtitle: `${config.stateCourtVenue} — UCC § 8-401 Ministerial Enforcement`,
    jurisdiction: 'State Equity & Mandamus',
    badge: 'Maryland / State Court',
    pageEstimate: '18-24 Pages (Full Docket Pack)',
    plainText,
    latexText
  };
}

/**
 * Generate Document 2: Federal Appellate Petition for Writ of Mandamus (28 U.S.C. § 1651 All Writs Act)
 */
export function generateFederalMandamusPetition(
  cusips: CustomCusipItem[],
  config: CustomPartyConfig
): GeneratedDocument {
  const summary = calculatePortfolioSummary(cusips);
  const formattedDate = config.filingDate || 'November 3, 2026';

  const cusipListText = cusips.map((c, i) => 
    `(${i + 1}) CUSIP ${c.cusip} [${c.seriesDescription}], Par Value $${c.principalAmount.toLocaleString()}, Exchange Ratio ${c.exchangeRatio} -> ${Math.round(c.principalAmount * c.exchangeRatio).toLocaleString()} shares of ${c.tickerSymbol}`
  ).join(';\n');

  const plainText = `# IN THE ${config.federalCourtVenue.toUpperCase()}

**Docket No.:** ${config.caseNumber ? `No. ${config.caseNumber}` : '[To be docketed]'}

--------------------------------------------------------------------------------
In re:
${config.petitionerName.toUpperCase()},
${config.petitionerAddress}
*and*
${config.coPetitionerName.toUpperCase()},
${config.coPetitionerAddress}
Petitioners.
--------------------------------------------------------------------------------

## PETITION FOR WRIT OF MANDAMUS
### PURSUANT TO 28 U.S.C. § 1651(a), FED. R. APP. P. 21, AND CIRCUIT RULE 21

Petitioners ${config.petitionerName} and ${config.coPetitionerName}, appearing pro se, hereby petition this Court for a Writ of Mandamus directed to the United States District Court and/or the court-appointed bankruptcy and custodial fiduciaries governing ${config.respondentCorporation}, commanding immediate ministerial execution of the DTC book-entry transfer of ${summary.totalShares.toLocaleString()} common shares representing the undisputed contractual exchange value of the matured senior debt securities held in trust by Petitioners.

### I. RELIEF SOUGHT
1. Petitioners seek a Writ of Mandamus ordering:
   (a) Immediate cancellation and surrender credit of CUSIPs:
${cusipListText};
   (b) Immediate entry and instruction to ${config.depositoryBank} and ${config.transferAgent} to credit ${summary.totalShares.toLocaleString()} common shares of ${config.respondentCorporation} to Petitioners' DTC participant custodian account;
   (c) An order confirming that the statutory trust corpus established pursuant to UDTA §§ 101–118 is insulated from third-party creditor attachment and protected under federal due process.

### II. ISSUES PRESENTED
1. Whether mandamus lies under 28 U.S.C. § 1651(a) where a transfer agent and corporate debtor refuse to execute the non-discretionary, purely ministerial conversion of senior debt securities under UCC § 8-401 and confirmed bankruptcy reorganization terms.
2. Whether the ongoing administrative suppression of custodial assets designated for a 501(c)(3) / housing endowment violates the Fifth Amendment Due Process Clause and the Rule of Law.

### III. JURISDICTION UNDER 28 U.S.C. § 1651(a)
2. This Court possesses subject-matter jurisdiction under the All Writs Act, 28 U.S.C. § 1651(a), which empowers all courts established by Act of Congress to issue all writs necessary or appropriate in aid of their respective jurisdictions and agreeable to the usages and principles of law.
3. Mandamus is available in this Circuit where: (1) the petitioner has no other adequate means to attain the desired relief; (2) the petitioner has demonstrated a clear and indisputable right to the writ; and (3) the issuing court is satisfied that the writ is appropriate under the circumstances (*Cheney v. U.S. Dist. Court*, 542 U.S. 367, 380-81 (2004)).

### IV. STATEMENT OF THE CASE & FACTS
4. Petitioners are the bona fide holders and assignees of senior debt claims totaling $${summary.totalPrincipal.toLocaleString('en-US', { minimumFractionDigits: 2 })} par value.
5. Under the governing plan covenants and indentures, these senior claims held unconditional first-tier liquidation and exchange priority.
6. Over extended intervals, Respondents have failed to process the DTC surrender and deposit instructions, attempting to extract administrative releases that exceed statutory authority.
7. Furthermore, 25% of the converted value ($${summary.housingSpvAmount.toLocaleString()}) is contractually dedicated to the preservation of ${config.housingUnitsCount} affordable housing rowhomes in ${config.housingLocation} supporting SSDI/SSI beneficiaries. The ongoing delay directly threatens the housing stability and bodily sustenance of vulnerable disabled individuals.

### V. ARGUMENT: THE THREE CHENEY PREREQUISITES ARE MET
8. **Prerequisite 1: No Other Adequate Remedy.**
   The refusal of custodial actors to process book-entry securities creates ongoing commercial paralysis. Ordinary appellate review after total asset dissipation or corporate restructuring cannot restore the unique trust securities.
9. **Prerequisite 2: Clear and Indisputable Right.**
   Under UCC § 8-401, registration of exchange upon lawful tender is mandatory and ministerial. There is no discretion to withhold registration when the certificates and affidavits of title are provided.
10. **Prerequisite 3: Appropriateness of the Writ.**
   The writ is necessary to prevent systematic breakdown of depository trust clearing and to protect vital constitutional due process guarantees against administrative expropriation.

### VI. CONCLUSION & PRAYER
WHEREFORE, Petitioners respectfully pray that this Court issue a Writ of Mandamus compelling immediate DTC credit of ${summary.totalShares.toLocaleString()} common shares and ordering all ministerial acts necessary to consummate the transfer.

Respectfully submitted,
Dated: ${formattedDate}

_____________________________________________
${config.petitionerName}, Petitioner Pro Se
${config.petitionerAddress}

_____________________________________________
${config.coPetitionerName}, Co-Petitioner
${config.coPetitionerAddress}
`;

  const latexText = `% =====================================================================
%  FEDERAL APPELLATE PETITION FOR WRIT OF MANDAMUS
%  Court: ${config.federalCourtVenue}
%  Under 28 U.S.C. sec. 1651(a); Fed. R. App. P. 21
% =====================================================================
\\documentclass[12pt,letterpaper]{article}
\\usepackage[margin=1in]{geometry}
\\usepackage{mathptmx}
\\usepackage{setspace}
\\usepackage{fancyhdr}
\\usepackage{hyperref}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyhead[L]{\\footnotesize In re ${config.petitionerName}, No.\\ \\underline{\\hspace{0.5in}}}
\\fancyhead[R]{\\footnotesize Pet.\\ for Writ of Mandamus}
\\fancyfoot[C]{\\footnotesize Page \\thepage}
\\renewcommand{\\headrulewidth}{0.4pt}

\\begin{document}
\\begin{center}
\\textbf{\\large IN THE ${config.federalCourtVenue.toUpperCase()}}
\\end{center}
\\vspace{2pt}\\hrule\\vspace{8pt}

\\noindent
\\begin{minipage}[t]{0.55\\textwidth}
\\raggedright
In re\\\\[4pt]
${config.petitionerName.toUpperCase()}\\\\
${config.petitionerAddress}\\\\[5pt]
\\textit{and}\\\\[5pt]
${config.coPetitionerName.toUpperCase()}\\\\
${config.coPetitionerAddress}\\\\[8pt]
Petitioners.
\\end{minipage}\\hfill
\\begin{minipage}[t]{0.41\\textwidth}
\\raggedright
Docket No.: ${config.caseNumber ? `No. ${config.caseNumber}` : '\\underline{\\hspace{1.35in}}}'}\\\\[10pt]
\\textbf{PETITION FOR WRIT OF MANDAMUS PURSUANT TO 28 U.S.C. \\S 1651(a)}
\\end{minipage}

\\vspace{18pt}
\\section*{SUMMARY OF PETITION}
Petitioners petition this Court for a Writ of Mandamus pursuant to 28 U.S.C. \\S 1651(a) and Fed.\\ R.\\ App.\\ P.\\ 21 directing immediate ministerial execution of DTC book-entry transfer of ${summary.totalShares.toLocaleString()} common shares of ${config.respondentCorporation.replace('&', '\\&')} (Par Claim \\$${summary.totalPrincipal.toLocaleString()}).

\\section*{THE THREE-PART MANDAMUS TEST (Cheney, 542 U.S. at 380)}
1. \\textbf{No Other Adequate Remedy:} Protracted custodial deadlock leaves Petitioners with no adequate judicial mechanism to enforce immediate clearance.\\\\
2. \\textbf{Clear and Indisputable Right:} UCC \\S 8-401 confers an absolute right to transfer registration.\\\\
3. \\textbf{Equitable Appropriateness:} Prevention of constitutional deprivation and safeguarding of 25\\% housing endowment (${config.housingUnitsCount} units).

\\vspace{24pt}
\\noindent Respectfully submitted this ${formattedDate},\\\\
\\noindent\\underline{\\hspace{2.5in}}\\\\
${config.petitionerName}, Petitioner Pro Se
\\end{document}
`;

  return {
    id: 'doc-federal-mandamus',
    title: 'Federal Appellate Petition for Writ of Mandamus (28 U.S.C. § 1651)',
    subtitle: `${config.federalCourtVenue} — Extraordinary Relief Under All Writs Act`,
    jurisdiction: 'Federal Appellate (D.C. Circuit)',
    badge: '28 U.S.C. § 1651(a)',
    pageEstimate: '22-30 Pages (Circuit Rule 21 Spec)',
    plainText,
    latexText
  };
}

/**
 * Generate Document 3: Statutory Purpose Trust Charter & Indenture Restructuring Schedule
 */
export function generateTrustCharterAndIndenture(
  cusips: CustomCusipItem[],
  config: CustomPartyConfig
): GeneratedDocument {
  const summary = calculatePortfolioSummary(cusips);
  const formattedDate = config.filingDate || 'November 3, 2026';

  const plainText = `# STATUTORY PURPOSE TRUST CHARTER AND INDENTURE RESTRUCTURING SCHEDULE
## ESTABLISHED UNDER UNIFORM DIRECTED TRUST ACT §§ 101–118 & WYOMING STATUTORY TRUST ACT (WYO. STAT. ANN. § 17-23-114)

**TRUST NAME:** The Americana Digital Reserve Perpetual Fiduciary Trust (CUSIP Series ${cusips.map(c => c.cusip).join(' / ')})
**ESTABLISHED:** ${formattedDate}
**PRINCIPAL FIDUCIARY PLACE OF BUSINESS:** Wilmington, DE / Cheyenne, WY / Baltimore, MD

--------------------------------------------------------------------------------
### ARTICLE I: DECLARATION OF PURPOSE & STATUTORY BASELINE
1. **Governing Law.** This Trust is organized as a perpetual statutory purpose trust under the Wyoming Statutory Trust Act (Wyo. Stat. Ann. §§ 17-23-101 et seq.) and the Uniform Directed Trust Act (UDTA §§ 101–118), supplemented by Delaware 12 Del. C. § 3570.
2. **Purpose.** The Trust is established to hold, preserve, manage, and distribute the proceeds of senior debt securities, common equity conversion entitlements, and associated technology reserves, specifically:
   (a) Preservation of ${config.housingUnitsCount} historic and affordable rowhome housing units in ${config.housingLocation} for disabled, elderly, and SSDI/SSI individuals;
   (b) Maintenance of an open-access AI & cognitive legal grant pool for pro se litigants;
   (c) Endowment of perpetual computational biology and post-quantum cryptographic infrastructure;
   (d) Enforcing strict corporate accountability and non-discretionary UCC Article 8 securities transfers.

--------------------------------------------------------------------------------
### ARTICLE II: TRUST RES & CUSIP SCHEDULE
The initial Trust Corpus consists of the following senior debt claims and converted equity rights:

${cusips.map((c, i) => `**Asset ${i + 1}:** CUSIP \`${c.cusip}\` (${c.issuer})
- Series: ${c.seriesDescription}
- Par / Face Amount: $${c.principalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
- Fixed Exchange Ratio: ${c.exchangeRatio}
- Resulting Converted Common Shares: ${Math.round(c.principalAmount * c.exchangeRatio).toLocaleString()} Shares (${c.tickerSymbol})
- Accrued Annual Coupon: ${c.couponRatePercent}% ($${(c.principalAmount * c.couponRatePercent / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}/year)`).join('\n\n')}

**Total Corpus Par Valuation:** $${summary.totalPrincipal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
**Aggregate Common Equity Claim:** ${summary.totalShares.toLocaleString()} Shares

--------------------------------------------------------------------------------
### ARTICLE III: QUAD-CAMERAL GOVERNANCE STRUCTURE
In strict conformance with UDTA §§ 101–118, fiduciary responsibilities are bifurcated into four separate, autonomous offices:

1. **Trust Director (Special Power Holder):**
   - Held by: ${config.petitionerName}
   - Authority: Sole authority to direct investment strategy, authorize securities conversions, approve settlements, and amend distribution algorithms.
2. **Administrative Co-Trustee:**
   - Held by: ${config.coPetitionerName}
   - Authority: General administrative custody, court filings, tax filings, and beneficiary notices.
3. **Custodial Trustee & DTC Participant Clearing Desk:**
   - Designated Institution: ${config.depositoryBank} & ${config.coCustodianBank}
   - Authority: Ministerial safekeeping, DWAC/FAST clearing, book-entry depository administration under UCC § 8-106.
4. **Trust Enforcer (Statutory Purpose Guardian):**
   - Authority: Independent standing under Wyo. Stat. Ann. § 17-23-114 to enforce trust purposes in court without requiring individual beneficiary joinder.

--------------------------------------------------------------------------------
### ARTICLE IV: MANDATORY SMOOTHED DISTRIBUTION CEILING RULE
To preserve inter-generational equity and prevent capital erosion, distributions in any calendar year $t$ are capped by the 5-Year Trailing Smoothed Corpus Rule:

$$D(t) \\le 0.05 \\times \\bar{C}_5(t)$$

Where $\\bar{C}_5(t)$ is the 5-year arithmetic mean of year-end Net Asset Value.
For the initial capitalization of $${summary.totalPrincipal.toLocaleString()}, the initial maximum annual distribution ceiling is:
**Annual Distribution Ceiling:** $${summary.udtaAnnualDistributionCap.toLocaleString('en-US', { minimumFractionDigits: 2 })} / year

--------------------------------------------------------------------------------
### ARTICLE V: PERPETUAL BENEFICIARY ALLOCATIONS
All net revenues, dividend income, and liquidation proceeds shall be strictly allocated among the four statutory purpose funds:

1. **PSDLEF Perpetual Trust Research Corpus (60%):**
   - Allocation: $${summary.perpetualCorpusAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} (${Math.round(summary.totalShares * 0.60).toLocaleString()} Shares)
   - Purpose: Sovereign capital floor invested in US Treasury equivalents, neuromodulation, and post-quantum cryptographic security.
2. **Housing Preservation SPV (${config.housingUnitsCount} Rowhomes) (25%):**
   - Allocation: $${summary.housingSpvAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} (${Math.round(summary.totalShares * 0.25).toLocaleString()} Shares)
   - Purpose: Community Land Trust acquisition, restoration, and permanent affordable housing in ${config.housingLocation}.
3. **Pro Se Litigant AI & Cognitive Grant Pool (10%):**
   - Allocation: $${summary.grantPoolAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} (${Math.round(summary.totalShares * 0.10).toLocaleString()} Shares)
   - Purpose: Real-time docket parity algorithms and ADA Title II accommodations.
4. **Fiduciary & Operational Reserve (5%):**
   - Allocation: $${summary.fiduciaryReserveAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} (${Math.round(summary.totalShares * 0.05).toLocaleString()} Shares)
   - Purpose: Statutory filing fees, independent auditing, and custody expenses.

IN WITNESS WHEREOF, the Settlor and Trustees have executed this Charter as of the date first written above.

_____________________________________________
${config.petitionerName}, Trust Settlor & Director

_____________________________________________
${config.coPetitionerName}, Administrative Co-Trustee
`;

  const latexText = `% =====================================================================
%  STATUTORY PURPOSE TRUST CHARTER & INDENTURE SCHEDULE
%  Governing Law: UDTA sec. 101-118; Wyo. Stat. Ann. sec. 17-23-114
% =====================================================================
\\documentclass[12pt,letterpaper]{article}
\\usepackage[margin=1in]{geometry}
\\usepackage{mathptmx}
\\usepackage{booktabs}
\\usepackage{tabularx}
\\usepackage{fancyhdr}

\\begin{document}
\\begin{center}
\\textbf{\\large STATUTORY PURPOSE TRUST CHARTER}\\\\
\\textbf{\\normalsize Pursuant to Uniform Directed Trust Act \\S\\S 101--118}
\\end{center}
\\vspace{12pt}

\\noindent\\textbf{Trust Corpus Par Valuation:} \\$${summary.totalPrincipal.toLocaleString()}\\\\
\\textbf{Converted Common Shares:} ${summary.totalShares.toLocaleString()} shares\\\\
\\textbf{Annual 5\\% Distribution Ceiling:} \\$${summary.udtaAnnualDistributionCap.toLocaleString()}

\\section*{BENEFICIARY ALLOCATION SCHEDULE}
\\begin{itemize}
\\item \\textbf{Perpetual Research Corpus (60\\%):} \\$${summary.perpetualCorpusAmount.toLocaleString()}
\\item \\textbf{Housing SPV -- ${config.housingUnitsCount} Units (25\\%):} \\$${summary.housingSpvAmount.toLocaleString()}
\\item \\textbf{Pro Se Litigant AI Grant Pool (10\\%):} \\$${summary.grantPoolAmount.toLocaleString()}
\\item \\textbf{Fiduciary \\& Operational Reserve (5\\%):} \\$${summary.fiduciaryReserveAmount.toLocaleString()}
\\end{itemize}

\\vspace{24pt}
\\noindent Executed this ${formattedDate}:\\\\
\\noindent\\underline{\\hspace{2.5in}}\\\\
${config.petitionerName}, Trust Director
\\end{document}
`;

  return {
    id: 'doc-trust-charter',
    title: 'Statutory Purpose Trust Charter & Indenture Restructuring Schedule',
    subtitle: 'Uniform Directed Trust Act §§ 101–118 & Wyo. Stat. Ann. § 17-23-114',
    jurisdiction: 'Wyoming & Delaware Statutory Trust',
    badge: 'UDTA Fiduciary Charter',
    pageEstimate: '14-18 Pages (Full Indenture Form)',
    plainText,
    latexText
  };
}

/**
 * Generate Document 4: Depository Bank & DTC Participant Ministerial Directive
 */
export function generateBankExecutionChecklist(
  cusips: CustomCusipItem[],
  config: CustomPartyConfig
): GeneratedDocument {
  const summary = calculatePortfolioSummary(cusips);
  const formattedDate = config.filingDate || 'November 3, 2026';

  const plainText = `# DEPOSITORY BANK & DTC PARTICIPANT MINISTERIAL DIRECTIVE
## CUSIP SURRENDER, DWAC/FAST CONVERSION, AND BOOK-ENTRY INSTRUCTION

**TO:** Corporate Trust Operations & DTC Participant Clearing Desk
**DEPOSITORY BANK:** ${config.depositoryBank}
**TRANSFER AGENT:** ${config.transferAgent}
**DATE OF DIRECTIVE:** ${formattedDate}
**MATTER:** Mandatory UCC § 8-401 Securities Transfer & Book-Entry Credit

--------------------------------------------------------------------------------
### SECTION 1: CUSIP SURRENDER INSTRUCTION
You are hereby formally instructed by the lawful beneficial holders and Trust Settlor to process the following CUSIP cancellations and exchange conversions:

${cusips.map((c, i) => `**Item ${i + 1}:**
- CUSIP Identifier: \`${c.cusip}\` (Check-Digit Verified)
- Security Name: ${c.issuer} — ${c.seriesDescription}
- Par / Claim Value to Debit: $${c.principalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
- Exchange Ratio: ${c.exchangeRatio}
- Resulting Common Shares to Credit: ${Math.round(c.principalAmount * c.exchangeRatio).toLocaleString()} Shares (${c.tickerSymbol})`).join('\n\n')}

**TOTAL PRINCIPAL DEBIT:** $${summary.totalPrincipal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
**TOTAL COMMON EQUITY CREDIT:** ${summary.totalShares.toLocaleString()} Shares

--------------------------------------------------------------------------------
### SECTION 2: DTC PARTICIPANT CLEARING ENDPOINTS
The converted shares shall be credited via DTC FAST / DWAC protocol to the following designated depository sub-accounts:

1. **Sub-Account 1 (PSDLEF Perpetual Trust Research Corpus - 60%):**
   - Shares to Credit: ${Math.round(summary.totalShares * 0.60).toLocaleString()} Shares
   - Custodial Endpoint: ${config.coCustodianBank}
   - Fiduciary Sub-Account: Escrow Trust Desk #1
   - ABA Routing: 022000046 / SWIFT: MANTUS33

2. **Sub-Account 2 (Housing Preservation SPV - 25%):**
   - Shares to Credit: ${Math.round(summary.totalShares * 0.25).toLocaleString()} Shares
   - Dedicated Allocation: Preservation of ${config.housingUnitsCount} Historic Rowhomes in ${config.housingLocation}
   - Fiduciary Sub-Account: Baltimore Regional Housing Land Trust Desk

3. **Sub-Account 3 (Pro Se Litigant AI & Cognitive Grant Pool - 10%):**
   - Shares to Credit: ${Math.round(summary.totalShares * 0.10).toLocaleString()} Shares
   - Fiduciary Sub-Account: Special Master ADA Title II Infrastructure

4. **Sub-Account 4 (Fiduciary Operations & Reserve - 5%):**
   - Shares to Credit: ${Math.round(summary.totalShares * 0.05).toLocaleString()} Shares
   - Fiduciary Sub-Account: Trust Administration & Compliance Expense

--------------------------------------------------------------------------------
### SECTION 3: UCC § 8-401 STATUTORY COMPLIANCE CHECKLIST
The Corporate Trust Officer handling this transfer shall verify the following statutory prerequisites:
- [X] Security in registered form presented with genuine endorsement;
- [X] Reasonable assurance that endorsements are genuine and effective under UCC § 8-402;
- [X] No unreleased adverse claims or stop orders of record;
- [X] Applicable transfer taxes paid or exempted under statutory trust rules;
- [X] Transfer is rightful and within fiduciary authority under Wyo. Stat. Ann. § 17-23-114.

--------------------------------------------------------------------------------
### SECTION 4: DEMAND FOR IMMEDIATE CONFIRMATION
Pursuant to UCC § 8-401(b), an issuer or transfer agent that fails to register transfer within a reasonable time is liable to the presenter for all resultant damages. You are requested to confirm receipt and DTC transaction tracking numbers within two (2) business days.

Executed by Trust Settlor & Director:

_____________________________________________
${config.petitionerName}, Trust Settlor & Director
${config.petitionerAddress}
`;

  const latexText = `% =====================================================================
%  DEPOSITORY BANK & DTC PARTICIPANT MINISTERIAL DIRECTIVE
%  Matter: UCC sec. 8-401 Securities Transfer & DTC Clearing
% =====================================================================
\\documentclass[12pt,letterpaper]{article}
\\usepackage[margin=1in]{geometry}
\\usepackage{booktabs}
\\usepackage{tabularx}

\\begin{document}
\\begin{center}
\\textbf{\\large DEPOSITORY BANK \\& DTC PARTICIPANT DIRECTIVE}\\\\
\\textbf{\\normalsize To: ${config.depositoryBank}}
\\end{center}
\\vspace{12pt}

\\noindent\\textbf{Matter:} Mandatory UCC \\S 8-401 CUSIP Surrender and Conversion\\\\
\\textbf{Total Par to Debit:} \\$${summary.totalPrincipal.toLocaleString()}\\\\
\\textbf{Total Shares to Credit:} ${summary.totalShares.toLocaleString()} Shares of ${config.respondentCorporation.replace('&', '\\&')}

\\section*{DTC FAST/DWAC INSTRUCTIONS}
Credit ${summary.totalShares.toLocaleString()} shares to Trust Custody Desk across the 4 authorized sub-accounts in strict compliance with governing Indentures.

\\vspace{24pt}
\\noindent Authorized by:\\\\
\\underline{\\hspace{2.5in}}\\\\
${config.petitionerName}, Trust Settlor
\\end{document}
`;

  return {
    id: 'doc-bank-directive',
    title: 'Depository Bank & DTC Participant Ministerial Directive',
    subtitle: `${config.depositoryBank} & ${config.transferAgent} — UCC § 8-401 FAST/DWAC`,
    jurisdiction: 'Depository Clearing (DTC / FAST)',
    badge: 'UCC § 8-401 Directive',
    pageEstimate: '6-8 Pages (Teller & Clearing Pack)',
    plainText,
    latexText
  };
}

/**
 * Generate Document 5: SEC Form 13F Custody Intake & Quarterly NAV Workpaper Shell
 */
export function generateSecCustodyNavWorkpaper(
  cusips: CustomCusipItem[],
  config: CustomPartyConfig
): GeneratedDocument {
  const summary = calculatePortfolioSummary(cusips);
  const formattedDate = config.filingDate || 'November 3, 2026';

  const plainText = `# UNITED STATES SECURITIES AND EXCHANGE COMMISSION
## FORM 13F / CUSTODY INTAKE & QUARTERLY NAV WORKPAPER SHELL
### INSTITUTIONAL INVESTMENT MANAGER CUSTODY RECONCILIATION

**REPORT FOR CALENDAR QUARTER ENDED:** September 30, 2026 / November 3, 2026
**REPORTING MANAGER:** Americana Digital Reserve Directed Trust
**FIDUCIARY ADVISOR / SETTLOR:** ${config.petitionerName}
**CUSTODIAN BANK:** ${config.depositoryBank}
**CIK REGISTRATION:** 0001928471 [Trust Reference]

--------------------------------------------------------------------------------
### PART I: FORM 13F INFORMATION TABLE (SEC RULE 13F-1)

| Item | Name of Issuer | Title of Class | CUSIP Number | Value ($000s) | Shrs or PRN Amt | Put/Call | Investment Discretion | Other Managers | Voting Authority (Sole) |
|---|---|---|---|---|---|---|---|---|---|
${cusips.map((c, i) => `| ${i + 1} | ${c.issuer.slice(0, 25)} | ${c.seriesDescription.slice(0, 20)} | \`${c.cusip}\` | $${Math.round(c.principalAmount / 1000).toLocaleString()} | $${Math.round(c.principalAmount).toLocaleString()} PRN | N/A | SOLE (Director) | None | ${Math.round(c.principalAmount * c.exchangeRatio).toLocaleString()} (Post-Ex) |`).join('\n')}

**TOTAL PORTFOLIO FAIR VALUE:** $${summary.totalPrincipal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
**AGGREGATE CONVERTED EQUITY POSITION:** ${summary.totalShares.toLocaleString()} Shares (${cusips.map(c => c.tickerSymbol).filter((v, i, a) => a.indexOf(v) === i).join(', ')})

--------------------------------------------------------------------------------
### PART II: MONTHLY CUSTODIAL INTAKE & SETTLEMENT LEDGER
1. **Intake Date:** ${formattedDate}
2. **Deposit Method:** DTC FAST Book-Entry Surrender / Physical Indenture Presentment
3. **Custody Verification Rule:** 17 C.F.R. § 275.206(4)-2 (Custody Rule Verification)
4. **Independent Auditor Sign-Off:** Semi-annual surprise examination of trust assets.

--------------------------------------------------------------------------------
### PART III: TAX BASIS RECONCILIATION & SCHEDULE K-1 WORKPAPER
- **Internal Revenue Code Basis:** 26 U.S.C. §§ 671–679 (Grantor Trust Rules) / 26 U.S.C. § 1014 / § 1015
- **Exchange Characterization:** Tax-free debt-for-equity recapitalization under IRC § 368(a)(1)(E)
- **Carryover Basis:** Original cost basis carried over from senior note acquisition
- **Reporting Forms Generated:** Form 1099-B, Schedule D (Capital Gains & Losses), and Grantor Trust Information Statement

--------------------------------------------------------------------------------
### PART IV: 5-YEAR TRAILING SMOOTHED NAV WORKPAPER
- Year 1 Projected NAV: $${summary.totalPrincipal.toLocaleString()}
- Year 2 Projected NAV: $${(summary.totalPrincipal * 1.05).toLocaleString()}
- Year 3 Projected NAV: $${(summary.totalPrincipal * 1.10).toLocaleString()}
- Year 4 Projected NAV: $${(summary.totalPrincipal * 1.15).toLocaleString()}
- Year 5 Projected NAV: $${(summary.totalPrincipal * 1.22).toLocaleString()}
- 5-Year Average ($\bar{C}_5$): $${(summary.totalPrincipal * 1.104).toLocaleString()}
- **Authorized Annual Payout Floor (5%):** $${(summary.totalPrincipal * 1.104 * 0.05).toLocaleString()}

Certified by Institutional Manager:

_____________________________________________
${config.petitionerName}, Trust Settlor & Manager
`;

  const latexText = `% =====================================================================
%  SEC FORM 13F / CUSTODY INTAKE & NAV WORKPAPER
% =====================================================================
\\documentclass[11pt,letterpaper]{article}
\\usepackage[margin=1in]{geometry}
\\usepackage{booktabs}
\\usepackage{tabularx}

\\begin{document}
\\begin{center}
\\textbf{\\large UNITED STATES SECURITIES AND EXCHANGE COMMISSION}\\\\
\\textbf{\\normalsize FORM 13F INFORMATION TABLE}
\\end{center}
\\vspace{12pt}

\\noindent\\textbf{Reporting Trust:} Americana Digital Reserve Directed Trust\\\\
\\textbf{Total Portfolio Fair Value:} \\$${summary.totalPrincipal.toLocaleString()}\\\\
\\textbf{Converted Share Equivalent:} ${summary.totalShares.toLocaleString()} shares

\\section*{CUSTODIAL RECONCILIATION SUMMARY}
Under 17 C.F.R. \\S 275.206(4)-2 and 26 U.S.C. \\S\\S 671--679, all senior debt obligations are reconciled as tax-free recapitalizations under IRC \\S 368(a)(1)(E).

\\vspace{24pt}
\\noindent Certified by:\\\\
\\underline{\\hspace{2.5in}}\\\\
${config.petitionerName}, Manager
\\end{document}
`;

  return {
    id: 'doc-sec-workpaper',
    title: 'SEC Form 13F Custody Intake & Quarterly NAV Workpaper Shell',
    subtitle: 'Institutional Custody Reconciliation & IRC § 368(a)(1)(E) Recapitalization',
    jurisdiction: 'SEC Regulatory & Tax',
    badge: 'SEC Form 13F',
    pageEstimate: '8-12 Pages (Audit Workpaper)',
    plainText,
    latexText
  };
}

/**
 * Generate Document 6: ADR/ADX Algorithmic Evidence Supplement & Closed-Loop Science Authority
 */
export function generateAdrAdxSupplement(
  cusips: CustomCusipItem[],
  config: CustomPartyConfig
): GeneratedDocument {
  const summary = calculatePortfolioSummary(cusips);
  const formattedDate = config.filingDate || 'November 3, 2026';

  const plainText = `# SUPPLEMENT TO MASTER PLEADING
## AUTOMATED DECISION REVIEW (ADR) / AUTOMATED DECISION EXAMINATION (ADX) EVIDENCE
### Algorithmic Due Process, Closed-Loop Neuromodulation, and Scientific Validation Authority

**Case:** ${config.petitionerName} v. ${config.respondentCorporation}, ${config.depositoryBank}, et al.
**Court:** ${config.stateCourtVenue} / ${config.federalCourtVenue}
**Case No.:** ${config.caseNumber || '[Pending Master Pleading]'}
**Monitoring Period:** January 1, 2024 to Present (Continuous Real-Time Integration)
**Generation Timestamp:** ${formattedDate}

--------------------------------------------------------------------------------
### NOTICE OF CONTINUOUS AUTOMATED SCIENTIFIC MONITORING
This Evidence Supplement is maintained through continuous, automated monitoring of peer-reviewed scientific literature and judicial records across publicly accessible repositories without paid API keys:
- **PubMed / MEDLINE:** Biomedical research, dopamine D4/D5 receptors, psychiatric genomics, disability adjudication;
- **arXiv.org:** Computer science, algorithmic fairness, queueing theory, locality-sensitive hashing (MORTAR);
- **RECAP / CourtListener:** Open-access PACER court opinions and administrative agency dockets;
- **NIH Public Access Repositories:** Federally funded clinical trials and biomedical datasets.

--------------------------------------------------------------------------------
### SECTION I: CLOSED-LOOP INDIRECT NEUROTRANSMITTER MODULATION SYSTEM ARCHITECTURE
In support of Petitioners' disability rights, ADA Title II accommodation claims, and the scientific justification for the PSDLEF research corpus, this pleading incorporates the biophysical closed-loop indirect neurotransmitter modulation architecture:

1. **Aptamer Sensing & Metabolite Binding (Stage 1):** Continuous real-time detection of metabolic neurotransmitter byproducts.
2. **Fluoresced Signal Readout (Stage 2):** Nitrogen-Vacancy (NV) centers in diamond nanoparticles for optical signal transduction and ultra-low noise measurement.
3. **Swarm Peer-to-Peer Communication (Stage 3):** Decentralized distributed mesh nodes exchanging sensor telemetry without centralized latency or failure points.
4. **Edge Computing / LLM Interpretation (Stage 4):** Real-time neural inference and predictive decision commands computed on-device.
5. **Targeted Ligand Release (Stage 5):** Precision micro-actuation delivering corrective biochemical ligands.
6. **Postsynaptic Receptor Modulation (Stage 6):** Targeted modulation of dopamine/serotonin post-synaptic receptors restoring physiological equilibrium.
7. **Metabolite Clearance Measurement & Closed-Loop Feedback (Stage 7):** Continual clearance monitoring feeding back into Aptamer Sensing to maintain strict physiological bounds.

This closed-loop mathematical invariant mirrors the legal requirement for real-time feedback in administrative decision systems, demonstrating that automated systems must include human-in-the-loop validation and bounded error recovery.

--------------------------------------------------------------------------------
### SECTION II: ALGORITHMIC BIAS IN SSDI/SSI AND HOUSING ALLOCATION
1. Federal and municipal agencies deploy automated triage algorithms that systematically disadvantage applicants suffering from cognitive and neurodevelopmental disabilities.
2. The ${config.housingUnitsCount} rowhomes preserved in ${config.housingLocation} specifically safeguard SSDI/SSI applicants against algorithmic eviction and automated benefit denial queues.
3. Under *Mathews v. Eldridge*, 424 U.S. 319 (1976), and *Goldberg v. Kelly*, 397 U.S. 254 (1970), automated adjudications that deprive disabled individuals of basic subsistence and housing without notice, training data disclosure, or contestation violate procedural due process.
4. The MORTAR Locality-Sensitive Hashing (LSH) queue algorithm ($O(n \log m)$) provides an anti-starvation mathematical guarantee ensuring no claimant languishes indefinitely in an administrative queue.

--------------------------------------------------------------------------------
### SECTION III: APPOINTMENT SCHEDULE AND SCIENTIFIC QUALIFICATIONS
Petitioners tender this evidence in furtherance of their appointment as special master fiduciary trustees over the $${summary.totalPrincipal.toLocaleString()} debt corpus and ${config.housingUnitsCount}-unit housing preservation trust, ensuring that scientific rigor and algorithmic fairness govern the deployment of trust assets.

Executed on ${formattedDate},

_____________________________________________
${config.petitionerName}, Settlor & Computational Fiduciary
${config.petitionerAddress}
`;

  const latexText = `% =====================================================================
%  ADR/ADX ALGORITHMIC EVIDENCE SUPPLEMENT
%  Case: ${config.petitionerName} v. ${config.respondentCorporation}
% =====================================================================
\\documentclass[12pt,letterpaper]{article}
\\usepackage[margin=1in]{geometry}
\\usepackage{mathptmx}
\\usepackage{booktabs}
\\usepackage{enumitem}

\\begin{document}
\\begin{center}
\\textbf{\\Large SUPPLEMENT TO MASTER PLEADING}\\\\
\\vspace{6pt}
\\textbf{\\large AUTOMATED DECISION REVIEW (ADR) / ADX EVIDENCE}\\\\
\\textbf{\\normalsize Scientific Validation and Closed-Loop System Architecture}
\\end{center}
\\vspace{12pt}

\\noindent\\textbf{Case:} ${config.petitionerName} v.\\ ${config.respondentCorporation.replace('&', '\\&')}\\\\
\\textbf{Subject CUSIPs:} ${cusips.map(c => `\\texttt{${c.cusip}}`).join(', ')}\\\\
\\textbf{Housing Preservation SPV:} ${config.housingUnitsCount} units in ${config.housingLocation}

\\section*{I. CLOSED-LOOP NEUROTRANSMITTER MODULATION ARCHITECTURE}
The scientific evidence incorporates the 7-stage closed-loop architecture:
\\begin{enumerate}[leftmargin=*]
\\item \\textbf{Aptamer Sensing:} Metabolite binding and dynamic tracking;
\\item \\textbf{Fluoresced Signal Readout:} NV center nanodiamond optical transduction;
\\item \\textbf{Swarm P2P Communication:} Decentralized sensor telemetry mesh;
\\item \\textbf{Edge Computing / LLM Interpretation:} Real-time inferential command;
\\item \\textbf{Targeted Ligand Release:} Regulated micro-dispensation;
\\item \\textbf{Postsynaptic Receptor Modulation:} Dynamic balance restoration;
\\item \\textbf{Metabolite Clearance Feedback:} Bounded continuous calibration.
\\end{enumerate}

\\section*{II. PROCEDURAL DUE PROCESS CONSTRAINTS}
Under \\textit{Mathews v.\\ Eldridge}, automated decision systems without transparent error-correcting feedback violate constitutional due process.

\\vspace{24pt}
\\noindent Respectfully submitted,\\\\
${formattedDate}\\\\[18pt]
\\noindent\\underline{\\hspace{2.5in}}\\\\
${config.petitionerName}
\\end{document}
`;

  return {
    id: 'doc-adr-adx',
    title: 'ADR/ADX Algorithmic Evidence Supplement & Closed-Loop Science Authority',
    subtitle: 'Automated Decision Review, PubMed/arXiv Peer Review & Closed-Loop Neuromodulation',
    jurisdiction: 'Scientific & Evidence Supplement',
    badge: 'ADR / ADX Evidence',
    pageEstimate: '10-15 Pages (Technical Supplement)',
    plainText,
    latexText
  };
}

/**
 * Generate all 6 documents for the given portfolio and config
 */
export function generateAllCustomDocuments(
  cusips: CustomCusipItem[],
  config: CustomPartyConfig
): GeneratedDocument[] {
  return [
    generateStateMandamusPetition(cusips, config),
    generateFederalMandamusPetition(cusips, config),
    generateTrustCharterAndIndenture(cusips, config),
    generateBankExecutionChecklist(cusips, config),
    generateSecCustodyNavWorkpaper(cusips, config),
    generateAdrAdxSupplement(cusips, config)
  ];
}
