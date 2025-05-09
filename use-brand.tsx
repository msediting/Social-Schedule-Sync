import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BrandSetting, InsertBrandSetting, PlatformConnection } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useBrand() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get brand settings
  const { 
    data: brandSettings, 
    isLoading: isLoadingBrand, 
    error: brandError 
  } = useQuery<BrandSetting>({
    queryKey: ["/api/brand-settings"],
  });

  // Get platform connections
  const { 
    data: platformConnections, 
    isLoading: isLoadingPlatforms, 
    error: platformsError 
  } = useQuery<PlatformConnection[]>({
    queryKey: ["/api/platform-connections"],
  });

  // Update brand settings
  const updateBrandSettings = useMutation({
    mutationFn: async (settings: Partial<BrandSetting>) => {
      if (!brandSettings) throw new Error("No brand settings found");
      const res = await apiRequest("PATCH", `/api/brand-settings/${brandSettings.id}`, settings);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Brand settings updated",
        description: "Your brand settings have been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/brand-settings"] });
    },
    onError: (error) => {
      toast({
        title: "Error updating brand settings",
        description: "There was a problem updating your brand settings. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating brand settings:", error);
    },
  });

  // Update brand colors
  const updateBrandColors = (colors: string[]) => {
    if (!brandSettings) return;
    
    updateBrandSettings.mutate({
      colors
    });
  };

  // Update brand fonts
  const updateBrandFonts = (heading: string, body: string) => {
    if (!brandSettings) return;
    
    updateBrandSettings.mutate({
      fonts: {
        heading,
        body
      }
    });
  };

  // Update platform connection
  const updatePlatformConnection = useMutation({
    mutationFn: async ({ id, changes }: { id: number; changes: Partial<PlatformConnection> }) => {
      const res = await apiRequest("PATCH", `/api/platform-connections/${id}`, changes);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Platform connection updated",
        description: "Your platform connection has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/platform-connections"] });
    },
    onError: (error) => {
      toast({
        title: "Error updating platform connection",
        description: "There was a problem updating your platform connection. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating platform connection:", error);
    },
  });

  // Toggle platform connection status
  const togglePlatformConnection = (id: number, connected: boolean) => {
    updatePlatformConnection.mutate({
      id,
      changes: { connected }
    });
  };

  // Get connected platforms
  const getConnectedPlatforms = () => {
    if (!platformConnections) return [];
    
    return platformConnections
      .filter(connection => connection.connected)
      .map(connection => connection.platform);
  };

  return {
    brandSettings,
    isLoadingBrand,
    brandError,
    platformConnections,
    isLoadingPlatforms,
    platformsError,
    updateBrandSettings,
    updateBrandColors,
    updateBrandFonts,
    updatePlatformConnection,
    togglePlatformConnection,
    getConnectedPlatforms,
  };
}
