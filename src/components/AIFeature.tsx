import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Loader2, Upload, Download, Save } from 'lucide-react';
import { saveToHistory } from '@/utils/history';
import { exportResponse } from '@/utils/export';
import { usageService } from '@/services/usage';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/services/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface AIFeatureProps {
  title: string;
  description: string;
  onSubmit: (input: string, additionalData?: Record<string, string>) => Promise<string>;
  additionalFields?: Array<{
    key: string;
    label: string;
    type: 'text' | 'textarea';
    placeholder: string;
  }>;
  placeholder?: string;
}

export const AIFeature: React.FC<AIFeatureProps> = ({
  title,
  description,
  onSubmit,
  additionalFields = [],
  placeholder = "Enter your text here..."
}) => {
  const [input, setInput] = useState('');
  const [additionalData, setAdditionalData] = useState<Record<string, string>>({});
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { user } = useAuth();

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target?.result as string;
        
        // If it's a text file, return as is
        if (file.type === 'text/plain') {
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
            .replace(/[^\x20-\x7E\s]/g, '') // Keep only printable ASCII and whitespace
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();
          
          if (cleanText.length < 10) {
            reject(new Error('Unable to extract readable text from this file. Please try a .txt file or copy-paste your content.'));
          } else {
            resolve(cleanText);
          }
        } catch (error) {
          reject(new Error('Error processing file. Please try a .txt file instead.'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };
      
      reader.readAsText(file);
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const content = await extractTextFromFile(file);
        setInput(content);
        toast.success('File uploaded and processed successfully!');
      } catch (error) {
        console.error('File upload error:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to process file');
      }
    }
  };

  const formatAIResponse = (text: string): string => {
    return text
      .replace(/##\s+(.*?)\n/g, '<h2 class="text-xl font-bold text-white mt-6 mb-3 border-b border-gray-600 pb-2">$1</h2>') // ## headings
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-blue-300">$1</strong>') // Bold text
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-300">$1</em>') // Italic text
      .replace(/\n\n/g, '</p><p class="mb-4">') // Paragraphs
      .replace(/\n/g, '<br>') // Line breaks
      .replace(/^(.*)$/, '<p class="mb-4">$1</p>'); // Wrap in paragraph
  };

  const handleSubmit = async () => {
    if (!input.trim()) {
      toast.error('Please enter some text or upload a file.');
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
      const result = await onSubmit(input, additionalData);
      const formattedResponse = formatAIResponse(result);
      setResponse(formattedResponse);
      setProgress(100);
      usageService.incrementUsage();
      toast.success('Response generated successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate response. Please try again.');
    } finally {
      clearInterval(progressInterval);
      setLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const handleSaveToHistory = () => {
    if (response) {
      saveToHistory({
        content: response,
        timestamp: new Date(),
        feature: title,
        input: input.substring(0, 100) + (input.length > 100 ? '...' : '')
      });
      toast.success('Saved to history!');
    }
  };

  const handleSaveToFirestore = async () => {
    if (!user || !response) {
      toast.error('Please sign in to save responses to your account.');
      return;
    }

    try {
      await addDoc(collection(db, 'ai_responses'), {
        userId: user.uid,
        feature: title,
        input: input.substring(0, 100) + (input.length > 100 ? '...' : ''),
        response: response,
        timestamp: new Date(),
        userEmail: user.email,
        userName: user.displayName
      });
      toast.success('Response saved to your account!');
    } catch (error) {
      console.error('Error saving to Firestore:', error);
      toast.error('Failed to save to your account. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
        <p className="text-gray-400">{description}</p>
      </div>

      {loading && (
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white">Generating response...</span>
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
            <CardTitle className="text-white">Input</CardTitle>
            <CardDescription>Enter your content or upload a file</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {additionalFields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={field.key} className="text-white">{field.label}</Label>
                {field.type === 'textarea' ? (
                  <Textarea
                    id={field.key}
                    placeholder={field.placeholder}
                    value={additionalData[field.key] || ''}
                    onChange={(e) => setAdditionalData(prev => ({
                      ...prev,
                      [field.key]: e.target.value
                    }))}
                    className="bg-input border-border text-white"
                  />
                ) : (
                  <Input
                    id={field.key}
                    placeholder={field.placeholder}
                    value={additionalData[field.key] || ''}
                    onChange={(e) => setAdditionalData(prev => ({
                      ...prev,
                      [field.key]: e.target.value
                    }))}
                    className="bg-input border-border text-white"
                  />
                )}
              </div>
            ))}
            
            <div className="space-y-2">
              <Label htmlFor="content" className="text-white">Content</Label>
              <Textarea
                id="content"
                placeholder={placeholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
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
                className="bg-gradient-to-r from-[rgb(63,159,255)] to-[rgb(156,77,255)] text-white hover:opacity-90"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Generate'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border border-[rgb(156,77,255)]/20">
          <CardHeader>
            <CardTitle className="text-white">Response</CardTitle>
            <CardDescription>AI-generated result</CardDescription>
          </CardHeader>
          <CardContent>
            {response ? (
              <div className="space-y-4">
                <div className="bg-input border border-border rounded-lg p-4 min-h-[200px] max-h-[400px] overflow-y-auto">
                  <div 
                    className="text-white whitespace-pre-wrap font-sans text-sm"
                    dangerouslySetInnerHTML={{ __html: response }}
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    onClick={handleSaveToHistory}
                    variant="outline"
                    className="border-[rgb(63,159,255)] text-[rgb(63,159,255)] hover:bg-[rgb(63,159,255)]/10"
                  >
                    Save to History
                  </Button>
                  <Button
                    onClick={handleSaveToFirestore}
                    variant="outline"
                    className="border-[rgb(255,77,156)] text-[rgb(255,77,156)] hover:bg-[rgb(255,77,156)]/10"
                  >
                    <Save size={16} className="mr-2" />
                    Save to Account
                  </Button>
                  <Button
                    onClick={() => exportResponse(response.replace(/<[^>]*>/g, ''), title, 'pdf')}
                    variant="outline"
                    className="border-border text-white hover:bg-accent"
                  >
                    <Download size={16} className="mr-2" />
                    Export PDF
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-center py-12">
                Generated content will appear here
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
