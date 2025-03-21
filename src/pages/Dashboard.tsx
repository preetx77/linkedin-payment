
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PostGenerator from '@/components/PostGenerator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookText, BarChart3, History, Settings } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('generate');
  
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
                      <History size={18} />
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
                  <CardTitle>Usage</CardTitle>
                  <CardDescription>Your current plan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Posts Generated</span>
                        <span className="font-medium">12 / 50</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2.5">
                        <div className="bg-linkedin h-2.5 rounded-full" style={{ width: '24%' }}></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Resets in 23 days
                      </p>
                    </div>
                    
                    <div className="pt-2">
                      <h4 className="font-medium mb-1">Pro Plan</h4>
                      <p className="text-sm text-muted-foreground">
                        Current billing cycle: May 1 - May 31
                      </p>
                    </div>
                  </div>
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
                      <CardTitle>Analytics</CardTitle>
                      <CardDescription>
                        Track the performance of your LinkedIn posts
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-center h-64 border border-dashed rounded-lg">
                        <p className="text-muted-foreground">
                          Analytics will be available after you publish posts
                        </p>
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
                    <CardContent>
                      <div className="flex items-center justify-center h-64 border border-dashed rounded-lg">
                        <p className="text-muted-foreground">
                          You haven't generated any posts yet
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="settings" className="mt-0">
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>Settings</CardTitle>
                      <CardDescription>
                        Manage your account and preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-4">Account Settings</h3>
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-2">Name</label>
                                <input 
                                  type="text" 
                                  className="w-full border border-border rounded-lg p-2"
                                  defaultValue="John Doe"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-2">Email</label>
                                <input 
                                  type="email" 
                                  className="w-full border border-border rounded-lg p-2"
                                  defaultValue="john@example.com"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border-t border-border pt-6">
                          <h3 className="text-lg font-medium mb-4">Preferences</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">Email Notifications</h4>
                                <p className="text-sm text-muted-foreground">
                                  Receive updates about your account
                                </p>
                              </div>
                              <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-linkedin">
                                <span className="inline-block h-5 w-5 rounded-full bg-background transition-transform data-[state=checked]:translate-x-5" style={{ transform: 'translateX(20px)' }}></span>
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
