import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowLeft, Download } from 'lucide-react';

interface CostSummaryProps {
  useCaseName: string;
  workflowName: string;
  prospects: number;
  emailsPerProspect: number;
  totalCredits: number;
  totalUsd: number;
  onBack: () => void;
}

export function CostSummary({ useCaseName, workflowName, prospects, emailsPerProspect, totalCredits, totalUsd, onBack }: CostSummaryProps) {
  const costPerProspect = totalUsd / prospects;
  const totalEmails = prospects * emailsPerProspect;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-green-100 rounded-full">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-black">Campaign Summary</h2>
        <p className="text-gray-600 text-lg">Your {useCaseName} - {workflowName.toLowerCase()} is ready to launch</p>
      </div>

      <Card className="rounded-2xl shadow-lg border-0 bg-gradient-to-br from-gray-50 to-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-black">Campaign Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-xl border">
                <h4 className="font-medium text-gray-600 mb-2">Campaign Type</h4>
                <p className="text-lg font-semibold text-black">{useCaseName} - {workflowName}</p>
              </div>
              
              <div className="p-4 bg-white rounded-xl border">
                <h4 className="font-medium text-gray-600 mb-2">Target Prospects</h4>
                <p className="text-2xl font-bold text-black">{prospects.toLocaleString()}</p>
              </div>

              <div className="p-4 bg-white rounded-xl border">
                <h4 className="font-medium text-gray-600 mb-2">Total Emails</h4>
                <p className="text-2xl font-bold text-black">{totalEmails.toLocaleString()}</p>
                <p className="text-sm text-gray-500">{emailsPerProspect} emails per prospect</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-6 bg-black text-white rounded-xl">
                <h4 className="font-medium opacity-90 mb-2">Total Credits Needed</h4>
                <p className="text-3xl font-bold font-mono">{totalCredits.toLocaleString()}</p>
              </div>

              <div className="p-6 bg-green-600 text-white rounded-xl">
                <h4 className="font-medium opacity-90 mb-2">Total Campaign Cost</h4>
                <p className="text-3xl font-bold">${totalUsd.toFixed(2)}</p>
                <p className="text-sm opacity-75">${costPerProspect.toFixed(3)} per prospect</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 rounded-xl text-center">
                  <p className="text-xs text-blue-600 font-medium">CREDITS/EMAIL</p>
                  <p className="text-lg font-bold text-blue-800">{(totalCredits / totalEmails).toFixed(1)}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-xl text-center">
                  <p className="text-xs text-purple-600 font-medium">COST/EMAIL</p>
                  <p className="text-lg font-bold text-purple-800">${(totalUsd / totalEmails).toFixed(3)}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <h3 className="text-lg font-semibold text-blue-900">Ready to Launch?</h3>
            <p className="text-blue-700">
              For <strong>{prospects.toLocaleString()} prospects</strong> with <strong>{emailsPerProspect} emails each</strong>, 
              you need <strong>{totalCredits.toLocaleString()} credits</strong> (${totalUsd.toFixed(2)}).
            </p>
            <div className="flex items-center justify-center space-x-2">
              <Badge className="bg-blue-600 text-white">Estimated Timeline: 2-3 weeks</Badge>
              <Badge variant="outline" className="border-blue-300 text-blue-700">Response Rate: 15-25%</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

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