import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Users, Mail, TrendingUp, ArrowLeft } from 'lucide-react';
import { CreditBreakdownTable } from './CreditBreakdownTable';

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

interface CampaignConfiguratorProps {
  selectedWorkflow: Workflow;
  prospects: number;
  emailsPerProspect: number;
  creditPerUsd: number;
  onProspectsChange: (value: number[]) => void;
  onEmailsChange: (value: number[]) => void;
  onBack: () => void;
  onNext: () => void;
}

export function CampaignConfigurator({ 
  selectedWorkflow, 
  prospects, 
  emailsPerProspect, 
  creditPerUsd,
  onProspectsChange, 
  onEmailsChange, 
  onBack, 
  onNext 
}: CampaignConfiguratorProps) {
  const totalCredits = selectedWorkflow.actions.reduce((sum, action) => {
    let multiplier = prospects;
    // For certain actions, multiply by number of emails/interactions
    if (action.action.toLowerCase().includes('email') || 
        action.action.toLowerCase().includes('follow-up') ||
        action.action.toLowerCase().includes('social media') ||
        action.action.toLowerCase().includes('query') ||
        action.action.toLowerCase().includes('response')) {
      multiplier = prospects * emailsPerProspect;
    }
    return sum + (action.credits_per_unit * multiplier);
  }, 0);

  const totalUsd = totalCredits * creditPerUsd;

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-black">Configure Your Campaign</h2>
        <p className="text-gray-600 text-lg">Fine-tune your workflow parameters</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <Card className="rounded-2xl shadow-lg border-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-xl text-black">{
                <Users className="w-5 h-5" />
                <span>Workflow Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-black">Volume/Scale</label>
                  <Badge variant="outline" className="font-mono text-lg px-3 py-1">
                    {prospects.toLocaleString()}
                  </Badge>
                </div>
                <Slider
                  value={[prospects]}
                  onValueChange={onProspectsChange}
                  max={2000}
                  min={50}
                  step={50}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>50</span>
                  <span>1,000</span>
                  <span>2,000</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-black">Interactions per Unit</label>
                  <Badge variant="outline" className="font-mono text-lg px-3 py-1">
                    {emailsPerProspect}
                  </Badge>
                </div>
                <Slider
                  value={[emailsPerProspect]}
                  onValueChange={onEmailsChange}
                  max={8}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>1</span>
                  <span>4</span>
                  <span>8</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center p-3 bg-blue-50 rounded-xl">
                  <Mail className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                  <p className="text-xs text-blue-600 font-medium">TOTAL ACTIONS</p>
                  <p className="text-lg font-bold text-blue-800">{(prospects * emailsPerProspect).toLocaleString()}</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-xl">
                  <TrendingUp className="w-5 h-5 mx-auto mb-1 text-green-600" />
                  <p className="text-xs text-green-600 font-medium">EST. SUCCESS</p>
                  <p className="text-lg font-bold text-green-800">{Math.round(prospects * 0.2)}</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-xl">
                  <Users className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                  <p className="text-xs text-purple-600 font-medium">EST. OUTCOMES</p>
                  <p className="text-lg font-bold text-purple-800">{Math.round(prospects * 0.05)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl bg-gradient-to-r from-black to-gray-800 text-white">
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <h3 className="text-lg font-semibold">Live Cost Estimate</h3>
                <div className="space-y-2">
                  <p className="text-3xl font-bold font-mono">{totalCredits.toLocaleString()} credits</p>
                  <p className="text-xl opacity-90">${totalUsd.toFixed(2)} USD</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center">
                    <p className="text-xs opacity-75">COST PER UNIT</p>
                    <p className="text-lg font-semibold">${(totalUsd / prospects).toFixed(3)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs opacity-75">COST PER ACTION</p>
                    <p className="text-lg font-semibold">${(totalUsd / (prospects * emailsPerProspect)).toFixed(3)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <CreditBreakdownTable
          actions={selectedWorkflow.actions}
          prospects={prospects}
          emailsPerProspect={emailsPerProspect}
          creditPerUsd={creditPerUsd}
        />
      </div>

      <div className="flex justify-between items-center pt-6">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="px-6 py-3 rounded-2xl border-gray-300 hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Use Cases
        </Button>
        
        <Button 
          onClick={onNext}
          size="lg"
          className="px-8 py-3 bg-black text-white hover:bg-gray-800 rounded-2xl"
        >
          View Summary →
        </Button>
      </div>
    </div>
  );
}