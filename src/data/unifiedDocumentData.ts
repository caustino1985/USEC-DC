import { 
  CUSIPEntry, 
  SweepAllocation, 
  ExecutionTab, 
  CourtIntake, 
  CounterpartyInfo,
  Rule18ExactionIteration,
  EmailPresentationPackage,
  WyomingTrustDocument,
  AlgorithmDefinition
} from '../types/document';

export const UNIFIED_DOCUMENT_METADATA = {
  title: "OMNIBUS CONSOLIDATED PETITION FOR WRIT OF MANDAMUS, DECLARATORY RELIEF, EMERGENCY CUSTODIAL SETTLEMENT, AND RULE 18 CONSOLIDATED EXACTION OF LIBERTY",
  shortTitle: "Unified Baltimore County Circuit Court, D.C. Circuit & BNY Mellon Master Mandamus & Trust Clearing Omnibus",
  executionDate: "November 3, 2026",
  filingDate: "November 3, 2026",
  batchDispatchDate: "November 2–3, 2026 (00:46 UTC)",
  initialFormalDate: "Tuesday, August 11, 2026 at 7:25:32 PM EDT",
  
  // Primary Petitioner & Signatory
  petitioner: "Caustin Lee McLaughlin",
  petitionerTitle: "Debtor-in-Possession / Principal Trustee, PSDLEF Purpose Trust / Managing Director",
  petitionerAddress: "1000 N. Woodington Rd., Apt. 228, Baltimore, Maryland 21223",
  petitionerMaritalResidence: "14 Strawbridge Court, Gwynn Oak, MD 21207 (Baltimore County)",
  petitionerPrevAddress: "1525 Newton St NW, Washington, D.C. 20010-3103",
  petitionerEmail: "Xaustino@hotmail.com",
  petitionerPhone: "(410) 826-8141",
  petitionerDOB: "06/18/1985",
  petitionerBirthplace: "Richmond, Virginia",
  petitionerDLN: "4042567 (District of Columbia)",

  // Co-Signatory & Spousal Fiduciary
  coSignatory: "Juan Jose Fernandez",
  coSignatoryTitle: "Co-Trustee / Authorized Signatory, PSDLEF-Americana-SSA-TRUST",
  coSignatoryResidence: "14 Strawbridge Court, Gwynn Oak, MD 21207 (Baltimore County)",
  coSignatoryDOB: "08/14/1981",
  coSignatoryBirthplace: "El Salvador",
  
  // Baltimore County Marriage Record
  marriageRecord: {
    state: "State of Maryland",
    county: "Baltimore County (3)",
    licenseNumber: "0309504160039411",
    certificateNumber: "2013-5222",
    dateCeremony: "December 17, 2013 at 2:15 PM",
    venue: "Towson, Maryland (Circuit Court for Baltimore County)",
    authorizedOfficial: "Denise D. Harris, Deputy Clerk, Circuit Court for Baltimore County",
    standingEffect: "Conclusive legal proof of joint household, spousal co-trustee standing, and unified fiduciary authority."
  },

  // Judicial Dockets
  baltimoreCountyDocket: "Case No. C-03-CV-26-004128 (Civil / Equity Division, Towson, MD)",
  dcCircuitDocket: "Case No. 24-10492",
  ddcDocket: "Case No. 24-2383 (Subchapter V Chapter 11, In Custodia Legis)",
  baltimoreCityDocket: "Case No. 24-C-26-003970 (Ancillary Mandamus)",
  scotusDocket: "Original Supervisory Docket (28 U.S.C. § 1651(a) / Rule 20)",
  delawareBankruptcyRef: "Case No. 14-10475 (CSS) / 14-10492",

  // Custodial & Depository Endpoints
  depositoryCustodian: "The Bank of New York Mellon (BNY Mellon) — Corporate Trust & DTC Participant Clearing",
  depositoryAddress: "240 Greenwich Street, New York, NY 10286",
  transferAgent: "Computershare Trust Company, N.A., 150 Royall Street, Canton, MA 02021",
  respondentCorporation: "Centrus Energy Corp. (f/k/a USEC Inc.), 6901 Rockledge Drive, Bethesda, MD 20817",
  coCustodianBank: "M&T Bank Corporate Trust & Business Banking (Baltimore Regional Center, 25 S. Charles St)",
  abaRouting: "022000046",
  swiftCode: "MANTUS33",
  protocolTargetUrl: "https://americana-digital-reserve-exchange.ai.studio/",
  onChainBitcoinReserveAddress: "bc1q9f83b4ac1087e59871fa28419cb7891240c7",

  // Capitalization Figures (TUCKER ACT JUDGMENT POOL EXCLUDED PER DIRECTIVE)
  seriesAPrincipal: 350000000.00,
  seriesACoupon: "6.625% (6 ½%)",
  seriesAMaturity: "January 20, 2006",
  seriesACUSIP: "917300AA1",
  seriesAShares: 32095000,

  seriesBPrincipal: 150000000.00,
  seriesBCoupon: "6.750% (6 ¾%)",
  seriesBMaturity: "January 20, 2009",
  seriesBCUSIP: "917300AB9",
  seriesBShares: 13755000,

  totalPrincipal: 500000000.00,
  exchangeRatio: 0.0917,
  totalShares: 45850000,
};

