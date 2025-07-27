import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle, Calculator, DollarSign } from 'lucide-react';

interface Action {
  action: string;
  credits_per_unit: number;
  description: string;
}

interface CreditBreakdownTableProps {
  actions: Action[];
  prospects: number;
  emailsPerProspect: number;
  creditPerUsd: number;
  useCaseId: string;
}

export function CreditBreakdownTable({ actions, prospects, emailsPerProspect, creditPerUsd, useCaseId }: CreditBreakdownTableProps) {
  const getUnitLabels = (useCaseId: string) => {
    switch (useCaseId) {
      case 'ai-sdr':
        return { unit1: 'prospects', unit2: 'emails' };
      case 'ai-marketer':
        return { unit1: 'blog posts', unit2: 'social posts' };
      case 'ai-customer-service':
        return { unit1: 'tickets', unit2: 'follow-ups' };
      case 'ai-knowledge-search':
        return { unit1: 'searches', unit2: 'documents' };
      case 'ai-hr-support':
        return { unit1: 'queries', unit2: 'follow-ups' };
      default:
        return { unit1: 'units', unit2: 'actions' };
    }
  };

  const unitLabels = getUnitLabels(useCaseId);

  const calculateActionCredits = (action: Action) => {
    let multiplier = prospects;
    
    // Certain actions are multiplied by interactions per unit
    if (action.action.toLowerCase().includes('email') || 
        action.action.toLowerCase().includes('follow-up') ||
        action.action.toLowerCase().includes('social media') ||
        action.action.toLowerCase().includes('query') ||
        action.action.toLowerCase().includes('response')) {
      multiplier = prospects * emailsPerProspect;
    }
    
    return action.credits_per_unit * multiplier;
  };

  const totalCredits = actions.reduce((sum, action) => sum + calculateActionCredits(action), 0);
  const totalUsd = totalCredits * creditPerUsd;

  return (
    <Card className="rounded-2xl shadow-lg border-0 bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-xl text-black">
          <Calculator className="w-5 h-5" />
          <span>Cost Breakdown</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="bg-white rounded-full p-1 border border-gray-200 hover:bg-gray-50 transition-colors">
                <HelpCircle className="w-4 h-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent className="bg-white border border-gray-200 shadow-md">
                <p>Credits are consumed based on AI actions performed per prospect</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {actions.map((action, index) => {
            const actionCredits = calculateActionCredits(action);
            const actionUsd = actionCredits * creditPerUsd;
            
            return (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-black">{action.action}</h4>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="bg-white rounded-full p-1 border border-gray-200 hover:bg-gray-50 transition-colors">
                          <HelpCircle className="w-3 h-3 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-white border border-gray-200 shadow-md">
                          <p>{action.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-sm text-gray-600">
                    {action.credits_per_unit} credits × {
                      action.action.toLowerCase().includes('email') || action.action.toLowerCase().includes('follow-up') ||
                      action.action.toLowerCase().includes('social media') || action.action.toLowerCase().includes('query') ||
                      action.action.toLowerCase().includes('response')
                        ? `${prospects} ${unitLabels.unit1} × ${emailsPerProspect} ${unitLabels.unit2}`
                        : `${prospects} ${unitLabels.unit1}`
                    }
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <Badge variant="outline" className="text-sm font-mono">
                    {actionCredits.toLocaleString()} credits
                  </Badge>
                  <p className="text-xs text-gray-500">${actionUsd.toFixed(2)}</p>
                </div>
              </div>
            );
          })}
          
          <div className="border-t pt-4 mt-6">
            <div className="flex items-center justify-between p-4 bg-black text-white rounded-xl">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span className="text-lg font-semibold">Total Cost</span>
              </div>
              <div className="text-right space-y-1">
                <div className="text-xl font-mono font-bold">
                  {totalCredits.toLocaleString()} credits
                </div>
                <div className="text-lg opacity-90">
                  ${totalUsd.toFixed(2)} USD
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}