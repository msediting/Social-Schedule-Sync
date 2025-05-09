import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Image as ImageIcon,
  Plus,
  X,
  Calendar as CalendarIcon
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { InsertPost, PlatformConnection, PostTemplate } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

interface PostCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  initialTemplate?: PostTemplate;
}

const postFormSchema = z.object({
  content: z.string().min(1, "Content is required"),
  imageUrl: z.string().optional(),
  scheduledDate: z.date(),
  platforms: z.array(z.string()).min(1, "Select at least one platform"),
  templateId: z.number().optional(),
});

type PostFormValues = z.infer<typeof postFormSchema>;

export default function PostCreator({ isOpen, onClose, initialTemplate }: PostCreatorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Get platform connections
  const { data: platforms } = useQuery<PlatformConnection[]>({
    queryKey: ["/api/platform-connections"],
  });

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      content: initialTemplate?.content || "",
      imageUrl: initialTemplate?.imageUrl || "",
      scheduledDate: new Date(),
      platforms: initialTemplate?.platforms || [],
      templateId: initialTemplate?.id,
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (post: InsertPost) => {
      const res = await apiRequest("POST", "/api/posts", post);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Post scheduled successfully",
        description: "Your post has been scheduled for publishing."
      });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts/calendar"] });
      onClose();
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error scheduling post",
        description: "There was a problem scheduling your post. Please try again.",
        variant: "destructive"
      });
    }
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      
      // For demo purposes, we're not actually uploading the file
      // Instead, we'll just set a placeholder URL
      form.setValue("imageUrl", URL.createObjectURL(e.target.files[0]));
    }
  }

  function onSubmit(data: PostFormValues) {
    createPostMutation.mutate({
      content: data.content,
      imageUrl: data.imageUrl,
      scheduledDate: data.scheduledDate,
      platforms: data.platforms,
      templateId: data.templateId,
      userId: 1 // This would come from auth in a real app
    });
  }

  function togglePlatform(platform: string) {
    const currentPlatforms = form.getValues("platforms");
    if (currentPlatforms.includes(platform)) {
      form.setValue("platforms", currentPlatforms.filter(p => p !== platform));
    } else {
      form.setValue("platforms", [...currentPlatforms, platform]);
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "facebook":
        return <Facebook className="h-4 w-4" />;
      case "instagram":
        return <Instagram className="h-4 w-4" />;
      case "twitter":
        return <Twitter className="h-4 w-4" />;
      case "linkedin":
        return <Linkedin className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getPlatformColors = (platform: string, isSelected: boolean) => {
    if (!isSelected) return "bg-white text-gray-700 border-gray-300 hover:bg-gray-50";
    
    switch (platform) {
      case "facebook":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "instagram":
        return "bg-pink-100 text-pink-800 hover:bg-pink-200";
      case "twitter":
        return "bg-black text-white hover:bg-gray-800";
      case "linkedin":
        return "bg-blue-700 text-white hover:bg-blue-800";
      default:
        return "bg-primary-100 text-primary-800 hover:bg-primary-200";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
          <DialogDescription>
            Create and schedule your post across multiple platforms.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Platform Selection */}
            <FormField
              control={form.control}
              name="platforms"
              render={() => (
                <FormItem>
                  <FormLabel>Platforms</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {platforms?.map((platform) => {
                      const isSelected = form.getValues("platforms").includes(platform.platform);
                      return (
                        <Badge
                          key={platform.id}
                          variant="outline"
                          className={cn(
                            "cursor-pointer inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full",
                            getPlatformColors(platform.platform, isSelected)
                          )}
                          onClick={() => togglePlatform(platform.platform)}
                        >
                          {getPlatformIcon(platform.platform)}
                          <span className="ml-1">{platform.platform.charAt(0).toUpperCase() + platform.platform.slice(1)}</span>
                        </Badge>
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Content Input */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="What's on your mind?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Media Upload */}
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Media</FormLabel>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    {field.value ? (
                      <div className="space-y-2 text-center">
                        <div className="relative mx-auto">
                          <img 
                            src={field.value} 
                            alt="Post preview" 
                            className="h-32 w-32 object-cover rounded-md"
                          />
                          <Button
                            type="button"
                            variant="secondary"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-gray-100 p-1"
                            onClick={() => {
                              setSelectedFile(null);
                              field.onChange("");
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex justify-center text-sm">
                          <Label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500"
                          >
                            Change file
                          </Label>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            onChange={handleFileChange}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1 text-center">
                        <ImageIcon className="mx-auto text-gray-400 h-12 w-12" />
                        <div className="flex text-sm text-gray-600 justify-center">
                          <Label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              onChange={handleFileChange}
                            />
                          </Label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Schedule Date */}
            <FormField
              control={form.control}
              name="scheduledDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Schedule for</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP HH:mm")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          if (date) {
                            const currentDate = field.value;
                            const newDate = new Date(date);
                            newDate.setHours(currentDate.getHours());
                            newDate.setMinutes(currentDate.getMinutes());
                            field.onChange(newDate);
                          }
                        }}
                        initialFocus
                      />
                      
                      <div className="p-3 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <Label>Time</Label>
                          <Input
                            type="time"
                            value={format(field.value, "HH:mm")}
                            onChange={(e) => {
                              const [hours, minutes] = e.target.value.split(':').map(Number);
                              const newDate = new Date(field.value);
                              newDate.setHours(hours);
                              newDate.setMinutes(minutes);
                              field.onChange(newDate);
                            }}
                            className="w-24"
                          />
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={createPostMutation.isPending}
              >
                {createPostMutation.isPending ? "Scheduling..." : "Schedule Post"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
