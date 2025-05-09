import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { usePlatformConnections } from '@/hooks/use-platform-connections';

export default function YouTubeEarningsCalculator() {
  const { toast } = useToast();
  const { data: platformConnections, isLoading } = usePlatformConnections();
  
  const [youtubeStats, setYoutubeStats] = useState<{
    subscribers: number;
    averageViews: number;
    cpm: number;
    totalVideos: number;
    watchHours: number;
  } | null>(null);
  
  const [customStats, setCustomStats] = useState({
    subscribers: 5000,
    averageViews: 1000,
    cpm: 4,
    totalVideos: 40,
    watchHours: 4000,
    videosPerMonth: 4
  });
  
  const [earnings, setEarnings] = useState({
    monthly: 0,
    yearly: 0,
    potential: 0
  });

  useEffect(() => {
    if (platformConnections) {
      const youtubeConnection = platformConnections.find(
        (connection) => connection.platform === 'youtube'
      );
      
      if (youtubeConnection?.stats) {
        const stats = youtubeConnection.stats as {
          subscribers: number;
          averageViews: number;
          cpm: number;
          totalVideos: number;
          watchHours: number;
        };
        
        setYoutubeStats(stats);
        // Initialize custom stats from YouTube stats
        setCustomStats({
          ...customStats,
          subscribers: stats.subscribers || customStats.subscribers,
          averageViews: stats.averageViews || customStats.averageViews,
          cpm: stats.cpm || customStats.cpm,
          totalVideos: stats.totalVideos || customStats.totalVideos,
          watchHours: stats.watchHours || customStats.watchHours
        });
      }
    }
  }, [platformConnections]);

  useEffect(() => {
    calculateEarnings();
  }, [customStats]);

  const calculateEarnings = () => {
    // Monthly earnings calculation: (averageViews × videosPerMonth × CPM) ÷ 1000
    const monthly = (customStats.averageViews * customStats.videosPerMonth * customStats.cpm) / 1000;
    
    // Yearly earnings based on monthly
    const yearly = monthly * 12;
    
    // Potential earnings with 20% growth in views and 10% increase in CPM
    const potentialViews = customStats.averageViews * 1.2;
    const potentialCPM = customStats.cpm * 1.1;
    const potential = (potentialViews * customStats.videosPerMonth * potentialCPM) / 1000 * 12;
    
    setEarnings({
      monthly: parseFloat(monthly.toFixed(2)),
      yearly: parseFloat(yearly.toFixed(2)),
      potential: parseFloat(potential.toFixed(2))
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomStats({
      ...customStats,
      [name]: parseFloat(value) || 0
    });
  };

  const handleSliderChange = (name: string, value: number[]) => {
    setCustomStats({
      ...customStats,
      [name]: value[0]
    });
  };

  const resetToChannelStats = () => {
    if (youtubeStats) {
      setCustomStats({
        ...customStats,
        subscribers: youtubeStats.subscribers,
        averageViews: youtubeStats.averageViews,
        cpm: youtubeStats.cpm,
        totalVideos: youtubeStats.totalVideos,
        watchHours: youtubeStats.watchHours
      });
      
      toast({
        title: "Stats Reset",
        description: "Calculator has been reset to your YouTube channel stats.",
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="animate-pulse bg-gray-200 h-6 w-3/4 rounded"></CardTitle>
          <CardDescription className="animate-pulse bg-gray-200 h-4 w-1/2 rounded mt-2"></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="animate-pulse bg-gray-200 h-4 w-1/4 rounded"></div>
                <div className="animate-pulse bg-gray-200 h-10 w-full rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>YouTube Earnings Calculator</CardTitle>
        <CardDescription>
          Estimate your potential earnings based on your YouTube channel metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="subscribers">Subscribers</Label>
              <span className="text-sm text-muted-foreground">{customStats.subscribers.toLocaleString()}</span>
            </div>
            <div className="pt-2">
              <Slider
                id="subscribers"
                min={100}
                max={100000}
                step={100}
                value={[customStats.subscribers]}
                onValueChange={(value) => handleSliderChange('subscribers', value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="averageViews">Average Views per Video</Label>
              <span className="text-sm text-muted-foreground">{customStats.averageViews.toLocaleString()}</span>
            </div>
            <div className="pt-2">
              <Slider
                id="averageViews"
                min={100}
                max={50000}
                step={100}
                value={[customStats.averageViews]}
                onValueChange={(value) => handleSliderChange('averageViews', value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="cpm">CPM (Cost Per Mille) in $</Label>
              <span className="text-sm text-muted-foreground">${customStats.cpm.toFixed(2)}</span>
            </div>
            <div className="pt-2">
              <Slider
                id="cpm"
                min={0.5}
                max={20}
                step={0.5}
                value={[customStats.cpm]}
                onValueChange={(value) => handleSliderChange('cpm', value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="videosPerMonth">Videos Published Per Month</Label>
            <Input
              id="videosPerMonth"
              name="videosPerMonth"
              type="number"
              min={1}
              max={60}
              value={customStats.videosPerMonth}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-primary/10 p-4 rounded-lg text-center">
              <h3 className="text-lg font-medium">Monthly</h3>
              <p className="text-2xl font-bold text-primary mt-2">${earnings.monthly}</p>
            </div>
            <div className="bg-primary/10 p-4 rounded-lg text-center">
              <h3 className="text-lg font-medium">Yearly</h3>
              <p className="text-2xl font-bold text-primary mt-2">${earnings.yearly}</p>
            </div>
            <div className="bg-primary/20 p-4 rounded-lg text-center">
              <h3 className="text-lg font-medium">Potential</h3>
              <p className="text-2xl font-bold text-primary mt-2">${earnings.potential}</p>
              <p className="text-xs text-muted-foreground mt-1">with 20% more views</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          onClick={resetToChannelStats}
          disabled={!youtubeStats}
          className="w-full"
        >
          Reset to Channel Stats
        </Button>
      </CardFooter>
    </Card>
  );
}