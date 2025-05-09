import { useState } from "react";
import Header from "@/components/layout/header";
import TemplateLibrary from "@/components/template-library";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { PostTemplate } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Helmet } from "react-helmet";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Templates() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const { toast } = useToast();
  
  const { data: templates, isLoading } = useQuery<PostTemplate[]>({
    queryKey: ["/api/templates"],
  });
  
  const filteredTemplates = templates?.filter(template => 
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleCreateSample = () => {
    toast({
      title: "Template created",
      description: "Your template has been created successfully.",
    });
    setIsCreatingTemplate(false);
  };
  
  return (
    <>
      <Helmet>
        <title>Template Library - SocialSync</title>
        <meta name="description" content="Browse and customize social media templates for consistent branding across all your platforms." />
      </Helmet>

      <div>
        <Header title="Templates" />
        
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Template Library</CardTitle>
                    <CardDescription>Create and manage reusable content templates for your posts</CardDescription>
                  </div>
                  <Button 
                    onClick={() => setIsCreatingTemplate(true)}
                    className="bg-primary-500 text-white"
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Create Template
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative w-full max-w-sm mb-6">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search templates..." 
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Tabs defaultValue="all">
                  <TabsList>
                    <TabsTrigger value="all">All Templates</TabsTrigger>
                    <TabsTrigger value="social">Social Media</TabsTrigger>
                    <TabsTrigger value="promo">Promotions</TabsTrigger>
                    <TabsTrigger value="announce">Announcements</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="mt-6">
                    <TemplateLibrary />
                  </TabsContent>
                  
                  <TabsContent value="social" className="mt-6">
                    <div className="text-center py-8 text-gray-500">
                      Filter by social media templates
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="promo" className="mt-6">
                    <div className="text-center py-8 text-gray-500">
                      Filter by promotion templates
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="announce" className="mt-6">
                    <div className="text-center py-8 text-gray-500">
                      Filter by announcement templates
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          {/* Create Template Basic Dialog */}
          <Dialog open={isCreatingTemplate} onOpenChange={setIsCreatingTemplate}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Template</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input id="template-name" placeholder="e.g., Product Launch" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="template-content">Content</Label>
                  <Textarea 
                    id="template-content"
                    placeholder="Enter your template content..."
                    className="min-h-[100px]"
                  />
                  <p className="text-xs text-gray-500">
                    Use placeholders like [PRODUCT], [PRICE], etc.
                  </p>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreatingTemplate(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateSample}>
                  Create Template
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}
