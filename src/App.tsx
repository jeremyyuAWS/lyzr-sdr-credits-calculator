import React, { useState, useEffect } from 'react';
import { UseCaseSelector } from '@/components/UseCaseSelector';
import { ScenarioSelector } from '@/components/ScenarioSelector';
import { CampaignConfigurator } from '@/components/CampaignConfigurator';
import { CostSummary } from '@/components/CostSummary';
import { Badge } from '@/components/ui/badge';
import { Calculator, Zap } from 'lucide-react';
import creditsData from '@/data/credits.json';

type Step = 'usecase' | 'workflow' | 'configure' | 'summary';

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

interface UseCase {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  workflows: Workflow[];
}

function App() {
  const [currentStep, setCurrentStep] = useState<Step>('usecase');
  const [selectedUseCaseId, setSelectedUseCaseId] = useState('');
  const [selectedWorkflowId, setSelectedWorkflowId] = useState('');
  const [prospects, setProspects] = useState(500);
  const [emailsPerProspect, setEmailsPerProspect] = useState(3);

  const useCases = creditsData.use_cases as UseCase[];
  const selectedUseCase = useCases.find(uc => uc.id === selectedUseCaseId);
  const workflows = selectedUseCase?.workflows || [];
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
    if (currentStep === 'usecase') {
      setCurrentStep('workflow');
    } else if (currentStep === 'workflow') {
      setCurrentStep('configure');
    } else if (currentStep === 'configure') {
      setCurrentStep('summary');
    }
  };

  const handleUseCaseSelect = (useCaseId: string) => {
    setSelectedUseCaseId(useCaseId);
    // Reset workflow selection when use case changes
    if (selectedUseCaseId !== useCaseId) {
    }
  };

  const handleBack = () => {
    if (currentStep === 'workflow') {
      setCurrentStep('usecase');
    } else if (currentStep === 'configure') {
      setCurrentStep('workflow');
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
              { step: 'usecase', label: 'Choose Use Case', number: 1 },
              { step: 'workflow', label: 'Select Workflow', number: 2 },
              { step: 'configure', label: 'Configure Campaign', number: 3 },
              { step: 'summary', label: 'Review Summary', number: 4 }
            ].map(({ step, label, number }) => (
              <div key={step} className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === step 
                    ? 'bg-black text-white' 
                    : (currentStep === 'workflow' && step === 'usecase') ||
                      (currentStep === 'configure' && (step === 'usecase' || step === 'workflow')) ||
                      (currentStep === 'summary' && (step === 'usecase' || step === 'workflow' || step === 'configure'))
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {(currentStep === 'workflow' && step === 'usecase') ||
                   (currentStep === 'configure' && (step === 'usecase' || step === 'workflow')) ||
                   (currentStep === 'summary' && (step === 'usecase' || step === 'workflow' || step === 'configure')) ? '✓' : number}
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
        {currentStep === 'usecase' && (
          <UseCaseSelector
            useCases={useCases}
            selectedUseCase={selectedUseCaseId}
            onSelectUseCase={handleUseCaseSelect}
            onNext={handleNext}
          />
        )}

        {currentStep === 'workflow' && selectedUseCase && (
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
            useCaseId={selectedUseCaseId}
            onProspectsChange={(value) => setProspects(value[0])}
            onEmailsChange={(value) => setEmailsPerProspect(value[0])}
            onBack={handleBack}
            onNext={handleNext}
          />
        )}

        {currentStep === 'summary' && selectedWorkflow && selectedUseCase && (
          <CostSummary
            useCaseName={selectedUseCase.name}
            workflowName={selectedWorkflow.name}
            prospects={prospects}
            emailsPerProspect={emailsPerProspect}
            totalCredits={totalCredits}
            totalUsd={totalUsd}
            actions={selectedWorkflow.actions}
            creditPerUsd={creditsData.pricing.credit_per_usd}
            useCaseId={selectedUseCaseId}
            onBack={handleBack}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>Lyzr AI Credits Calculator Demo • Synthetic pricing for demonstration purposes</p>
            <p className="mt-1">Actual marketplace pricing may vary based on workflow complexity and volume</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;