/**
 * Wyoming Statutory Liquidation Trust Beneficiary Roster & Settlement Portions
 * Governing Authority: Wyoming Statutory Trust Act (Wyo. Stat. Ann. § 17-23-101 et seq.)
 * Total Res: $500,000,000.00 Senior Debt Principal / 45,850,000 LEU Reorganized Common Shares
 * Strict Invariants: Tucker Act Pool = $0.00 | Solar Projects = 0 (Housing Preservation Only)
 */

import { TrustBeneficiaryRecord } from '../types/document';

export interface MasterPoolSummary {
  id: 'psdlef' | 'housing-spv' | 'pro-se-grant' | 'legal-defense';
  name: string;
  category: string;
  percentage: number;
  dollars: number;
  shares: number;
  color: string;
  accentColor: string;
  activeBeneficiariesCount: number;
  verifiedCount: number;
  pendingCount: number;
  actionRequiredCount: number;
  clearingEndpoint: string;
  statutoryBasis: string;
  mandateDescription: string;
  annualDistributionCap: number; // 5% trailing cap
  housingUnits?: number;
}

export const MASTER_POOL_SETTLEMENT_PORTIONS: MasterPoolSummary[] = [
  {
    id: 'psdlef',
    name: 'PSDLEF Perpetual Purpose Corpus',
    category: 'Sovereign Capital & Computational Biology Endowment',
    percentage: 60,
    dollars: 300000000,
    shares: 27510000,
    color: '#10B981', // emerald-500
    accentColor: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/40 text-emerald-300',
    activeBeneficiariesCount: 4,
    verifiedCount: 4,
    pendingCount: 0,
    actionRequiredCount: 0,
    clearingEndpoint: 'M&T Bank Corporate Trust (ABA 022000046, SWIFT MANTUS33) / BNY Mellon DTC',
    statutoryBasis: 'Wyo. Stat. Ann. § 17-23-114 / 15 U.S.C. § 77aaa',
    mandateDescription: 'Sovereign capital floor invested in U.S. Treasury equivalents. Perpetual research endowment for computational biology, dopamine D4/D5 SAR explorer, and NIST FIPS 203/204 post-quantum infrastructure.',
    annualDistributionCap: 15000000
  },
  {
    id: 'housing-spv',
    name: 'Baltimore Historic Rowhomes Housing Preservation SPV',
    category: 'Community Land Trust & SSDI/SSI Housing Carveout',
    percentage: 25,
    dollars: 125000000,
    shares: 11462500,
    color: '#6366F1', // indigo-500
    accentColor: 'from-indigo-500/20 to-blue-500/10 border-indigo-500/40 text-indigo-300',
    activeBeneficiariesCount: 5,
    verifiedCount: 3,
    pendingCount: 2,
    actionRequiredCount: 0,
    clearingEndpoint: 'Baltimore Regional Escrow & Land Trust Fiduciary Desk (25 S. Charles St.)',
    statutoryBasis: 'Md. Code Ann., Real Prop. § 14-120 / Wyo. Stat. Ann. § 17-23-106',
    mandateDescription: 'Acquisition, deep envelope architectural restoration, and community land trust stewardship of 300 Baltimore historic row homes, with a dedicated carveout of 30 row homes specifically for SSDI/SSI disability applicants enduring the 800+ day SSA backlog.',
    annualDistributionCap: 6250000,
    housingUnits: 300
  },
  {
    id: 'pro-se-grant',
    name: 'Pro Se Litigant AI & Cognitive Accommodation Grant Pool',
    category: 'ADA Title II Accommodations & Legal Tech Access',
    percentage: 10,
    dollars: 50000000,
    shares: 4585000,
    color: '#F59E0B', // amber-500
    accentColor: 'from-amber-500/20 to-yellow-500/10 border-amber-500/40 text-amber-300',
    activeBeneficiariesCount: 3,
    verifiedCount: 2,
    pendingCount: 1,
    actionRequiredCount: 0,
    clearingEndpoint: 'ADA Title II Special Master Sub-Account / M&T Sub-Ledger 3',
    statutoryBasis: '42 U.S.C. § 12132 / Tennessee v. Lane, 541 U.S. 509 (2004)',
    mandateDescription: 'ADA Title II cognitive prosthetics, automated in forma pauperis drafting tools, real-time docket parity algorithms, and pro se litigant equity grants.',
    annualDistributionCap: 2500000
  },
  {
    id: 'legal-defense',
    name: 'Legal Defense, Trust Protector & Operational Surety Reserves',
    category: 'Fiduciary Surety & Regulatory Compliance',
    percentage: 5,
    dollars: 25000000,
    shares: 2292500,
    color: '#EC4899', // pink-500
    accentColor: 'from-pink-500/20 to-rose-500/10 border-pink-500/40 text-pink-300',
    activeBeneficiariesCount: 3,
    verifiedCount: 2,
    pendingCount: 0,
    actionRequiredCount: 1,
    clearingEndpoint: 'Fiduciary Surety & Regulatory Compliance Depository / Delaware Trust Desk',
    statutoryBasis: 'Uniform Directed Trust Act § 8 / Fed. R. Civ. P. 18',
    mandateDescription: 'Quad-cameral Trust Protector enforcement, independent examiner audits, fiduciary bond surety, and appellate enforcement of Rule 18 exaction remedies.',
    annualDistributionCap: 1250000
  }
];

