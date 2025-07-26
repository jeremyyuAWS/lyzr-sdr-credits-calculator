import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Megaphone, Headphones, Search, UserCheck } from 'lucide-react';

interface UseCase {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  workflows: any[];
}

interface UseCaseSelectorProps {
  useCases: UseCase[];
  selectedUseCase: string;
  onSelectUseCase: (useCaseId: string) => void;
  onNext: () => void;
}

const getUseCaseIcon = (iconName: string, className: string = "w-8 h-8") => {
  switch (iconName) {
    case 'Users':
      return <Users className={className} />;
    case 'Megaphone':
      return <Megaphone className={className} />;
    case 'Headphones':
      return <Headphones className={className} />;
    case 'Search':
      return <Search className={className} />;
    case 'UserCheck':
      return <UserCheck className={className} />;
    default:
      return <Users className={className} />;
  }
};

const getColorClasses = (color: string, isSelected: boolean) => {
  const baseClasses = "cursor-pointer transition-all duration-200 rounded-2xl border-2";
  
  if (isSelected) {
    return `${baseClasses} ring-2 ring-black border-black shadow-lg`;
  }
  
  switch (color) {
    case 'blue':
      return `${baseClasses} border-blue-200 hover:border-blue-300 hover:shadow-md`;
    case 'green':
      return `${baseClasses} border-green-200 hover:border-green-300 hover:shadow-md`;
    case 'purple':
      return `${baseClasses} border-purple-200 hover:border-purple-300 hover:shadow-md`;
    case 'orange':
      return `${baseClasses} border-orange-200 hover:border-orange-300 hover:shadow-md`;
    case 'pink':
      return `${baseClasses} border-pink-200 hover:border-pink-300 hover:shadow-md`;
    default:
      return `${baseClasses} border-gray-200 hover:border-gray-300 hover:shadow-md`;
  }
};

const getIconColorClasses = (color: string) => {
  switch (color) {
    case 'blue':
      return 'bg-blue-100 text-blue-600';
    case 'green':
      return 'bg-green-100 text-green-600';
    case 'purple':
      return 'bg-purple-100 text-purple-600';
    case 'orange':
      return 'bg-orange-100 text-orange-600';
    case 'pink':
      return 'bg-pink-100 text-pink-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

export function UseCaseSelector({ useCases, selectedUseCase, onSelectUseCase, onNext }: UseCaseSelectorProps) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-black">Lyzr AI Credits Calculator</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose your AI use case to calculate credits and estimate costs for your automation workflows
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {useCases.map((useCase) => (
          <Card
            key={useCase.id}
            className={getColorClasses(useCase.color, selectedUseCase === useCase.id)}
            onClick={() => onSelectUseCase(useCase.id)}
          >
            <CardHeader className="pb-4">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`p-4 rounded-2xl ${getIconColorClasses(useCase.color)}`}>
                  {getUseCaseIcon(useCase.icon)}
                </div>
                <div>
                  <CardTitle className="text-xl text-black">{useCase.name}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 text-center leading-relaxed mb-4">
                {useCase.description}
              </CardDescription>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 text-center">Available Workflows:</p>
                <ul className="space-y-1 text-sm text-gray-600">
                  {useCase.workflows.map((workflow, index) => (
                    <li key={workflow.id} className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      <span className="leading-relaxed">{workflow.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center pt-8">
        <Button
          onClick={onNext}
          disabled={!selectedUseCase}
          size="lg"
          className="px-12 py-4 bg-black text-white hover:bg-gray-800 rounded-2xl text-lg"
        >
          Explore Workflows →
        </Button>
      </div>

      <div className="text-center pt-6 pb-4">
        <p className="text-sm text-gray-500">
          Select a use case above to view available workflows and calculate your credit requirements
        </p>
      </div>
    </div>
  );
}