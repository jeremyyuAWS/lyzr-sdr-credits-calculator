import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Users, Mail, TrendingUp, ArrowLeft, FileText, MessageSquare, Headphones, Search, UserCheck } from 'lucide-react';
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
  useCaseId: string;
  onProspectsChange: (value: number[]) => void;
  onEmailsChange: (value: number[]) => void;
  onBack: () => void;
  onNext: () => void;
}

const getUseCaseConfig = (useCaseId: string) => {
  switch (useCaseId) {
    case 'ai-sdr':
      return {
        title: 'Sales Campaign Configuration',
        subtitle: 'Configure your outbound sales automation',
        icon: <Users className="w-5 h-5" />,
        param1: {
          label: 'Monthly Prospects',
          description: 'How many prospects will you target per month?',
          min: 50,
          max: 2000,
          step: 50,
          unit: 'prospects'
        },
        param2: {
          label: 'Emails per Prospect',
          description: 'How many emails will each prospect receive?',
          min: 1,
          max: 8,
          step: 1,
          unit: 'emails'
        },
        metrics: [
          { label: 'TOTAL EMAILS', icon: <Mail className="w-5 h-5" />, color: 'blue' },
          { label: 'EST. RESPONSES', icon: <TrendingUp className="w-5 h-5" />, color: 'green' },
          { label: 'EST. MEETINGS', icon: <Users className="w-5 h-5" />, color: 'purple' }
        ]
      };
    
    case 'ai-marketer':
      return {
        title: 'Marketing Campaign Configuration',
        subtitle: 'Configure your content creation workflow',
        icon: <FileText className="w-5 h-5" />,
        param1: {
          label: 'Monthly Blog Posts',
          description: 'How many blog posts will you publish per month?',
          min: 1,
          max: 50,
          step: 1,
          unit: 'posts'
        },
        param2: {
          label: 'Social Posts per Blog',
          description: 'How many social media posts per blog post?',
          min: 1,
          max: 10,
          step: 1,
          unit: 'social posts'
        },
        metrics: [
          { label: 'TOTAL CONTENT', icon: <FileText className="w-5 h-5" />, color: 'blue' },
          { label: 'EST. REACH', icon: <TrendingUp className="w-5 h-5" />, color: 'green' },
          { label: 'EST. LEADS', icon: <Users className="w-5 h-5" />, color: 'purple' }
        ]
      };
    
    case 'ai-customer-service':
      return {
        title: 'Support Automation Configuration',
        subtitle: 'Configure your customer support AI',
        icon: <Headphones className="w-5 h-5" />,
        param1: {
          label: 'Monthly Support Tickets',
          description: 'How many support tickets do you handle per month?',
          min: 100,
          max: 5000,
          step: 100,
          unit: 'tickets'
        },
        param2: {
          label: 'Follow-ups per Ticket',
          description: 'How many follow-up interactions per ticket?',
          min: 1,
          max: 5,
          step: 1,
          unit: 'follow-ups'
        },
        metrics: [
          { label: 'TOTAL INTERACTIONS', icon: <MessageSquare className="w-5 h-5" />, color: 'blue' },
          { label: 'EST. RESOLVED', icon: <TrendingUp className="w-5 h-5" />, color: 'green' },
          { label: 'EST. ESCALATIONS', icon: <Users className="w-5 h-5" />, color: 'purple' }
        ]
      };
    
    case 'ai-knowledge-search':
      return {
        title: 'Knowledge Search Configuration',
        subtitle: 'Configure your document intelligence system',
        icon: <Search className="w-5 h-5" />,
        param1: {
          label: 'Monthly Document Queries',
          description: 'How many document searches per month?',
          min: 100,
          max: 10000,
          step: 100,
          unit: 'searches'
        },
        param2: {
          label: 'Documents per Query',
          description: 'How many documents analyzed per search?',
          min: 1,
          max: 20,
          step: 1,
          unit: 'documents'
        },
        metrics: [
          { label: 'TOTAL ANALYSES', icon: <Search className="w-5 h-5" />, color: 'blue' },
          { label: 'EST. INSIGHTS', icon: <TrendingUp className="w-5 h-5" />, color: 'green' },
          { label: 'EST. REPORTS', icon: <FileText className="w-5 h-5" />, color: 'purple' }
        ]
      };
    
    case 'ai-hr-support':
      return {
        title: 'HR Support Configuration',
        subtitle: 'Configure your HR automation workflow',
        icon: <UserCheck className="w-5 h-5" />,
        param1: {
          label: 'Monthly HR Queries',
          description: 'How many HR questions do you handle per month?',
          min: 50,
          max: 2000,
          step: 50,
          unit: 'queries'
        },
        param2: {
          label: 'Follow-ups per Query',
          description: 'How many follow-up interactions per query?',
          min: 1,
          max: 4,
          step: 1,
          unit: 'follow-ups'
        },
        metrics: [
          { label: 'TOTAL INTERACTIONS', icon: <MessageSquare className="w-5 h-5" />, color: 'blue' },
          { label: 'EST. RESOLVED', icon: <TrendingUp className="w-5 h-5" />, color: 'green' },
          { label: 'EST. ESCALATIONS', icon: <Users className="w-5 h-5" />, color: 'purple' }
        ]
      };
    
    default:
      return {
        title: 'Campaign Configuration',
        subtitle: 'Configure your automation workflow',
        icon: <Users className="w-5 h-5" />,
        param1: {
          label: 'Monthly Volume',
          description: 'How many units will you process per month?',
          min: 50,
          max: 2000,
          step: 50,
          unit: 'units'
        },
        param2: {
          label: 'Interactions per Unit',
          description: 'How many interactions per unit?',
          min: 1,
          max: 8,
          step: 1,
          unit: 'interactions'
        },
        metrics: [
          { label: 'TOTAL ACTIONS', icon: <Mail className="w-5 h-5" />, color: 'blue' },
          { label: 'EST. SUCCESS', icon: <TrendingUp className="w-5 h-5" />, color: 'green' },
          { label: 'EST. OUTCOMES', icon: <Users className="w-5 h-5" />, color: 'purple' }
        ]
      };
  }
};

