import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/layout/sidebar";
import Dashboard from "@/pages/dashboard";
import Calendar from "@/pages/calendar";
import Templates from "@/pages/templates";
import Analytics from "@/pages/analytics";
import Settings from "@/pages/settings";
import YouTube from "@/pages/youtube";
import Hashtags from "@/pages/hashtags";

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50">
        {children}
      </main>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => (
        <AppLayout>
          <Dashboard />
        </AppLayout>
      )} />
      <Route path="/calendar" component={() => (
        <AppLayout>
          <Calendar />
        </AppLayout>
      )} />
      <Route path="/templates" component={() => (
        <AppLayout>
          <Templates />
        </AppLayout>
      )} />
      <Route path="/analytics" component={() => (
        <AppLayout>
          <Analytics />
        </AppLayout>
      )} />
      <Route path="/settings" component={() => (
        <AppLayout>
          <Settings />
        </AppLayout>
      )} />
      <Route path="/youtube" component={() => (
        <AppLayout>
          <YouTube />
        </AppLayout>
      )} />
      <Route path="/hashtags" component={() => (
        <AppLayout>
          <Hashtags />
        </AppLayout>
      )} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
