
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getHistory } from '@/utils/history';
import { User, Calendar, Activity, BarChart3 } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const history = getHistory();

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
              <AvatarFallback className="bg-white text-black text-2xl">
                {user?.displayName?.[0] || user?.email?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-white">{user?.displayName || 'User'}</CardTitle>
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
                Joined {user?.metadata.creationTime ? 
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
              <div className="text-center p-4 bg-input rounded-lg">
                <div className="text-2xl font-bold text-white mb-2">
                  {stats.totalGenerations}
                </div>
                <div className="text-sm text-gray-400">Total Generations</div>
              </div>
              <div className="text-center p-4 bg-input rounded-lg">
                <div className="text-2xl font-bold text-white mb-2">
                  {stats.featuresUsed}
                </div>
                <div className="text-sm text-gray-400">Features Used</div>
              </div>
              <div className="text-center p-4 bg-input rounded-lg">
                <div className="text-sm font-medium text-white mb-2">Most Used</div>
                <Badge variant="outline" className="border-border text-white text-xs">
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
                        <Badge variant="outline" className="border-border text-white">
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
    </div>
  );
};

export default Profile;