// RULE 18 CONSOLIDATED EXACTION OF LIBERTY ARGUMENTS (EVERY ITERATION)
export const RULE_18_EXACTION_ITERATIONS: Rule18ExactionIteration[] = [
  {
    iterationNumber: 1,
    title: "Iteration I: Constitutional & Physical Liberty Exaction (42 U.S.C. § 1983 / Criminal Process)",
    legalAnchor: "Fed. R. Civ. P. 18(a) / Md. Rule 2-303(b) / 42 U.S.C. § 1983 / 28 U.S.C. § 1343",
    constitutionalBasis: "Fourth, Fifth, and Fourteenth Amendments; Due Process Clause & Equal Protection Clause",
    factualDeprivation: "Subjecting Petitioner to retaliatory arrest, retaliatory prosecution, coercive custodial interrogation without counsel, fabricated uncorroborated evidence, and protracted criminal process in Baltimore County/City designed to suppress protected First Amendment whistleblowing and federal civil rights petitions.",
    doctrinalThresholds: [
      "Nieves v. Bartlett, 587 U.S. 391 (2019) & Gonzalez v. Trevino, 602 U.S. 653 (2024): Objective comparator showing of selective arrest without probable cause",
      "Thompson v. Clark, 596 U.S. 36 (2022): Favorable termination satisfied by dismissal without conviction",
      "Manuel v. City of Joliet, 580 U.S. 357 (2017): Pretrial detention based on fabricated evidence violates Fourth Amendment",
      "Buckley v. Fitzsimmons, 509 U.S. 259 (1993): Investigative fabrication is not protected by absolute prosecutorial immunity",
      "Monell v. Dept. of Social Services, 436 U.S. 658 (1978): Custom and failure to train amounting to deliberate indifference"
    ],
    remedyDemanded: "Declaratory judgment that all arrest and charging records are unconstitutional exactions of liberty; permanent expungement; injunctive order enjoining further retaliatory process; and statutory compensatory and punitive damages."
  },
  {
    iterationNumber: 2,
    title: "Iteration II: Administrative Mortality & Disability Due Process Exaction (SSA / 42 U.S.C. § 405(g))",
    legalAnchor: "Fed. R. Civ. P. 18(a) / 42 U.S.C. § 405(g) / Mathews v. Eldridge / ICCPR Article 6",
    constitutionalBasis: "Fifth Amendment Procedural Due Process; Non-Delegation Doctrine; ICCPR Right to Life",
    factualDeprivation: "Maintenance of an administrative disability adjudication queue that imposes multi-year delays (exceeding 800+ days) causing measurable claimant mortality while awaiting hearings (over 109,725 documented deaths in GAO-20-641R). The state exacts bodily integrity, health, and economic liberty without timely due process.",
    doctrinalThresholds: [
      "Mathews v. Eldridge, 424 U.S. 319 (1976): Private interest in survival balances heavily against bureaucratic delay",
      "Goldberg v. Kelly, 397 U.S. 254 (1970): Pre-termination/pre-deprivation evidentiary due process for basic sustenance",
      "GAO-20-641R & Sanders/Larson (2020): Official audit verifying catastrophic mortality in SSA appeals queue",
      "MORTAR Algorithmic Queueing Engine: Locality-sensitive hashing O(n log m) bounded-delay triage providing an anti-starvation mathematical invariant",
      "ICCPR General Comment 36: State duty to prevent foreseeable institutional deprivation of life"
    ],
    remedyDemanded: "Mandatory injunction requiring immediate deployment of the MORTAR triage engine with anti-starvation bounds, immediate expedited hearing, and interim emergency disability sustenance distributions."
  },
  {
    iterationNumber: 3,
    title: "Iteration III: Biological & Genomic Data Sovereignty Exaction (Non-Consensual Genetic Extraction)",
    legalAnchor: "Fed. R. Civ. P. 18(a) / GINA (42 U.S.C. § 2000ff) / ADA Title II (42 U.S.C. § 12131) / 29 U.S.C. § 794",
    constitutionalBasis: "Fourth Amendment Informational Privacy; Fourteenth Amendment Bodily Integrity; Genetic Privacy",
    factualDeprivation: "Non-consensual harvesting, cataloging, profiling, and algorithmic weaponization of immutable neurogenetic biomarkers (COMT rs4680, DRD2/ANKK1 rs1800497, SLC6A3 rs2075654, BDNF rs6265) without warrant, consent, or dynamic cryptographic authorization, converting biological data into an instrument of administrative exclusion.",
    doctrinalThresholds: [
      "Carpenter v. United States, 585 U.S. 296 (2018): Heightened Fourth Amendment privacy in deeply revealing, persistent digital footprints",
      "Riley v. California, 573 U.S. 373 (2014): Digital data contains vast intimate personal papers and effects",
      "Maryland v. King, 569 U.S. 435 (2013): DNA collection strictly bounded to identification, not functional or phenotypic profiling",
      "Tennessee v. Lane, 541 U.S. 509 (2004): Abrogation of sovereign immunity under ADA Title II for judicial and institutional accessibility",
      "Olmstead v. L.C., 527 U.S. 581 (1999): Integration mandate prohibiting segregation or denial of services based on neurogenetic traits"
    ],
    remedyDemanded: "Order mandating return and destruction of non-consensual genomic profiles; enforcement of the OpenSSA Integrity Pipeline (OSI-P R1-R9) post-quantum encryption; and implementation of HARMONI-X cognitive accommodation."
  },
  {
    iterationNumber: 4,
    title: "Iteration IV: Corporate Indenture & DTC Clearing Property Exaction ($500M Reorganized Capital)",
    legalAnchor: "Fed. R. Civ. P. 18(a) / Trust Indenture Act of 1939 (15 U.S.C. § 77aaa) / 11 U.S.C. §§ 541 & 1186 / Md. Rule 15-701",
    constitutionalBasis: "Fifth Amendment Takings Clause; Fourteenth Amendment Property Deprivation; Mullane Notice Due Process",
    factualDeprivation: "The unlawful withholding, concealment, and administrative freezing of 45,850,000 reorganized common shares of Centrus Energy Corp. (NYSE: LEU) originating from the $500,000,000.00 USEC 1999 Senior Notes Indenture, masked through multi-tiered DTC book-entry participant layers without individual notice to beneficial holders.",
    doctrinalThresholds: [
      "Mullane v. Central Hanover Bank & Trust Co., 339 U.S. 306 (1950): Constructive publication notice is constitutionally void where beneficial holder identity is reasonably ascertainable",
      "Mennonite Board of Missions v. Adams, 462 U.S. 791 (1983): Mandatory actual personal notice to mortgagees and known property interest holders",
      "Information-Theoretic Proof: P(ID | S) -> 1.0 via mandatory SEC Form 13F-HR institutional disclosures (PNC File No. 28-1235)",
      "11 U.S.C. §§ 541 & 1186: Debtor-in-Possession holds all estate assets and rights of action in custodia legis",
      "11 U.S.C. § 105(a): Plenary equitable tolling of reorganization plan bar dates to prevent fraudulent conversion"
    ],
    remedyDemanded: "Peremptory Writ of Mandamus commanding BNY Mellon and Computershare Trust Company, N.A. to immediately execute book-entry credit of 45,850,000 LEU shares and accumulated dividends to the designated Americana Digital Reserve depository."
  }
];

// WYOMING STATUTORY LIQUIDATION TRUST FORMATION DOCUMENTS
export const WYOMING_LIQUIDATION_TRUST_DOCUMENTS: WyomingTrustDocument[] = [
  {
    id: "wy-cert-trust",
    title: "Certificate of Trust — Americana Liquidation & Purpose Trust",
    statutoryReference: "Wyoming Statutory Trust Act (Wyo. Stat. Ann. § 17-23-101 et seq.)",
    purpose: "Formal Certificate filed with the Secretary of State of Wyoming establishing the statutory, bankruptcy-remote liquidation vehicle.",
    sections: [
      {
        heading: "Article I: Name of Statutory Trust",
        content: "The name of the statutory trust formed hereby is 'Americana Liquidation & Sovereign Purpose Trust' (hereinafter the 'Trust')."
      },
      {
        heading: "Article II: Registered Office and Registered Agent in Wyoming",
        content: "The address of the registered office of the Trust in the State of Wyoming is 1621 Central Avenue, Cheyenne, WY 82001. The name of the registered agent is Wyoming Corporate Services, Inc. / Registered Agent Solutions."
      },
      {
        heading: "Article III: Statutory Purpose and Liquidation Mandate",
        content: "The Trust is formed as a perpetual purpose trust under Wyo. Stat. Ann. § 17-23-102 and the Uniform Directed Trust Act (UDTA) to hold, manage, administer, and execute the orderly liquidation and custody of $500,000,000.00 in reorganized estate debt entitlements and 45,850,000 common shares of Centrus Energy Corp. (NYSE: LEU) originating from Delaware Bankruptcy Case No. 14-10492."
      },
      {
        heading: "Article IV: Quad-Cameral Governance and Fiduciary Separation",
        content: "Pursuant to Wyo. Stat. Ann. § 17-23-114, governance is strictly divided among four non-commingled bodies: (1) Trust Director (Investment & Liquidation Authority), (2) Distribution Committee (Benefit & Grant Disbursements), (3) Trust Protector (Perpetuity & Audit Enforcement), and (4) Independent Examiner (Compliance & Forensic Reconciliation)."
      },
      {
        heading: "Article V: Irrevocability and Bankruptcy-Remote Status",
        content: "The Trust is irrevocable and bankruptcy-remote. The property of the Trust constitutes a separate juridical estate not subject to claims against any grantor, trustee, or beneficiary, except as expressly provided in the Master Trust Indenture."
      }
    ]
  },
  {
    id: "wy-trust-agreement",
    title: "Master Trust Indenture & Order of Liquidation",
    statutoryReference: "Wyo. Stat. Ann. §§ 17-23-106, 17-23-114 & Uniform Directed Trust Act",
    purpose: "Operational governing agreement specifying the asset transfer, liquidation pacing, and daily sweep distribution mechanics.",
    sections: [
      {
        heading: "Section 1: Initial Trust Res & Capital Contribution",
        content: "The initial Trust estate consists of all right, title, and beneficial interest in the Class 4 Allowed Claims under the USEC Inc. 1999 Indenture ($350M Series A CUSIP 917300AA1; $150M Series B CUSIP 917300AB9) and the 45,850,000 reorganized common shares of Centrus Energy Corp. (NYSE: LEU)."
      },
      {
        heading: "Section 2: Order of Liquidation & Share Release Protocol",
        content: "The Trust Director shall execute algorithmic, market-neutral disposition of the 45,850,000 LEU shares via TWAP and VWAP volume-weighted mechanisms (Algorithms 10 and 11) not to exceed 1.5% of average daily trading volume, eliminating price disruption."
      },
      {
        heading: "Section 3: The 5% Trailing Corpus Perpetuity Constraint",
        content: "In compliance with perpetual trust preservation rules, annual distributions to operating purposes shall never exceed 5% of the trailing five-year moving average value of the corpus: D(t) <= 0.05 * A_5yr(t). All surplus yields are permanently reinvested in sovereign Treasury equivalents."
      },
      {
        heading: "Section 4: Daily Sweep Allocation Vector & 30 Row Homes SSDI/SSI Housing",
        content: "All realized liquidation proceeds, dividends, and interest sweeps into M&T Bank Account 2 are distributed daily at 4:00 PM EST according to the deterministic vector: 60% Treasury Equivalents (Capital Floor), 25% Baltimore Historic Rowhomes Housing Preservation SPV (300 Properties — including exactly 30 row homes dedicated as PSDLEF expedited housing for SSDI/SSI applicants awaiting disability adjudication), 10% Pro Se Litigant AI & Cognitive Grant Pool, and 5% Legal & Operational Reserves."
      }
    ]
  }
];

