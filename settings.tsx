import { useState } from "react";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { User, BrandSetting } from "@shared/schema";
import { Helmet } from "react-helmet";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin,
  Check,
  ChevronRight
} from "lucide-react";

export default function Settings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoScheduling, setAutoScheduling] = useState(false);
  
  // Fetch user data
  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"],
  });
  
  // Fetch brand settings
  const { data: brandSettings } = useQuery<BrandSetting>({
    queryKey: ["/api/brand-settings"],
  });
  
  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async (userData: Partial<User>) => {
      // In a real app, this would be a PATCH to /api/user
      // For this demo, we'll just show a toast
      return userData;
    },
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error updating profile",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Update brand settings mutation
  const updateBrandSettingsMutation = useMutation({
    mutationFn: async (settings: Partial<BrandSetting>) => {
      if (!brandSettings) throw new Error("No brand settings to update");
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
    onError: () => {
      toast({
        title: "Error updating brand settings",
        description: "There was a problem updating your brand settings. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const userData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      businessName: formData.get("businessName") as string,
    };
    
    updateUserMutation.mutate(userData);
  };
  
  const handleSaveBrand = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const brandData = {
      name: formData.get("brandName") as string,
      logoUrl: formData.get("logoUrl") as string,
    };
    
    updateBrandSettingsMutation.mutate(brandData);
  };
  
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "facebook":
        return <Facebook className="h-5 w-5 text-blue-600" />;
      case "instagram":
        return <Instagram className="h-5 w-5 text-pink-600" />;
      case "twitter":
        return <Twitter className="h-5 w-5" />;
      case "linkedin":
        return <Linkedin className="h-5 w-5 text-blue-700" />;
      default:
        return null;
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Settings - SocialSync</title>
        <meta name="description" content="Configure your SocialSync account, manage brand settings, and connect social media platforms." />
      </Helmet>

      <div>
        <Header title="Settings" />
        
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="profile" className="mb-8">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="brand">Brand</TabsTrigger>
              <TabsTrigger value="connections">Connections</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>
                    Manage your account information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6" onSubmit={handleSaveProfile}>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input 
                            id="name" 
                            name="name" 
                            defaultValue={user?.name || ""}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            defaultValue={user?.email || ""}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input 
                          id="businessName" 
                          name="businessName" 
                          defaultValue={user?.businessName || ""}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input 
                          id="password" 
                          name="password" 
                          type="password" 
                          placeholder="••••••••"
                        />
                        <p className="text-xs text-gray-500">
                          Leave blank to keep your current password
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="submit" disabled={updateUserMutation.isPending}>
                        {updateUserMutation.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="brand" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Brand Settings</CardTitle>
                  <CardDescription>
                    Customize your brand appearance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6" onSubmit={handleSaveBrand}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="brandName">Brand Name</Label>
                        <Input 
                          id="brandName" 
                          name="brandName" 
                          defaultValue={brandSettings?.name || ""}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="logoUrl">Logo URL</Label>
                        <Input 
                          id="logoUrl" 
                          name="logoUrl" 
                          defaultValue={brandSettings?.logoUrl || ""}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Brand Colors</Label>
                        <div className="flex flex-wrap gap-2">
                          {brandSettings?.colors.map((color, index) => (
                            <div 
                              key={index} 
                              className="h-8 w-8 rounded-full border border-gray-200"
                              style={{ backgroundColor: color }}
                            ></div>
                          ))}
                          <button 
                            type="button" 
                            className="h-8 w-8 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:text-gray-500"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="headingFont">Heading Font</Label>
                        <Select defaultValue={brandSettings?.fonts.heading}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select font" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Inter">Inter</SelectItem>
                            <SelectItem value="Roboto">Roboto</SelectItem>
                            <SelectItem value="Montserrat">Montserrat</SelectItem>
                            <SelectItem value="Open Sans">Open Sans</SelectItem>
                            <SelectItem value="Poppins">Poppins</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bodyFont">Body Font</Label>
                        <Select defaultValue={brandSettings?.fonts.body}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select font" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Inter">Inter</SelectItem>
                            <SelectItem value="Roboto">Roboto</SelectItem>
                            <SelectItem value="Montserrat">Montserrat</SelectItem>
                            <SelectItem value="Open Sans">Open Sans</SelectItem>
                            <SelectItem value="Poppins">Poppins</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="submit" disabled={updateBrandSettingsMutation.isPending}>
                        {updateBrandSettingsMutation.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="connections" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Social Media Connections</CardTitle>
                  <CardDescription>
                    Connect your social media accounts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Facebook */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        {getPlatformIcon("facebook")}
                        <div className="ml-4">
                          <h3 className="text-sm font-medium">Facebook</h3>
                          <p className="text-xs text-gray-500">Connect your Facebook page</p>
                        </div>
                      </div>
                      <Button variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200">
                        <Check className="h-4 w-4" />
                        Connected
                      </Button>
                    </div>
                    
                    {/* Instagram */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        {getPlatformIcon("instagram")}
                        <div className="ml-4">
                          <h3 className="text-sm font-medium">Instagram</h3>
                          <p className="text-xs text-gray-500">Connect your Instagram business account</p>
                        </div>
                      </div>
                      <Button variant="outline" className="flex items-center gap-1 bg-pink-50 text-pink-600 hover:bg-pink-100 border-pink-200">
                        <Check className="h-4 w-4" />
                        Connected
                      </Button>
                    </div>
                    
                    {/* Twitter */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        {getPlatformIcon("twitter")}
                        <div className="ml-4">
                          <h3 className="text-sm font-medium">Twitter</h3>
                          <p className="text-xs text-gray-500">Connect your Twitter account</p>
                        </div>
                      </div>
                      <Button variant="outline">
                        Connect
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* LinkedIn */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        {getPlatformIcon("linkedin")}
                        <div className="ml-4">
                          <h3 className="text-sm font-medium">LinkedIn</h3>
                          <p className="text-xs text-gray-500">Connect your LinkedIn page</p>
                        </div>
                      </div>
                      <Button variant="outline">
                        Connect
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preferences" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>
                    Configure your app preferences and notifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Notifications</h3>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="email-notifications" className="text-sm">Email Notifications</Label>
                          <p className="text-xs text-gray-500">Receive email alerts for post publishing and analytics</p>
                        </div>
                        <Switch 
                          id="email-notifications" 
                          checked={emailNotifications} 
                          onCheckedChange={setEmailNotifications}
                        />
                      </div>
                      
                      <div className="border-t pt-4">
                        <h3 className="text-sm font-medium mb-4">Scheduling</h3>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="auto-scheduling" className="text-sm">Auto Scheduling</Label>
                            <p className="text-xs text-gray-500">Let the app determine the best times to post</p>
                          </div>
                          <Switch 
                            id="auto-scheduling" 
                            checked={autoScheduling} 
                            onCheckedChange={setAutoScheduling}
                          />
                        </div>
                        
                        <div className="mt-4 space-y-2">
                          <Label htmlFor="timezone">Timezone</Label>
                          <Select defaultValue="America/New_York">
                            <SelectTrigger id="timezone">
                              <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                              <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                              <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                              <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                              <SelectItem value="Europe/London">London (GMT)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>Save Preferences</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
