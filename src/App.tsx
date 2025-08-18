import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/AppLayout";

// Lazy load pages for code splitting
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ImportProfiles = lazy(() => import("./pages/ImportProfiles"));
const Database = lazy(() => import("./pages/Database"));
const Campaigns = lazy(() => import("./pages/Campaigns"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Qualification = lazy(() => import("./pages/Qualification"));
const Auth = lazy(() => import("./pages/Auth"));
const Candidature = lazy(() => import("./pages/Candidature"));
const RoleManagement = lazy(() => import("./pages/RoleManagement"));

// Optimized React Query configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000, // 1 minute
      gcTime: 5 * 60_000, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// Loading fallback component
const PageFallback = () => (
  <div className="min-h-screen bg-background p-6">
    <div className="max-w-7xl mx-auto">
      <Skeleton className="h-32 w-full mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <AppLayout><Index /></AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/candidature" element={
                <ProtectedRoute>
                  <AppLayout><Candidature /></AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/import" element={
                <ProtectedRoute>
                  <AppLayout><ImportProfiles /></AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/database" element={
                <ProtectedRoute>
                  <AppLayout><Database /></AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/campaigns" element={
                <ProtectedRoute>
                  <AppLayout><Campaigns /></AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/qualification" element={
                <ProtectedRoute>
                  <AppLayout><Qualification /></AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute>
                  <AppLayout><Analytics /></AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/roles" element={
                <ProtectedRoute>
                  <AppLayout><RoleManagement /></AppLayout>
                </ProtectedRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