// EMAIL PRESENTATION PACKAGES (READY TO SEND)
export const EMAIL_PRESENTATION_PACKAGES: EmailPresentationPackage[] = [
  {
    id: "pkg-baltimore-county",
    recipientName: "Clerk of Court / MDEC Electronic Intake",
    recipientOrg: "Circuit Court for Baltimore County, Maryland",
    toEmail: "saocircuitcourtmdec@baltimorecountymd.gov",
    ccEmail: "Xaustino@hotmail.com",
    subject: "NOTICE OF PRESENTMENT & RULE 18 CONSOLIDATED EXACTION OF LIBERTY — Case No. C-03-CV-26-004128",
    purpose: "Formal electronic presentment to the Circuit Court for Baltimore County of the Omnibus Mandamus Petition, Rule 18 Exaction of Liberty arguments, and Maryland Rule 1-325(e) IFP Motion.",
    status: "Draft",
    attachedDocuments: [
      { title: "Omnibus_Consolidated_Mandamus_Petition_Baltimore_County.pdf", format: "PDF/A-3", fileSize: "4.8 MB", sha256Digest: "9f83b4ac1087e59871fa28419cb7891240c7e5a1b3c9" },
      { title: "Rule_18_Consolidated_Exaction_of_Liberty_Manifest.pdf", format: "PDF/A-3", fileSize: "2.1 MB", sha256Digest: "c87a1024b3329f65d87a4128b90123ef456789abcd01" },
      { title: "Maryland_Rule_1-325e_Verified_IFP_Affidavit.pdf", format: "PDF/A-3", fileSize: "820 KB", sha256Digest: "34901abcd789ef01234567890abcdef1234567890123" },
      { title: "Marriage_Certificate_Towson_MD_License_0309504160039411.pdf", format: "PDF", fileSize: "1.2 MB", sha256Digest: "7891240c7bc1q9f83b4ac1087e59871fa28419cb25c9" }
    ],
    emailBody: `TO THE CLERK OF THE CIRCUIT COURT FOR BALTIMORE COUNTY, MARYLAND:

PLEASE TAKE NOTICE that the undersigned Petitioner and Debtor-in-Possession in In re Caustin Lee McLaughlin, Case No. 24-2383 (D.D.C.), hereby presents this OMNIBUS CONSOLIDATED PETITION FOR WRIT OF MANDAMUS, DECLARATORY RELIEF, AND RULE 18 CONSOLIDATED EXACTION OF LIBERTY (Case No. C-03-CV-26-004128).

Attached hereto for formal presentment, routing confirmation, and MDEC indexing are:
1. Omnibus Verified Petition for Writ of Mandamus and Injunctive Order (Md. Rule 15-701)
2. Rule 18 Consolidated Exaction of Liberty Comprehensive Brief (Iterations I through IV)
3. Motion for Leave to Proceed In Forma Pauperis & Verified Affidavit of Indigency (Md. Rule 1-325(e))
4. Authenticated State of Maryland Marriage Certificate (Towson, Baltimore County License #0309504160039411) establishing spousal co-trustee standing for Caustin Lee McLaughlin and Juan Jose Fernandez.

Please advise the Petitioner of the formal assignment and MDEC docketing confirmation.

Respectfully submitted,
/s/ Caustin Lee McLaughlin
Managing Director / Debtor-in-Possession / Principal Trustee
1000 N. Woodington Rd., Apt. 228, Baltimore, MD 21223
Phone: (410) 826-8141 | Email: Xaustino@hotmail.com`
  },
  {
    id: "pkg-bny-mellon",
    recipientName: "Corporate Trust Operations & DTC Participant Clearing Desk",
    recipientOrg: "The Bank of New York Mellon",
    toEmail: "corptrust@bnymellon.com",
    ccEmail: "mark.somerstein@ropesgray.com, csctrust@cscinfo.com, Xaustino@hotmail.com",
    subject: "MANDATORY CUSTODIAL TRANSFER INSTRUCTION & DTC CLEARING DIRECTIVE — USEC / Centrus 1999 Indenture",
    purpose: "Mandatory directive commanding BNY Mellon Corporate Trust to pull legacy CUSIPs 917300AA1/AB9, apply the 0.0917 exchange ratio, and execute book-entry credit of 45,850,000 LEU common shares.",
    status: "Draft",
    attachedDocuments: [
      { title: "BNY_Mellon_DTC_Participant_Clearing_Directive.pdf", format: "PDF/A-3", fileSize: "3.2 MB", sha256Digest: "59871fa28419cb7891240c7bc1q9f83b4ac1087e5a1" },
      { title: "SEC_Form_13F_CUSIP_Reconciliation_Exhibit.pdf", format: "PDF/A-3", fileSize: "1.9 MB", sha256Digest: "000089843202000752281235pnc917300aa1917300ab9" },
      { title: "Certificate_of_Incumbency_and_Authority_Matrix_Tabs_A_D.pdf", format: "PDF/A-3", fileSize: "1.4 MB", sha256Digest: "1024crystalskyberdilithium87fips203204pqcstamp" }
    ],
    emailBody: `TO THE BANK OF NEW YORK MELLON — CORPORATE TRUST OPERATIONS:

Operating under the confirmed Plan of Reorganization in In re USEC Inc. (Case No. 14-10492), the Trust Indenture Act of 1939 (15 U.S.C. § 77aaa), and 11 U.S.C. §§ 541 & 1186, you are hereby ordered and instructed to execute the following operational sequence:

1. Reconcile legacy CUSIPs 917300AA1 ($350M Series A) and 917300AB9 ($150M Series B) from the DTC central depository vault.
2. Coordinate with transfer agent Computershare Trust Company, N.A. to apply the confirmed 0.0917 ratio, converting the $500,000,000.00 debt principal into 45,850,000 REORGANIZED COMMON SHARES of Centrus Energy Corp. (NYSE: LEU).
3. Transmit the converted book-entry shares, dividend yields, and distributions to:
   - Target Protocol Exchange Endpoint: https://americana-digital-reserve-exchange.ai.studio/
   - Bitcoin Reserve Address: bc1q9f83b4ac1087e59871fa28419cb7891240c7
   - M&T Bank DTC Participant ABA: 022000046 | SWIFT: MANTUS33

Attached are the authenticated Certificate of Incumbency, SEC Form 13F CUSIP Match Workpapers, and Master Signature Cards.

By Order of the Principal Trustee & Debtor-in-Possession,
/s/ Caustin Lee McLaughlin
Authorized Contact: Xaustino@hotmail.com`
  },
  {
    id: "pkg-dc-circuit",
    recipientName: "Clerk of Court / Appellate Intake",
    recipientOrg: "U.S. Court of Appeals for the District of Columbia Circuit",
    toEmail: "dcd_intake@dcd.uscourts.gov",
    ccEmail: "intake@cadc.uscourts.gov, Xaustino@hotmail.com",
    subject: "PETITION FOR SUPERVISORY MANDAMUS & IN CUSTODIA LEGIS REVIEW — Case No. 24-10492",
    purpose: "Transmission of Federal Appellate Mandamus Petition preserving estate assets held in custodia legis under Subchapter V Case No. 24-2383.",
    status: "Draft",
    attachedDocuments: [
      { title: "Master_Federal_Appellate_Mandamus_Omnibus_DC_Circuit.pdf", format: "PDF/A-3", fileSize: "5.1 MB", sha256Digest: "dc2410492ddc242383mandamusscotusallwritsact1651" },
      { title: "Mullane_Due_Process_13F_Information_Theoretic_Proof.pdf", format: "PDF/A-3", fileSize: "2.4 MB", sha256Digest: "mullane339us306mennonite462us791pidsexp10" },
      { title: "Federal_Rule_18_Consolidated_Exaction_Statement.pdf", format: "PDF/A-3", fileSize: "2.8 MB", sha256Digest: "frcp18exactionoflibertyiterations1through4fed" }
    ],
    emailBody: `TO THE CLERK OF THE U.S. COURT OF APPEALS FOR THE D.C. CIRCUIT:

Enclosed for filing in In re Estate of Caustin Lee McLaughlin, Case No. 24-10492, is Petitioner's MASTER FEDERAL APPELLATE MANDAMUS AND TRUST CLEARING OMNIBUS pursuant to 28 U.S.C. § 1651(a) and Federal Rule of Civil Procedure 18.

Petitioner asserts the complete $500,000,000.00 senior debt entitlement, 45,850,000 converted LEU common shares, and the four iterations of the Rule 18 Exaction of Liberty doctrine.

Submitted in forma pauperis pursuant to 28 U.S.C. § 1915 and ADA Title II mandates (Tennessee v. Lane).

Respectfully submitted,
/s/ Caustin Lee McLaughlin, Debtor-in-Possession`
  },
  {
    id: "pkg-mt-bank",
    recipientName: "Business Banking & Corporate Trust Services",
    recipientOrg: "Manufacturers and Traders Trust Company (M&T Bank)",
    toEmail: "commercialservices@mtb.com",
    ccEmail: "corptrust@mtb.com, Xaustino@hotmail.com",
    subject: "INSTITUTIONAL ACCOUNT ONBOARDING & SIGNATURE PACKAGE — Americana Digital Reserve LLC",
    purpose: "Delivery of executed 10-Agreement M&T Banking Suite including Account Control Agreement (ACA), Custodial Addendum, Corporate Resolution, and Wire Authorization.",
    status: "Draft",
    attachedDocuments: [
      { title: "MT_Bank_Master_Services_Agreement_Signed.pdf", format: "PDF", fileSize: "3.6 MB", sha256Digest: "mtb022000046mantus33msaaccountcontrolagreement" },
      { title: "MT_Bank_Corporate_Banking_Resolution_Dual_Signatory.pdf", format: "PDF", fileSize: "1.5 MB", sha256Digest: "mtbcorpbankingresdualsignatureover5000000" },
      { title: "Beneficial_Ownership_FinCEN_31CFR1010_230.pdf", format: "PDF", fileSize: "950 KB", sha256Digest: "fincenbeneficialownership25pctmclaughlinfernandez" }
    ],
    emailBody: `TO M&T BANK — BUSINESS BANKING & CORPORATE TRUST DIVISION:

Americana Digital Reserve LLC hereby submits the fully executed corporate account onboarding and depository packet for Account 1 (Operating Checking) and Account 2 (Escrow Sub-Account B):

- Master Services Agreement & Business Deposit Account Application
- Corporate Banking Resolution designating Caustin Lee McLaughlin (Managing Director) and Juan Jose Fernandez (Co-Trustee)
- ACH Origination & Fedwire/SWIFT Wire Transfer Authorizations
- Account Control Agreement (ACA) & Custodial Services Addendum
- Beneficial Ownership Certification (31 C.F.R. § 1010.230) and IRS Form W-9

Primary Depository Coordinates: ABA Routing 022000046 | SWIFT MANTUS33.

Sincerely,
Caustin Lee McLaughlin, Managing Director`
  },
  {
    id: "pkg-wyoming-sos",
    recipientName: "Business Division / Statutory Trust Filings",
    recipientOrg: "Secretary of State of Wyoming",
    toEmail: "business@wyo.gov",
    ccEmail: "Xaustino@hotmail.com",
    subject: "STATUTORY PURPOSE & LIQUIDATION TRUST FILING — Americana Liquidation & Sovereign Purpose Trust",
    purpose: "Formal filing of Certificate of Trust under Wyo. Stat. Ann. § 17-23-101 et seq. establishing the bankruptcy-remote liquidation trust.",
    status: "Draft",
    attachedDocuments: [
      { title: "Wyoming_Certificate_of_Trust_Executed.pdf", format: "PDF", fileSize: "1.8 MB", sha256Digest: "wyostatann1723101certificateoftrustsoswyogov" },
      { title: "Consent_of_Registered_Agent_Wyoming.pdf", format: "PDF", fileSize: "640 KB", sha256Digest: "wyoregisteredagentsolutions1621centralavecheyenne" },
      { title: "Master_Trust_Indenture_Liquidation_Schedule.pdf", format: "PDF", fileSize: "2.9 MB", sha256Digest: "mastertrustindentureliquidation45850000leushares" }
    ],
    emailBody: `TO THE SECRETARY OF STATE OF WYOMING — BUSINESS DIVISION:

Pursuant to the Wyoming Statutory Trust Act (Wyo. Stat. Ann. § 17-23-101 et seq.) and the Uniform Directed Trust Act, enclosed please find the Certificate of Trust and Consent of Registered Agent for:

AMERICANA LIQUIDATION & SOVEREIGN PURPOSE TRUST

This perpetual statutory purpose trust is established to hold in custody and liquidate $500,000,000.00 in restructured securities and 45,850,000 Centrus Energy Corp. common shares.

Registered Office: 1621 Central Avenue, Cheyenne, WY 82001.

Submitted by:
Caustin Lee McLaughlin, Principal Trustee`
  }
];

