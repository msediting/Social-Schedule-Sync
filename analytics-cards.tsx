import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Send, 
  LineChart
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface AnalyticsSummary {
  publishedThisMonth: number;
  scheduledThisMonth: number;
  totalPlannedPosts: number;
  totalEngagement: number;
  engagementBreakdown: {
    likes: number;
    comments: number;
    shares: number;
  };
}

export default function AnalyticsCards() {
  const { data: analytics, isLoading } = useQuery<AnalyticsSummary>({
    queryKey: ["/api/analytics/summary"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-10 w-10 rounded-lg" />
              </div>
              <div className="mt-4 space-y-2">
                <Skeleton className="h-2 w-full rounded-full" />
                <Skeleton className="h-4 w-40" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!analytics) return null;

  const publishedPercentage = analytics.totalPlannedPosts > 0
    ? (analytics.publishedThisMonth / analytics.totalPlannedPosts) * 100
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Post Overview */}
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Published This Month</p>
              <p className="text-2xl font-semibold mt-1">{analytics.publishedThisMonth}</p>
            </div>
            <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center text-primary-500">
              <Send className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <Progress
              value={publishedPercentage}
              className="h-2"
            />
            <p className="text-xs text-gray-500 mt-2">
              {analytics.publishedThisMonth} of {analytics.totalPlannedPosts} planned posts published
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Engagement */}
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Engagement</p>
              <p className="text-2xl font-semibold mt-1">
                {analytics.totalEngagement > 1000 
                  ? `${(analytics.totalEngagement / 1000).toFixed(1)}K` 
                  : analytics.totalEngagement}
              </p>
            </div>
            <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center text-green-500">
              <LineChart className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex space-x-2">
              <div className="flex-1">
                <p className="text-xs text-gray-500">Likes</p>
                <p className="text-sm font-medium">
                  {analytics.engagementBreakdown.likes > 1000 
                    ? `${(analytics.engagementBreakdown.likes / 1000).toFixed(1)}K` 
                    : analytics.engagementBreakdown.likes}
                </p>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Comments</p>
                <p className="text-sm font-medium">
                  {analytics.engagementBreakdown.comments > 1000 
                    ? `${(analytics.engagementBreakdown.comments / 1000).toFixed(1)}K` 
                    : analytics.engagementBreakdown.comments}
                </p>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Shares</p>
                <p className="text-sm font-medium">
                  {analytics.engagementBreakdown.shares > 1000 
                    ? `${(analytics.engagementBreakdown.shares / 1000).toFixed(1)}K` 
                    : analytics.engagementBreakdown.shares}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Quick Actions */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
              <span className="text-sm text-gray-700">Schedule New Post</span>
              <Send className="h-4 w-4 text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
              <span className="text-sm text-gray-700">Create Template</span>
              <svg 
                viewBox="0 0 24 24" 
                className="h-4 w-4 text-gray-400"
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="3" y1="9" x2="21" y2="9"/>
                <line x1="9" y1="21" x2="9" y2="9"/>
              </svg>
            </button>
            <button className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
              <span className="text-sm text-gray-700">Connect Platform</span>
              <svg 
                viewBox="0 0 24 24"
                className="h-4 w-4 text-gray-400"
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
