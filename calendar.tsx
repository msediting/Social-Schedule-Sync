import { useState } from "react";
import Header from "@/components/layout/header";
import ContentCalendar from "@/components/content-calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Post } from "@shared/schema";
import { format, addMonths, subMonths } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Helmet } from "react-helmet";
import UpcomingPosts from "@/components/upcoming-posts";

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [view, setView] = useState<"calendar" | "list">("calendar");
  
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  
  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts/calendar", { year, month }],
  });
  
  const handlePreviousMonth = () => {
    setCurrentMonth(prevMonth => subMonths(prevMonth, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
  };
  
  const totalScheduledPosts = posts?.filter(post => post.status === "scheduled").length || 0;
  const totalPublishedPosts = posts?.filter(post => post.status === "published").length || 0;
  
  return (
    <>
      <Helmet>
        <title>Content Calendar - SocialSync</title>
        <meta name="description" content="View and manage your scheduled social media content across multiple platforms with an intuitive calendar interface." />
      </Helmet>

      <div>
        <Header title="Content Calendar" />
        
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Month Navigator Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h3 className="text-lg font-medium text-center">
                    {format(currentMonth, "MMMM yyyy")}
                  </h3>
                  <Button variant="outline" size="sm" onClick={handleNextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Scheduled Posts Summary */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500">Scheduled Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{totalScheduledPosts}</div>
                <p className="text-xs text-gray-500 mt-1">
                  for {format(currentMonth, "MMMM yyyy")}
                </p>
              </CardContent>
            </Card>
            
            {/* Published Posts Summary */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500">Published Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{totalPublishedPosts}</div>
                <p className="text-xs text-gray-500 mt-1">
                  in {format(currentMonth, "MMMM yyyy")}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="calendar" className="mb-8" onValueChange={(value) => setView(value as "calendar" | "list")}>
            <TabsList className="mb-4">
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="calendar">
              <ContentCalendar />
            </TabsContent>
            
            <TabsContent value="list">
              <UpcomingPosts />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