// THE 31-ALGORITHM EXECUTION SUITE
export const ALGORITHM_SUITE: AlgorithmDefinition[] = [
  { num: 1, id: "ALG-01", module: "Module I: Bond Valuation", name: "Accrued Interest", purpose: "Computes day-count fraction accrued interest under 30/360 or actual conventions.", formulation: "AI = (Days / YearBasis) * Coupon * Par", complexity: "O(1)", register: "Adopted" },
  { num: 2, id: "ALG-02", module: "Module I: Bond Valuation", name: "Make-Whole Premium", purpose: "Discounts remaining cash flows at Adjusted Treasury Rate + contractual spread.", formulation: "PV = sum_{t=1}^N C / (1 + (r_f + delta)/2)^{2t} + F / (1 + (r_f + delta)/2)^{2N}", complexity: "O(N)", register: "Adopted" },
  { num: 3, id: "ALG-03", module: "Module I: Bond Valuation", name: "Yield to Maturity (Newton-Raphson)", purpose: "Iterative root-finding solver for internal rate of return on debt instruments.", formulation: "y_{k+1} = y_k - (P(y_k) - P_market) / P'(y_k)", complexity: "O(k * N)", register: "Adopted" },
  { num: 4, id: "ALG-04", module: "Module II: Asset Conversion", name: "Debt-to-Equity Conversion", purpose: "Converts allowed bond principal into reorganized equity at Plan ratio.", formulation: "N_shares = Principal * Ratio = $500M * 0.0917 = 45,850,000 shs", complexity: "O(1)", register: "Model/Simulation" },
  { num: 5, id: "ALG-05", module: "Module II: Asset Conversion", name: "Pro Rata Distribution", purpose: "Allocates finite cash or equity distributions proportionally across claimants.", formulation: "D_i = (Claim_i / TotalClaims) * DistributablePool", complexity: "O(n)", register: "Adopted" },
  { num: 6, id: "ALG-06", module: "Module II: Asset Conversion", name: "Fractional Share Liquidation", purpose: "Aggregates and liquidates odd-lot fractional shares under DTC rules.", formulation: "CashFrac = FracPart * P_VWAP", complexity: "O(n)", register: "Adopted" },
  { num: 7, id: "ALG-07", module: "Module III: Volatility Modelling", name: "Realized Volatility", purpose: "Calculates annualized sample standard deviation of log returns.", formulation: "sigma_ann = sqrt(252 / N * sum_{t=1}^N (r_t - r_mean)^2)", complexity: "O(n)", register: "Adopted" },
  { num: 8, id: "ALG-08", module: "Module III: Volatility Modelling", name: "GARCH(1,1)", purpose: "Estimates conditional time-varying variance with autoregressive volatility.", formulation: "sigma_t^2 = omega + alpha * eps_{t-1}^2 + beta * sigma_{t-1}^2", complexity: "O(n)", register: "Adopted" },
  { num: 9, id: "ALG-09", module: "Module III: Volatility Modelling", name: "Implied Volatility (Black-Scholes Inversion)", purpose: "Extracts forward-looking volatility surface from options market prices.", formulation: "sigma_imp = BS_Inverse(C_obs, S, K, T, r)", complexity: "O(k)", register: "Adopted" },
  { num: 10, id: "ALG-10", module: "Module IV: Execution Optimization", name: "TWAP Execution", purpose: "Time-Weighted Average Price algorithmic order slicing over market sessions.", formulation: "SliceSize = TotalOrder / NumSlices", complexity: "O(n)", register: "Adopted" },
  { num: 11, id: "ALG-11", module: "Module IV: Execution Optimization", name: "VWAP Execution", purpose: "Volume-Weighted Average Price execution tracking historical volume curve.", formulation: "Slice_i = TotalOrder * (VolProfile_i / TotalExpectedVol)", complexity: "O(n)", register: "Adopted" },
  { num: 12, id: "ALG-12", module: "Module IV: Execution Optimization", name: "Implementation Shortfall (Perold)", purpose: "Measures execution drag including commissions, spread, and market impact.", formulation: "IS = (P_executed - P_decision) * Q + Fees", complexity: "O(1)", register: "Adopted" },
  { num: 13, id: "ALG-13", module: "Module V: Derivatives & Hedging", name: "Black-Scholes Analytic Pricing", purpose: "Continuous-time European option valuation under geometric Brownian motion.", formulation: "C = S * N(d1) - K * e^{-rT} * N(d2)", complexity: "O(1)", register: "Adopted" },
  { num: 14, id: "ALG-14", module: "Module V: Derivatives & Hedging", name: "Dynamic Delta Hedging", purpose: "Rebalances underlying equity hedge to maintain delta-neutral posture.", formulation: "HedgePosition = -Delta * OptionQuantity", complexity: "O(1)", register: "Adopted" },
  { num: 15, id: "ALG-15", module: "Module V: Derivatives & Hedging", name: "Gamma Scalping", purpose: "Monetizes underlying asset realized volatility against implied volatility.", formulation: "PnL_gamma = 0.5 * Gamma * (Delta S)^2 - Theta * dt", complexity: "O(1)", register: "Adopted" },
  { num: 16, id: "ALG-16", module: "Module VI: Risk Management", name: "Value at Risk (VaR)", purpose: "Computes maximum expected portfolio loss at (1 - alpha) confidence.", formulation: "VaR_alpha = -mu * dt + z_alpha * sigma * sqrt(dt)", complexity: "O(1)", register: "Adopted" },
  { num: 17, id: "ALG-17", module: "Module VI: Risk Management", name: "Conditional VaR / Expected Shortfall", purpose: "Averages expected losses in tail events exceeding VaR threshold.", formulation: "CVaR = E[ L | L >= VaR_alpha ]", complexity: "O(n)", register: "Adopted" },
  { num: 18, id: "ALG-18", module: "Module VI: Risk Management", name: "Maximum Drawdown", purpose: "Tracks peak-to-trough decline across trust portfolio valuation history.", formulation: "MDD = max_{t} (Peak_t - Value_t) / Peak_t", complexity: "O(n)", register: "Adopted" },
  { num: 19, id: "ALG-19", module: "Module VII: Yield Optimization", name: "Nelson-Siegel Yield Curve", purpose: "Parametric fitting of term structure of interest rates across maturities.", formulation: "y(t) = beta0 + beta1 * ((1 - e^{-t/tau})/(t/tau)) + beta2 * ((1 - e^{-t/tau})/(t/tau) - e^{-t/tau})", complexity: "O(k)", register: "Adopted" },
  { num: 20, id: "ALG-20", module: "Module VII: Yield Optimization", name: "Duration and Convexity", purpose: "Computes first- and second-order price sensitivity to interest rate shifts.", formulation: "D_mod = -1/P * dP/dy;  C = 1/P * d^2P/dy^2;  Delta P / P approx -D_mod * Delta y + 0.5 * C * (Delta y)^2", complexity: "O(n)", register: "Adopted" },
  { num: 21, id: "ALG-21", module: "Module VIII: Liquidity & AMM", name: "Constant Product Market Maker (x*y = k)", purpose: "Computes automated market maker pricing for tokenized asset reserve pools.", formulation: "x * y = k;  Delta y = y - k / (x + Delta x);  P_spot = y / x", complexity: "O(1)", register: "Adopted" },
  { num: 22, id: "ALG-22", module: "Module VIII: Liquidity & AMM", name: "Concentrated Liquidity Allocation", purpose: "Concentrates pool capital within observed ranges to boost capital efficiency 100-400x.", formulation: "L = sqrt(x * y);  Delta x = Delta(1/sqrt(P)) * L;  Delta y = Delta(sqrt(P)) * L", complexity: "O(1)", register: "Adopted" },
  { num: 23, id: "ALG-23", module: "Module VIII: Liquidity & AMM", name: "Impermanent Loss Calculation", purpose: "Measures divergence loss for liquidity providers relative to buy-and-hold.", formulation: "IL = (2 * sqrt(r_p)) / (1 + r_p) - 1", complexity: "O(1)", register: "Adopted" },
  { num: 24, id: "ALG-24", module: "Module IX: Portfolio Optimization", name: "Markowitz Mean-Variance Optimization", purpose: "Solves quadratic programming problem to find optimal risk-return weights.", formulation: "min_w  0.5 * w^T Sigma w - lambda * mu^T w  s.t. 1^T w = 1, w >= 0", complexity: "O(n^3)", register: "Adopted" },
  { num: 25, id: "ALG-25", module: "Module IX: Portfolio Optimization", name: "Black-Litterman Expected Returns", purpose: "Blends market equilibrium returns with investor views via Bayesian updating.", formulation: "E[R] = [ (tau Sigma)^{-1} + P^T Omega^{-1} P ]^{-1} * [ (tau Sigma)^{-1} Pi + P^T Omega^{-1} Q ]", complexity: "O(n^3)", register: "Adopted" },
  { num: 26, id: "ALG-26", module: "Module IX: Portfolio Optimization", name: "Risk Parity Allocation (Qian)", purpose: "Equalizes risk contributions across all asset classes without return forecasts.", formulation: "RiskContrib_i = w_i * (Sigma w)_i / sqrt(w^T Sigma w) = 1/N", complexity: "O(k * n)", register: "Adopted" },
  { num: 27, id: "ALG-27", module: "Module X: Post-Quantum Settlement", name: "ML-KEM-1024 Key Encapsulation", purpose: "Standardized in NIST FIPS 203; provides 256-bit post-quantum secret sharing.", formulation: "ML-KEM.Encaps(pk_recv) -> (c, ss) over R_q = Z_q[X]/(X^256 + 1)", complexity: "O(n^2)", register: "Adopted" },
  { num: 28, id: "ALG-28", module: "Module X: Post-Quantum Settlement", name: "ML-DSA-87 Digital Signature", purpose: "NIST FIPS 204 quantum-resistant signatures for legal filings and banking.", formulation: "sig = ML-DSA-87.Sign(sk_trustee, H(doc)); Verify(pk, H(doc), sig) == true", complexity: "O(n^2)", register: "Adopted" },
  { num: 29, id: "ALG-29", module: "Module X: Post-Quantum Settlement", name: "SHA3-256 Merkle-DAG Commitment", purpose: "Commits transaction and pleading mutations to Byzantine fault-tolerant audit chain.", formulation: "H_i = SHA3-256( H_{i-1} || T_i || ML-DSA-87(H_i, k_sig) )", complexity: "O(m)", register: "Model/Simulation" },
  { num: 30, id: "ALG-30", module: "Module XI: Accessibility & Cognitive", name: "Cognitive Load Estimation (Interaction Telemetry)", purpose: "Estimates user cognitive load from keystroke dynamics and paging entropy to simplify UI.", formulation: "L_hat(t) = w1 * sigma_IKI + w2 * N_backtrack + w3 * T_fixation + w4 * E_scroll", complexity: "O(1)", register: "Proposal/Design Target" },
  { num: 31, id: "ALG-31", module: "Module XI: Accessibility & Cognitive", name: "Plain-Language Legal Translation (RAG)", purpose: "Translates complex statutes and case-law into grade-level summaries with citation guards.", formulation: "RAG(corpus, query) -> Flesch-Kincaid Grade 6 summary with inline pin-cites", complexity: "O(log N)", register: "Model/Simulation" }
];

