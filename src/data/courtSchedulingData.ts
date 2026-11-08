/**
 * Court Scheduling & Master Pleading Milestones Dataset
 * 
 * Synchronized directly with the 12-part Master Mandamus, Rule 18 Consolidated Exaction,
 * and Wyoming Statutory Purpose Trust Indenture filings.
 */

export interface CourtAttendee {
  email: string;
  displayName: string;
  role: string;
  selectedByDefault: boolean;
}

export interface MasterPleadingMilestone {
  id: string;
  milestoneTitle: string;
  instrumentPart: string;
  docketNumber: string;
  jurisdiction: 'state' | 'federal' | 'trust' | 'agency';
  jurisdictionLabel: string;
  courtName: string;
  location: string;
  scheduledDate: string; // ISO 8601 string
  durationMinutes: number;
  statutoryBasis: string;
  urgency: 'critical' | 'high' | 'medium';
  actionRequested: string;
  description: string;
  defaultAttendees: CourtAttendee[];
}

export const MASTER_PLEADING_MILESTONES: MasterPleadingMilestone[] = [
  {
    id: 'milestone-balt-mandamus-show-cause',
    milestoneTitle: 'Circuit Court for Baltimore County — Rule 15-701 Show Cause Hearing',
    instrumentPart: 'Part I & Part IV: Verified Petition for Ministerial Mandamus & Declaratory Judgment',
    docketNumber: 'Case No. C-03-CV-26-004128',
    jurisdiction: 'state',
    jurisdictionLabel: 'Circuit Court for Baltimore County (State Equity)',
    courtName: 'Circuit Court for Baltimore County, Maryland',
    location: 'County Courts Building, 401 Bosley Avenue, Courtroom 3, Towson, MD 21204',
    scheduledDate: '2026-11-12T09:30:00-05:00',
    durationMinutes: 90,
    statutoryBasis: 'Md. Rule 15-701; Md. Code Ann., Cts. & Jud. Proc. § 3-8B-01; UCC § 8-401',
    urgency: 'critical',
    actionRequested: 'Peremptory Writ of Mandamus commanding immediate DTC book-entry transfer of 45,850,000 common shares and cancellation of CUSIPs 917300AA1/917300AB9.',
    description: `Formal Show Cause Hearing on Petitioners' Verified Petition for Writ of Mandamus (Ministerial) and Complaint for Declaratory Judgment.
Respondents: The Bank of New York Mellon, Computershare Trust Co., N.A., and Centrus Energy Corp.
Pleading Basis: Ministerial duty under UCC § 8-401 to register exchange without unauthorized preconditions.`,
    defaultAttendees: [
      {
        email: 'bizcaustin@gmail.com',
        displayName: 'Caustin Lee McLaughlin',
        role: 'Petitioner Pro Se & Trust Settlor',
        selectedByDefault: true
      },
      {
        email: 'trustees@psdlef.org',
        displayName: 'Juan Jose Fernandez',
        role: 'Co-Trustee & Fiduciary Representative',
        selectedByDefault: true
      },
      {
        email: 'corporate.trust.clearing@bnymellon.com',
        displayName: 'The Bank of New York Mellon Corporate Trust Desk',
        role: 'Depository Bank & Custodian Counsel',
        selectedByDefault: true
      },
      {
        email: 'corporateactions@computershare.com',
        displayName: 'Computershare Trust Company, N.A.',
        role: 'Transfer Agent & Indenture Registrar',
        selectedByDefault: true
      },
      {
        email: 'legal.filings@centrusenergy.com',
        displayName: 'Centrus Energy Corp. Office of General Counsel',
        role: 'Respondent Debtor Corporation',
        selectedByDefault: true
      }
    ]
  },
  {
    id: 'milestone-dc-circuit-all-writs',
    milestoneTitle: 'U.S. Court of Appeals for the D.C. Circuit — Emergency All Writs Act Conference',
    instrumentPart: 'Part II & Part III: Appellate Mandamus under 28 U.S.C. § 1651(a) & Fed. R. App. P. 21',
    docketNumber: 'D.C. Cir. Docket No. 26-1049',
    jurisdiction: 'federal',
    jurisdictionLabel: 'U.S. Court of Appeals for the D.C. Circuit',
    courtName: 'United States Court of Appeals for the District of Columbia Circuit',
    location: 'E. Barrett Prettyman U.S. Courthouse, 333 Constitution Ave NW, Courtroom 20, Washington, DC 20001',
    scheduledDate: '2026-11-19T10:00:00-05:00',
    durationMinutes: 60,
    statutoryBasis: '28 U.S.C. § 1651(a); Fed. R. App. P. 21; D.C. Cir. R. 21; Cheney v. U.S. Dist. Court',
    urgency: 'critical',
    actionRequested: 'Emergency Writ of Mandamus enforcing bankruptcy reorganization covenants, UCC § 8-401, and All Writs Act jurisdiction.',
    description: `Emergency appellate conference on Petition for Writ of Mandamus pursuant to 28 U.S.C. § 1651(a) and Fed. R. App. P. 21.
Issues: Interlocutory appellate jurisdiction, refusal of custodial clearing agents to honor non-discretionary statutory conversion, and Cheney 3-prong threshold satisfaction.`,
    defaultAttendees: [
      {
        email: 'bizcaustin@gmail.com',
        displayName: 'Caustin Lee McLaughlin',
        role: 'Petitioner Pro Se',
        selectedByDefault: true
      },
      {
        email: 'trustees@psdlef.org',
        displayName: 'Juan Jose Fernandez',
        role: 'Co-Petitioner & Co-Trustee',
        selectedByDefault: true
      },
      {
        email: 'clerk_dc_circuit@cadc.uscourts.gov',
        displayName: 'Office of the Clerk, D.C. Circuit Court of Appeals',
        role: 'Federal Appellate Clerk of Court',
        selectedByDefault: true
      },
      {
        email: 'appellate.counsel@bnymellon.com',
        displayName: 'Appellate Fiduciary Counsel for BNY Mellon',
        role: 'Respondent Appellate Counsel',
        selectedByDefault: false
      }
    ]
  },
  {
    id: 'milestone-mdec-scheduling-conf',
    milestoneTitle: 'MDEC Case Management & Mandatory Pretrial Scheduling Conference',
    instrumentPart: 'Part V & Tab G: Maryland Rule 2-504 Pretrial Scheduling Order & MDEC Protocol',
    docketNumber: 'Case No. C-03-CV-26-004128',
    jurisdiction: 'state',
    jurisdictionLabel: 'Circuit Court for Baltimore County (Civil Division)',
    courtName: 'Circuit Court for Baltimore County, Civil Equity Assignment Office',
    location: 'Remote Virtual Hearing Room (MDEC WebEx / Google Meet Bridge) / Towson, MD',
    scheduledDate: '2026-11-24T14:00:00-05:00',
    durationMinutes: 45,
    statutoryBasis: 'Maryland Rule 2-504 (Scheduling Orders); Maryland Rule 2-504.1; MDEC Policies',
    urgency: 'high',
    actionRequested: 'Entry of binding Pretrial Scheduling Order governing CUSIP physical indenture presentment and electronic discovery deadlines.',
    description: `Mandatory scheduling conference conducted by the Baltimore County Circuit Court Assignment Commissioner.
Matters: Cut-off dates for joinder of additional DTC clearing broker-dealers, scheduling of formal CUSIP inspection, and discovery plan under Maryland Rule 2-504.`,
    defaultAttendees: [
      {
        email: 'bizcaustin@gmail.com',
        displayName: 'Caustin Lee McLaughlin',
        role: 'Petitioner',
        selectedByDefault: true
      },
      {
        email: 'assignment_commissioner@mdcourts.gov',
        displayName: 'Baltimore County Circuit Court Civil Assignment',
        role: 'Case Management Commissioner',
        selectedByDefault: true
      },
      {
        email: 'litigation@delawaretrust.com',
        displayName: 'Delaware Trust Company Fiduciary Desk',
        role: 'Co-Trustee / Respondent Counsel',
        selectedByDefault: true
      }
    ]
  },
  {
    id: 'milestone-wyoming-trust-dtc-settlement',
    milestoneTitle: 'Wyoming Statutory Purpose Trust — Initial Trustee Organization & DTC FAST Settlement',
    instrumentPart: 'Part VII & Part VIII: Wyoming Statutory Trust Charter & Directed Trust Indenture Schedule',
    docketNumber: 'WY-TRUST-REG-2026-0091',
    jurisdiction: 'trust',
    jurisdictionLabel: 'Wyoming Statutory Purpose Trust & DTC Fiduciary Desk',
    courtName: 'The Americana Digital Reserve Statutory Purpose Trust Fiduciary Board',
    location: 'Corporate Trust Executive Suite, M&T Bank / BNY Mellon Virtual Executive Room',
    scheduledDate: '2026-12-02T11:00:00-05:00',
    durationMinutes: 60,
    statutoryBasis: 'Wyo. Stat. Ann. § 17-23-114; Uniform Directed Trust Act §§ 101–118; 12 Del. C. § 3570',
    urgency: 'high',
    actionRequested: 'Ratification of Quad-Cameral Directed Trust, execution of 5% smoothed distribution ceiling ($25M/yr cap), and opening of the 4 sub-accounts.',
    description: `Inaugural trustee convening of the Americana Digital Reserve Statutory Purpose Trust.
Sub-Accounts:
- 60% PSDLEF Perpetual Research Corpus ($300M / 27,510,000 shares)
- 25% Baltimore Historic Rowhomes Housing SPV ($125M / 11,462,500 shares; 30 rowhomes)
- 10% Pro Se Litigant AI & Cognitive Grant Pool ($50M / 4,585,000 shares)
- 5% Fiduciary & Operational Reserve ($25M / 2,292,500 shares).`,
    defaultAttendees: [
      {
        email: 'bizcaustin@gmail.com',
        displayName: 'Caustin Lee McLaughlin',
        role: 'Trust Settlor & Trust Director',
        selectedByDefault: true
      },
      {
        email: 'trustees@psdlef.org',
        displayName: 'Juan Jose Fernandez',
        role: 'Administrative Co-Trustee',
        selectedByDefault: true
      },
      {
        email: 'institutional.trust@mtb.com',
        displayName: 'M&T Bank Corporate Trust Desk (Baltimore)',
        role: 'Co-Custodian & Escrow Depository',
        selectedByDefault: true
      },
      {
        email: 'dtc.settlement@dtcc.com',
        displayName: 'Depository Trust Company (DTC) Corporate Actions',
        role: 'DTC Participant Clearing Specialist',
        selectedByDefault: true
      }
    ]
  },
  {
    id: 'milestone-balt-injunction-hearing',
    milestoneTitle: 'Circuit Court for Baltimore County — Preliminary Injunction & UCC Article 8 Hearing',
    instrumentPart: 'Part VI & Part X: Count III Permanent Injunction & UCC § 8-401 Specific Performance',
    docketNumber: 'Case No. C-03-CV-26-004128',
    jurisdiction: 'state',
    jurisdictionLabel: 'Circuit Court for Baltimore County (Equity Division)',
    courtName: 'Circuit Court for Baltimore County, Maryland',
    location: 'County Courts Building, 401 Bosley Avenue, Courtroom 5, Towson, MD 21204',
    scheduledDate: '2026-12-10T09:30:00-05:00',
    durationMinutes: 120,
    statutoryBasis: 'Maryland Rule 15-502 (Injunctions); UCC § 8-401; Md. Real Prop. § 14-120',
    urgency: 'critical',
    actionRequested: 'Preliminary injunction enjoining transfer restrictions, staying adverse foreclosure on the 30 historic rowhomes, and directing immediate issuance of share certificates.',
    description: `Evidentiary hearing on Petitioners' Motion for Preliminary Injunction.
Key Evidence: Proof of irrevocable beneficial assignment, 1999 Indenture covenants, 2014 Plan Class 4 unsecured claims, and urgent community land trust protection for the 30 rowhome housing units in Baltimore County and City.`,
    defaultAttendees: [
      {
        email: 'bizcaustin@gmail.com',
        displayName: 'Caustin Lee McLaughlin',
        role: 'Petitioner Pro Se',
        selectedByDefault: true
      },
      {
        email: 'housing.preservation@baltimorecountymd.gov',
        displayName: 'Baltimore County Housing & Community SPV Liaison',
        role: 'Community Land Trust Representative',
        selectedByDefault: true
      },
      {
        email: 'defense.litigation@centrusenergy.com',
        displayName: 'Centrus Energy External Defense Litigation Team',
        role: 'Defense Counsel for Issuer',
        selectedByDefault: true
      },
      {
        email: 'corporate.actions@bnymellon.com',
        displayName: 'BNY Mellon Corporate Trust Department',
        role: 'Custodian Litigation Counsel',
        selectedByDefault: true
      }
    ]
  },
  {
    id: 'milestone-ssa-disability-due-process',
    milestoneTitle: 'Social Security Administration (SSA) — Emergency OHO Administrative Due Process Hearing',
    instrumentPart: 'Part IV & Rule 18 Iteration II: Administrative Mortality & Disability Due Process Exaction',
    docketNumber: 'SSA-OHO Docket No. 2026-4418-ALJ',
    jurisdiction: 'agency',
    jurisdictionLabel: 'Social Security Administration OHO (Federal Agency)',
    courtName: 'Social Security Administration, Office of Hearings Operations (OHO)',
    location: 'Baltimore Hearing Office, 1010 Park Avenue, Suite 200, Baltimore, MD 21201 / MS Teams/Meet',
    scheduledDate: '2026-12-17T13:30:00-05:00',
    durationMinutes: 60,
    statutoryBasis: '42 U.S.C. § 405(g); Mathews v. Eldridge, 424 U.S. 319 (1976); GAO-20-641R Audit Findings',
    urgency: 'high',
    actionRequested: 'Immediate application of the MORTAR LSH triage algorithm with anti-starvation bound and interim emergency disability distributions.',
    description: `Emergency evidentiary administrative hearing on unconstitutional wait-time delays (exceeding 800+ days) causing measurable claimant mortality.
Evidence: Deployment of the MORTAR Locality-Sensitive Hashing triage algorithm with bounded-delay guarantees and ADA Title II cognitive accommodation mandate.`,
    defaultAttendees: [
      {
        email: 'bizcaustin@gmail.com',
        displayName: 'Caustin Lee McLaughlin',
        role: 'Claimant Pro Se',
        selectedByDefault: true
      },
      {
        email: 'oho.baltimore.alj@ssa.gov',
        displayName: 'Office of Hearings Operations Hearing Clerk',
        role: 'SSA Administrative Hearing Office',
        selectedByDefault: true
      },
      {
        email: 'disability.advocates@psdlef.org',
        displayName: 'PSDLEF Disability Due Process Advocate',
        role: 'Disability Special Master Liaison',
        selectedByDefault: true
      }
    ]
  }
];
