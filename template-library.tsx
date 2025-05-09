import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PostTemplate } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Plus,
  Pencil
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import PostCreator from "./post-creator";

const templateFormSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  description: z.string().optional(),
  content: z.string().min(1, "Template content is required"),
  imageUrl: z.string().optional(),
  platforms: z.array(z.string()).min(1, "Select at least one platform"),
});

type TemplateFormValues = z.infer<typeof templateFormSchema>;

export default function TemplateLibrary() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<PostTemplate | null>(null);
  const [isUsingTemplate, setIsUsingTemplate] = useState(false);

  const { data: templates, isLoading } = useQuery<PostTemplate[]>({
    queryKey: ["/api/templates"],
  });

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      name: "",
      description: "",
      content: "",
      imageUrl: "",
      platforms: [],
    },
  });

  const createTemplateMutation = useMutation({
    mutationFn: async (template: Omit<TemplateFormValues, "userId">) => {
      const res = await apiRequest("POST", "/api/templates", {
        ...template,
        userId: 1, // In a real app, this would come from auth
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Template created",
        description: "Your template has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      setIsCreatingTemplate(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error creating template",
        description: "There was a problem creating your template. Please try again.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: TemplateFormValues) {
    createTemplateMutation.mutate(data);
  }

  function togglePlatform(platform: string) {
    const currentPlatforms = form.getValues("platforms");
    if (currentPlatforms.includes(platform)) {
      form.setValue("platforms", currentPlatforms.filter(p => p !== platform));
    } else {
      form.setValue("platforms", [...currentPlatforms, platform]);
    }
  }

  function handleUseTemplate(template: PostTemplate) {
    setSelectedTemplate(template);
    setIsUsingTemplate(true);
  }

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="w-full h-36" />
              <CardContent className="p-4">
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <div className="flex items-center justify-between">
                  <div className="flex space-x-1">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-5 w-5" />
                  </div>
                  <Skeleton className="h-6 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Template Library</h2>
        <Button
          onClick={() => setIsCreatingTemplate(true)}
          variant="outline"
          className="bg-primary-50 text-primary-600 hover:bg-primary-100"
        >
          <Plus className="mr-1 h-4 w-4" />
          New Template
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {templates?.map((template) => (
          <Card 
            key={template.id} 
            className="overflow-hidden hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]"
          >
            {template.imageUrl ? (
              <img 
                src={template.imageUrl} 
                alt={template.name} 
                className="w-full h-36 object-cover"
              />
            ) : (
              <div className="w-full h-36 bg-gray-100 flex items-center justify-center text-gray-400">
                <Pencil className="h-8 w-8" />
              </div>
            )}
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-gray-900">{template.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{template.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex space-x-1">
                  {template.platforms.map((platform, idx) => {
                    switch (platform) {
                      case "facebook":
                        return <Facebook key={idx} className="h-4 w-4 text-blue-600" />;
                      case "instagram":
                        return <Instagram key={idx} className="h-4 w-4 text-pink-600" />;
                      case "twitter":
                        return <Twitter key={idx} className="h-4 w-4" />;
                      case "linkedin":
                        return <Linkedin key={idx} className="h-4 w-4 text-blue-700" />;
                      default:
                        return null;
                    }
                  })}
                </div>
                <Button
                  variant="link"
                  size="sm"
                  className="text-xs text-primary-600 font-medium hover:text-primary-700 p-0 h-auto"
                  onClick={() => handleUseTemplate(template)}
                >
                  Use Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Create Template Dialog */}
      <Dialog open={isCreatingTemplate} onOpenChange={setIsCreatingTemplate}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Template</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Product Launch" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., For announcing new products" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="platforms"
                render={() => (
                  <FormItem>
                    <FormLabel>Platforms</FormLabel>
                    <div className="flex flex-wrap gap-2">
                      {["facebook", "instagram", "twitter", "linkedin"].map((platform) => {
                        const isSelected = form.getValues("platforms").includes(platform);
                        return (
                          <Badge
                            key={platform}
                            variant="outline"
                            className={cn(
                              "cursor-pointer",
                              isSelected && platform === "facebook" && "bg-blue-100 text-blue-800 hover:bg-blue-200",
                              isSelected && platform === "instagram" && "bg-pink-100 text-pink-800 hover:bg-pink-200",
                              isSelected && platform === "twitter" && "bg-black text-white hover:bg-gray-800",
                              isSelected && platform === "linkedin" && "bg-blue-700 text-white hover:bg-blue-800",
                              !isSelected && "bg-white text-gray-700 hover:bg-gray-50"
                            )}
                            onClick={() => togglePlatform(platform)}
                          >
                            {platform === "facebook" && <Facebook className="mr-1 h-3 w-3" />}
                            {platform === "instagram" && <Instagram className="mr-1 h-3 w-3" />}
                            {platform === "twitter" && <Twitter className="mr-1 h-3 w-3" />}
                            {platform === "linkedin" && <Linkedin className="mr-1 h-3 w-3" />}
                            {platform.charAt(0).toUpperCase() + platform.slice(1)}
                          </Badge>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Use placeholders like [PRODUCT], [PRICE], etc."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL (optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com/image.jpg" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreatingTemplate(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={createTemplateMutation.isPending}
                >
                  {createTemplateMutation.isPending ? "Creating..." : "Create Template"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Use template with post creator */}
      {selectedTemplate && (
        <PostCreator 
          isOpen={isUsingTemplate}
          onClose={() => {
            setIsUsingTemplate(false);
            setSelectedTemplate(null);
          }}
          initialTemplate={selectedTemplate}
        />
      )}
    </div>
  );
}
