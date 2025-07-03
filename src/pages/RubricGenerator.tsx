
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Loader2, Upload } from 'lucide-react';
import { fireworksService } from '@/services/fireworks';
import { RubricDisplay } from '@/components/RubricDisplay';
import mammoth from 'mammoth';

const RubricGenerator = () => {
  const [assignment, setAssignment] = useState('');
  const [criteria, setCriteria] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        // Handle DOCX files with mammoth
        if (file.name.toLowerCase().endsWith('.docx')) {
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          if (result.value && result.value.trim().length > 0) {
            resolve(result.value.trim());
            return;
          }
        }

        // Handle other files with FileReader
        const reader = new FileReader();
        
        reader.onload = (e) => {
          const content = e.target?.result as string;
          
          // If it's a text file, return as is
          if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
            resolve(content);
            return;
          }
          
          // For other file types, try to extract readable text
          try {
            // Remove binary data and control characters
            const cleanText = content
              .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '') // Remove control characters
              .replace(/PK[\s\S]*?xml/g, '') // Remove zip/docx metadata
              .replace(/\�/g, '') // Remove replacement characters
              .replace(/[^\x20-\x7E\s\u00A0-\uFFFF]/g, '') // Keep printable characters and Unicode
              .replace(/\s+/g, ' ') // Normalize whitespace
              .trim();
            
            if (cleanText.length < 10) {
              reject(new Error('Unable to extract readable text from this file. Please try a .txt or .docx file.'));
            } else {
              resolve(cleanText);
            }
          } catch (error) {
            reject(new Error('Error processing file. Please try a .txt or .docx file instead.'));
          }
        };
        
        reader.onerror = () => {
          reject(new Error('Error reading file'));
        };
        
        reader.readAsText(file, 'UTF-8');
      } catch (error) {
        console.error('File processing error:', error);
        reject(new Error('Failed to process file. Please try a .txt or .docx file.'));
      }
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const content = await extractTextFromFile(file);
        setAssignment(content);
        toast.success('File uploaded and processed successfully!');
      } catch (error) {
        console.error('File upload error:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to process file');
      }
    }
  };

  const handleSubmit = async () => {
    if (!assignment.trim()) {
      toast.error('Please describe the assignment.');
      return;
    }

    setLoading(true);
    setProgress(0);
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const result = await fireworksService.generateRubric(assignment, criteria);
      setResponse(result);
      setProgress(100);
      toast.success('Rubric generated successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate rubric. Please try again.');
    } finally {
      clearInterval(progressInterval);
      setLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Rubric Generator</h1>
        <p className="text-gray-400">Create detailed, professional rubrics for assignments and assessments with table formatting options</p>
      </div>

      {loading && (
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white">Generating rubric...</span>
                <span className="text-gray-400">{progress}%</span>
              </div>
              <Progress 
                value={progress} 
                className="h-2 bg-gray-800"
                style={{
                  background: 'linear-gradient(to right, rgb(63, 159, 255), rgb(156, 77, 255))'
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border border-[rgb(63,159,255)]/20">
          <CardHeader>
            <CardTitle className="text-white">Assignment Details</CardTitle>
            <CardDescription>Describe your assignment and grading criteria</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="criteria" className="text-white">Assessment Criteria</Label>
              <Textarea
                id="criteria"
                placeholder="Specify key criteria and skills to be assessed..."
                value={criteria}
                onChange={(e) => setCriteria(e.target.value)}
                className="bg-input border-border text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="assignment" className="text-white">Assignment Description</Label>
              <Textarea
                id="assignment"
                placeholder="Describe the assignment or project that needs a rubric..."
                value={assignment}
                onChange={(e) => setAssignment(e.target.value)}
                className="bg-input border-border text-white min-h-[200px]"
              />
            </div>

            <div className="flex gap-2">
              <Input
                type="file"
                accept=".txt,.doc,.docx,.pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('file-upload')?.click()}
                className="border-[rgb(156,77,255)] text-[rgb(156,77,255)] hover:bg-[rgb(156,77,255)]/10"
              >
                <Upload size={16} className="mr-2" />
                Upload File
              </Button>
              
              <Button 
                onClick={handleSubmit} 
                disabled={loading}
                className="bg-gradient-to-r from-[rgb(63,159,255)] to-[rgb(156,77,255)] text-white hover:opacity-90 flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Rubric...
                  </>
                ) : (
                  'Generate Rubric'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border border-[rgb(156,77,255)]/20">
          <CardHeader>
            <CardTitle className="text-white">Generated Rubric</CardTitle>
            <CardDescription>Professional rubric with multiple viewing options</CardDescription>
          </CardHeader>
          <CardContent>
            {response ? (
              <RubricDisplay response={response} />
            ) : (
              <div className="text-gray-400 text-center py-12">
                Generated rubric will appear here with table and list view options
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RubricGenerator;