export const INITIAL_TRUST_BENEFICIARIES: TrustBeneficiaryRecord[] = [
  {
    id: 'ben-001',
    name: 'Caustin Lee McLaughlin',
    roleOrCategory: 'Principal Trustee',
    masterPoolId: 'psdlef',
    poolName: 'PSDLEF Perpetual Purpose Corpus',
    allocatedPercentage: 45.0,
    allocatedDollars: 225000000,
    allocatedShares: 20632500,
    verificationStatus: 'Verified',
    verificationMethod: 'DOJ EOIR-59 (OMB# 1125-0017) + Circuit Court for Baltimore County Marriage Record + REAL ID DLN 4042567',
    clearingEndpoint: 'M&T Bank Corporate Trust (ABA 022000046, SWIFT MANTUS33) / BNY Mellon DTC Desk',
    lastVerifiedAt: '2026-11-01 10:14 EST',
    verifiedBy: 'Clerk of Circuit Court for Baltimore County / DTC Participant Operations Desk',
    notes: 'Managing Director & Debtor-in-Possession in active Subchapter V Case No. 24-2383. Full dispositive and liquidation pacing authority under Wyo. Stat. Ann. § 17-23-114.',
    docketReference: 'Case No. C-03-CV-26-004128 / D.D.C. 24-2383'
  },
  {
    id: 'ben-002',
    name: 'Juan Jose Fernandez',
    roleOrCategory: 'Co-Trustee & Fiduciary',
    masterPoolId: 'psdlef',
    poolName: 'PSDLEF Perpetual Purpose Corpus',
    allocatedPercentage: 15.0,
    allocatedDollars: 75000000,
    allocatedShares: 6877500,
    verificationStatus: 'Verified',
    verificationMethod: 'State of Maryland Certificate of Marriage (License #0309504160039411, Circuit Court for Baltimore County)',
    clearingEndpoint: 'M&T Bank Escrow Sub-Account 2 (Joint Signatory Protocol)',
    lastVerifiedAt: '2026-11-01 10:14 EST',
    verifiedBy: 'Circuit Court for Baltimore County Equity Division (Towson, MD)',
    notes: 'Co-Trustee with mandatory dual-authorization signature key on disbursements exceeding $10,000.00. Real property marital domicile: 14 Strawbridge Court, Gwynn Oak, MD 21207.',
    docketReference: 'Towson Marriage Record #0309504160039411'
  },
  {
    id: 'ben-003',
    name: 'Baltimore Historic Rowhomes Housing Preservation SPV',
    roleOrCategory: 'Housing Preservation SPV',
    masterPoolId: 'housing-spv',
    poolName: 'Baltimore Historic Rowhomes Housing Preservation SPV',
    allocatedPercentage: 22.5,
    allocatedDollars: 112500000,
    allocatedShares: 10316250,
    verificationStatus: 'Verified',
    verificationMethod: 'Md. Code Ann., Real Prop. § 14-120 & Baltimore County Equity Injunction Docket C-03-CV-26-004128',
    clearingEndpoint: 'Baltimore Regional Escrow & Land Trust Fiduciary Desk (25 S. Charles St.)',
    lastVerifiedAt: '2026-10-31 16:30 EST',
    verifiedBy: 'State Department of Assessments & Taxation (SDAT) Real Property Registry',
    notes: '270 residential row homes in Baltimore City and County under perpetual community land trust conservation deed restrictions.',
    housingUnitsAssigned: 270,
    docketReference: 'SDAT Maryland Property Identification System'
  },
  {
    id: 'ben-004',
    name: 'SSDI/SSI Applicant Housing Carveout (Dedicated 30 Row Homes)',
    roleOrCategory: 'SSDI/SSI Dedicated Housing Pool',
    masterPoolId: 'housing-spv',
    poolName: 'Baltimore Historic Rowhomes Housing Preservation SPV',
    allocatedPercentage: 2.5,
    allocatedDollars: 12500000,
    allocatedShares: 1146250,
    verificationStatus: 'Verified',
    verificationMethod: 'Rule 18 Consolidated Exaction Iteration II (Administrative Mortality Due Process Mandate)',
    clearingEndpoint: 'Baltimore Community Land Trust SSDI Emergency Housing Sub-Ledger',
    lastVerifiedAt: '2026-11-01 11:45 EST',
    verifiedBy: 'PSDLEF Housing Operations & Disability Advocacy Fiduciary Committee',
    notes: 'Statutory carveout of exactly 30 historic row homes dedicated as zero-displacement permanent supportive housing for Social Security SSDI/SSI applicants enduring the 800+ day SSA hearing backlog.',
    ssdiBacklogCarveout: true,
    housingUnitsAssigned: 30,
    docketReference: 'Rule 18 Iteration II / 42 U.S.C. § 405(g)'
  },
  {
    id: 'ben-005',
    name: 'SSDI/SSI Applicant Cohort Alpha (10 Homes - Hearing Queue > 800 Days)',
    roleOrCategory: 'SSDI/SSI Dedicated Housing Pool',
    masterPoolId: 'housing-spv',
    poolName: 'Baltimore Historic Rowhomes Housing Preservation SPV',
    allocatedPercentage: 0.83,
    allocatedDollars: 4166667,
    allocatedShares: 382083,
    verificationStatus: 'Pending',
    verificationMethod: 'SSA Form HA-501 Hearing Request Docket Validation & 800-Day Queue Attestation',
    clearingEndpoint: 'Baltimore West Metro Supportive Housing Escrow Account',
    lastVerifiedAt: '2026-10-29 14:20 EST',
    verifiedBy: 'Social Security Office of Hearings Operations (OHO) Intake Queue Cross-Match',
    notes: '10 individual row homes allocated to verified disabled applicants in acute housing distress while awaiting administrative hearing.',
    ssdiBacklogCarveout: true,
    housingUnitsAssigned: 10,
    docketReference: 'SSA OHO Region III / Baltimore Hearing Office'
  },
  {
    id: 'ben-006',
    name: 'SSDI/SSI Applicant Cohort Beta (10 Homes - Appeals Council / Federal Remand)',
    roleOrCategory: 'SSDI/SSI Dedicated Housing Pool',
    masterPoolId: 'housing-spv',
    poolName: 'Baltimore Historic Rowhomes Housing Preservation SPV',
    allocatedPercentage: 0.83,
    allocatedDollars: 4166667,
    allocatedShares: 382083,
    verificationStatus: 'Pending',
    verificationMethod: 'U.S. District Court Remand Docket & SSA Appeals Council Verification',
    clearingEndpoint: 'Gwynn Oak Community Land Trust Rehabilitation Sub-Ledger',
    lastVerifiedAt: '2026-10-28 09:15 EST',
    verifiedBy: 'Fourth Circuit Appellate Disability Advocacy Clinic',
    notes: '10 row homes assigned to applicants in post-hearing remand or Article III judicial review stages.',
    ssdiBacklogCarveout: true,
    housingUnitsAssigned: 10,
    docketReference: '42 U.S.C. § 405(g) Judicial Review Docket'
  },
  {
    id: 'ben-007',
    name: 'SSDI/SSI Applicant Cohort Gamma (10 Homes - Severe Disability / Compassionate Allowance)',
    roleOrCategory: 'SSDI/SSI Dedicated Housing Pool',
    masterPoolId: 'housing-spv',
    poolName: 'Baltimore Historic Rowhomes Housing Preservation SPV',
    allocatedPercentage: 0.84,
    allocatedDollars: 4166666,
    allocatedShares: 382084,
    verificationStatus: 'Verified',
    verificationMethod: 'SSA CAL (Compassionate Allowance Initiative) Medical Evidentiary Certification',
    clearingEndpoint: 'Woodington Supportive Living Trust Sub-Account',
    lastVerifiedAt: '2026-11-01 08:30 EST',
    verifiedBy: 'Maryland Disability Determination Services (DDS) Expedited Desk',
    notes: '10 homes fully weatherized and ADA-modified for applicants with severe degenerative motor or cognitive conditions.',
    ssdiBacklogCarveout: true,
    housingUnitsAssigned: 10,
    docketReference: 'SSA POMS DI 23022.010 Compassionate Allowances'
  },
  {
    id: 'ben-008',
    name: 'Pro Se Litigant AI & Cognitive Grant Pool',
    roleOrCategory: 'Pro Se Litigant AI Grant',
    masterPoolId: 'pro-se-grant',
    poolName: 'Pro Se Litigant AI & Cognitive Accommodation Grant Pool',
    allocatedPercentage: 7.0,
    allocatedDollars: 35000000,
    allocatedShares: 3209500,
    verificationStatus: 'Verified',
    verificationMethod: '42 U.S.C. § 12132 & Tennessee v. Lane, 541 U.S. 509 Constitutional ADA Mandate',
    clearingEndpoint: 'ADA Title II Special Master Sub-Account / M&T Sub-Ledger 3',
    lastVerifiedAt: '2026-10-31 15:45 EST',
    verifiedBy: 'U.S. Access Board Standards Committee Compliance Desk',
    notes: 'Funds open-access electronic filing tools, cognitive overload reduction interfaces, and in forma pauperis automated petition builders.',
    docketReference: 'ADA Title II Enforcement Docket #28-CFR-35'
  },
  {
    id: 'ben-009',
    name: 'Pro Se Cognitive Accessibility Fellows Program',
    roleOrCategory: 'Research Fellowship',
    masterPoolId: 'pro-se-grant',
    poolName: 'Pro Se Litigant AI & Cognitive Accommodation Grant Pool',
    allocatedPercentage: 3.0,
    allocatedDollars: 15000000,
    allocatedShares: 1375500,
    verificationStatus: 'Pending',
    verificationMethod: 'Fellowship Charter & FIPS 203/204 Post-Quantum Key Ring Registry',
    clearingEndpoint: 'Open Source Legal Technology Research Sub-Account',
    lastVerifiedAt: '2026-10-25 12:00 EST',
    verifiedBy: 'PSDLEF Computational Governance Selection Committee',
    notes: 'Stipends and infrastructure grants for legal technologists developing open-source algorithmic court access systems.',
    docketReference: 'PSDLEF Research Charter 2026-04'
  },
  {
    id: 'ben-010',
    name: 'Delaware Trust Company (Trust Protector Desk)',
    roleOrCategory: 'Surety & Operational Reserve',
    masterPoolId: 'legal-defense',
    poolName: 'Legal Defense, Trust Protector & Operational Surety Reserves',
    allocatedPercentage: 2.5,
    allocatedDollars: 12500000,
    allocatedShares: 1146250,
    verificationStatus: 'Verified',
    verificationMethod: 'Delaware Corporate Trust Charter & Uniform Directed Trust Act § 8 Appointment',
    clearingEndpoint: 'Delaware Trust Company Corporate Custody (Wilmington, DE)',
    lastVerifiedAt: '2026-11-01 09:00 EST',
    verifiedBy: 'Delaware Office of the State Bank Commissioner',
    notes: 'Independent fiduciary supervisory role enforcing the 5% trailing corpus perpetuity rule and indenture covenant compliance.',
    docketReference: 'DE Banking Charter #TC-9921'
  },
  {
    id: 'ben-011',
    name: 'BNY Mellon & M&T Bank Custodial Depository Operations Desk',
    roleOrCategory: 'Surety & Operational Reserve',
    masterPoolId: 'legal-defense',
    poolName: 'Legal Defense, Trust Protector & Operational Surety Reserves',
    allocatedPercentage: 1.5,
    allocatedDollars: 7500000,
    allocatedShares: 687750,
    verificationStatus: 'Verified',
    verificationMethod: 'DTC Participant Participant Clearinghouse Agreement & Fedwire ABA 022000046',
    clearingEndpoint: 'The Bank of New York Mellon Corporate Trust (240 Greenwich St, NY)',
    lastVerifiedAt: '2026-11-01 10:14 EST',
    verifiedBy: 'DTC Depository Trust & Clearing Corporation (DTCC) Participant Verification',
    notes: 'Operational clearing fees, DTC book-entry transfer maintenance, and automated daily sweep execution.',
    docketReference: 'DTCC Participant ID #0901 / SWIFT MANTUS33'
  },
  {
    id: 'ben-012',
    name: 'Forensic Accounting & Independent Examiner Desk',
    roleOrCategory: 'Surety & Operational Reserve',
    masterPoolId: 'legal-defense',
    poolName: 'Legal Defense, Trust Protector & Operational Surety Reserves',
    allocatedPercentage: 1.0,
    allocatedDollars: 5000000,
    allocatedShares: 458500,
    verificationStatus: 'Action Required',
    verificationMethod: 'Annual SEC Form 13F-HR Edgar CUSIP Cross-Reconciliation & Certified Audit Sign-Off',
    clearingEndpoint: 'Independent Fiduciary Audit Escrow Account',
    lastVerifiedAt: '2026-10-20 17:00 EST',
    verifiedBy: 'Audit Committee of the Distribution Committee',
    notes: 'Annual audit sign-off pending for Q4 2026 cycle. Requires CUSIP 917300AA1 / 917300AB9 reconciliation confirmation.',
    docketReference: 'SEC File No. 28-1235 (PNC) & 28-5703 (BlackRock)'
  }
];

