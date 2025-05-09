import Header from "@/components/layout/header";
import BrandProfile from "@/components/brand-profile";
import AnalyticsCards from "@/components/analytics-cards";
import ContentCalendar from "@/components/content-calendar";
import TemplateLibrary from "@/components/template-library";
import UpcomingPosts from "@/components/upcoming-posts";
import { Helmet } from "react-helmet";

export default function Dashboard() {
  return (
    <>
      <Helmet>
        <title>Dashboard - SocialSync</title>
        <meta name="description" content="Manage your social media content, view analytics, and schedule posts from your SocialSync dashboard." />
      </Helmet>

      <div>
        <Header title="Dashboard" />
        
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          {/* Brand Profile */}
          <BrandProfile />
          
          {/* Analytics & Quick Actions */}
          <AnalyticsCards />
          
          {/* Content Calendar */}
          <ContentCalendar />
          
          {/* Post Templates */}
          <TemplateLibrary />
          
          {/* Upcoming Posts */}
          <UpcomingPosts />
        </div>
      </div>
    </>
  );
}