export const CUSIP_PORTFOLIO_DATA: CUSIPEntry[] = [
  {
    issuer: "USEC Inc. Senior Notes A",
    titleOfClass: "Senior Debt 6.625% Due 2006",
    cusip: "917300AA1",
    valueK: 350000,
    sharesOrPrincipal: "$350,000,000",
    discretion: "Sole (DTC Clearing Vault)",
    votingAuth: "350,000,000",
    relevance: "Primary Reorganized Indenture Claim -> 32,095,000 LEU Shares"
  },
  {
    issuer: "USEC Inc. Senior Notes B",
    titleOfClass: "Senior Debt 6.750% Due 2009",
    cusip: "917300AB9",
    valueK: 150000,
    sharesOrPrincipal: "$150,000,000",
    discretion: "Sole (DTC Clearing Vault)",
    votingAuth: "150,000,000",
    relevance: "Primary Reorganized Indenture Claim -> 13,755,000 LEU Shares"
  },
  {
    issuer: "BlackRock Inc. Class A",
    titleOfClass: "Common Stock",
    cusip: "09247X101",
    valueK: 1450000,
    sharesOrPrincipal: "35,000,000",
    discretion: "Defined Manager",
    votingAuth: "35,000,000",
    relevance: "Q3 2002 13F-HR Institutional Benchmark"
  },
  {
    issuer: "General Electric Co.",
    titleOfClass: "Common Stock",
    cusip: "369604103",
    valueK: 315000,
    sharesOrPrincipal: "12,800,000",
    discretion: "Shared-Defined",
    votingAuth: "12,800,000",
    relevance: "Institutional Custodial Network Verification"
  },
  {
    issuer: "Microsoft Corp.",
    titleOfClass: "Common Stock",
    cusip: "594918104",
    valueK: 280600,
    sharesOrPrincipal: "5,200,000",
    discretion: "Sole",
    votingAuth: "5,200,000",
    relevance: "PNC/Mellon Dual Participant Clearing Tier"
  },
  {
    issuer: "Pfizer Inc.",
    titleOfClass: "Common Stock",
    cusip: "717081103",
    valueK: 195200,
    sharesOrPrincipal: "6,800,000",
    discretion: "Sole",
    votingAuth: "6,800,000",
    relevance: "DTC Depository Baseline Proof"
  },
  {
    issuer: "Abbott Laboratories",
    titleOfClass: "Common Stock",
    cusip: "002824100",
    valueK: 142500,
    sharesOrPrincipal: "3,500,000",
    discretion: "Sole",
    votingAuth: "3,500,000",
    relevance: "SEC Accession No. 0000898432-02-000752 File No. 28-1235"
  },
  {
    issuer: "AOL Time Warner Inc.",
    titleOfClass: "Common Stock",
    cusip: "00184A105",
    valueK: 210800,
    sharesOrPrincipal: "16,200,000",
    discretion: "Shared-Defined",
    votingAuth: "16,200,000",
    relevance: "CUSIP Matching Mechanics Verification"
  },
  {
    issuer: "AT&T Corp.",
    titleOfClass: "Common Stock",
    cusip: "001957505",
    valueK: 98400,
    sharesOrPrincipal: "7,100,000",
    discretion: "Sole",
    votingAuth: "7,100,000",
    relevance: "Institutional Reconciliation Benchmark"
  }
];

