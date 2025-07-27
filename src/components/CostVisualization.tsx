import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react';

interface Action {
  action: string;
  credits_per_unit: number;
  description: string;
}

interface CostVisualizationProps {
  actions: Action[];
  prospects: number;
  emailsPerProspect: number;
  useCaseId: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export function CostVisualization({ actions, prospects, emailsPerProspect, useCaseId }: CostVisualizationProps) {
  const calculateActionCredits = (action: Action) => {
    let multiplier = prospects;
    
    if (action.action.toLowerCase().includes('email') || 
        action.action.toLowerCase().includes('follow-up') ||
        action.action.toLowerCase().includes('social media') ||
        action.action.toLowerCase().includes('query') ||
        action.action.toLowerCase().includes('response')) {
      multiplier = prospects * emailsPerProspect;
    }
    
    return action.credits_per_unit * multiplier;
  };

  const chartData = actions.map((action, index) => ({
    name: action.action,
    credits: calculateActionCredits(action),
    percentage: 0, // Will calculate after we have total
    color: COLORS[index % COLORS.length]
  }));

  const totalCredits = chartData.reduce((sum, item) => sum + item.credits, 0);
  
  // Update percentages
  chartData.forEach(item => {
    item.percentage = Math.round((item.credits / totalCredits) * 100);
  });

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-black">{data.name}</p>
          <p className="text-sm text-gray-600">
            {data.credits.toLocaleString()} credits ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const BarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const credits = payload[0].value;
      const percentage = Math.round((credits / totalCredits) * 100);
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-black">{label}</p>
          <p className="text-sm text-gray-600">
            {credits.toLocaleString()} credits ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="rounded-2xl shadow-lg border-0">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-lg text-black">
            <PieChartIcon className="w-5 h-5" />
            <span>Credit Distribution</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="credits"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-gray-700">{item.name}</span>
                </div>
                <span className="font-medium text-black">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-lg border-0">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-lg text-black">
            <BarChart3 className="w-5 h-5" />
            <span>Credits by Action</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart 
              data={chartData} 
              layout="horizontal"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={100}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  // Truncate long action names for better display
                  return value.length > 15 ? value.substring(0, 15) + '...' : value;
                }}
              />
              <Tooltip content={<BarTooltip />} />
              <Bar 
                dataKey="credits" 
                fill="#0088FE" 
                radius={[0, 4, 4, 0]}
                name="Credits"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}