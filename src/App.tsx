import React, { useState } from 'react';
import { Header, AppTab } from './components/Header';
import { HarmonizationNoticeBanner } from './components/HarmonizationNoticeBanner';
import { NavigationSidebar } from './components/NavigationSidebar';
import { UnifiedDocumentContent } from './components/UnifiedDocumentContent';
import { VerificationPanel } from './components/VerificationPanel';
import { TabsManifestView } from './components/TabsManifestView';
import { HarmonizationSummaryView } from './components/HarmonizationSummaryView';
import { DocumentExportModal } from './components/DocumentExportModal';
import { Rule18ExactionOfLibertyView } from './components/Rule18ExactionOfLibertyView';
import { OnlineSignatureSuite } from './components/OnlineSignatureSuite';
import { WyomingLiquidationTrustView } from './components/WyomingLiquidationTrustView';
import { AlgorithmsSuiteView } from './components/AlgorithmsSuiteView';
import { EmailDispatchModal } from './components/EmailDispatchModal';
import { GoogleWorkspaceHub } from './components/GoogleWorkspaceHub';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('document');
  const [activePartId, setActivePartId] = useState<string>('part-1');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showLineNumbers, setShowLineNumbers] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);

  const handleSelectPart = (partId: string) => {
    setActivePartId(partId);
    if (activeTab !== 'document') {
      setActiveTab('document');
    }
    // Smooth scroll to the target element
    setTimeout(() => {
      const element = document.getElementById(partId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showLineNumbers={showLineNumbers}
        setShowLineNumbers={setShowLineNumbers}
        fontSize={fontSize}
        setFontSize={setFontSize}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenEmailModal={() => setIsEmailModalOpen(true)}
      />

      {/* Harmonization status alert banner */}
      <div className="no-print">
        <HarmonizationNoticeBanner onJumpToSection={handleSelectPart} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6">
        {/* Document Master Pleading View */}
        {activeTab === 'document' && (
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Sidebar navigation */}
            <NavigationSidebar
              activePartId={activePartId}
              onSelectPart={handleSelectPart}
              searchFilter={searchQuery}
            />

            {/* Document body */}
            <UnifiedDocumentContent
              showLineNumbers={showLineNumbers}
              fontSize={fontSize}
              searchQuery={searchQuery}
            />
          </div>
        )}

        {/* Google Workspace & Firebase Hub */}
        {activeTab === 'workspace' && (
          <GoogleWorkspaceHub />
        )}

        {/* Rule 18 Consolidated Exaction of Liberty (All 4 Iterations) */}
        {activeTab === 'rule18' && (
          <Rule18ExactionOfLibertyView />
        )}

        {/* Online Signature Suite */}
        {activeTab === 'onlineSign' && (
          <OnlineSignatureSuite />
        )}

        {/* Wyoming Statutory Liquidation Trust Formation */}
        {activeTab === 'wyomingTrust' && (
          <WyomingLiquidationTrustView />
        )}

        {/* 31 Algorithms Financial Execution Suite */}
        {activeTab === 'algorithms' && (
          <AlgorithmsSuiteView />
        )}

        {/* Post-Quantum Verification Panel */}
        {activeTab === 'verification' && (
          <VerificationPanel />
        )}

        {/* Tabs Manifest A through J */}
        {activeTab === 'tabsManifest' && (
          <TabsManifestView />
        )}

        {/* Executive Harmonization Summary View */}
        {activeTab === 'summary' && (
          <HarmonizationSummaryView />
        )}
      </main>

      {/* Printable version of the document container (for window.print()) */}
      <div className="print-only hidden">
        <UnifiedDocumentContent
          showLineNumbers={false}
          fontSize="small"
          searchQuery=""
        />
      </div>

      {/* Export Modal */}
      <DocumentExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      {/* Email Dispatch Modal */}
      <EmailDispatchModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif font-black text-amber-500">§</span>
            <span>Master Legal &amp; Custodial Settlement Instrument — Circuit Court for Baltimore County &amp; Federal Dockets</span>
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            Harmonized Total: $500,000,000.00 | 45,850,000 Common Shares of Centrus Energy Corp. (NYSE: LEU) | Zero Tucker Pool
          </div>
        </div>
      </footer>
    </div>
  );
}
