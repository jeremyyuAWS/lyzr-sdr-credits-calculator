import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowLeft, Download } from 'lucide-react';
import { CostVisualization } from './CostVisualization';
import { exportQuote } from '@/utils/exportQuote';

interface CostSummaryProps {
  useCaseName: string;
  workflowName: string;
  prospects: number;
  emailsPerProspect: number;
  totalCredits: number;
  totalUsd: number;
  actions: Array<{
    action: string;
    credits_per_unit: number;
    description: string;
  }>;
  creditPerUsd: number;
  useCaseId: string;
  onBack: () => void;
}

export function CostSummary({ 
  useCaseName, 
  workflowName, 
  prospects, 
  emailsPerProspect, 
  totalCredits, 
  totalUsd, 
  actions,
  creditPerUsd,
  useCaseId,
  onBack 
}: CostSummaryProps) {
  const costPerProspect = totalUsd / prospects;
  const totalEmails = prospects * emailsPerProspect;

  const handleExportQuote = () => {
    exportQuote({
      useCaseName,
      workflowName,
      prospects,
      emailsPerProspect,
      actions,
      totalCredits,
      totalUsd,
      creditPerUsd,
      useCaseId
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-green-100 rounded-full">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-black">Campaign Summary</h2>
        <p className="text-gray-600 text-lg">Your campaign is configured and ready to launch</p>
        <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full">
          <span className="text-sm font-medium text-blue-700">{useCaseName}</span>
          <span className="text-blue-400">•</span>
          <span className="text-sm text-blue-600">{workflowName}</span>
        </div>
      </div>

      {/* Key Metrics - Most Important Info First */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-sm font-medium opacity-90 mb-2">TOTAL CAMPAIGN COST</h3>
              <p className="text-4xl font-bold mb-1">${totalUsd.toFixed(2)}</p>
              <p className="text-sm opacity-80">{totalCredits.toLocaleString()} credits</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl shadow-lg border-0">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-600 mb-2">CAMPAIGN SCALE</h3>
              <p className="text-3xl font-bold text-black mb-1">{prospects.toLocaleString()}</p>
              <p className="text-sm text-gray-500">prospects × {emailsPerProspect} emails</p>
              <p className="text-xs text-gray-400 mt-1">{totalEmails.toLocaleString()} total emails</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl shadow-lg border-0">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-600 mb-2">COST EFFICIENCY</h3>
              <p className="text-2xl font-bold text-black mb-1">${costPerProspect.toFixed(3)}</p>
              <p className="text-sm text-gray-500">per prospect</p>
              <p className="text-xs text-gray-400 mt-1">${(totalUsd / totalEmails).toFixed(3)} per email</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expected Results */}
      <Card className="rounded-2xl bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-blue-900">Expected Results</h3>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-2xl font-bold text-blue-800">{Math.round(prospects * 0.2).toLocaleString()}</p>
                <p className="text-sm text-blue-600">Est. Responses</p>
                <p className="text-xs text-blue-500">~20% response rate</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-800">{Math.round(prospects * 0.05).toLocaleString()}</p>
                <p className="text-sm text-blue-600">Est. Meetings</p>
                <p className="text-xs text-blue-500">~5% conversion rate</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-800">2-3</p>
                <p className="text-sm text-blue-600">Weeks</p>
                <p className="text-xs text-blue-500">Campaign duration</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <CostVisualization
        actions={actions}
        prospects={prospects}
        emailsPerProspect={emailsPerProspect}
        useCaseId={useCaseId}
      />

      <div className="flex justify-between items-center pt-4">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="px-6 py-3 rounded-2xl border-gray-300 hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Modify Campaign
        </Button>
        
        <div className="space-x-3">
          <Button 
            variant="outline"
            onClick={handleExportQuote}
            className="px-6 py-3 rounded-2xl border-gray-300 hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Quote
          </Button>
          <Button 
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl"
          >
            Start Campaign
          </Button>
        </div>
      </div>
    </div>
  );
}