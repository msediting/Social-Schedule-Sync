import { useState } from "react";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Post } from "@shared/schema";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { format, subDays, subMonths } from "date-fns";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Helmet } from "react-helmet";

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("30days");
  const [platformFilter, setPlatformFilter] = useState("all");
  
  // Calculate date range based on selected time range
  const getDateRange = () => {
    const now = new Date();
    switch (timeRange) {
      case "7days":
        return subDays(now, 7);
      case "30days":
        return subDays(now, 30);
      case "90days":
        return subDays(now, 90);
      case "year":
        return subMonths(now, 12);
      default:
        return subDays(now, 30);
    }
  };
  
  const startDate = getDateRange();
  
  // Fetch posts
  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });
  
  // Filter posts by date range and platform
  const filteredPosts = posts?.filter(post => {
    const postDate = new Date(post.publishedDate || post.scheduledDate);
    const isInDateRange = postDate >= startDate;
    
    if (platformFilter === "all") {
      return isInDateRange;
    }
    
    return isInDateRange && post.platforms.includes(platformFilter);
  });
  
  // Calculate engagement metrics
  const totalLikes = filteredPosts?.reduce((sum, post) => {
    return sum + (post.engagementStats?.likes || 0);
  }, 0) || 0;
  
  const totalComments = filteredPosts?.reduce((sum, post) => {
    return sum + (post.engagementStats?.comments || 0);
  }, 0) || 0;
  
  const totalShares = filteredPosts?.reduce((sum, post) => {
    return sum + (post.engagementStats?.shares || 0);
  }, 0) || 0;
  
  // Generate platform distribution data
  const platformCounts: Record<string, number> = { facebook: 0, instagram: 0, twitter: 0, linkedin: 0 };
  
  filteredPosts?.forEach(post => {
    post.platforms.forEach(platform => {
      platformCounts[platform] = (platformCounts[platform] || 0) + 1;
    });
  });
  
  const platformData = Object.entries(platformCounts).map(([name, value]) => ({
    name,
    value
  }));
  
  // Mock engagement data (in a real app, this would come from the server)
  const engagementData = [
    { name: 'Week 1', likes: 124, comments: 45, shares: 32 },
    { name: 'Week 2', likes: 186, comments: 67, shares: 41 },
    { name: 'Week 3', likes: 236, comments: 78, shares: 52 },
    { name: 'Week 4', likes: 294, comments: 93, shares: 63 },
  ];
  
  // Mock posting frequency data
  const postFrequencyData = [
    { name: 'Mon', posts: 3 },
    { name: 'Tue', posts: 5 },
    { name: 'Wed', posts: 2 },
    { name: 'Thu', posts: 4 },
    { name: 'Fri', posts: 6 },
    { name: 'Sat', posts: 1 },
    { name: 'Sun', posts: 0 },
  ];
  
  // Colors for pie chart
  const PLATFORM_COLORS = {
    facebook: '#1877F2',
    instagram: '#E1306C',
    twitter: '#1DA1F2',
    linkedin: '#0077B5'
  };
  
  return (
    <>
      <Helmet>
        <title>Analytics - SocialSync</title>
        <meta name="description" content="Track your social media performance with comprehensive analytics and engagement metrics." />
      </Helmet>

      <div>
        <Header title="Analytics" />
        
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <h1 className="text-2xl font-semibold text-gray-900">Performance Analytics</h1>
            
            <div className="flex space-x-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                  <SelectItem value="year">Last year</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{filteredPosts?.length || 0}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Likes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">
                  {totalLikes > 1000 ? `${(totalLikes / 1000).toFixed(1)}K` : totalLikes}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Comments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">
                  {totalComments > 1000 ? `${(totalComments / 1000).toFixed(1)}K` : totalComments}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Shares</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">
                  {totalShares > 1000 ? `${(totalShares / 1000).toFixed(1)}K` : totalShares}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Tabs for different charts */}
          <Tabs defaultValue="engagement">
            <TabsList>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
              <TabsTrigger value="platforms">Platforms</TabsTrigger>
              <TabsTrigger value="frequency">Posting Frequency</TabsTrigger>
            </TabsList>
            
            <TabsContent value="engagement" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Overview</CardTitle>
                  <CardDescription>
                    Likes, comments, and shares for the selected time period
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={engagementData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="likes" stroke="#3b82f6" name="Likes" />
                      <Line type="monotone" dataKey="comments" stroke="#10b981" name="Comments" />
                      <Line type="monotone" dataKey="shares" stroke="#8b5cf6" name="Shares" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="platforms" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Distribution</CardTitle>
                  <CardDescription>
                    Distribution of posts across platforms
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={platformData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {platformData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={PLATFORM_COLORS[entry.name as keyof typeof PLATFORM_COLORS] || '#8884d8'} 
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="frequency" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Posting Frequency</CardTitle>
                  <CardDescription>
                    Number of posts by day of week
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={postFrequencyData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="posts" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
