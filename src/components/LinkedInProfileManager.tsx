
import { useState, useEffect } from 'react';
import { LinkedInProfile, LinkedInService } from '@/utils/LinkedInService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, RefreshCw, PlusCircle, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ProfileList = ({ profiles, onRefresh, isFetching }: { 
  profiles: LinkedInProfile[], 
  onRefresh: () => void,
  isFetching: boolean
}) => {
  if (profiles.length === 0) {
    return (
      <div className="border border-dashed rounded-lg p-6 text-center">
        <p className="text-muted-foreground text-sm">
          {isFetching ? 'Loading profiles...' : 'No reference profiles added yet'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {profiles.map((profile) => (
        <Card key={profile.id} className="bg-card/50">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base font-medium">
              {profile.username}
            </CardTitle>
            <CardDescription className="text-xs truncate">
              {profile.profile_url}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 pb-2">
            <div className="text-xs text-muted-foreground">
              <p>Posts analyzed: {profile.posts_count}</p>
              <p>Last scraped: {new Date(profile.last_scraped).toLocaleDateString()}</p>
            </div>
          </CardContent>
          <CardFooter className="p-2 flex justify-end">
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive">
              <Trash2 className="h-3 w-3 mr-1" />
              Remove
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

const LinkedInProfileManager = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [profileUrl, setProfileUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [profiles, setProfiles] = useState<LinkedInProfile[]>([]);

  useEffect(() => {
    if (user) {
      fetchProfiles();
    }
  }, [user]);

  const fetchProfiles = async () => {
    setIsFetching(true);
    try {
      const profilesData = await LinkedInService.getProfiles();
      setProfiles(profilesData);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch LinkedIn profiles',
        variant: 'destructive',
      });
    } finally {
      setIsFetching(false);
    }
  };

  const handleAddProfile = async () => {
    if (!profileUrl) {
      toast({
        title: 'Input required',
        description: 'Please enter a LinkedIn profile URL',
        variant: 'destructive',
      });
      return;
    }
    
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to add LinkedIn profiles',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await LinkedInService.scrapeProfile(profileUrl);
      
      if (result.success && result.profile) {
        toast({
          title: 'Profile added',
          description: `Successfully added LinkedIn profile: ${result.profile.username}`,
        });
        setProfileUrl('');
        fetchProfiles();
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to add LinkedIn profile',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error adding profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to add LinkedIn profile',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">
          Add LinkedIn Profile
        </label>
        <div className="flex gap-2">
          <Input
            placeholder="https://www.linkedin.com/in/username"
            value={profileUrl}
            onChange={(e) => setProfileUrl(e.target.value)}
            className="flex-1"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && profileUrl) {
                e.preventDefault();
                handleAddProfile();
              }
            }}
          />
          <Button 
            onClick={handleAddProfile} 
            disabled={isLoading || !profileUrl}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Adding...</span>
              </>
            ) : (
              <>
                <PlusCircle className="h-4 w-4" />
                <span>Add</span>
              </>
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Enter the full URL of a LinkedIn profile to analyze their posting style
        </p>
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium">Reference LinkedIn Profiles</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchProfiles}
            disabled={isFetching}
            className="h-8 px-2 text-xs"
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        <ProfileList 
          profiles={profiles} 
          onRefresh={fetchProfiles}
          isFetching={isFetching}
        />
      </div>
    </div>
  );
};

export default LinkedInProfileManager;
