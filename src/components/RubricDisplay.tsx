
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
  weight?: string;
  description?: string;
  excellentRange?: string;
  goodRange?: string;
  satisfactoryRange?: string;
  needsImprovementRange?: string;
}

export const RubricDisplay: React.FC<RubricDisplayProps> = ({ response }) => {
  const [viewMode, setViewMode] = useState<'list' | 'table'>('list');

  const parseRubricData = (text: string): RubricData[] => {
    // Enhanced parsing logic for more detailed rubric data with percentage ranges
    const lines = text.split('\n').filter(line => line.trim());
    const rubricData: RubricData[] = [];
    
    // Look for common rubric patterns with percentage ranges
    const criteriaPattern = /(\d+\.|•|\-|#{1,3})\s*(.+?)[:]/;
    const levelPattern = /(Excellent|Outstanding|Exemplary|Good|Proficient|Satisfactory|Fair|Adequate|Needs?\s*Improvement|Poor|Unsatisfactory)\s*[:\-]\s*(.+)/i;
    const pointPattern = /(\d+)\s*(points?|pts?|%)/i;
    const percentagePattern = /(\d+)-(\d+)%/g;
    
    let currentCriterion: Partial<RubricData> = {};
    
    for (const line of lines) {
      const criteriaMatch = line.match(criteriaPattern);
      if (criteriaMatch) {
        if (currentCriterion.criteria) {
          rubricData.push(currentCriterion as RubricData);
        }
        currentCriterion = { 
          criteria: criteriaMatch[2].trim(),
          description: '',
          weight: '',
          points: '',
          excellentRange: '90-100%',
          goodRange: '80-89%',
          satisfactoryRange: '70-79%',
          needsImprovementRange: '0-69%'
        };
        
        // Extract points if mentioned in the same line
        const pointMatch = line.match(pointPattern);
        if (pointMatch) {
          currentCriterion.points = pointMatch[0];
        }
        continue;
      }
      
      const levelMatch = line.match(levelPattern);
      if (levelMatch && currentCriterion.criteria) {
        const level = levelMatch[1].toLowerCase();
        const description = levelMatch[2].trim();
        
        if (level.includes('excellent') || level.includes('outstanding') || level.includes('exemplary')) {
          currentCriterion.excellent = description;
        } else if (level.includes('good') || level.includes('proficient')) {
          currentCriterion.good = description;
        } else if (level.includes('satisfactory') || level.includes('fair') || level.includes('adequate')) {
          currentCriterion.satisfactory = description;
        } else if (level.includes('needs') || level.includes('poor') || level.includes('unsatisfactory')) {
          currentCriterion.needsImprovement = description;
        }
      }
      
      // Extract additional details like weight or points
      if (currentCriterion.criteria && !levelMatch) {
        const pointMatch = line.match(pointPattern);
        if (pointMatch && !currentCriterion.points) {
          currentCriterion.points = pointMatch[0];
        }
        
        const weightMatch = line.match(/weight\s*:?\s*(\d+%?)/i);
        if (weightMatch) {
          currentCriterion.weight = weightMatch[1];
        }
      }
    }
    
    if (currentCriterion.criteria) {
      rubricData.push(currentCriterion as RubricData);
    }
    
    // If parsing didn't work well, create enhanced generic structure with detailed percentages
    if (rubricData.length === 0) {
      return [
        {
          criteria: 'Content Quality & Understanding',
          excellent: 'Demonstrates exceptional understanding with comprehensive analysis, original insights, and sophisticated reasoning. Shows mastery of all concepts with innovative applications.',
          good: 'Shows solid understanding with good analysis and clear reasoning. Demonstrates proficiency in most concepts with some creative applications.',
          satisfactory: 'Displays basic understanding with adequate analysis. Shows developing grasp of fundamental concepts with standard applications.',
          needsImprovement: 'Shows limited understanding with weak analysis. Demonstrates minimal grasp of concepts requiring significant support and instruction.',
          points: '25 points',
          weight: '25%',
          description: 'Evaluates depth of understanding and quality of content',
          excellentRange: '90-100%',
          goodRange: '80-89%',
          satisfactoryRange: '70-79%',
          needsImprovementRange: '0-69%'
        },
        {
          criteria: 'Organization & Structure',
          excellent: 'Exceptionally well-organized with clear, logical flow and seamless transitions. Compelling introduction that hooks the reader and conclusion that synthesizes key points effectively.',
          good: 'Well-organized with good structure and adequate transitions. Clear introduction and conclusion that support the main content effectively.',
          satisfactory: 'Basic organization with some structure. Adequate introduction and conclusion that meet minimum requirements.',
          needsImprovement: 'Poor organization with unclear structure. Weak or missing introduction/conclusion that fail to support the content.',
          points: '20 points',
          weight: '20%',
          description: 'Assesses logical flow and structural elements',
          excellentRange: '90-100%',
          goodRange: '80-89%',
          satisfactoryRange: '70-79%',
          needsImprovementRange: '0-69%'
        },
        {
          criteria: 'Research & Evidence',
          excellent: 'Outstanding use of diverse, credible sources with excellent integration and critical analysis. Proper citations throughout with sophisticated synthesis of information.',
          good: 'Good use of credible sources with adequate integration and analysis. Most citations are proper with effective use of supporting evidence.',
          satisfactory: 'Basic use of acceptable sources with some integration. Citations are generally correct with adequate supporting evidence.',
          needsImprovement: 'Limited or poor use of sources with minimal integration. Missing or incorrect citations with insufficient supporting evidence.',
          points: '20 points',
          weight: '20%',
          description: 'Evaluates use of sources and supporting evidence',
          excellentRange: '90-100%',
          goodRange: '80-89%',
          satisfactoryRange: '70-79%',
          needsImprovementRange: '0-69%'
        },
        {
          criteria: 'Writing Mechanics & Style',
          excellent: 'Excellent grammar, spelling, and style throughout. Engaging, professional writing with varied sentence structure and sophisticated vocabulary.',
          good: 'Good grammar and spelling with clear, effective writing style. Minor errors that don\'t impede understanding with appropriate vocabulary.',
          satisfactory: 'Adequate grammar and spelling with basic writing style. Writing is clear but may lack engagement with standard vocabulary.',
          needsImprovement: 'Frequent errors in grammar/spelling that impede understanding. Poor writing style with limited vocabulary and unclear expression.',
          points: '15 points',
          weight: '15%',
          description: 'Assesses technical writing skills and presentation',
          excellentRange: '90-100%',
          goodRange: '80-89%',
          satisfactoryRange: '70-79%',
          needsImprovementRange: '0-69%'
        },
        {
          criteria: 'Critical Thinking & Analysis',
          excellent: 'Demonstrates sophisticated critical thinking with in-depth analysis, evaluation of multiple perspectives, and original conclusions supported by evidence.',
          good: 'Shows solid critical thinking with good analysis and consideration of different viewpoints. Conclusions are well-supported and logical.',
          satisfactory: 'Displays basic critical thinking with adequate analysis. Shows some consideration of different perspectives with acceptable conclusions.',
          needsImprovement: 'Limited critical thinking with superficial analysis. Minimal consideration of perspectives with weak or unsupported conclusions.',
          points: '20 points',
          weight: '20%',
          description: 'Evaluates analytical and critical thinking skills',
          excellentRange: '90-100%',
          goodRange: '80-89%',
          satisfactoryRange: '70-79%',
          needsImprovementRange: '0-69%'
        }
      ];
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
    <title>Professional Assessment Rubric</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
        }
        .rubric-container {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            max-width: 1400px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 3px solid;
            border-image: linear-gradient(90deg, rgb(63, 159, 255), rgb(156, 77, 255)) 1;
        }
        h1 {
            color: #2c3e50;
            font-size: 2.5em;
            margin-bottom: 10px;
            background: linear-gradient(90deg, rgb(63, 159, 255), rgb(156, 77, 255));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .subtitle {
            color: #7f8c8d;
            font-size: 1.2em;
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
            font-size: 14px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
        }
        th, td {
            border: 1px solid #e0e6ed;
            padding: 16px 12px;
            text-align: left;
            vertical-align: top;
            line-height: 1.5;
        }
        th {
            background: linear-gradient(135deg, rgb(63, 159, 255), rgb(156, 77, 255));
            color: white;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-size: 13px;
        }
        .criteria-cell {
            font-weight: 600;
            background: linear-gradient(135deg, #e8f4ff, #f0f8ff);
            color: #2c3e50;
            border-left: 4px solid rgb(63, 159, 255);
            min-width: 200px;
        }
        .criteria-title {
            font-size: 15px;
            margin-bottom: 8px;
            color: rgb(63, 159, 255);
        }
        .criteria-desc {
            font-size: 12px;
            color: #7f8c8d;
            font-weight: normal;
            font-style: italic;
        }
        .points-weight {
            background: #f8f9fa;
            font-weight: 600;
            color: rgb(156, 77, 255);
            text-align: center;
            font-size: 13px;
        }
        .excellent { 
            background: linear-gradient(135deg, #d4edda, #c3e6cb); 
            border-left: 4px solid #28a745;
        }
        .good { 
            background: linear-gradient(135deg, #d1ecf1, #bee5eb); 
            border-left: 4px solid #17a2b8;
        }
        .satisfactory { 
            background: linear-gradient(135deg, #fff3cd, #ffeaa7); 
            border-left: 4px solid #ffc107;
        }
        .needs-improvement { 
            background: linear-gradient(135deg, #f8d7da, #f5c6cb); 
            border-left: 4px solid #dc3545;
        }
        tr:hover {
            background-color: rgba(63, 159, 255, 0.05);
            transform: translateY(-1px);
            transition: all 0.2s ease;
        }
        .performance-level {
            font-weight: 600;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-size: 12px;
        }
        .percentage-range {
            font-weight: 700;
            font-size: 14px;
            margin-bottom: 6px;
            padding: 4px 8px;
            border-radius: 4px;
            display: inline-block;
        }
        .level-description {
            line-height: 1.6;
            font-size: 13px;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #ecf0f1;
            color: #7f8c8d;
            font-size: 14px;
        }
        .watermark {
            background: linear-gradient(90deg, rgb(63, 159, 255), rgb(156, 77, 255));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: 600;
        }
        @media print {
            body { 
                background: white; 
                padding: 0;
            }
            .rubric-container { 
                box-shadow: none; 
                padding: 20px;
            }
            tr:hover {
                transform: none;
            }
        }
        @media (max-width: 768px) {
            .rubric-container {
                padding: 20px;
            }
            table {
                font-size: 12px;
            }
            th, td {
                padding: 12px 8px;
            }
        }
    </style>
</head>
<body>
    <div class="rubric-container">
        <div class="header">
            <h1>Professional Assessment Rubric</h1>
            <div class="subtitle">Comprehensive Evaluation Framework with Percentage-Based Scoring</div>
        </div>
        <table>
            <thead>
                <tr>
                    <th style="width: 18%;">Assessment Criteria</th>
                    <th style="width: 8%;">Points/Weight</th>
                    <th style="width: 18%;">Excellent (90-100%)</th>
                    <th style="width: 18%;">Good (80-89%)</th>
                    <th style="width: 18%;">Satisfactory (70-79%)</th>
                    <th style="width: 20%;">Needs Improvement (0-69%)</th>
                </tr>
            </thead>
            <tbody>
                ${data.map((row, index) => `
                    <tr>
                        <td class="criteria-cell">
                            <div class="criteria-title">${row.criteria || 'Assessment Criterion'}</div>
                            ${row.description ? `<div class="criteria-desc">${row.description}</div>` : ''}
                        </td>
                        <td class="points-weight">
                            ${row.points ? `<div>${row.points}</div>` : '<div>25 pts</div>'}
                            ${row.weight ? `<div style="font-size: 11px; margin-top: 4px;">${row.weight}</div>` : ''}
                        </td>
                        <td class="excellent">
                            <div class="performance-level" style="color: #28a745;">Excellent</div>
                            <div class="percentage-range" style="background: #28a745; color: white;">${row.excellentRange || '90-100%'}</div>
                            <div class="level-description">${row.excellent || 'Exceptional performance that exceeds all expectations. Demonstrates mastery and innovation with sophisticated understanding.'}</div>
                        </td>
                        <td class="good">
                            <div class="performance-level" style="color: #17a2b8;">Good</div>
                            <div class="percentage-range" style="background: #17a2b8; color: white;">${row.goodRange || '80-89%'}</div>
                            <div class="level-description">${row.good || 'Strong performance that meets most expectations. Shows solid understanding and skill with good application of concepts.'}</div>
                        </td>
                        <td class="satisfactory">
                            <div class="performance-level" style="color: #ffc107;">Satisfactory</div>
                            <div class="percentage-range" style="background: #ffc107; color: white;">${row.satisfactoryRange || '70-79%'}</div>
                            <div class="level-description">${row.satisfactory || 'Adequate performance that meets basic requirements. Shows developing understanding with standard application.'}</div>
                        </td>
                        <td class="needs-improvement">
                            <div class="performance-level" style="color: #dc3545;">Needs Improvement</div>
                            <div class="percentage-range" style="background: #dc3545; color: white;">${row.needsImprovementRange || '0-69%'}</div>
                            <div class="level-description">${row.needsImprovement || 'Performance below expectations. Requires significant development and additional support to meet standards.'}</div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        
        <div style="margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #f8f9fa, #e9ecef); border-radius: 8px; border-left: 4px solid rgb(63, 159, 255);">
            <h3 style="color: #2c3e50; margin-bottom: 15px;">Percentage-Based Scoring Guide</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; font-size: 13px;">
                <div><strong>Excellent (90-100%):</strong> Exceeds expectations with exceptional quality</div>
                <div><strong>Good (80-89%):</strong> Meets expectations with solid performance</div>
                <div><strong>Satisfactory (70-79%):</strong> Approaching expectations with adequate work</div>
                <div><strong>Needs Improvement (0-69%):</strong> Below expectations requiring additional support</div>
            </div>
            <p style="margin-top: 15px; font-size: 12px; color: #6c757d; font-style: italic;">
                Total possible points: ${data.reduce((sum, item) => sum + parseInt(item.points?.match(/\d+/)?.[0] || '25'), 0)} points
            </p>
        </div>
        
        <div class="footer">
            <div style="margin-bottom: 10px;">Generated on ${new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</div>
            <div class="watermark">Corea Starstroupe | All Rights Reserved</div>
        </div>
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
    link.download = `professional_rubric_${new Date().toISOString().split('T')[0]}.html`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Professional rubric downloaded as HTML file!');
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
          <DialogContent className="max-w-7xl max-h-[90vh] overflow-auto bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-white text-xl">Professional Rubric Table View</DialogTitle>
            </DialogHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-[rgb(63,159,255)] to-[rgb(156,77,255)]">
                    <TableHead className="text-white font-bold">Assessment Criteria</TableHead>
                    <TableHead className="text-white font-bold">Points/Weight</TableHead>
                    <TableHead className="text-white font-bold">Excellent (90-100%)</TableHead>
                    <TableHead className="text-white font-bold">Good (80-89%)</TableHead>
                    <TableHead className="text-white font-bold">Satisfactory (70-79%)</TableHead>
                    <TableHead className="text-white font-bold">Needs Improvement (0-69%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rubricData.map((row, index) => (
                    <TableRow key={index} className="hover:bg-[rgb(63,159,255)]/5">
                      <TableCell className="font-medium text-[rgb(63,159,255)] border-l-4 border-[rgb(63,159,255)]">
                        <div className="font-semibold">{row.criteria || 'Assessment Criterion'}</div>
                        {row.description && <div className="text-sm text-gray-400 mt-1">{row.description}</div>}
                      </TableCell>
                      <TableCell className="text-[rgb(156,77,255)] font-semibold text-center">
                        <div>{row.points || '25 pts'}</div>
                        {row.weight && <div className="text-xs mt-1">{row.weight}</div>}
                      </TableCell>
                      <TableCell className="text-green-300 bg-green-900/10 border-l-2 border-green-500">
                        <div className="font-semibold text-green-400 mb-2">Excellent</div>
                        <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold mb-2 inline-block">
                          {row.excellentRange || '90-100%'}
                        </div>
                        <div className="text-sm">{row.excellent || 'Exceptional performance that exceeds expectations with sophisticated understanding'}</div>
                      </TableCell>
                      <TableCell className="text-blue-300 bg-blue-900/10 border-l-2 border-blue-500">
                        <div className="font-semibold text-blue-400 mb-2">Good</div>
                        <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold mb-2 inline-block">
                          {row.goodRange || '80-89%'}
                        </div>
                        <div className="text-sm">{row.good || 'Strong performance that meets expectations with solid understanding'}</div>
                      </TableCell>
                      <TableCell className="text-yellow-300 bg-yellow-900/10 border-l-2 border-yellow-500">
                        <div className="font-semibold text-yellow-400 mb-2">Satisfactory</div>
                        <div className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold mb-2 inline-block">
                          {row.satisfactoryRange || '70-79%'}
                        </div>
                        <div className="text-sm">{row.satisfactory || 'Adequate performance meeting basic requirements with developing understanding'}</div>
                      </TableCell>
                      <TableCell className="text-red-300 bg-red-900/10 border-l-2 border-red-500">
                        <div className="font-semibold text-red-400 mb-2">Needs Improvement</div>
                        <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold mb-2 inline-block">
                          {row.needsImprovementRange || '0-69%'}
                        </div>
                        <div className="text-sm">{row.needsImprovement || 'Performance below expectations requiring significant improvement and support'}</div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-6 p-4 bg-gradient-to-r from-[rgb(63,159,255)]/10 to-[rgb(156,77,255)]/10 rounded-lg border border-[rgb(63,159,255)]/20">
                <h4 className="text-white font-semibold mb-3">Percentage-Based Scoring Guide</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="text-green-300"><strong>Excellent (90-100%):</strong> Exceeds expectations</div>
                  <div className="text-blue-300"><strong>Good (80-89%):</strong> Meets expectations</div>
                  <div className="text-yellow-300"><strong>Satisfactory (70-79%):</strong> Approaching expectations</div>
                  <div className="text-red-300"><strong>Needs Improvement (0-69%):</strong> Below expectations</div>
                </div>
                <p className="text-gray-400 text-xs mt-3 italic">
                  Total possible points: {rubricData.reduce((sum, item) => sum + parseInt(item.points?.match(/\d+/)?.[0] || '25'), 0)} points
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Button
          onClick={downloadHTML}
          variant="outline"
          className="border-[rgb(255,77,156)] text-[rgb(255,77,156)] hover:bg-[rgb(255,77,156)]/10"
        >
          <Download size={16} className="mr-2" />
          Download Professional HTML
        </Button>
      </div>

      {viewMode === 'list' && (
        <div className="bg-input border border-border rounded-lg p-4 min-h-[200px] max-h-[400px] overflow-y-auto">
          <div 
            className="text-white whitespace-pre-wrap font-sans text-sm"
            dangerouslySetInnerHTML={{ 
              __html: response
                .replace(/##\s+(.*?)(?=\n|$)/g, '<h2 class="text-xl font-bold text-white mt-6 mb-3 border-b-2 border-gradient-to-r from-[rgb(63,159,255)] to-[rgb(156,77,255)] pb-2 bg-gradient-to-r from-[rgb(63,159,255)] to-[rgb(156,77,255)] bg-clip-text text-transparent">$1</h2>')
                .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-[rgb(63,159,255)]">$1</strong>')
                .replace(/\*(.*?)\*/g, '<em class="italic text-gray-300">$1</em>')
                .replace(/(\d+)-(\d+)%/g, '<span class="bg-gradient-to-r from-[rgb(63,159,255)] to-[rgb(156,77,255)] text-white px-2 py-1 rounded text-xs font-bold">$1-$2%</span>')
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
