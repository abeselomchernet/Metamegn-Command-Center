import React from 'react';
import { EvidenceChip } from '../src/ui/EvidenceChip';
import { useTranslation } from '../src/i18n/I18nContext';
import { ShieldAlert, CheckCircle2, XCircle, FileCode, Check, AlertCircle } from 'lucide-react';

export const About: React.FC = () => {
  const { t } = useTranslation();

  const proofGates = [
    {
      id: 'proof-1',
      title: '1. Commercial Validation: Bank Buyer Commitment',
      description: 'A sponsoring acquiring bank or financial institution willing to pay for and deploy the acceptance reconciliation layer.',
      status: 'Not started',
    },
    {
      id: 'proof-2',
      title: '2. Technical & Legal Authorization',
      description: 'Formal regulatory, privacy, and technical access agreements with each payment rail and core banking provider to receive daily statement feeds.',
      status: 'Not started',
    },
    {
      id: 'proof-3',
      title: '3. Financial Officer Audit Acceptance',
      description: 'Sign-off from certified merchant financial officers and bank auditors confirming reconciliation rules and discrepancy resolution standards.',
      status: 'Not started',
    },
    {
      id: 'proof-4',
      title: '4. Independent Security & Privacy Review',
      description: 'External security penetration audit and data protection compliance review of data retention, encryption at rest, and audit log immutability.',
      status: 'Not started',
    },
  ];

  const strictlyNotShown = [
    'No money movement, payouts, fund transfers, or automated ACH/clearing execution.',
    'No merchant underwriting, KYC verification, credit scoring, or account opening.',
    'No cardholder primary account number (PAN) capture, storage, or PIN translation.',
    'No custody or holding of merchant or consumer funds; zero escrow balance ledger.',
    'No affiliation, endorsement, or live connectivity with PSS, any bank, or wallet provider.',
    'No proprietary brand logos, marks, or trademarks of existing financial entities.',
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 1. Header */}
      <div className="pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">{t.aboutTitle}</h1>
          <EvidenceChip status="Not tested" detail="Research concept" />
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          {t.aboutSubtitle}
        </p>
      </div>

      {/* 2. Research Scope & Purpose Notice */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-950">
          <AlertCircle size={16} className="text-amber-600 shrink-0" />
          <span>Research Question Context & Nature of This Build</span>
        </div>
        <p>
          This application is an independent public-source illustration of a research question:
          <em> "Could an acceptance-layer transaction event ledger operate without holding merchant funds, and would a commercial bank find value in subscribing to it?"</em>
        </p>
        <p className="text-amber-800">
          It is an illustration of a research question, not a proposal, not a product, and not a PSS system. No content from any proposal document is used. All financial records, customer identifiers, statement rows, and numbers rendered are deterministic sample data.
        </p>
      </div>

      {/* 3. The Four Proof Gates (Prerequisites) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900">{t.fourProofGates}</h2>
            <p className="text-xs text-slate-500">Prerequisite milestones required prior to any production implementation</p>
          </div>
          <EvidenceChip status="Not tested" />
        </div>

        <div className="space-y-3">
          {proofGates.map((gate) => (
            <div
              key={gate.id}
              className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-0.5">
                <h3 className="font-bold text-slate-900">{gate.title}</h3>
                <p className="text-slate-600 text-[11px] max-w-xl">{gate.description}</p>
              </div>
              <div className="shrink-0">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-slate-200 text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                  <span>{gate.status}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Scope Boundary: What This Illustration Does vs Does Not Do */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* What It Illustrates */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm border-b border-slate-100 pb-2">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>In-Scope (What It Illustrates)</span>
          </div>
          <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
            <li>Immutable recording of POS merchant transaction events.</li>
            <li>5-class automated reconciliation matching against external statement rows.</li>
            <li>Routing and triaging of open discrepancy exceptions to supervisors.</li>
            <li>Low-connectivity offline queueing and duplicate-checked replay.</li>
            <li>Shift handover cash counting and variance calculation without fund transfers.</li>
            <li>Deterministic seeded mock data generation with zero floating-point math.</li>
          </ul>
        </div>

        {/* What It Strictly Does NOT Do */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-rose-800 font-bold text-sm border-b border-slate-100 pb-2">
            <XCircle size={16} className="text-rose-600" />
            <span>Strictly Out-of-Scope</span>
          </div>
          <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
            {strictlyNotShown.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
