import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PostTemplate, InsertPostTemplate } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useTemplates() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get all templates
  const { data: templates, isLoading, error } = useQuery<PostTemplate[]>({
    queryKey: ["/api/templates"],
  });

  // Get a specific template by ID
  const getTemplate = (id: number) => {
    return useQuery<PostTemplate>({
      queryKey: ["/api/templates", id],
      enabled: !!id,
    });
  };

  // Create a new template
  const createTemplate = useMutation({
    mutationFn: async (template: InsertPostTemplate) => {
      const res = await apiRequest("POST", "/api/templates", template);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Template created",
        description: "Your template has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
    },
    onError: (error) => {
      toast({
        title: "Error creating template",
        description: "There was a problem creating your template. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating template:", error);
    },
  });

  // Update an existing template
  const updateTemplate = useMutation({
    mutationFn: async ({ id, template }: { id: number; template: Partial<InsertPostTemplate> }) => {
      const res = await apiRequest("PATCH", `/api/templates/${id}`, template);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Template updated",
        description: "Your template has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
    },
    onError: (error) => {
      toast({
        title: "Error updating template",
        description: "There was a problem updating your template. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating template:", error);
    },
  });

  // Delete a template
  const deleteTemplate = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/templates/${id}`, null);
    },
    onSuccess: () => {
      toast({
        title: "Template deleted",
        description: "Your template has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
    },
    onError: (error) => {
      toast({
        title: "Error deleting template",
        description: "There was a problem deleting your template. Please try again.",
        variant: "destructive",
      });
      console.error("Error deleting template:", error);
    },
  });

  // Filter templates by platform
  const filterTemplatesByPlatform = (platform: string) => {
    if (!templates) return [];
    
    return templates.filter(template => 
      template.platforms.includes(platform)
    );
  };

  // Search templates by name or description
  const searchTemplates = (query: string) => {
    if (!templates || !query) return templates;
    
    const lowercaseQuery = query.toLowerCase();
    
    return templates.filter(template => 
      template.name.toLowerCase().includes(lowercaseQuery) ||
      (template.description && template.description.toLowerCase().includes(lowercaseQuery))
    );
  };

  return {
    templates,
    isLoading,
    error,
    getTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    filterTemplatesByPlatform,
    searchTemplates,
  };
}