export const DYREO_ALLOCATION_VECTOR: SweepAllocation[] = [
  {
    key: "treasury",
    category: "PSDLEF Perpetual Trust Corpus (U.S. Treasury Equivalents)",
    percentage: 60,
    description: "Principal preservation in short-term sovereign risk-free securities and continuous liquidity baseline.",
    formulaSymbol: "\\alpha_{\\text{Treasury}} = 0.60"
  },
  {
    key: "real_estate",
    category: "Baltimore Historic Rowhomes Housing Preservation SPV (300 Properties — 30 SSDI/SSI Units)",
    percentage: 25,
    description: "Capital expenditures for historic rowhome building envelope preservation, structural longevity, and tenant stabilization requiring Housing Preservation Ratio HPR >= 0.85, including exactly 30 dedicated row homes as PSDLEF expedited supportive housing for SSDI/SSI applicants.",
    formulaSymbol: "\\beta_{\\text{Housing}} = 0.25"
  },
  {
    key: "ada",
    category: "Pro Se Litigant AI & Cognitive Accommodation Grant Pool",
    percentage: 10,
    description: "ADA Title II / 28 C.F.R. § 35.130(b)(7) accommodations and cognitive prosthetic legal automation research.",
    formulaSymbol: "\\gamma_{\\text{ADA}} = 0.10"
  },
  {
    key: "reserve",
    category: "Legal Defense & Emergency Operational Reserve",
    percentage: 5,
    description: "Fiduciary custody oversight, audit compliance, transfer agent filings, and emergency liquidity contingency.",
    formulaSymbol: "\\delta_{\\text{Reserve}} = 0.05"
  }
];

