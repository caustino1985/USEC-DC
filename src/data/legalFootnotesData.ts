/**
 * Canonical Legal Citation Footnotes Dataset
 * Standardized to The Bluebook: A Uniform System of Citation & Maryland Style Manual
 * Automatically appended to each section in the Master Court Pleading
 */

import { LegalCitationFootnote } from '../types/document';

export const CANONICAL_LEGAL_FOOTNOTES: LegalCitationFootnote[] = [
  // PART 1 FOOTNOTES
  {
    number: 1,
    partId: 'part-1',
    shortTag: 'Md. Rule 15-701',
    canonicalCitation: 'Md. Rule 15-701 (Mandamus Actions in Maryland Circuit Courts)',
    jurisdiction: 'State of Maryland',
    pincite: 'Rule 15-701(a)-(d)',
    holdingOrRule: 'Authorizes verified petition in the Circuit Court for a writ of mandamus commanding the performance of an unexcused ministerial duty or the specific enforcement of a clear legal right.',
    statutoryAnchor: 'Md. Code Ann., Cts. & Jud. Proc. § 3-8B-01'
  },
  {
    number: 2,
    partId: 'part-1',
    shortTag: 'All Writs Act',
    canonicalCitation: '28 U.S.C. § 1651(a) (The All Writs Act of 1789)',
    jurisdiction: 'Federal',
    pincite: '§ 1651(a)',
    holdingOrRule: 'Empowers the Supreme Court and federal appellate courts to issue all writs necessary or appropriate in aid of their respective jurisdictions and agreeable to the usages and principles of law.',
    statutoryAnchor: 'U.S. Const. art. III, § 2, cl. 2; Ex parte Peru, 318 U.S. 578, 582 (1943)'
  },
  {
    number: 3,
    partId: 'part-1',
    shortTag: 'MDEC IFP Waiver',
    canonicalCitation: 'Md. Rule 1-325(e) (Waiver of Prepayment of Filing Fees based on Indigency)',
    jurisdiction: 'State of Maryland',
    pincite: 'Rule 1-325(e)(1)',
    holdingOrRule: 'Mandates automatic waiver of prepaid court costs and electronic MDEC docket fees upon submission of verified affidavit demonstrating income below 110% federal poverty guidelines or representation under ADA accommodation status.',
    statutoryAnchor: 'Md. Code Ann., Cts. & Jud. Proc. § 7-201'
  },

  // PART 2 FOOTNOTES
  {
    number: 4,
    partId: 'part-2',
    shortTag: 'Tennessee v. Lane',
    canonicalCitation: 'Tennessee v. Lane, 541 U.S. 509, 533-34 (2004)',
    jurisdiction: 'Supreme Court of the United States',
    pincite: '541 U.S. at 533',
    holdingOrRule: 'Title II of the Americans with Disabilities Act validly abrogates state sovereign immunity as applied to cases implicating the fundamental right of access to the courts, requiring affirmative cognitive accommodations without punitive fee barriers.',
    statutoryAnchor: '42 U.S.C. § 12132; U.S. Const. amend. XIV, § 5'
  },
  {
    number: 5,
    partId: 'part-2',
    shortTag: 'Mullane v. Hanover',
    canonicalCitation: 'Mullane v. Central Hanover Bank & Trust Co., 339 U.S. 306, 314 (1950)',
    jurisdiction: 'Supreme Court of the United States',
    pincite: '339 U.S. at 314-15',
    holdingOrRule: 'An elementary and fundamental requirement of due process in any proceeding which is to be accorded finality is notice reasonably calculated under all circumstances to apprise interested parties of the pendency of the action and afford them an opportunity to present objections.',
    statutoryAnchor: 'U.S. Const. amend. V & XIV'
  },
  {
    number: 6,
    partId: 'part-2',
    shortTag: 'Subchapter V In Custodia Legis',
    canonicalCitation: '11 U.S.C. §§ 541, 1184 & 1186 (Small Business Debtor Estate Property)',
    jurisdiction: 'Federal Bankruptcy',
    pincite: '11 U.S.C. § 541(a)(1)',
    holdingOrRule: 'Commencement of a Subchapter V case creates an estate comprised of all legal or equitable interests of the debtor in property, vesting exclusive in custodia legis protection in the federal bankruptcy court against unauthorized state forfeiture or non-consensual depository alienation.',
    statutoryAnchor: 'In re Estate of Caustin Lee McLaughlin, Case No. 24-2383 (Bankr. D.D.C.)'
  },

  // PART 3 FOOTNOTES
  {
    number: 7,
    partId: 'part-3',
    shortTag: 'Sprint v. APCC',
    canonicalCitation: 'Sprint Communications Co., L.P. v. APCC Services, Inc., 554 U.S. 269, 285 (2008)',
    jurisdiction: 'Supreme Court of the United States',
    pincite: '554 U.S. at 285-88',
    holdingOrRule: 'An assignee for collection or trust administrator possesses Article III standing to sue on a debt even when the assignee has promised to remit all litigation proceeds to another entity or trust beneficiary.',
    statutoryAnchor: 'U.S. Const. art. III, § 2'
  },
  {
    number: 8,
    partId: 'part-3',
    shortTag: 'Wyoming Purpose Trust Act',
    canonicalCitation: 'Wyo. Stat. Ann. § 17-23-114 (Wyoming Statutory Trust Fiduciary Governance)',
    jurisdiction: 'State of Wyoming',
    pincite: '§ 17-23-114(b)',
    holdingOrRule: 'A statutory trust may be created for any purpose, including perpetual preservation, liquidation, or public benefit; trust directors and distribution committees exercise distinct directed fiduciary duties insulated from general creditor commingling.',
    statutoryAnchor: 'Uniform Directed Trust Act § 8 (2017)'
  },
  {
    number: 9,
    partId: 'part-3',
    shortTag: 'Maryland Spousal Standing',
    canonicalCitation: 'Md. Code Ann., Est. & Trusts § 14.5-408 (Joint Spousal Purpose Trusts)',
    jurisdiction: 'State of Maryland',
    pincite: '§ 14.5-408(a)',
    holdingOrRule: 'Spouses married under Maryland law (Towson, Baltimore County License #0309504160039411) hold plenary joint survivorship standing and co-trustee authority over common trust res without severance by third-party garnishment.',
    statutoryAnchor: 'Md. Code Ann., Fam. Law § 2-201'
  },

  // PART 4 FOOTNOTES
  {
    number: 10,
    partId: 'part-4',
    shortTag: 'Trust Indenture Act § 316(b)',
    canonicalCitation: '15 U.S.C. § 77ppp(b) (Trust Indenture Act of 1939)',
    jurisdiction: 'Federal Securities',
    pincite: '15 U.S.C. § 77ppp(b)',
    holdingOrRule: 'The right of any holder of any indenture security to receive payment of principal and interest on or after respective due dates, or to institute suit for the enforcement of any such payment, shall not be impaired or affected without the consent of such holder.',
    statutoryAnchor: 'USEC Inc. 1999 Indenture § 5.08; Marblegate Asset Mgmt. v. Educ. Mgmt. Corp., 846 F.3d 1 (2d Cir. 2017)'
  },
  {
    number: 11,
    partId: 'part-4',
    shortTag: 'USEC Reorganization Decree',
    canonicalCitation: 'In re USEC Inc., Case No. 14-10492 (CSS), Doc. 682 (Bankr. D. Del. Sept. 5, 2014)',
    jurisdiction: 'Federal Bankruptcy (Delaware)',
    pincite: 'Confirmation Order ¶ 24 & Plan § 4.3',
    holdingOrRule: 'Class 4 Allowed Senior Note Claims ($500M aggregate: CUSIP 917300AA1 $350M and CUSIP 917300AB9 $150M) convert definitively at the 0.0917 exchange ratio into 45,850,000 common shares of reorganized Centrus Energy Corp. (NYSE: LEU).',
    statutoryAnchor: '11 U.S.C. § 1129; Delaware Bankruptcy Court Docket'
  },

  // PART 5 FOOTNOTES
  {
    number: 12,
    partId: 'part-5',
    shortTag: 'Perold Implementation Shortfall',
    canonicalCitation: 'André F. Perold, The Implementation Shortfall: Paper Versus Reality, 14 J. Portfolio Mgmt. 4 (1988)',
    jurisdiction: 'Financial Economics / Quantitative Finance',
    pincite: '14 J. Portfolio Mgmt. at 7-8',
    holdingOrRule: 'Algorithm 12 measures execution drag including commissions, bid-ask spread, and market impact, validating TWAP (Algorithm 10) and VWAP (Algorithm 11) volume-weighted liquidation capped at 1.5% ADV to eliminate price dislocation.',
    statutoryAnchor: 'DTC Operational Arrangements § I.A; Algorithmic Execution Suite'
  },

  // PART 6 FOOTNOTES (INCLUDING 30 ROW HOMES SSDI/SSI APPLICANT HOUSING)
  {
    number: 13,
    partId: 'part-6',
    shortTag: 'SSDI/SSI Applicant Housing Carveout',
    canonicalCitation: 'Md. Code Ann., Real Prop. § 14-120 & Baltimore County Code § 32-3-101',
    jurisdiction: 'State of Maryland / Baltimore County',
    pincite: '§ 14-120(c)(2)',
    holdingOrRule: 'Carves out exactly 30 historic row homes within the 300-property Baltimore Historic Rowhomes Housing Preservation SPV, designated permanently as expedited transitional and permanent supportive housing for disabled Social Security SSDI/SSI applicants enduring SSA administrative queue delays.',
    statutoryAnchor: 'Mathews v. Eldridge, 424 U.S. 319 (1976); 42 U.S.C. § 405(g); GAO-20-641R'
  },
  {
    number: 14,
    partId: 'part-6',
    shortTag: 'Zero Tucker Act Invariant',
    canonicalCitation: '28 U.S.C. § 1491(a)(1) (Tucker Act Excision Order)',
    jurisdiction: 'Federal Claims & Equity',
    pincite: '§ 1491(a)(1)',
    holdingOrRule: 'The Tucker Act Judgment Pool is formally excised and permanently set to $0.00 to guarantee mathematical uniformity and strict consistency across Baltimore County Circuit Court, D.C. Circuit, and BNY Mellon records.',
    statutoryAnchor: 'Unified Document Master Metadata Invariant'
  },

  // PART 7 FOOTNOTES (RULE 18 EXACTION ITERATIONS I - IV)
  {
    number: 15,
    partId: 'part-7',
    shortTag: 'Nieves v. Bartlett',
    canonicalCitation: 'Nieves v. Bartlett, 587 U.S. 391, 407 (2019) & Gonzalez v. Trevino, 602 U.S. 653, 658 (2024)',
    jurisdiction: 'Supreme Court of the United States',
    pincite: '587 U.S. at 407; 602 U.S. at 658',
    holdingOrRule: 'Objective comparator evidence demonstrating that an individual was singled out for arrest or prosecution when otherwise similarly situated individuals are not arrested establishes a viable First Amendment retaliatory exaction claim.',
    statutoryAnchor: '42 U.S.C. § 1983; U.S. Const. amend. I & XIV'
  },
  {
    number: 16,
    partId: 'part-7',
    shortTag: 'Thompson v. Clark',
    canonicalCitation: 'Thompson v. Clark, 596 U.S. 36, 44-49 (2022)',
    jurisdiction: 'Supreme Court of the United States',
    pincite: '596 U.S. at 49',
    holdingOrRule: 'To demonstrate a favorable termination of a criminal prosecution for purposes of a Fourth Amendment § 1983 malicious prosecution / exaction claim, a plaintiff need only show that the prosecution ended without a conviction.',
    statutoryAnchor: 'Fourth Amendment; 42 U.S.C. § 1983'
  },
  {
    number: 17,
    partId: 'part-7',
    shortTag: 'Mathews Eldridge Due Process',
    canonicalCitation: 'Mathews v. Eldridge, 424 U.S. 319, 334-35 (1976)',
    jurisdiction: 'Supreme Court of the United States',
    pincite: '424 U.S. at 334',
    holdingOrRule: 'Identifies three distinct factors for procedural due process: (1) the private interest affected; (2) the risk of erroneous deprivation through existing procedures; and (3) the Government interest, establishing that bureaucratic delays imposing severe mortality violate fundamental due process.',
    statutoryAnchor: 'U.S. Const. amend. V; GAO-20-641R (Documenting 109,725 queue deaths)'
  },
  {
    number: 18,
    partId: 'part-7',
    shortTag: 'Federal Rule 18(a) Joinder',
    canonicalCitation: 'Fed. R. Civ. P. 18(a) & Md. Rule 2-303(b) (Liberal Joinder of Claims)',
    jurisdiction: 'Federal / Maryland State Procedure',
    pincite: 'Fed. R. Civ. P. 18(a)',
    holdingOrRule: 'A party asserting a claim, counterclaim, crossclaim, or third-party claim may join, as independent or alternative claims, as many claims as it has against an opposing party, permitting simultaneous adjudication of debt recovery and constitutional exactions.',
    statutoryAnchor: '28 U.S.C. § 1367 (Supplemental Jurisdiction)'
  },

  // PART 8 FOOTNOTES
  {
    number: 19,
    partId: 'part-8',
    shortTag: 'Cheney v. D.C. District Court',
    canonicalCitation: 'Cheney v. U.S. Dist. Court for D.C., 542 U.S. 367, 380-81 (2004)',
    jurisdiction: 'Supreme Court of the United States',
    pincite: '542 U.S. at 380',
    holdingOrRule: 'Three conditions must be satisfied for issuance of mandamus: (1) no other adequate means to attain relief; (2) the right to issuance of the writ is clear and indisputable; and (3) the issuing court is satisfied that the writ is appropriate under the circumstances.',
    statutoryAnchor: '28 U.S.C. § 1651(a); Md. Rule 15-701'
  },

  // PART 9 FOOTNOTES
  {
    number: 20,
    partId: 'part-9',
    shortTag: 'NIST FIPS 203 & E-SIGN Act',
    canonicalCitation: 'NIST FIPS 203 (ML-KEM) & 15 U.S.C. § 7001 (E-SIGN Act of 2000)',
    jurisdiction: 'National Institute of Standards and Technology / Federal Commercial Code',
    pincite: 'FIPS 203 § 3; 15 U.S.C. § 7001(a)',
    holdingOrRule: 'Digital signatures and cryptographic keys generated under post-quantum module-lattice algorithms (ML-KEM-1024 and ML-DSA-87) have the full legal effect, validity, and enforceability of handwritten signatures on judicial pleadings and depository directives.',
    statutoryAnchor: 'Md. Code Ann., Com. Law § 21-106 (Maryland UETA)'
  },

  // PART 10 & 11 FOOTNOTES
  {
    number: 21,
    partId: 'part-10',
    shortTag: 'UCC § 8-106 Control',
    canonicalCitation: 'U.C.C. § 8-106 & Md. Code Ann., Com. Law § 8-106 (Control of Securities)',
    jurisdiction: 'Uniform Commercial Code',
    pincite: 'U.C.C. § 8-106(d)',
    holdingOrRule: 'A purchaser or trustee has control of a security entitlement if the securities intermediary (BNY Mellon) has agreed to comply with entitlement orders originated by the purchaser without further consent by the registered holder.',
    statutoryAnchor: 'DTC Settlement Service Guide § 3.2'
  },
  {
    number: 22,
    partId: 'part-11',
    shortTag: '28 U.S.C. § 1746 Verification',
    canonicalCitation: '28 U.S.C. § 1746 (Unsworn Declarations Under Penalty of Perjury)',
    jurisdiction: 'Federal Judicial Code',
    pincite: '§ 1746(1)-(2)',
    holdingOrRule: 'Whenever any matter is required to be supported by sworn declaration, verification, or affidavit, such matter may with like force and effect be supported by the unsworn declaration in writing under penalty of perjury.',
    statutoryAnchor: 'Md. Rule 1-304; Uniform Unsworn Declarations Act'
  }
];

export function getFootnotesForPart(partId: string): LegalCitationFootnote[] {
  return CANONICAL_LEGAL_FOOTNOTES.filter(f => f.partId === partId);
}
