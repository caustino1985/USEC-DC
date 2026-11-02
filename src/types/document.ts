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
