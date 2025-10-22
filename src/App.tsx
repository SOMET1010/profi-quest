import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useSearchParams } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/AppLayout";

// Lazy load pages for code splitting
const Home = lazy(() => import("./pages/Home"));
const PublicCandidature = lazy(() => import("./pages/PublicCandidature"));
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ImportProfiles = lazy(() => import("./pages/ImportProfiles"));
const Database = lazy(() => import("./pages/Database"));
const ExpertDetail = lazy(() => import("./pages/ExpertDetail"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Qualification = lazy(() => import("./pages/Qualification"));
const Auth = lazy(() => import("./pages/Auth"));
const RoleManagement = lazy(() => import("./pages/RoleManagement"));
const PermissionManagement = lazy(() => import("./pages/PermissionManagement"));
const FormBuilder = lazy(() => import("./pages/FormBuilder"));

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

// Error handler component
const ErrorHandler = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (error || errorDescription) {
      toast.error('Erreur d\'authentification', {
        description: errorDescription || error || 'Une erreur est survenue'
      });
    }
  }, [searchParams]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}>
          <ErrorHandler />
          <Suspense fallback={<PageFallback />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/postuler" element={<PublicCandidature />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Protected Routes - Dashboard */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <AppLayout><Index /></AppLayout>
                </ProtectedRoute>
              } />
              {/* Redirect /candidature to /postuler */}
              <Route path="/candidature" element={<PublicCandidature />} />
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
              <Route path="/expert/:id" element={
                <ProtectedRoute>
                  <AppLayout><ExpertDetail /></AppLayout>
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
              <Route path="/admin/permissions" element={
                <ProtectedRoute>
                  <AppLayout><PermissionManagement /></AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/form-builder" element={
                <ProtectedRoute>
                  <FormBuilder />
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
