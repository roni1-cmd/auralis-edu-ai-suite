
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getHistory, deleteHistoryItem, HistoryItem } from '@/utils/history';
import { User, Calendar, Activity, BarChart3, Edit2, Trash2, Save } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const Profile = () => {
  const { user } = useAuth();
  const history = getHistory();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const stats = {
    totalGenerations: history.length,
    featuresUsed: new Set(history.map(item => item.feature)).size,
    lastActivity: history.length > 0 ? history[0].timestamp : null,
    favoriteFeature: history.length > 0 
      ? history.reduce((acc, item) => {
          acc[item.feature] = (acc[item.feature] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      : {}
  };

  const mostUsedFeature = Object.entries(stats.favoriteFeature).length > 0
    ? Object.entries(stats.favoriteFeature).sort(([,a], [,b]) => b - a)[0][0]
    : 'None';

  const handleRename = (item: HistoryItem) => {
    setEditingId(item.id);
    setEditingTitle(item.feature);
  };

  const saveRename = (id: string) => {
    // Update the history item with new title
    const updatedHistory = history.map(item => 
      item.id === id ? { ...item, feature: editingTitle } : item
    );
    localStorage.setItem('auralis_history', JSON.stringify(updatedHistory));
    setEditingId(null);
    setEditingTitle('');
    toast.success('Response renamed successfully!');
  };

  const handleDelete = (id: string) => {
    deleteHistoryItem(id);
    toast.success('Response deleted successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
        <p className="text-gray-400">Your account information and usage statistics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-card border-border lg:col-span-1">
          <CardHeader className="text-center">
            <Avatar className="h-20 w-20 mx-auto mb-4">
              <AvatarImage src={user?.photoURL || undefined} />
              <AvatarFallback className="bg-gradient-to-br from-[rgb(63,159,255)] to-[rgb(156,77,255)] text-white text-2xl">
                {user?.displayName?.[0] || user?.email?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-white">{user?.displayName || user?.email || 'User'}</CardTitle>
            <CardDescription>{user?.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <User size={16} className="text-gray-400" />
              <span className="text-sm text-gray-300">Google Account</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-400" />
              <span className="text-sm text-gray-300">
                Joined {user?.metadata?.creationTime ? 
                  new Date(user.metadata.creationTime).toLocaleDateString() : 
                  'Recently'
                }
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-gray-400" />
              <span className="text-sm text-gray-300">
                Last active {stats.lastActivity ? 
                  stats.lastActivity.toLocaleDateString() : 
                  'Never'
                }
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 size={20} />
              Usage Statistics
            </CardTitle>
            <CardDescription>Your activity on Auralis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-input rounded-lg border border-[rgb(63,159,255)]/20">
                <div className="text-2xl font-bold text-white mb-2">
                  {stats.totalGenerations}
                </div>
                <div className="text-sm text-gray-400">Total Generations</div>
              </div>
              <div className="text-center p-4 bg-input rounded-lg border border-[rgb(156,77,255)]/20">
                <div className="text-2xl font-bold text-white mb-2">
                  {stats.featuresUsed}
                </div>
                <div className="text-sm text-gray-400">Features Used</div>
              </div>
              <div className="text-center p-4 bg-input rounded-lg border border-[rgb(255,77,156)]/20">
                <div className="text-sm font-medium text-white mb-2">Most Used</div>
                <Badge variant="outline" className="border-[rgb(63,159,255)] text-[rgb(63,159,255)] text-xs">
                  {mostUsedFeature}
                </Badge>
              </div>
            </div>

            {Object.entries(stats.favoriteFeature).length > 0 && (
              <div className="mt-6">
                <h4 className="text-white font-medium mb-3">Feature Usage</h4>
                <div className="space-y-2">
                  {Object.entries(stats.favoriteFeature)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 5)
                    .map(([feature, count]) => (
                      <div key={feature} className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">{feature}</span>
                        <Badge variant="outline" className="border-[rgb(156,77,255)] text-[rgb(156,77,255)]">
                          {count}
                        </Badge>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Stored AI Responses */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-white">Stored AI Responses</CardTitle>
          <CardDescription>Manage your saved AI responses</CardDescription>
        </CardHeader>
        <CardContent>
          {history.length > 0 ? (
            <div className="space-y-4">
              {history.slice(0, 10).map((item) => (
                <div key={item.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    {editingId === item.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          className="bg-input border-border text-white"
                        />
                        <Button
                          onClick={() => saveRename(item.id)}
                          size="sm"
                          className="bg-[rgb(63,159,255)] hover:bg-[rgb(63,159,255)]/80"
                        >
                          <Save size={14} />
                        </Button>
                        <Button
                          onClick={() => setEditingId(null)}
                          variant="outline"
                          size="sm"
                          className="border-border text-white"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-white font-medium">{item.feature}</h3>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleRename(item)}
                            variant="outline"
                            size="sm"
                            className="border-border text-white hover:bg-accent"
                          >
                            <Edit2 size={14} />
                          </Button>
                          <Button
                            onClick={() => handleDelete(item.id)}
                            variant="outline"
                            size="sm"
                            className="border-red-500 text-red-500 hover:bg-red-500/10"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{item.input}</p>
                  <p className="text-gray-500 text-xs">
                    {item.timestamp.toLocaleDateString()} at {item.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              No stored responses yet. Start using AI features to see them here!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