const getMetricValues = (useCaseId: string, prospects: number, emailsPerProspect: number) => {
  const totalActions = prospects * emailsPerProspect;
  
  switch (useCaseId) {
    case 'ai-sdr':
      return [
        totalActions, // Total emails
        Math.round(prospects * 0.2), // 20% response rate
        Math.round(prospects * 0.05) // 5% meeting rate
      ];
    
    case 'ai-marketer':
      return [
        totalActions, // Total content pieces
        totalActions * 1000, // Estimated reach (1000 per content piece)
        Math.round(totalActions * 5) // Estimated leads (5 per content piece)
      ];
    
    case 'ai-customer-service':
      return [
        totalActions, // Total interactions
        Math.round(prospects * 0.8), // 80% resolution rate
        Math.round(prospects * 0.1) // 10% escalation rate
      ];
    
    case 'ai-knowledge-search':
      return [
        totalActions, // Total analyses
        Math.round(prospects * 0.6), // 60% useful insights
        Math.round(prospects * 0.1) // 10% generate reports
      ];
    
    case 'ai-hr-support':
      return [
        totalActions, // Total interactions
        Math.round(prospects * 0.9), // 90% resolution rate
        Math.round(prospects * 0.05) // 5% escalation rate
      ];
    
    default:
      return [totalActions, Math.round(prospects * 0.2), Math.round(prospects * 0.05)];
  }
};

export function CampaignConfigurator({ 
  selectedWorkflow, 
  prospects, 
  emailsPerProspect, 
  creditPerUsd,
  useCaseId,
  onProspectsChange, 
  onEmailsChange, 
  onBack, 
  onNext 
}: CampaignConfiguratorProps) {
  const config = getUseCaseConfig(useCaseId);
  const metricValues = getMetricValues(useCaseId, prospects, emailsPerProspect);

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
        <h2 className="text-3xl font-bold text-black">{config.title}</h2>
        <p className="text-gray-600 text-lg">{config.subtitle}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <Card className="rounded-2xl shadow-lg border-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-xl text-black">
                {config.icon}
                <span>Workflow Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-black">{config.param1.label}</label>
                  <Badge variant="outline" className="font-mono text-lg px-3 py-1">
                    {prospects.toLocaleString()} {config.param1.unit}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{config.param1.description}</p>
                <Slider
                  value={[prospects]}
                  onValueChange={onProspectsChange}
                  max={config.param1.max}
                  min={config.param1.min}
                  step={config.param1.step}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{config.param1.min}</span>
                  <span>{Math.round((config.param1.max + config.param1.min) / 2)}</span>
                  <span>{config.param1.max}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-black">{config.param2.label}</label>
                  <Badge variant="outline" className="font-mono text-lg px-3 py-1">
                    {emailsPerProspect} {config.param2.unit}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{config.param2.description}</p>
                <Slider
                  value={[emailsPerProspect]}
                  onValueChange={onEmailsChange}
                  max={config.param2.max}
                  min={config.param2.min}
                  step={config.param2.step}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{config.param2.min}</span>
                  <span>{Math.round((config.param2.max + config.param2.min) / 2)}</span>
                  <span>{config.param2.max}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                {config.metrics.map((metric, index) => (
                  <div key={index} className={`text-center p-3 bg-${metric.color}-50 rounded-xl`}>
                    <div className={`w-5 h-5 mx-auto mb-1 text-${metric.color}-600`}>
                      {metric.icon}
                    </div>
                    <p className={`text-xs text-${metric.color}-600 font-medium`}>{metric.label}</p>
                    <p className={`text-lg font-bold text-${metric.color}-800`}>
                      {metricValues[index].toLocaleString()}
                    </p>
                  </div>
                ))}
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
                    <p className="text-xs opacity-75">COST PER {config.param1.unit.toUpperCase().slice(0, -1)}</p>
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
          useCaseId={useCaseId}
        />
      </div>

      <div className="flex justify-between items-center pt-6">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="px-6 py-3 rounded-2xl border-gray-300 hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Workflows
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