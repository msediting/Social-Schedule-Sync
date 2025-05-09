import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight,
  Facebook,
  Instagram,
  Twitter,
  Linkedin
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Post } from "@shared/schema";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, getDay } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import PostCreator from "./post-creator";

export default function ContentCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  
  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });
  
  // Add days from previous month to fill the first week
  const firstDayOfWeek = getDay(firstDayOfMonth);
  const prevMonthDays = firstDayOfWeek > 0 ? Array.from({ length: firstDayOfWeek }, (_, i) => {
    return new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth(), -i);
  }).reverse() : [];
  
  // Add days from next month to fill the last week
  const lastDayOfWeek = getDay(lastDayOfMonth);
  const nextMonthDays = lastDayOfWeek < 6 ? Array.from({ length: 6 - lastDayOfWeek }, (_, i) => {
    return new Date(lastDayOfMonth.getFullYear(), lastDayOfMonth.getMonth() + 1, i + 1);
  }) : [];
  
  // Combine all days
  const allDays = [...prevMonthDays, ...daysInMonth, ...nextMonthDays];
  
  // Get posts for the current month
  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: [
      "/api/posts/calendar", 
      { year: currentMonth.getFullYear(), month: currentMonth.getMonth() }
    ],
  });

  // Handle month navigation
  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  
  // Platform icon mapping
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "facebook":
        return <Facebook className="text-blue-600 h-3 w-3" />;
      case "instagram":
        return <Instagram className="text-pink-600 h-3 w-3" />;
      case "twitter":
        return <Twitter className="h-3 w-3" />;
      case "linkedin":
        return <Linkedin className="text-blue-700 h-3 w-3" />;
      default:
        return null;
    }
  };
  
  // Get background color for platform
  const getPlatformBgColor = (platform: string) => {
    switch (platform) {
      case "facebook":
        return "bg-blue-100";
      case "instagram":
        return "bg-pink-100";
      case "twitter":
        return "bg-black";
      case "linkedin":
        return "bg-blue-700";
      default:
        return "bg-gray-100";
    }
  };
  
  // Get text color for platform
  const getPlatformTextColor = (platform: string) => {
    switch (platform) {
      case "facebook":
        return "text-blue-600";
      case "instagram":
        return "text-pink-600";
      case "twitter":
        return "text-white";
      case "linkedin":
        return "text-white";
      default:
        return "text-gray-600";
    }
  };
  
  // Get posts for a specific day
  const getPostsForDay = (day: Date) => {
    if (!posts) return [];
    
    return posts.filter(post => {
      const postDate = new Date(post.scheduledDate);
      return isSameDay(postDate, day);
    });
  };
  
  // Handle click on a day
  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setIsCreatingPost(true);
  };

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-8 w-40" />
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        
        <Card>
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="bg-gray-50 h-8 flex items-center justify-center">
                <Skeleton className="h-4 w-8" />
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-px">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="bg-white min-h-[100px] p-2">
                <Skeleton className="h-4 w-4 mb-2" />
                <div className="space-y-1">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Content Calendar</h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={goToPreviousMonth}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={goToNextMonth}
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
          <Badge variant="outline" className="px-3 py-1.5 text-sm font-medium text-gray-900 bg-white border border-gray-300">
            {format(currentMonth, "MMMM yyyy")}
          </Badge>
        </div>
      </div>
      
      <Card className="overflow-hidden">
        {/* Calendar Header */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="bg-gray-50 h-8 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-500">{day}</span>
            </div>
          ))}
        </div>
        
        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {allDays.map((day, index) => {
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const postsForDay = getPostsForDay(day);
            
            return (
              <div 
                key={index} 
                className={cn(
                  "bg-white min-h-[100px] p-2 transition-colors",
                  isCurrentMonth ? "hover:bg-gray-50" : "text-gray-300",
                  postsForDay.length > 0 && isCurrentMonth && "cursor-pointer",
                )}
                onClick={() => isCurrentMonth && handleDayClick(day)}
              >
                <span className="text-xs">{format(day, "d")}</span>
                <div className="mt-1 space-y-1">
                  {isCurrentMonth && postsForDay.map((post) => {
                    // Get the first platform for coloring (in a real app would show multiple)
                    const platform = post.platforms[0];
                    return (
                      <div 
                        key={post.id} 
                        className={cn(
                          "rounded p-1 text-xs",
                          getPlatformBgColor(platform)
                        )}
                      >
                        <div className="flex items-center">
                          {getPlatformIcon(platform)}
                          <span className={cn("ml-1 truncate", getPlatformTextColor(platform))}>
                            {post.content.length > 20 
                              ? post.content.substring(0, 20) + "..." 
                              : post.content}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
      
      {/* Post creator modal */}
      {selectedDate && (
        <PostCreator
          isOpen={isCreatingPost}
          onClose={() => {
            setIsCreatingPost(false);
            setSelectedDate(null);
          }}
        />
      )}
    </div>
  );
}
