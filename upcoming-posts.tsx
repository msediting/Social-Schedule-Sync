import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Post } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Edit,
  MoreHorizontal,
  Trash
} from "lucide-react";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import PostCreator from "./post-creator";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";

export default function UpcomingPosts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null);
  const postsPerPage = 3;

  const { data: allPosts, isLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });
  
  // Filter only scheduled posts
  const scheduledPosts = allPosts?.filter(post => post.status === 'scheduled') || [];
  
  // Sort by scheduled date (ascending)
  const sortedPosts = [...scheduledPosts].sort((a, b) => 
    new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
  );
  
  // Paginate posts
  const paginatedPosts = sortedPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );
  
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);

  const deletePostMutation = useMutation({
    mutationFn: async (postId: number) => {
      await apiRequest("DELETE", `/api/posts/${postId}`, null);
    },
    onSuccess: () => {
      toast({
        title: "Post deleted",
        description: "The post has been deleted successfully."
      });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      setDeletingPostId(null);
    },
    onError: () => {
      toast({
        title: "Error deleting post",
        description: "There was a problem deleting the post. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "facebook":
        return <Facebook className="text-blue-600 h-4 w-4" />;
      case "instagram":
        return <Instagram className="text-pink-600 h-4 w-4" />;
      case "twitter":
        return <Twitter className="h-4 w-4" />;
      case "linkedin":
        return <Linkedin className="text-blue-700 h-4 w-4" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-16" />
        </div>
        
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <Skeleton className="h-16 w-16 rounded" />
                      <div>
                        <Skeleton className="h-5 w-48 mb-1" />
                        <Skeleton className="h-4 w-64 mb-2" />
                        <div className="flex items-center">
                          <Skeleton className="h-4 w-4 mr-1" />
                          <Skeleton className="h-4 w-4 mr-1" />
                          <Skeleton className="h-4 w-32 ml-2" />
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
              <Skeleton className="h-4 w-48" />
              <div className="flex space-x-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (scheduledPosts.length === 0) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Posts</h2>
          <Button
            variant="link"
            className="text-sm text-primary-600 font-medium"
          >
            View All
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">No upcoming posts scheduled. Create a new post to get started.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Upcoming Posts</h2>
        <Button
          variant="link"
          className="text-sm text-primary-600 font-medium"
        >
          View All
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <ul className="divide-y divide-gray-200">
            {paginatedPosts.map((post) => (
              <li key={post.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    {/* Post Preview */}
                    <div className="h-16 w-16 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                      {post.imageUrl ? (
                        <img 
                          src={post.imageUrl} 
                          alt="Post preview" 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="text-gray-400">
                          <Edit className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                    
                    {/* Post Details */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {post.content.length > 40 
                          ? post.content.substring(0, 40) + "..." 
                          : post.content}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{post.content}</p>
                      <div className="flex items-center mt-2">
                        {post.platforms.map((platform, index) => (
                          <span key={index} className="mr-1">
                            {getPlatformIcon(platform)}
                          </span>
                        ))}
                        <span className="text-xs text-gray-500 ml-2">
                          {format(new Date(post.scheduledDate), "MMM d, yyyy • h:mm a")}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-gray-500"
                      onClick={() => setEditingPost(post)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          className="text-red-600 cursor-pointer"
                          onClick={() => setDeletingPostId(post.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete Post
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          
          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <span className="text-xs text-gray-500">
              Showing {(currentPage - 1) * postsPerPage + 1} to {Math.min(currentPage * postsPerPage, scheduledPosts.length)} of {scheduledPosts.length} scheduled posts
            </span>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Edit post modal */}
      {editingPost && (
        <PostCreator
          isOpen={!!editingPost}
          onClose={() => setEditingPost(null)}
          initialTemplate={{
            id: editingPost.id,
            userId: editingPost.userId,
            name: '',
            description: '',
            imageUrl: editingPost.imageUrl || '',
            content: editingPost.content,
            platforms: editingPost.platforms,
            isDefault: false
          }}
        />
      )}
      
      {/* Delete confirmation */}
      <AlertDialog open={!!deletingPostId} onOpenChange={() => setDeletingPostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this scheduled post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => {
                if (deletingPostId) {
                  deletePostMutation.mutate(deletingPostId);
                }
              }}
            >
              {deletePostMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
