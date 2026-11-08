export interface CUSIPEntry {
  issuer: string;
  titleOfClass: string;
  cusip: string;
  valueK: number;
  sharesOrPrincipal: string;
  discretion: string;
  votingAuth: string;
  relevance: string;
}

export interface SweepAllocation {
  key: string;
  category: string;
  percentage: number;
  description: string;
  formulaSymbol: string;
}

export interface ExecutionTab {
  id: string;
  tabLetter: string;
  title: string;
  category: 'Banking' | 'Regulatory' | 'CUSIP' | 'Notarial' | 'Trust Formation';
  inkRequirement: string;
  parties: string[];
  description: string;
  status: 'Ready for Signature' | 'Notarization Required' | 'Pre-Populated' | 'Signed Online';
  contentSnippet: string;
  signatureRequiredFrom: ('caustin' | 'juan')[];
  signaturesAffixed?: {
    signatory: string;
    signatureType: 'drawn' | 'typed';
    timestamp: string;
    signatureData: string;
    pqcHash: string;
  }[];
}

export interface CourtIntake {
  courtName: string;
  venueType: 'County' | 'Federal Appellate' | 'Federal Bankruptcy' | 'State Equity';
  email: string;
  jurisdiction: string;
  role: string;
  filingFormat: string;
}

export interface CounterpartyInfo {
  role: string;
  name: string;
  address?: string;
  email: string;
  notes: string;
}

export interface Rule18ExactionIteration {
  iterationNumber: number;
  title: string;
  legalAnchor: string;
  constitutionalBasis: string;
  factualDeprivation: string;
  doctrinalThresholds: string[];
  remedyDemanded: string;
}

export interface EmailPresentationPackage {
  id: string;
  recipientName: string;
  recipientOrg: string;
  toEmail: string;
  ccEmail?: string;
  subject: string;
  purpose: string;
  attachedDocuments: {
    title: string;
    format: string;
    fileSize: string;
    sha256Digest: string;
  }[];
  emailBody: string;
  status: 'Draft' | 'Queued' | 'Dispatched' | 'Verified';
}

export interface WyomingTrustDocument {
  id: string;
  title: string;
  statutoryReference: string;
  purpose: string;
  sections: {
    heading: string;
    content: string;
  }[];
}

export interface AlgorithmDefinition {
  num: number;
  id: string;
  module: string;
  name: string;
  purpose: string;
  formulation: string;
  complexity: string;
  register: 'Adopted' | 'Model/Simulation' | 'Proposal/Design Target';
}

export interface LegalCitationFootnote {
  number: number;
  partId: string;
  shortTag: string;
  canonicalCitation: string;
  jurisdiction: string;
  pincite?: string;
  holdingOrRule: string;
  statutoryAnchor?: string;
}

export interface CaseHistoryRecord {
  id: string;
  caseName: string;
  docketNumber: string;
  court: string;
  jurisdiction: 'Federal Appellate' | 'Federal Bankruptcy' | 'Supreme Court' | 'Maryland State' | 'Precedential';
  status: string;
  filingDate: string;
  lastUpdated: string;
  relevance: string;
  openSourceUrl: string;
  sourceDatabase: 'CourtListener / RECAP (PACER)' | 'Maryland Judiciary Case Search (MDEC)' | 'SEC EDGAR Public' | 'Supreme Court Record';
  summary: string;
  keyOrders: {
    date: string;
    description: string;
    documentNumber?: string;
  }[];
}

export interface PeerReviewScienceItem {
  id: string;
  title: string;
  authors: string[];
  journalOrVenue: string;
  publicationDate: string;
  source: 'NIH PubMed' | 'Europe PMC' | 'arXiv' | 'ClinicalTrials.gov';
  identifier: string; // PMID, DOI, or arXiv ID
  url: string;
  relevantAlgorithmIds: string[];
  algorithmicContext: string;
  abstractSnippet: string;
  openAccess: boolean;
  peerReviewed: boolean;
}

export interface AdrAdxLedgerUpdate {
  updateId: string;
  timestamp: string;
  triggerEvent: string;
  algorithmId: string;
  scientificCitation: string;
  merkleRootHash: string;
  housingAllocationDelta: string;
  status: 'Committed' | 'Verified' | 'Pending Relay';
}

export type BeneficiaryVerificationStatus = 'Verified' | 'Pending' | 'Action Required' | 'Under Review';

export interface TrustBeneficiaryRecord {
  id: string;
  name: string;
  roleOrCategory: 
    | 'Principal Trustee' 
    | 'Co-Trustee & Fiduciary' 
    | 'Housing Preservation SPV' 
    | 'SSDI/SSI Dedicated Housing Pool' 
    | 'Pro Se Litigant AI Grant' 
    | 'Surety & Operational Reserve' 
    | 'Research Fellowship'
    | 'Land Trust Custodian';
  masterPoolId: 'psdlef' | 'housing-spv' | 'pro-se-grant' | 'legal-defense';
  poolName: string;
  allocatedPercentage: number;
  allocatedDollars: number;
  allocatedShares: number;
  verificationStatus: BeneficiaryVerificationStatus;
  verificationMethod: string;
  clearingEndpoint: string;
  lastVerifiedAt: string;
  verifiedBy: string;
  notes: string;
  ssdiBacklogCarveout?: boolean;
  housingUnitsAssigned?: number;
  docketReference?: string;
}

