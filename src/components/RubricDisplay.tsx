
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, List, Grid } from 'lucide-react';
import { toast } from 'sonner';

interface RubricDisplayProps {
  response: string;
}

interface RubricData {
  criteria: string;
  excellent: string;
  good: string;
  satisfactory: string;
  needsImprovement: string;
  points?: string;
}

export const RubricDisplay: React.FC<RubricDisplayProps> = ({ response }) => {
  const [viewMode, setViewMode] = useState<'list' | 'table'>('list');

  const parseRubricData = (text: string): RubricData[] => {
    // Simple parsing logic - this can be enhanced based on AI response format
    const lines = text.split('\n').filter(line => line.trim());
    const rubricData: RubricData[] = [];
    
    // Look for common rubric patterns
    const criteriaPattern = /(\d+\.|•|\-)\s*(.+?):/;
    const levelPattern = /(Excellent|Outstanding|Good|Satisfactory|Fair|Needs?\s*Improvement|Poor)\s*[:\-]\s*(.+)/i;
    
    let currentCriterion: Partial<RubricData> = {};
    
    for (const line of lines) {
      const criteriaMatch = line.match(criteriaPattern);
      if (criteriaMatch) {
        if (currentCriterion.criteria) {
          rubricData.push(currentCriterion as RubricData);
        }
        currentCriterion = { criteria: criteriaMatch[2].trim() };
      }
      
      const levelMatch = line.match(levelPattern);
      if (levelMatch && currentCriterion.criteria) {
        const level = levelMatch[1].toLowerCase();
        const description = levelMatch[2].trim();
        
        if (level.includes('excellent') || level.includes('outstanding')) {
          currentCriterion.excellent = description;
        } else if (level.includes('good')) {
          currentCriterion.good = description;
        } else if (level.includes('satisfactory') || level.includes('fair')) {
          currentCriterion.satisfactory = description;
        } else if (level.includes('needs') || level.includes('poor')) {
          currentCriterion.needsImprovement = description;
        }
      }
    }
    
    if (currentCriterion.criteria) {
      rubricData.push(currentCriterion as RubricData);
    }
    
    // If parsing didn't work well, create a generic structure
    if (rubricData.length === 0) {
      return [{
        criteria: 'Content Quality',
        excellent: 'Exceptional work that exceeds expectations',
        good: 'Good work that meets most expectations',
        satisfactory: 'Adequate work that meets basic requirements',
        needsImprovement: 'Work that needs significant improvement',
        points: '25 points'
      }];
    }
    
    return rubricData;
  };

  const generateHTMLTable = (data: RubricData[]): string => {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Assessment Rubric</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f5f5f5;
        }
        .rubric-container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            max-width: 1200px;
            margin: 0 auto;
        }
        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid rgb(63, 159, 255);
            padding-bottom: 10px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
            vertical-align: top;
        }
        th {
            background: linear-gradient(135deg, rgb(63, 159, 255), rgb(156, 77, 255));
            color: white;
            font-weight: bold;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        tr:hover {
            background-color: #f0f0f0;
        }
        .criteria-cell {
            font-weight: bold;
            background-color: #e8f4ff;
        }
        .excellent { background-color: #d4edda; }
        .good { background-color: #d1ecf1; }
        .satisfactory { background-color: #fff3cd; }
        .needs-improvement { background-color: #f8d7da; }
        @media print {
            body { background: white; }
            .rubric-container { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="rubric-container">
        <h1>Assessment Rubric</h1>
        <table>
            <thead>
                <tr>
                    <th style="width: 20%;">Criteria</th>
                    <th style="width: 20%;">Excellent (4)</th>
                    <th style="width: 20%;">Good (3)</th>
                    <th style="width: 20%;">Satisfactory (2)</th>
                    <th style="width: 20%;">Needs Improvement (1)</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(row => `
                    <tr>
                        <td class="criteria-cell">${row.criteria || 'N/A'}</td>
                        <td class="excellent">${row.excellent || 'Exceptional performance'}</td>
                        <td class="good">${row.good || 'Good performance'}</td>
                        <td class="satisfactory">${row.satisfactory || 'Adequate performance'}</td>
                        <td class="needs-improvement">${row.needsImprovement || 'Needs improvement'}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <p style="text-align: center; margin-top: 30px; color: #666;">
            Generated on ${new Date().toLocaleDateString()} | Auralis Education Assistant
        </p>
    </div>
</body>
</html>`;
    return html;
  };

  const downloadHTML = () => {
    const rubricData = parseRubricData(response);
    const htmlContent = generateHTMLTable(rubricData);
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rubric_${new Date().toISOString().split('T')[0]}.html`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Rubric downloaded as HTML file!');
  };

  const rubricData = parseRubricData(response);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <Button
          onClick={() => setViewMode('list')}
          variant={viewMode === 'list' ? 'default' : 'outline'}
          className="border-[rgb(63,159,255)] text-[rgb(63,159,255)] hover:bg-[rgb(63,159,255)]/10"
        >
          <List size={16} className="mr-2" />
          List View
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="border-[rgb(156,77,255)] text-[rgb(156,77,255)] hover:bg-[rgb(156,77,255)]/10"
            >
              <Grid size={16} className="mr-2" />
              Table View
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[80vh] overflow-auto bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-white">Rubric Table View</DialogTitle>
            </DialogHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-white font-bold">Criteria</TableHead>
                    <TableHead className="text-white font-bold">Excellent (4)</TableHead>
                    <TableHead className="text-white font-bold">Good (3)</TableHead>
                    <TableHead className="text-white font-bold">Satisfactory (2)</TableHead>
                    <TableHead className="text-white font-bold">Needs Improvement (1)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rubricData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium text-blue-300">{row.criteria || 'N/A'}</TableCell>
                      <TableCell className="text-green-300">{row.excellent || 'Exceptional performance'}</TableCell>
                      <TableCell className="text-blue-300">{row.good || 'Good performance'}</TableCell>
                      <TableCell className="text-yellow-300">{row.satisfactory || 'Adequate performance'}</TableCell>
                      <TableCell className="text-red-300">{row.needsImprovement || 'Needs improvement'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>
        <Button
          onClick={downloadHTML}
          variant="outline"
          className="border-[rgb(255,77,156)] text-[rgb(255,77,156)] hover:bg-[rgb(255,77,156)]/10"
        >
          <Download size={16} className="mr-2" />
          Download HTML
        </Button>
      </div>

      {viewMode === 'list' && (
        <div className="bg-input border border-border rounded-lg p-4 min-h-[200px] max-h-[400px] overflow-y-auto">
          <div 
            className="text-white whitespace-pre-wrap font-sans text-sm"
            dangerouslySetInnerHTML={{ 
              __html: response
                .replace(/##\s+(.*?)\n/g, '<h2 class="text-xl font-bold text-white mt-6 mb-3 border-b border-gray-600 pb-2">$1</h2>')
                .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-blue-300">$1</strong>')
                .replace(/\*(.*?)\*/g, '<em class="italic text-gray-300">$1</em>')
                .replace(/\n\n/g, '</p><p class="mb-4">')
                .replace(/\n/g, '<br>')
                .replace(/^(.*)$/, '<p class="mb-4">$1</p>')
            }}
          />
        </div>
      )}
    </div>
  );
};
