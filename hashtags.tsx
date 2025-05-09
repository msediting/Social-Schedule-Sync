import { Helmet } from "react-helmet";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Twitter, Instagram, Facebook, Youtube, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Predefined hashtag sets for different platforms
const HASHTAG_SETS = {
  youtube: {
    business: ["#SmallBusiness", "#Entrepreneur", "#BusinessTips", "#StartupLife", "#BusinessGrowth", "#BusinessStrategy", "#BusinessAdvice", "#CEO", "#SmallBusinessTips", "#BusinessCoach"],
    marketing: ["#MarketingTips", "#DigitalMarketing", "#ContentMarketing", "#MarketingStrategy", "#SocialMediaMarketing", "#EmailMarketing", "#MarketingAdvice", "#SEOTips", "#OnlineMarketing", "#VideoMarketing"],
    productivity: ["#ProductivityTips", "#TimeManagement", "#WorkFromHome", "#RemoteWork", "#ProductivityHacks", "#OrganizationTips", "#DailyRoutine", "#MorningRoutine", "#Workflow", "#Productivity"],
    technology: ["#TechTips", "#Technology", "#TechNews", "#SoftwareTips", "#AppReview", "#TechTutorial", "#TechHelp", "#TechSupport", "#TechHacks", "#LatestTech"],
    lifestyle: ["#DayInTheLife", "#LifestyleVlog", "#LifestyleTips", "#DailyVlog", "#LifeHacks", "#LifeAdvice", "#LifestyleChange", "#HealthyLifestyle", "#LifestyleDesign", "#LifestyleContent"]
  },
  instagram: {
    business: ["#BusinessOwner", "#EntrepreneurLife", "#WomenInBusiness", "#BusinessGrowth", "#BusinessCoach", "#BusinessTips", "#SmallBusinessOwner", "#BusinessStrategy", "#BusinessSuccess", "#BusinessGoals"],
    marketing: ["#MarketingDigital", "#SocialMediaTips", "#ContentCreation", "#InfluencerMarketing", "#MarketingAgency", "#MarketingAdvice", "#BrandStrategy", "#InstagramTips", "#SocialMediaMarketing", "#MarketingConsultant"],
    fashion: ["#OOTD", "#FashionStyle", "#StyleInspo", "#FashionBlogger", "#StyleBlogger", "#OutfitInspiration", "#StreetStyle", "#FashionLover", "#StyleOfTheDay", "#FashionAddict"],
    food: ["#FoodPorn", "#FoodPhotography", "#Foodie", "#InstaFood", "#FoodBlogger", "#FoodLover", "#HomeCooking", "#FoodStyling", "#FoodGram", "#ChefLife"],
    travel: ["#TravelGram", "#Wanderlust", "#TravelPhotography", "#InstaTravel", "#TravelBlogger", "#Adventure", "#TravelLife", "#ExploreMore", "#TravelAddict", "#TravelTheWorld"]
  },
  twitter: {
    business: ["#SmallBiz", "#Entrepreneurship", "#Leadership", "#Innovation", "#Startup", "#BusinessGrowth", "#WomenInBusiness", "#BusinessStrategy", "#Success", "#BusinessTips"],
    marketing: ["#Marketing", "#DigitalMarketing", "#SocialMedia", "#ContentMarketing", "#SEO", "#MarketingStrategy", "#Branding", "#EmailMarketing", "#GrowthHacking", "#MarketingTips"],
    technology: ["#Tech", "#AI", "#MachineLearning", "#BigData", "#Blockchain", "#IoT", "#DataScience", "#Programming", "#Coding", "#WebDev"],
    news: ["#Breaking", "#NewsUpdate", "#TrendingNow", "#CurrentEvents", "#Headlines", "#LatestNews", "#NewsAlert", "#NewsBrief", "#DailyNews", "#TopStories"],
    opinions: ["#Perspective", "#Opinion", "#Thoughts", "#MyTake", "#HotTake", "#Debate", "#Discussion", "#Commentary", "#ViewPoint", "#Reflection"]
  },
  facebook: {
    business: ["#LocalBusiness", "#SmallBusinessOwner", "#ShopLocal", "#SupportSmallBusiness", "#BusinessCommunity", "#Entrepreneur", "#BusinessOwner", "#BusinessGrowth", "#BusinessSuccess", "#BusinessTips"],
    community: ["#Community", "#LocalCommunity", "#CommunitySupport", "#CommunityEvent", "#CommunityService", "#VolunteerWork", "#CommunityOutreach", "#CommunityEngagement", "#CommunityConnection", "#CommunityFocus"],
    events: ["#EventPromotion", "#UpcomingEvent", "#EventPlanning", "#VirtualEvent", "#LiveEvent", "#NetworkingEvent", "#EventMarketing", "#EventManagement", "#SpecialEvent", "#EventOrganizer"],
    family: ["#FamilyTime", "#FamilyFun", "#FamilyLife", "#FamilyDay", "#FamilyMoments", "#FamilyMemories", "#FamilyFirst", "#FamilyGoals", "#FamilyVacation", "#FamilyLove"],
    inspiration: ["#Motivation", "#PositiveVibes", "#PositiveThinking", "#DailyInspiration", "#MondayMotivation", "#InspirationalQuotes", "#BeInspired", "#GoodVibes", "#DailyMotivation", "#PositiveThoughts"]
  }
};

