import React, { useState, useEffect } from 'react';
import { ScenarioSelector } from '@/components/ScenarioSelector';
import { CampaignConfigurator } from '@/components/CampaignConfigurator';
import { CostSummary } from '@/components/CostSummary';
import { Badge } from '@/components/ui/badge';
import { Calculator, Zap } from 'lucide-react';
import creditsData from '@/data/credits.json';

type Step = 'select' | 'configure' | 'summary';

interface Workflow {
  id: string;
  name: string;
  description: string;
  actions: Array<{
    action: string;
    credits_per_unit: number;
    description: string;
  }>;
}

function App() {
  const [currentStep, setCurrentStep] = useState<Step>('select');
  const [selectedWorkflowId, setSelectedWorkflowId] = useState('');
  const [prospects, setProspects] = useState(500);
  const [emailsPerProspect, setEmailsPerProspect] = useState(3);

  const workflows = creditsData.workflows as Workflow[];
  const selectedWorkflow = workflows.find(w => w.id === selectedWorkflowId);

  const totalCredits = selectedWorkflow?.actions.reduce((sum, action) => {
    let multiplier = prospects;
    if (action.action.toLowerCase().includes('email') || action.action.toLowerCase().includes('follow-up')) {
      multiplier = prospects * emailsPerProspect;
    }
    return sum + (action.credits_per_unit * multiplier);
  }, 0) || 0;

  const totalUsd = totalCredits * creditsData.pricing.credit_per_usd;

  const handleNext = () => {
    if (currentStep === 'select') {
      setCurrentStep('configure');
    } else if (currentStep === 'configure') {
      setCurrentStep('summary');
    }
  };

  const handleBack = () => {
    if (currentStep === 'configure') {
      setCurrentStep('select');
    } else if (currentStep === 'summary') {
      setCurrentStep('configure');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-black rounded-xl">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-black">Lyzr Credits Calculator</h1>
                <p className="text-sm text-gray-600">Transparent SDR campaign pricing</p>
              </div>
            </div>
            <Badge variant="outline" className="flex items-center space-x-1">
              <Zap className="w-3 h-3" />
              <span>Demo Version</span>
            </Badge>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-8 py-4">
            {[
              { step: 'select', label: 'Choose Workflow', number: 1 },
              { step: 'configure', label: 'Configure Campaign', number: 2 },
              { step: 'summary', label: 'Review Summary', number: 3 }
            ].map(({ step, label, number }) => (
              <div key={step} className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === step 
                    ? 'bg-black text-white' 
                    : currentStep === 'configure' && step === 'select' ||
                      currentStep === 'summary' && (step === 'select' || step === 'configure')
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {currentStep === 'configure' && step === 'select' ||
                   currentStep === 'summary' && (step === 'select' || step === 'configure') ? '✓' : number}
                </div>
                <span className={`text-sm font-medium ${
                  currentStep === step ? 'text-black' : 'text-gray-500'
                }`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === 'select' && (
          <ScenarioSelector
            workflows={workflows}
            selectedWorkflow={selectedWorkflowId}
            onSelectWorkflow={setSelectedWorkflowId}
            onNext={handleNext}
          />
        )}

        {currentStep === 'configure' && selectedWorkflow && (
          <CampaignConfigurator
            selectedWorkflow={selectedWorkflow}
            prospects={prospects}
            emailsPerProspect={emailsPerProspect}
            creditPerUsd={creditsData.pricing.credit_per_usd}
            onProspectsChange={(value) => setProspects(value[0])}
            onEmailsChange={(value) => setEmailsPerProspect(value[0])}
            onBack={handleBack}
            onNext={handleNext}
          />
        )}

        {currentStep === 'summary' && selectedWorkflow && (
          <CostSummary
            workflowName={selectedWorkflow.name}
            prospects={prospects}
            emailsPerProspect={emailsPerProspect}
            totalCredits={totalCredits}
            totalUsd={totalUsd}
            onBack={handleBack}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>Lyzr Credits Calculator Demo • Synthetic pricing for demonstration purposes</p>
            <p className="mt-1">Actual marketplace pricing may vary based on workflow complexity and volume</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;