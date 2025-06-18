
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Upload, Download } from 'lucide-react';
import { saveToHistory } from '@/utils/history';
import { exportResponse } from '@/utils/export';

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setInput(content);
        toast.success('File uploaded successfully!');
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async () => {
    if (!input.trim()) {
      toast.error('Please enter some text or upload a file.');
      return;
    }

    setLoading(true);
    try {
      const result = await onSubmit(input, additionalData);
      setResponse(result);
      toast.success('Response generated successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate response. Please try again.');
    } finally {
      setLoading(false);
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
        <p className="text-gray-400">{description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
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
                className="border-border text-white hover:bg-accent"
              >
                <Upload size={16} className="mr-2" />
                Upload File
              </Button>
              
              <Button 
                onClick={handleSubmit} 
                disabled={loading}
                className="bg-white text-black hover:bg-gray-100"
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

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-white">Response</CardTitle>
            <CardDescription>AI-generated result</CardDescription>
          </CardHeader>
          <CardContent>
            {response ? (
              <div className="space-y-4">
                <div className="bg-input border border-border rounded-lg p-4 min-h-[200px] max-h-[400px] overflow-y-auto">
                  <pre className="text-white whitespace-pre-wrap font-sans text-sm">
                    {response}
                  </pre>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveToHistory}
                    variant="outline"
                    className="border-border text-white hover:bg-accent"
                  >
                    Save to History
                  </Button>
                  <Button
                    onClick={() => exportResponse(response, title, 'pdf')}
                    variant="outline"
                    className="border-border text-white hover:bg-accent"
                  >
                    <Download size={16} className="mr-2" />
                    Export PDF
                  </Button>
                  <Button
                    onClick={() => exportResponse(response, title, 'json')}
                    variant="outline"
                    className="border-border text-white hover:bg-accent"
                  >
                    <Download size={16} className="mr-2" />
                    Export JSON
                  </Button>
                  <Button
                    onClick={() => exportResponse(response, title, 'txt')}
                    variant="outline"
                    className="border-border text-white hover:bg-accent"
                  >
                    <Download size={16} className="mr-2" />
                    Export TXT
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