export function getBeneficiaryCountsSummary(beneficiaries: TrustBeneficiaryRecord[]) {
  const total = beneficiaries.length;
  const verified = beneficiaries.filter(b => b.verificationStatus === 'Verified').length;
  const pending = beneficiaries.filter(b => b.verificationStatus === 'Pending' || b.verificationStatus === 'Under Review').length;
  const actionRequired = beneficiaries.filter(b => b.verificationStatus === 'Action Required').length;
  
  const totalAllocatedDollars = beneficiaries.reduce((acc, b) => acc + b.allocatedDollars, 0);
  const totalAllocatedShares = beneficiaries.reduce((acc, b) => acc + b.allocatedShares, 0);
  
  const ssdiUnits = beneficiaries
    .filter(b => b.ssdiBacklogCarveout)
    .reduce((acc, b) => acc + (b.housingUnitsAssigned || 0), 0);

  const verifiedDollars = beneficiaries
    .filter(b => b.verificationStatus === 'Verified')
    .reduce((acc, b) => acc + b.allocatedDollars, 0);

  const verificationPercentage = total > 0 ? Math.round((verified / total) * 100) : 0;
  const dollarVerifiedPercentage = totalAllocatedDollars > 0 ? ((verifiedDollars / totalAllocatedDollars) * 100).toFixed(1) : '0.0';

  return {
    total,
    verified,
    pending,
    actionRequired,
    totalAllocatedDollars,
    totalAllocatedShares,
    ssdiUnits,
    verifiedDollars,
    verificationPercentage,
    dollarVerifiedPercentage
  };
}
