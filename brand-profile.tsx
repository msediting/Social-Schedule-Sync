import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Plus, 
  Check, 
  X
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { BrandSetting, PlatformConnection } from "@shared/schema";
import { PopoverTrigger, Popover, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function BrandProfile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditingBrand, setIsEditingBrand] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [newColor, setNewColor] = useState<string>("#000000");

  // Get brand settings
  const { data: brandSettings, isLoading: isLoadingBrand } = useQuery<BrandSetting>({
    queryKey: ["/api/brand-settings"],
  });

  // Get platform connections
  const { data: platforms, isLoading: isLoadingPlatforms } = useQuery<PlatformConnection[]>({
    queryKey: ["/api/platform-connections"],
  });

  // Update brand settings mutation
  const updateBrandMutation = useMutation({
    mutationFn: async (updatedSettings: Partial<BrandSetting>) => {
      if (!brandSettings) throw new Error("No brand settings to update");
      const res = await apiRequest("PATCH", `/api/brand-settings/${brandSettings.id}`, updatedSettings);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Brand settings updated",
        description: "Your brand settings have been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/brand-settings"] });
      setIsEditingBrand(false);
    },
    onError: () => {
      toast({
        title: "Error updating brand settings",
        description: "There was a problem updating your brand settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update platform connection mutation
  const updatePlatformMutation = useMutation({
    mutationFn: async ({ id, connected }: { id: number; connected: boolean }) => {
      const res = await apiRequest("PATCH", `/api/platform-connections/${id}`, { connected });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/platform-connections"] });
      toast({
        title: "Platform connection updated",
        description: "Your platform connection has been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error updating platform connection",
        description: "There was a problem updating your platform connection. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleColorAdd = () => {
    if (!brandSettings) return;
    
    const updatedColors = [...brandSettings.colors, newColor];
    updateBrandMutation.mutate({
      colors: updatedColors
    });
    setNewColor("#000000");
  };

  const handleColorRemove = (colorToRemove: string) => {
    if (!brandSettings) return;
    
    const updatedColors = brandSettings.colors.filter(color => color !== colorToRemove);
    updateBrandMutation.mutate({
      colors: updatedColors
    });
  };

  const handleFontChange = (type: "heading" | "body", font: string) => {
    if (!brandSettings) return;
    
    const updatedFonts = {
      ...brandSettings.fonts,
      [type]: font
    };
    
    updateBrandMutation.mutate({
      fonts: updatedFonts
    });
  };

  const handlePlatformToggle = (platformId: number, currentStatus: boolean) => {
    updatePlatformMutation.mutate({
      id: platformId,
      connected: !currentStatus
    });
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "facebook":
        return <Facebook className="text-blue-600" />;
      case "instagram":
        return <Instagram className="text-pink-600" />;
      case "twitter":
        return <Twitter />;
      case "linkedin":
        return <Linkedin className="text-blue-700" />;
      default:
        return null;
    }
  };

  if (isLoadingBrand || isLoadingPlatforms) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Brand Profile</CardTitle>
            <CardDescription>Customize how your content appears across platforms</CardDescription>
          </div>
          <Button 
            variant="link" 
            className="text-primary-500 hover:text-primary-600"
            onClick={() => setIsEditingBrand(true)}
          >
            Edit Settings
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Brand Colors */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Brand Colors</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {brandSettings?.colors.map((color, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="h-6 w-6 rounded-full p-0 border border-gray-200"
                  style={{ backgroundColor: color }}
                />
              ))}
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="h-6 w-6 rounded-full border border-gray-300 p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3">
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <Input
                        type="color"
                        value={newColor}
                        onChange={(e) => setNewColor(e.target.value)}
                        className="w-10 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={newColor}
                        onChange={(e) => setNewColor(e.target.value)}
                        className="w-24"
                      />
                    </div>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={handleColorAdd}
                    >
                      Add Color
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          {/* Brand Fonts */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Brand Fonts</h3>
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Heading: {brandSettings?.fonts.heading}
                </span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="link" 
                      className="text-xs text-primary-500 p-0 h-auto"
                    >
                      Change
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3">
                    <div className="space-y-2">
                      <Label>Select Heading Font</Label>
                      <Select 
                        defaultValue={brandSettings?.fonts.heading} 
                        onValueChange={(value) => handleFontChange("heading", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select font" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Inter">Inter</SelectItem>
                          <SelectItem value="Roboto">Roboto</SelectItem>
                          <SelectItem value="Poppins">Poppins</SelectItem>
                          <SelectItem value="Montserrat">Montserrat</SelectItem>
                          <SelectItem value="Open Sans">Open Sans</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Body: {brandSettings?.fonts.body}
                </span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="link" 
                      className="text-xs text-primary-500 p-0 h-auto"
                    >
                      Change
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3">
                    <div className="space-y-2">
                      <Label>Select Body Font</Label>
                      <Select 
                        defaultValue={brandSettings?.fonts.body} 
                        onValueChange={(value) => handleFontChange("body", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select font" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Inter">Inter</SelectItem>
                          <SelectItem value="Roboto">Roboto</SelectItem>
                          <SelectItem value="Poppins">Poppins</SelectItem>
                          <SelectItem value="Montserrat">Montserrat</SelectItem>
                          <SelectItem value="Open Sans">Open Sans</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          
          {/* Connected Platforms */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Connected Platforms</h3>
            <div className="flex flex-col space-y-2">
              {platforms?.map((platform) => (
                <div key={platform.id} className="flex items-center">
                  {getPlatformIcon(platform.platform)}
                  <span className="ml-2 text-sm text-gray-600 capitalize">
                    {platform.platform}
                  </span>
                  <Button
                    variant="link"
                    size="sm"
                    className={cn(
                      "ml-auto text-xs",
                      platform.connected ? "text-green-500" : "text-gray-400"
                    )}
                    onClick={() => handlePlatformToggle(platform.id, platform.connected)}
                  >
                    {platform.connected ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Connected
                      </>
                    ) : (
                      "Connect"
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      
      {/* Edit Brand Dialog */}
      <Dialog open={isEditingBrand} onOpenChange={setIsEditingBrand}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Brand Settings</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="brand-name">Brand Name</Label>
              <Input
                id="brand-name"
                value={brandSettings?.name || ""}
                onChange={(e) => 
                  updateBrandMutation.mutate({ name: e.target.value })
                }
              />
            </div>
            
            <div className="space-y-2">
              <Label>Brand Colors</Label>
              <div className="flex flex-wrap gap-2">
                {brandSettings?.colors.map((color, index) => (
                  <div key={index} className="relative group">
                    <div
                      className="h-8 w-8 rounded-full border border-gray-200"
                      style={{ backgroundColor: color }}
                    ></div>
                    <button
                      className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-white border border-gray-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleColorRemove(color)}
                    >
                      <X className="h-2 w-2" />
                    </button>
                  </div>
                ))}
                <label className="h-8 w-8 rounded-full border border-dashed border-gray-300 flex items-center justify-center cursor-pointer">
                  <Plus className="h-4 w-4 text-gray-400" />
                  <input
                    type="color"
                    className="sr-only"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    onBlur={handleColorAdd}
                  />
                </label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditingBrand(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => setIsEditingBrand(false)}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