export const EXECUTION_TABS: ExecutionTab[] = [
  {
    id: "tab-a",
    tabLetter: "A",
    title: "Master Authority Matrix & Signature Card",
    category: "Banking",
    inkRequirement: "C + J (Dual Ink Signatures for > $10,000.00)",
    parties: ["Caustin Lee McLaughlin (Principal Trustee)", "Juan Jose Fernandez (Co-Trustee)"],
    status: "Ready for Signature",
    signatureRequiredFrom: ['caustin', 'juan'],
    description: "Designates Account 1 (Operating Custody) and Account 2 (Escrow Sub-Account B). Dual signature threshold enforced above $10,000.00.",
    contentSnippet: "All depository transactions anchored to SHA3-256 Merkle-chained audit ledger under PSDLEF Purpose Trust."
  },
  {
    id: "tab-b",
    tabLetter: "B",
    title: "IRS Form W-9 — Entity Certification",
    category: "Regulatory",
    inkRequirement: "C + J Acknowledgment",
    parties: ["Caustin Lee McLaughlin (Grantor / Principal Trustee)", "Juan Jose Fernandez (Co-Trustee)"],
    status: "Ready for Signature",
    signatureRequiredFrom: ['caustin', 'juan'],
    description: "Certifies PSDLEF-Americana-SSA-TRUST as a Grantor Purpose Trust / Disregarded Entity under Md. Code Ann., Est. & Trusts § 14.5-408.",
    contentSnippet: "TIN/EIN verified on file; U.S. Person status certified under penalties of perjury."
  },
  {
    id: "tab-c",
    tabLetter: "C",
    title: "Certificate of Incumbency",
    category: "Regulatory",
    inkRequirement: "C + J",
    parties: ["Caustin Lee McLaughlin", "Juan Jose Fernandez"],
    status: "Ready for Signature",
    signatureRequiredFrom: ['caustin', 'juan'],
    description: "Verifies incumbent trustees with joint spousal fiduciary authority per Baltimore County Marriage License #0309504160039411.",
    contentSnippet: "Caustin Lee McLaughlin holds primary signatory power; Juan Jose Fernandez holds full co-signatory authority."
  },
  {
    id: "tab-d",
    tabLetter: "D",
    title: "BNY Mellon Trust / Custody Agreement",
    category: "Banking",
    inkRequirement: "C + J",
    parties: ["Caustin Lee McLaughlin", "The Bank of New York Mellon Corporate Trust"],
    status: "Ready for Signature",
    signatureRequiredFrom: ['caustin', 'juan'],
    description: "Directs BNY Mellon as Master Indenture Depository to receive, hold, and credit 45,850,000 reorganized Centrus common shares.",
    contentSnippet: "Governing Law: Maryland Equity & Federal Trust Indenture Act. Account 1: Converted LEU Stock; Account 2: Yield Sweep."
  },
  {
    id: "tab-e",
    tabLetter: "E",
    title: "Automated Daily Sweep Authorization",
    category: "Banking",
    inkRequirement: "C + J",
    parties: ["Caustin Lee McLaughlin", "Juan Jose Fernandez"],
    status: "Ready for Signature",
    signatureRequiredFrom: ['caustin', 'juan'],
    description: "Authorizes automated daily sweep at 4:00 PM EST: 60% Treasury, 25% Microgrid SPV, 10% ADA Grant, 5% Operational Reserve.",
    contentSnippet: "Formula: D(t) = Integral from 0 to t of Y(tau) * [0.60, 0.25, 0.10, 0.05]^T dtau."
  },
  {
    id: "tab-f",
    tabLetter: "F",
    title: "Post-Quantum Cryptographic Access Agreement",
    category: "Regulatory",
    inkRequirement: "C + J",
    parties: ["Caustin Lee McLaughlin (HSM Slot 01)", "Juan Jose Fernandez (HSM Slot 02)"],
    status: "Ready for Signature",
    signatureRequiredFrom: ['caustin', 'juan'],
    description: "Mandates NIST FIPS 203 ML-KEM-1024 encapsulation and NIST FIPS 204 ML-DSA-87 digital signatures for all disbursements > $10,000.",
    contentSnippet: "Encapsulation over R_q = Z_q[X]/(X^256 + 1) (q = 3329); BLAKE3 digests and SHA3-256 Merkle chain verification."
  },
  {
    id: "tab-g",
    tabLetter: "G",
    title: "DTC Clearing & Share Conversion Directive",
    category: "CUSIP",
    inkRequirement: "C + J",
    parties: ["Caustin Lee McLaughlin", "Computershare Trust Co., N.A.", "BNY Mellon Corporate Trust"],
    status: "Ready for Signature",
    signatureRequiredFrom: ['caustin', 'juan'],
    description: "Commands immediate CUSIP mapping of 917300AA1 ($350M) and 917300AB9 ($150M) at 0.0917 ratio into 45,850,000 common shares of LEU.",
    contentSnippet: "Direct transmission to Americana Digital Reserve Exchange endpoint and M&T Bank DTC Participant ABA: 022000046."
  },
  {
    id: "tab-h",
    tabLetter: "H",
    title: "M&T Bank 10-Agreement Master Banking Suite",
    category: "Banking",
    inkRequirement: "C + J",
    parties: ["Caustin Lee McLaughlin", "Manufacturers and Traders Trust Company (M&T Bank)"],
    status: "Ready for Signature",
    signatureRequiredFrom: ['caustin', 'juan'],
    description: "Full suite comprising Master Services Agreement, Business Deposit App, Corporate Resolution, ACH, Wire, Positive Pay, and Account Control Agreement (ACA).",
    contentSnippet: "Primary Onshore Depository: M&T Bank Baltimore Commercial Hub, ABA 022000046, SWIFT MANTUS33."
  },
  {
    id: "tab-i",
    tabLetter: "I",
    title: "Wyoming Statutory Liquidation Trust Certificate & Agreement",
    category: "Trust Formation",
    inkRequirement: "C + J + Notary",
    parties: ["Caustin Lee McLaughlin (Principal Trustee)", "Juan Jose Fernandez (Co-Trustee)", "Secretary of State of Wyoming"],
    status: "Ready for Signature",
    signatureRequiredFrom: ['caustin', 'juan'],
    description: "Perpetual purpose liquidation trust formed under Wyo. Stat. Ann. § 17-23-101 et seq. for bankruptcy-remote asset custody.",
    contentSnippet: "Americana Liquidation & Sovereign Purpose Trust (1621 Central Ave, Cheyenne, WY 82001)."
  },
  {
    id: "tab-j",
    tabLetter: "J",
    title: "State of Maryland / Baltimore County Notarial Jurat",
    category: "Notarial",
    inkRequirement: "C + J + Notary Public (Dual Seal)",
    parties: ["Caustin Lee McLaughlin", "Juan Jose Fernandez", "Notary Public (State of MD / Baltimore County)"],
    status: "Notarization Required",
    signatureRequiredFrom: ['caustin', 'juan'],
    description: "Official Maryland jurat in Baltimore County certifying personal appearance and verified identity of both trustees.",
    contentSnippet: "Subscribed and sworn to before me in the County of Baltimore, State of Maryland, this 1st day of November, 2026."
  }
];

export const COURT_ROUTING_TABLE: CourtIntake[] = [
  {
    courtName: "Circuit Court for Baltimore County, Maryland",
    venueType: "County",
    email: "saocircuitcourtmdec@baltimorecountymd.gov",
    jurisdiction: "Md. Code Ann., Cts. & Jud. Proc. §§ 1-201, 1-501, 3-403, 6-201 (Towson, MD)",
    role: "Primary State Court of Record (Case No. C-03-CV-26-004128) / Mandamus under Md. Rule 15-701",
    filingFormat: "MDEC / Paper Verified Petition"
  },
  {
    courtName: "U.S. Court of Appeals for the District of Columbia Circuit",
    venueType: "Federal Appellate",
    email: "dcd_intake@dcd.uscourts.gov / intake@cadc.uscourts.gov",
    jurisdiction: "28 U.S.C. § 1651(a) (All Writs Act) / Supervisory Mandamus",
    role: "Case No. 24-10492 Supervisory Review & In Custodia Legis Asset Oversight",
    filingFormat: "CM/ECF Appellate Docket"
  },
  {
    courtName: "U.S. District Court for the District of Columbia",
    venueType: "Federal Bankruptcy",
    email: "dcd_intake@dcd.uscourts.gov",
    jurisdiction: "28 U.S.C. § 1331 / 11 U.S.C. §§ 541 & 1186 (Subchapter V)",
    role: "Case No. 24-2383 (In re Caustin Lee McLaughlin, Debtor-in-Possession)",
    filingFormat: "CM/ECF Bankruptcy Division"
  },
  {
    courtName: "Supreme Court of the United States",
    venueType: "Federal Appellate",
    email: "intake@supremecourt.gov",
    jurisdiction: "28 U.S.C. § 1651(a) & Supreme Court Rule 20",
    role: "Master Supervisory Mandamus / Protective Rule 20 Application",
    filingFormat: "SCOTUS Electronic Intake / Rule 29"
  },
  {
    courtName: "Circuit Court for Baltimore City, Maryland",
    venueType: "State Equity",
    email: "saocircuitcourtmdec@stattorney.org",
    jurisdiction: "Md. Code Ann., Cts. & Jud. Proc. § 1-501 (Equity Division)",
    role: "Case No. 24-C-26-003970 (Ancillary Commercial Docket)",
    filingFormat: "MDEC / Judicial Equity"
  }
];

export const COUNTERPARTIES_TABLE: CounterpartyInfo[] = [
  {
    role: "Depository Custodian & Indenture Trustee",
    name: "The Bank of New York Mellon (BNY Mellon)",
    address: "240 Greenwich Street, New York, NY 10286",
    email: "corptrust@bnymellon.com / registered agent",
    notes: "Clearing Venue for DTC Participant settlement, CUSIP mapping, and book-entry stock issuance"
  },
  {
    role: "Successor Transfer Agent & Claims Administrator",
    name: "Computershare Trust Company, N.A.",
    address: "150 Royall Street, Canton, MA 02021",
    email: "directorate-corporateactions@computershare.com",
    notes: "Direct share registry conversion bridge under confirmed 2014 Plan of Reorganization"
  },
  {
    role: "Successor Obligor Corporation",
    name: "Centrus Energy Corp. (f/k/a USEC Inc.)",
    address: "6901 Rockledge Drive, Bethesda, MD 20817",
    email: "corpcomm@usec.com / investorrelations@centrusenergy.com",
    notes: "NYSE: LEU (Telephone: 301-564-3200). Successor obligor of 1999 Senior Notes Indenture"
  },
  {
    role: "Successor Trustee / Claims Administrator",
    name: "Delaware Trust Company, Corporate Trust Administration",
    address: "Little Falls Centre I, 2711 Centerville Rd., Wilmington, DE 19808",
    email: "csctrust@cscinfo.com",
    notes: "Successor Indenture Trustee under Class 4 Allowed Claims administration"
  },
  {
    role: "Lead Restructuring Counsel for Obligor",
    name: "Mark R. Somerstein, Esq. / Ropes & Gray LLP",
    address: "1211 Avenue of the Americas, New York, NY 10036",
    email: "mark.somerstein@ropesgray.com",
    notes: "Lead restructuring counsel in In re USEC Inc. bankruptcy proceedings"
  },
  {
    role: "Onshore Depository Co-Custodian",
    name: "M&T Bank Corporate Trust & Business Banking",
    address: "25 South Charles Street, Baltimore, MD 21201",
    email: "commercialservices@mtb.com | ABA: 022000046",
    notes: "Primary depository receiving bank for cash distributions, corporate accounts, and DYREO daily sweeps"
  },
  {
    role: "CUSIP & ISIN Numbering Authority",
    name: "CUSIP Global Services (S&P Global Market Intelligence)",
    address: "55 Water Street, 45th Floor, New York, NY 10041",
    email: "cusip_orders@cusip.com",
    notes: "Official issuer numbering and eligibility validation for ADR Series A and tokenized instruments"
  },
  {
    role: "Wyoming Registered Agent",
    name: "Wyoming Corporate Services / Registered Agent Solutions",
    address: "1621 Central Avenue, Cheyenne, WY 82001",
    email: "agents@wyocsr.com",
    notes: "Registered statutory office for Americana Liquidation & Sovereign Purpose Trust"
  }
];