// Popular industry-specific hashtags
const INDUSTRY_HASHTAGS = {
  retail: ["#RetailTherapy", "#ShopSmall", "#RetailBusiness", "#ShoppingTime", "#RetailLife", "#Shopaholic", "#RetailStore", "#CustomerExperience", "#RetailDisplay", "#ShoppingSpree"],
  realestate: ["#RealEstateAgent", "#HomesForSale", "#RealEstateLife", "#RealEstateInvestor", "#HouseHunting", "#DreamHome", "#RealEstateMarketing", "#PropertyManagement", "#NewListing", "#JustListed"],
  fitness: ["#FitnessGoals", "#FitnessJourney", "#FitnessMotivation", "#WorkoutTime", "#FitLife", "#GymLife", "#HealthyLifestyle", "#FitnessTransformation", "#FitnessCoach", "#PersonalTrainer"],
  beauty: ["#BeautyTips", "#MakeupLover", "#SkinCareTips", "#BeautyProducts", "#MakeupTutorial", "#BeautyBlogger", "#GlowUp", "#BeautyHacks", "#MakeupAddict", "#NaturalBeauty"],
  food: ["#FoodBusiness", "#Catering", "#Restaurant", "#FoodService", "#ChefLife", "#FoodPrep", "#FoodDelivery", "#FoodStartup", "#LocalEats", "#FamilyRestaurant"],
  gaming: ["#GamerLife", "#GamersUnite", "#GamingCommunity", "#StreamerLife", "#GameDay", "#PCGaming", "#ConsoleLive", "#GameReview", "#GamerSetup", "#ESports"],
  music: ["#MusicProducer", "#NewMusic", "#MusicLover", "#Songwriter", "#MusicLife", "#IndieMusic", "#MusicianLife", "#LiveMusic", "#MusicIsLife", "#MusicProduction"],
  moviereview: ["#MovieReview", "#FilmCritic", "#MustWatch", "#BoxOffice", "#MovieNight", "#FilmReview", "#CinemaLovers", "#MovieFan", "#MovieBuff", "#FilmCommunity"],
  movieexplain: ["#MovieAnalysis", "#FilmBreakdown", "#MovieExplained", "#MovieTheory", "#FilmStudy", "#CinematicAnalysis", "#MovieDetails", "#FilmExplained", "#DirectorVision", "#HiddenMeaning"],
  technology: ["#TechNews", "#Technology", "#TechTrends", "#Innovation", "#TechReview", "#TechGadgets", "#FutureTech", "#SmartTech", "#TechWorld", "#TechnologyNews"],
  education: ["#LearningJourney", "#eLearning", "#OnlineEducation", "#TeachersOfSocialMedia", "#StudyTips", "#LearningTips", "#EducationMatters", "#StudentLife", "#TeachingCommunity", "#EducationalContent"],
  travel: ["#TravelGram", "#Wanderlust", "#TravelPhotography", "#Travelblogger", "#TravelTheWorld", "#TravelTips", "#ExploreMore", "#TravelAddict", "#AdventureTime", "#TravelLife"]
};

