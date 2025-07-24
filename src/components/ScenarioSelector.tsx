import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Mail, Phone, TrendingUp } from 'lucide-react';

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

interface ScenarioSelectorProps {
  workflows: Workflow[];
  selectedWorkflow: string;
  onSelectWorkflow: (workflowId: string) => void;
  onNext: () => void;
}

const getWorkflowIcon = (workflowId: string) => {
  switch (workflowId) {
    case 'basic-sdr':
      return <Mail className="w-6 h-6" />;
    case 'standard-sdr':
      return <Users className="w-6 h-6" />;
    case 'premium-sdr':
      return <Phone className="w-6 h-6" />;
    default:
      return <TrendingUp className="w-6 h-6" />;
  }
};

const getWorkflowColor = (workflowId: string) => {
  switch (workflowId) {
    case 'basic-sdr':
      return 'border-blue-200 hover:border-blue-300';
    case 'standard-sdr':
      return 'border-green-200 hover:border-green-300';
    case 'premium-sdr':
      return 'border-purple-200 hover:border-purple-300';
    default:
      return 'border-gray-200 hover:border-gray-300';
  }
};

export function ScenarioSelector({ workflows, selectedWorkflow, onSelectWorkflow, onNext }: ScenarioSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-black">Choose Your Workflow</h2>
        <p className="text-gray-600 text-lg">Select the workflow that best fits your automation needs</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {workflows.map((workflow) => (
          <Card
            key={workflow.id}
            className={`cursor-pointer transition-all duration-200 rounded-2xl ${
              selectedWorkflow === workflow.id
                ? 'ring-2 ring-black border-black shadow-lg'
                : `border-2 ${getWorkflowColor(workflow.id)} hover:shadow-md`
            }`}
            onClick={() => onSelectWorkflow(workflow.id)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-xl ${
                  workflow.id === 'basic-sdr' ? 'bg-blue-100 text-blue-600' :
                  workflow.id === 'standard-sdr' ? 'bg-green-100 text-green-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  {getWorkflowIcon(workflow.id)}
                </div>
                <div>
                  <CardTitle className="text-lg text-black">{workflow.name}</CardTitle>
                  <Badge variant="outline" className="mt-1">
                    {workflow.actions.length} actions
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 mb-4">
                {workflow.description}
              </CardDescription>
              <div className="space-y-2">
                {workflow.actions.map((action, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">{action.action}</span>
                    <Badge variant="secondary" className="text-xs">
                      {action.credits_per_unit} credits
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center pt-6">
        <Button
          onClick={onNext}
          disabled={!selectedWorkflow}
          size="lg"
          className="px-8 py-3 bg-black text-white hover:bg-gray-800 rounded-2xl"
        >
          Configure Campaign →
        </Button>
      </div>
    </div>
  );
}