export const UNIFIED_DOCUMENT_PARTS = [
  {
    id: "part-1",
    roman: "I",
    title: "Master Caption, Executive Dual-Forum Mandate & Alignment",
    subsections: [
      "1.1 Baltimore County Circuit Court & Federal Appellate Caption Alignment",
      "1.2 Master $500,000,000.00 Estate Capitalization Vector (45,850,000 LEU Shares)",
      "1.3 Target Settlement Protocol Coordinates & Electronic Vault Endpoints"
    ]
  },
  {
    id: "part-2",
    roman: "II",
    title: "Rule 18 Consolidated Exaction of Liberty (Every Iteration: I through IV)",
    subsections: [
      "2.1 Federal Rule 18(a) / Md. Rule 2-303 Joinder of Claims & Exaction Doctrine",
      "2.2 Iteration I: Constitutional & Physical Liberty Exaction (§ 1983 / Nieves / Gonzalez)",
      "2.3 Iteration II: Administrative Mortality & Disability Queue Exaction (SSA / MORTAR)",
      "2.4 Iteration III: Biological & Genomic Data Sovereignty Exaction (Non-Consensual Extraction)",
      "2.5 Iteration IV: Indenture & Corporate Depository Property Exaction ($500M Reorganized Equity)"
    ]
  },
  {
    id: "part-3",
    roman: "III",
    title: "Verified Petition for Peremptory Mandamus, Declaratory Relief & Accounting",
    subsections: [
      "3.1 Circuit Court for Baltimore County Equitable Jurisdiction (Md. Rule 15-701)",
      "3.2 Factual Background: 1999 Indenture to 2014 Centrus Reorganization",
      "3.3 Formal Causes of Action (Counts I through IV)",
      "3.4 Comprehensive Prayer for Mandatory Injunctive Relief"
    ]
  },
  {
    id: "part-4",
    roman: "IV",
    title: "Motion to Proceed In Forma Pauperis (IFP) & ADA Title II Accommodation Mandate",
    subsections: [
      "4.1 Statutory Fee Waiver Grounds under 28 U.S.C. § 1915 & Md. Rule 1-325(e)",
      "4.2 In Custodia Legis Estate Status under 11 U.S.C. §§ 541 & 1186",
      "4.3 Title II ADA Mandatory Cognitive Accommodation (Tennessee v. Lane)",
      "4.4 Sweller Cognitive Load Optimization Formulation"
    ]
  },
  {
    id: "part-5",
    roman: "V",
    title: "Procedural Due Process & Information-Theoretic 13F Re-Identifiability Proof",
    subsections: [
      "5.1 Constitutional Notice Standard under Mullane and Mennonite",
      "5.2 Failure of Constructive Publication Notice in 2014 Centrus Reorganization",
      "5.3 Mathematical Proof: Asymptotic Convergence of Re-Identifiability P(ID|S) -> 1.0",
      "5.4 Equitable Tolling of Bar Dates under 11 U.S.C. § 105(a)"
    ]
  },
  {
    id: "part-6",
    roman: "VI",
    title: "SEC Form 13F Institutional Evidence Table & CUSIP Portfolio Verification",
    subsections: [
      "6.1 SEC Form 13F-HR Accession No. 0000898432-02-000752 (PNC File No. 28-1235)",
      "6.2 Exhaustive CUSIP Reconciliation Table (Series A & B Notes)",
      "6.3 Unified $500,000,000.00 Indenture Capitalization Ledger Cross-Verification"
    ]
  },
  {
    id: "part-7",
    roman: "VII",
    title: "Depository Custodial Orders & DTC Participant Clearing Directives to BNY Mellon",
    subsections: [
      "7.1 CUSIP Ledger Reconciliation Order (917300AA1 & 917300AB9)",
      "7.2 Mandatory Share Conversion: Issuance of 45,850,000 Common Shares of NYSE: LEU",
      "7.3 DTC Book-Entry Protocol Clearing Order to Protocol Exchange Target",
      "7.4 Co-Custodian Onboarding: M&T Bank Corporate Trust Account Architecture"
    ]
  },
  {
    id: "part-8",
    roman: "VIII",
    title: "Wyoming Statutory Liquidation Trust Formation (Wyo. Stat. Ann. § 17-23-101)",
    subsections: [
      "8.1 Wyoming Certificate of Trust for Americana Liquidation & Purpose Trust",
      "8.2 Quad-Cameral Fiduciary Separation Matrix (Wyo. Stat. Ann. § 17-23-114)",
      "8.3 Order of Liquidation & Algorithmic Market-Neutral Pacing (TWAP/VWAP)",
      "8.4 5% Trailing Corpus Perpetuity Constraint & Sovereign Treasury Invariant"
    ]
  },
  {
    id: "part-9",
    roman: "IX",
    title: "Continuous-Time DYREO Control Engine & Historic Real Estate Housing Preservation",
    subsections: [
      "9.1 Merton Stochastic Optimal Control Hamilton-Jacobi-Bellman (HJB) PDE",
      "9.2 Deterministic Daily Sweep Vector [0.60, 0.25, 0.10, 0.05]",
      "9.3 Baltimore Rowhomes Historic Housing Preservation & Capital Infrastructure (300 Properties)",
      "9.4 Structural Longevity & Physical Capital Preservation Kinetics"
    ]
  },
  {
    id: "part-10",
    roman: "X",
    title: "The 31-Algorithm Financial Execution Suite & Post-Quantum DAG Architecture",
    subsections: [
      "10.1 Complete 31-Algorithm Suite Specification (Modules I through XI)",
      "10.2 NIST FIPS 203 Module-Lattice Key Encapsulation (ML-KEM-1024)",
      "10.3 NIST FIPS 204 Digital Signature Standard (ML-DSA-87)",
      "10.4 Directed Acyclic Graph (DAG-Merkle) SHA3-256 BSBS Audit Ledger"
    ]
  },
  {
    id: "part-11",
    roman: "XI",
    title: "Spousal Fiduciary Standing, Baltimore County Marriage Record & Credentials",
    subsections: [
      "11.1 Baltimore County Circuit Court Marriage Certificate (License 0309504160039411)",
      "11.2 Joint Household & Spousal Co-Trustee Standing of McLaughlin & Fernandez",
      "11.3 DOJ Executive Office for Immigration Review (EOIR-59) Privacy Release",
      "11.4 District of Columbia Driver License Authentication (#4042567)"
    ]
  },
  {
    id: "part-12",
    roman: "XII",
    title: "Master Verification under Penalty of Perjury & Consolidated Certificate of Service",
    subsections: [
      "12.1 Unconditional Master Verification Pursuant to 28 U.S.C. § 1746",
      "12.2 Unified Certificate of Service Across Courts & Counterparties",
      "12.3 Official Instructions to Baltimore County & BNY Mellon DTC Intake Officers"
    ]
  }
];
