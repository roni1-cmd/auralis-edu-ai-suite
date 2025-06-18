
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getHistory, deleteHistoryItem, clearHistory, HistoryItem } from '@/utils/history';
import { exportResponse } from '@/utils/export';
import { Search, Trash2, Download, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const History = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFeature, setFilterFeature] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const historyData = getHistory();
    setHistory(historyData);
  };

  const handleDelete = (id: string) => {
    deleteHistoryItem(id);
    loadHistory();
    toast.success('Item deleted from history');
  };

  const handleClearAll = () => {
    clearHistory();
    loadHistory();
    toast.success('History cleared');
  };

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.feature.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFeature = !filterFeature || item.feature === filterFeature;
    return matchesSearch && matchesFeature;
  });

  const features = Array.from(new Set(history.map(item => item.feature)));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">History</h1>
          <p className="text-gray-400">View and manage your AI-generated content</p>
        </div>
        <Button 
          onClick={handleClearAll}
          variant="destructive"
          disabled={history.length === 0}
        >
          Clear All History
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search history..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-input border-border text-white"
          />
        </div>
        <select
          value={filterFeature}
          onChange={(e) => setFilterFeature(e.target.value)}
          className="px-3 py-2 bg-input border border-border rounded-md text-white"
        >
          <option value="">All Features</option>
          {features.map(feature => (
            <option key={feature} value={feature}>{feature}</option>
          ))}
        </select>
      </div>

      {filteredHistory.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="py-12 text-center">
            <p className="text-gray-400 text-lg">
              {history.length === 0 ? 'No history items found' : 'No items match your search'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredHistory.map((item) => (
            <Card key={item.id} className="bg-card border-border">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Badge variant="outline" className="border-border text-white">
                        {item.feature}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <Calendar size={14} />
                      {item.timestamp.toLocaleString()}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => exportResponse(item.content, item.feature, 'pdf')}
                      className="border-border text-white hover:bg-accent"
                    >
                      <Download size={14} className="mr-1" />
                      PDF
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(item.id)}
                      className="border-border text-red-400 hover:bg-red-600 hover:text-white"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-300 mb-1">Input:</h4>
                  <p className="text-sm text-gray-400">{item.input}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-1">Response:</h4>
                  <div className="bg-input border border-border rounded-lg p-3 max-h-40 overflow-y-auto">
                    <pre className="text-white text-sm whitespace-pre-wrap font-sans">
                      {item.content.length > 500 
                        ? item.content.substring(0, 500) + '...' 
                        : item.content}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
