import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import YouTubeEarningsCalculator from "@/components/youtube-earnings-calculator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function YouTube() {
  return (
    <>
      <Helmet>
        <title>YouTube Monetization - SocialSync</title>
        <meta name="description" content="Analyze and optimize your YouTube earnings with our advanced calculator." />
      </Helmet>

      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">YouTube Monetization</h1>
        <p className="text-muted-foreground">
          Calculate potential earnings and optimize your content strategy for YouTube.
        </p>

        <Tabs defaultValue="calculator" className="w-full mt-4">
          <TabsList className="mb-4">
            <TabsTrigger value="calculator">Earnings Calculator</TabsTrigger>
            <TabsTrigger value="tips">Optimization Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-4">
            <YouTubeEarningsCalculator />
          </TabsContent>

          <TabsContent value="tips" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>YouTube Earnings Optimization Guide</CardTitle>
                <CardDescription>
                  Follow these tips to maximize your YouTube revenue potential
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">1. Focus on Watch Time</h3>
                  <p>YouTube's algorithm prioritizes videos with longer watch times. Create engaging content that keeps viewers watching longer.</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">2. Optimize for Higher CPM</h3>
                  <p>Some niches like finance, business, and technology typically have higher CPM rates. Incorporate these topics when relevant.</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">3. Target Quality Demographics</h3>
                  <p>Viewers from countries like the US, UK, Canada, and Australia generally generate higher ad revenue.</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">4. Upload Consistently</h3>
                  <p>Regular uploads help grow your audience over time, which directly impacts your earnings potential.</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">5. Diversify Revenue Streams</h3>
                  <p>Don't rely solely on ad revenue. Consider channel memberships, super chats, merchandise, and sponsored content.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}