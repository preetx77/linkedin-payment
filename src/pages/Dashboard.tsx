import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PostGenerator from '@/components/PostGenerator';
import History from '@/components/History';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookText, BarChart3, History as HistoryIcon, Settings, CreditCard, Mail, User, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { userPlanService } from '@/lib/userPlan';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('generate');
  const { user } = useAuth();
  const [userPlan, setUserPlan] = useState(null);

  // Update plan data whenever user changes or when posts are generated
  useEffect(() => {
    const initializePlan = async () => {
      if (user) {
        // Get fresh plan data
        const planData = userPlanService.getUserPlan(user);
        setUserPlan(planData);
      } else {
        setUserPlan(null);
      }
    };

    initializePlan();

    // Set up an interval to refresh plan data
    const interval = setInterval(initializePlan, 5000);

    return () => clearInterval(interval);
  }, [user]);

  // Calculate usage statistics
  const calculateUsageStats = () => {
    if (!userPlan || !user) return { progress: 0, totalPosts: 0, limit: 0, remaining: 0 };

    const totalPosts = userPlanService.getTotalPostsGenerated(user.id);
    const limit = userPlanService.getPostsLimit(user.id);
    const remaining = userPlanService.getRemainingPosts(user.id);
    const progress = limit === Infinity ? 0 : (totalPosts / limit) * 100;

    return { progress, totalPosts, limit, remaining };
  };

  const { progress, totalPosts, limit, remaining } = calculateUsageStats();
  const daysRemaining = userPlan ? Math.ceil((new Date(userPlan.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;

  // Format dates for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-32">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Create and manage your LinkedIn posts</p>
          </div>
          
          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar */}
            <div className="col-span-12 lg:col-span-3">
              <Card className="glass-card">
                <CardHeader className="pb-3">
                  <CardTitle>Quick Links</CardTitle>
                  <CardDescription>Manage your content</CardDescription>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-1">
                    <button
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeTab === 'generate' 
                          ? 'bg-linkedin text-white' 
                          : 'text-foreground hover:bg-secondary'
                      }`}
                      onClick={() => setActiveTab('generate')}
                    >
                      <BookText size={18} />
                      <span>Create Post</span>
                    </button>
                    <button
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeTab === 'analytics' 
                          ? 'bg-linkedin text-white' 
                          : 'text-foreground hover:bg-secondary'
                      }`}
                      onClick={() => setActiveTab('analytics')}
                    >
                      <BarChart3 size={18} />
                      <span>Analytics</span>
                    </button>
                    <button
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeTab === 'history' 
                          ? 'bg-linkedin text-white' 
                          : 'text-foreground hover:bg-secondary'
                      }`}
                      onClick={() => setActiveTab('history')}
                    >
                      <HistoryIcon size={18} />
                      <span>History</span>
                    </button>
                    <button
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeTab === 'settings' 
                          ? 'bg-linkedin text-white' 
                          : 'text-foreground hover:bg-secondary'
                      }`}
                      onClick={() => setActiveTab('settings')}
                    >
                      <Settings size={18} />
                      <span>Settings</span>
                    </button>
                  </nav>
                </CardContent>
              </Card>
              
              <Card className="glass-card mt-6">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Usage</CardTitle>
                      <CardDescription>Your current plan</CardDescription>
                    </div>
                    {userPlan && (
                      <Badge variant="outline" className="font-medium">
                        {userPlan.name.charAt(0).toUpperCase() + userPlan.name.slice(1)} Plan
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {userPlan ? (
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Posts Generated</span>
                          <span className="font-medium">
                            {totalPosts}
                            {limit !== Infinity ? ` / ${limit}` : ''}
                          </span>
                        </div>
                        <Progress 
                          value={progress} 
                          className="h-2" 
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                          <span>
                            {limit === Infinity 
                              ? 'Unlimited posts available' 
                              : `${remaining} posts remaining`}
                          </span>
                          <span>Resets in {Math.max(0, daysRemaining)} days</span>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h4 className="text-sm font-medium mb-2">Current Billing Cycle</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Start: {formatDate(userPlan.startDate)}</p>
                          <p>End: {formatDate(userPlan.endDate)}</p>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <div className="flex items-center justify-between">
                          {remaining <= 0 ? (
                            <div className="text-sm">
                              <p className="font-medium text-yellow-500">Limit Reached!</p>
                              <p className="text-muted-foreground">Upgrade to continue generating posts</p>
                            </div>
                          ) : (
                            <div className="text-sm">
                              <p className="font-medium">Need more posts?</p>
                              <p className="text-muted-foreground">Upgrade your plan</p>
                            </div>
                          )}
                          <Link to="/pricing">
                            <Button variant="outline" size="sm" className="text-xs">
                              View Plans
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      Sign in to view your usage
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="col-span-12 lg:col-span-9">
              <Tabs defaultValue="generate" value={activeTab} onValueChange={setActiveTab}>
                <TabsContent value="generate" className="mt-0">
                  <PostGenerator />
                </TabsContent>
                
                <TabsContent value="analytics" className="mt-0">
                  <Card className="glass-card">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Analytics</CardTitle>
                          <CardDescription>
                            Track the performance of your LinkedIn posts
                          </CardDescription>
                        </div>
                        <span className="bg-yellow-500 text-white text-sm px-2 py-1 rounded">
                          Coming Soon
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-gray-500">
                          <BarChart3 className="w-5 h-5" />
                          <p>Advanced analytics and insights coming soon!</p>
                        </div>
                        <p className="text-sm">
                          Features coming in the next update:
                        </p>
                        <ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
                          <li>Post engagement metrics (views, likes, comments)</li>
                          <li>Audience demographics and insights</li>
                          <li>Best performing content analysis</li>
                          <li>Posting time optimization</li>
                          <li>Performance trends and reports</li>
                          <li>Export analytics data</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="history" className="mt-0">
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>Post History</CardTitle>
                      <CardDescription>
                        View and manage your previously generated posts
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <History />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="settings" className="mt-0">
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                      <CardDescription>
                        Manage your account details and subscription
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Account Details Section */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Account Details
                          </h3>
                          <div className="grid gap-4">
                            <div>
                              <label className="text-sm font-medium mb-1.5 block text-muted-foreground">Full Name</label>
                              <Input
                                value={user?.user_metadata?.full_name || 'Your Name'}
                                disabled
                                className="bg-muted"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-1.5 block text-muted-foreground">Email Address</label>
                              <Input
                                value={user?.email || 'your.email@example.com'}
                                disabled
                                className="bg-muted"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Current Plan Section */}
                        <div className="space-y-4 pt-4 border-t">
                          <h3 className="text-lg font-medium flex items-center gap-2">
                            <CreditCard className="w-5 h-5" />
                            Current Plan
                          </h3>
                          {userPlan && (
                            <div className="bg-muted p-4 rounded-lg">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <h4 className="font-medium">
                                    {userPlan.name === 'free' ? 'Free Plan' : 
                                     userPlan.name === 'basic' ? 'Basic Plan' : 
                                     userPlan.name === 'pro' ? 'Pro Plan' : 
                                     'Enterprise Plan'}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {userPlan.name === 'enterprise' ? 'Unlimited posts per month' : 
                                     `${userPlan.postsLimit} posts per month`}
                                  </p>
                                </div>
                                <Badge variant="secondary">Current Plan</Badge>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Shield className="w-4 h-4 mr-2" />
                                  Next billing date: {formatDate(userPlan.endDate)}
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground mt-2">
                                  <BookText className="w-4 h-4 mr-2" />
                                  Posts remaining: {Math.max(0, userPlan.postsLimit - userPlan.postsGenerated)}
                                </div>
                                {userPlan.name !== 'enterprise' && (
                                  <Link to="/pricing" className="block w-full mt-4">
                                    <Button variant="outline" className="w-full">
                                      Upgrade Plan
                                    </Button>
                                  </Link>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Available Plans Section */}
                        <div className="space-y-4 pt-4 border-t">
                          <h3 className="text-lg font-medium">Available Plans</h3>
                          <div className="grid gap-4">
                            {userPlan?.name === 'free' && (
                              <div className="border rounded-lg p-4">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <h4 className="font-medium">Pro Plan</h4>
                                    <p className="text-sm text-muted-foreground">Unlimited posts per month</p>
                                  </div>
                                  <p className="font-medium">$12/mo</p>
                                </div>
                                <Link to="/pricing">
                                  <Button variant="outline" className="w-full">
                                    Upgrade to Pro
                                  </Button>
                                </Link>
                              </div>
                            )}

                            {userPlan?.name !== 'enterprise' && (
                              <div className="border rounded-lg p-4">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <h4 className="font-medium">Enterprise Plan</h4>
                                    <p className="text-sm text-muted-foreground">Unlimited posts + Custom features</p>
                                  </div>
                                  <p className="font-medium">Custom</p>
                                </div>
                                <Button variant="outline" className="w-full" disabled>
                                  Contact Sales
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Email Preferences */}
                        <div className="space-y-4 pt-4 border-t">
                          <h3 className="text-lg font-medium flex items-center gap-2">
                            <Mail className="w-5 h-5" />
                            Email Preferences
                          </h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Marketing Emails</p>
                                <p className="text-sm text-muted-foreground">Receive updates about new features</p>
                              </div>
                              <div className="h-6 w-11 bg-muted rounded-full relative cursor-not-allowed">
                                <div className="h-5 w-5 rounded-full bg-background absolute top-0.5 right-0.5"></div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Usage Reports</p>
                                <p className="text-sm text-muted-foreground">Monthly summary of your post generation</p>
                              </div>
                              <div className="h-6 w-11 bg-muted rounded-full relative cursor-not-allowed">
                                <div className="h-5 w-5 rounded-full bg-background absolute top-0.5 right-0.5"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
