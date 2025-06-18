
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { usageService } from '@/services/usage';
import { Calendar, Clock, TrendingUp, User, CreditCard, Shield } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const usageData = usageService.getUsageData();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="border-l-4 border-white pl-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user?.displayName || 'Demo Teacher'}!
        </h1>
        <p className="text-gray-400">
          Ready to automate your teaching tasks with AI-powered tools
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Information */}
        <div className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Account Type</span>
                  <span className="text-green-400 font-medium">Premium</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Account ID</span>
                  <span className="text-white font-mono">{user?.uid?.substring(0, 8) || 'demo-usr'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Member Since</span>
                  <span className="text-white">January 2024</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Subscription</span>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-green-400">Active</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Usage Limits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Monthly API Calls</span>
                  <span className="text-white">{usageData.thisMonthCalls} / 1000</span>
                </div>
                <Progress value={(usageData.thisMonthCalls / 1000) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Daily Calls</span>
                  <span className="text-white">{usageData.todayCalls} / 50</span>
                </div>
                <Progress value={(usageData.todayCalls / 50) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Analytics */}
        <div className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                API Usage Analytics
              </CardTitle>
              <CardDescription>Your AI tool usage over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={usageData.dailyUsage}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#666" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis stroke="#666" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#000', 
                        border: '1px solid #333',
                        color: '#fff'
                      }}
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="calls" 
                      stroke="#fff" 
                      strokeWidth={2}
                      dot={{ fill: '#fff', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <Calendar className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">{usageData.todayCalls}</div>
                <div className="text-sm text-gray-400">Today</div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <Clock className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">{usageData.thisWeekCalls}</div>
                <div className="text-sm text-gray-400">This Week</div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">{usageData.totalCalls}</div>
                <div className="text-sm text-gray-400">Total</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
