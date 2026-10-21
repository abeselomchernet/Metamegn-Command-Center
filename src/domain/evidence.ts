/**
 * Evidence Status taxonomy.
 * Hard rule: Every feature, metric, and screen carries an evidence-status chip.
 * Allowed statuses: 'Sample data', 'Assumption', 'Not tested', 'Needs approval'.
 * Nothing is EVER labelled "Verified" or "Live".
 */

export type EvidenceStatus = 'Sample data' | 'Assumption' | 'Not tested' | 'Needs approval';

export interface EvidenceMetadata {
  status: EvidenceStatus;
  description: string;
}

export const EVIDENCE_STATUSES: Record<string, EvidenceMetadata> = {
  sample_data: {
    status: 'Sample data',
    description: 'Deterministic mock records generated for interface illustration only.',
  },
  assumption: {
    status: 'Assumption',
    description: 'Hypothetical behavioral assumption regarding connectivity, delays, or flows.',
  },
  not_tested: {
    status: 'Not tested',
    description: 'Architectural concept not verified with real payment infrastructure.',
  },
  needs_approval: {
    status: 'Needs approval',
    description: 'Operational decision requiring bank legal, compliance, or security consent.',
  },
};
