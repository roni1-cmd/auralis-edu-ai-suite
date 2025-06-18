
import { useState } from 'react';
import { AIFeature } from '@/components/AIFeature';
import { fireworksService } from '@/services/fireworks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AutomaticGrading = () => {
  const [gradingData, setGradingData] = useState<any>(null);

  const handleGrading = async (content: string, additionalData?: Record<string, string>) => {
    const criteria = additionalData?.criteria || 'Standard grading criteria';
    const response = await fireworksService.automaticGrading(content, criteria);
    
    // Mock data for demonstration - in a real app, you'd parse the AI response
    setGradingData({
      overallGrade: 85,
      criteria: [
        { name: 'Content', score: 90 },
        { name: 'Grammar', score: 80 },
        { name: 'Structure', score: 85 },
        { name: 'Creativity', score: 88 },
      ],
      distribution: [
        { grade: 'A', count: 12 },
        { grade: 'B', count: 18 },
        { grade: 'C', count: 8 },
        { grade: 'D', count: 3 },
        { grade: 'F', count: 1 },
      ]
    });

    return response;
  };

  return (
    <div className="space-y-6">
      <AIFeature
        title="Automatic Grading"
        description="AI-powered grading with detailed analytics and feedback"
        onSubmit={handleGrading}
        additionalFields={[
          {
            key: 'criteria',
            label: 'Grading Criteria',
            type: 'textarea',
            placeholder: 'Enter specific grading criteria and rubric details...'
          }
        ]}
        placeholder="Paste the student's work here for grading..."
      />

      {gradingData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-white">Criteria Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={gradingData.criteria}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                  <Bar dataKey="score" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-white">Grade Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={gradingData.distribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    dataKey="count"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {gradingData.distribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={['#10b981', '#3b82f6', '#f59e0b', '#f97316', '#ef4444'][index]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AutomaticGrading;