export default function HashtagGenerator() {
  const [activeTab, setActiveTab] = useState("youtube");
  const [keywords, setKeywords] = useState("");
  const [industry, setIndustry] = useState("");
  const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([]);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const { toast } = useToast();

  const platformIcons = {
    youtube: <Youtube className="h-4 w-4 mr-2" />,
    instagram: <Instagram className="h-4 w-4 mr-2" />,
    twitter: <Twitter className="h-4 w-4 mr-2" />,
    facebook: <Facebook className="h-4 w-4 mr-2" />
  };

  const generateHashtags = () => {
    const platform = activeTab as keyof typeof HASHTAG_SETS;
    let result: string[] = [];
    
    // Get platform-specific hashtags
    const platformTags = HASHTAG_SETS[platform];
    let randomCategories = Object.keys(platformTags);
    
    // Add 5-7 random hashtags from the platform's categories
    let count = Math.floor(Math.random() * 3) + 5; // 5 to 7 hashtags
    for (let i = 0; i < count; i++) {
      const randomCategory = randomCategories[Math.floor(Math.random() * randomCategories.length)];
      const categoryTags = platformTags[randomCategory as keyof typeof platformTags];
      const randomTag = categoryTags[Math.floor(Math.random() * categoryTags.length)];
      if (!result.includes(randomTag)) {
        result.push(randomTag);
      }
    }
    
    // Add industry-specific hashtags if selected
    if (industry && INDUSTRY_HASHTAGS[industry as keyof typeof INDUSTRY_HASHTAGS]) {
      const industryTags = INDUSTRY_HASHTAGS[industry as keyof typeof INDUSTRY_HASHTAGS];
      const randomIndustryTags = industryTags
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      result = [...result, ...randomIndustryTags];
    }
    
    // Add keyword-based hashtags
    if (keywords.trim()) {
      const keywordList = keywords.split(',').map(k => k.trim());
      const keywordTags = keywordList.map(k => `#${k.replace(/\s+/g, '')}`);
      result = [...result, ...keywordTags];
    }
    
    // Shuffle the array for random order
    result = result.sort(() => 0.5 - Math.random());
    
    setGeneratedHashtags(result);
  };

  const copyToClipboard = () => {
    const textToCopy = selectedHashtags.length > 0 
      ? selectedHashtags.join(' ') 
      : generatedHashtags.join(' ');
      
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: "Copied to clipboard!",
      description: "Hashtags have been copied to your clipboard."
    });
  };

  const toggleHashtag = (hashtag: string) => {
    if (selectedHashtags.includes(hashtag)) {
      setSelectedHashtags(selectedHashtags.filter(tag => tag !== hashtag));
    } else {
      setSelectedHashtags([...selectedHashtags, hashtag]);
    }
  };

  const refreshHashtags = () => {
    generateHashtags();
  };

  return (
    <div className="container mx-auto py-6">
      <Helmet>
        <title>Hashtag Generator | SocialSync</title>
        <meta 
          name="description" 
          content="Generate effective hashtags for YouTube, Instagram, Twitter, and Facebook to increase your social media reach and engagement."
        />
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-6">Hashtag Generator</h1>
      <p className="text-muted-foreground mb-6">
        Generate platform-specific hashtags to increase your content's reach and engagement.
      </p>
      
      <div className="grid gap-6 md:grid-cols-8">
        <div className="md:col-span-5">
          <Card>
            <CardHeader>
              <CardTitle>Generate Hashtags</CardTitle>
              <CardDescription>
                Choose a platform and customize your hashtags
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="youtube">
                    {platformIcons.youtube}
                    YouTube
                  </TabsTrigger>
                  <TabsTrigger value="instagram">
                    {platformIcons.instagram}
                    Instagram
                  </TabsTrigger>
                  <TabsTrigger value="twitter">
                    {platformIcons.twitter}
                    Twitter
                  </TabsTrigger>
                  <TabsTrigger value="facebook">
                    {platformIcons.facebook}
                    Facebook
                  </TabsTrigger>
                </TabsList>
                
                {/* Common content for all tabs */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Keywords (comma separated)</label>
                    <Input 
                      placeholder="marketing, social media, small business"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Industry (optional)</label>
                    <select 
                      className="w-full h-10 rounded-md border border-input px-3 py-2 text-sm ring-offset-background"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                    >
                      <option value="">Select an industry</option>
                      <option value="retail">Retail</option>
                      <option value="realestate">Real Estate</option>
                      <option value="fitness">Fitness</option>
                      <option value="beauty">Beauty</option>
                      <option value="food">Food & Restaurant</option>
                      <option value="gaming">Gaming</option>
                      <option value="music">Music</option>
                      <option value="moviereview">Movie Reviews</option>
                      <option value="movieexplain">Movie Analysis</option>
                      <option value="technology">Technology</option>
                      <option value="education">Education</option>
                      <option value="travel">Travel</option>
                    </select>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={generateHashtags}
                  >
                    Generate Hashtags
                  </Button>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Your Hashtags</span>
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={refreshHashtags} 
                    disabled={generatedHashtags.length === 0}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={copyToClipboard} 
                    disabled={generatedHashtags.length === 0}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Click on hashtags to select for copying
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedHashtags.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  Generate hashtags to see them here
                </div>
              ) : (
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {generatedHashtags.map((tag, index) => (
                        <Badge 
                          key={index}
                          variant={selectedHashtags.includes(tag) ? "default" : "outline"} 
                          className="cursor-pointer text-sm py-1 px-2"
                          onClick={() => toggleHashtag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    {selectedHashtags.length > 0 && (
                      <div className="mt-6 pt-4 border-t">
                        <div className="font-medium text-sm mb-2">Selected hashtags:</div>
                        <Textarea 
                          readOnly 
                          className="text-sm"
                          value={selectedHashtags.join(' ')} 
                          rows={3}
                        />
                      </div>
                    )}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Hashtag Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-lg mb-2">Best Practices</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Use 3-5 hashtags on Twitter</li>
                  <li>Use 5-10 hashtags on Facebook</li>
                  <li>Use 10-15 hashtags on Instagram</li>
                  <li>Use 3-5 hashtags on YouTube</li>
                  <li>Mix popular and niche hashtags</li>
                  <li>Research trending hashtags in your industry</li>
                  <li>Create a branded hashtag for your business</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2">Platform-Specific Tips</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li><strong>Instagram:</strong> Can place hashtags in comments to keep caption clean</li>
                  <li><strong>Twitter:</strong> Hashtags are clickable and lead to search results</li>
                  <li><strong>Facebook:</strong> Use fewer, more specific hashtags</li>
                  <li><strong>YouTube:</strong> Add hashtags in title (max 3 show above title) and description</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}