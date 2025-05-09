import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Post, InsertPost } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function usePosts() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get all posts
  const { data: posts, isLoading, error } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  // Get posts for a specific month
  const getPostsByMonth = (year: number, month: number) => {
    return useQuery<Post[]>({
      queryKey: ["/api/posts/calendar", { year, month }],
    });
  };

  // Create a new post
  const createPost = useMutation({
    mutationFn: async (post: InsertPost) => {
      const res = await apiRequest("POST", "/api/posts", post);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Post created",
        description: "Your post has been created and scheduled successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts/calendar"] });
    },
    onError: (error) => {
      toast({
        title: "Error creating post",
        description: "There was a problem creating your post. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating post:", error);
    },
  });

  // Update an existing post
  const updatePost = useMutation({
    mutationFn: async ({ id, post }: { id: number; post: Partial<InsertPost> }) => {
      const res = await apiRequest("PATCH", `/api/posts/${id}`, post);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Post updated",
        description: "Your post has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts/calendar"] });
    },
    onError: (error) => {
      toast({
        title: "Error updating post",
        description: "There was a problem updating your post. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating post:", error);
    },
  });

  // Delete a post
  const deletePost = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/posts/${id}`, null);
    },
    onSuccess: () => {
      toast({
        title: "Post deleted",
        description: "Your post has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts/calendar"] });
    },
    onError: (error) => {
      toast({
        title: "Error deleting post",
        description: "There was a problem deleting your post. Please try again.",
        variant: "destructive",
      });
      console.error("Error deleting post:", error);
    },
  });

  // Filter posts by various criteria
  const filterPosts = (filters: {
    status?: string;
    platform?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }) => {
    if (!posts) return [];

    return posts.filter((post) => {
      // Filter by status
      if (filters.status && post.status !== filters.status) {
        return false;
      }

      // Filter by platform
      if (filters.platform && !post.platforms.includes(filters.platform)) {
        return false;
      }

      // Filter by date range
      const postDate = new Date(post.scheduledDate);
      if (filters.dateFrom && postDate < filters.dateFrom) {
        return false;
      }
      if (filters.dateTo && postDate > filters.dateTo) {
        return false;
      }

      return true;
    });
  };

  return {
    posts,
    isLoading,
    error,
    getPostsByMonth,
    createPost,
    updatePost,
    deletePost,
    filterPosts,
  };
}
