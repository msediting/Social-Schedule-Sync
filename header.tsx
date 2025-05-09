import { Link, useLocation } from "wouter";
import { Search, Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import PostCreator from "@/components/post-creator";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const [location] = useLocation();
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  const tabs = [
    { name: "Overview", href: "/" },
    { name: "Calendar", href: "/calendar" },
    { name: "Scheduled Posts", href: "/scheduled" },
    { name: "Templates", href: "/templates" },
  ];

  return (
    <header className="bg-white shadow-sm z-10 relative">
      <div className="flex items-center justify-between p-4">
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Input 
              type="text" 
              placeholder="Search..." 
              className="bg-gray-100 rounded-md py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary-500 focus:bg-white w-64"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
          </div>
          
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-500 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>
          
          {/* Create Post Button */}
          <Button 
            onClick={() => setIsCreatingPost(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600"
          >
            <Plus className="mr-1 h-4 w-4" />
            Create Post
          </Button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="px-4 border-b border-gray-200">
        <div className="flex -mb-px space-x-8">
          {tabs.map((tab) => {
            const isActive = location === tab.href;
            return (
              <Link 
                key={tab.name} 
                href={tab.href}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  isActive 
                    ? "border-primary-500 text-primary-600" 
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.name}
              </Link>
            );
          })}
        </div>
      </div>
      
      {/* Post Creator Modal */}
      <PostCreator 
        isOpen={isCreatingPost} 
        onClose={() => setIsCreatingPost(false)}
      />
    </header>
  );
}
