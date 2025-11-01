import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, 
  FileSpreadsheet, 
  UserCheck, 
  Megaphone, 
  BarChart3,
  Search,
  Filter,
  TrendingUp,
  Clock,
  CheckCircle,
  UserCircle
} from "lucide-react";
import { lazy, Suspense } from "react";
import heroImage from "@/assets/ansut-cote-divoire-background.webp";
import { useStats } from "@/hooks/useStats";
import { useNavigate } from "react-router-dom";
import { useNavigationPreload } from "@/hooks/useNavigationPreload";
import { useHasRole } from "@/hooks/useRole";
import { useHasPermission } from "@/hooks/usePermissions";
import { PublicApplicationsSection } from "./PublicApplicationsSection";

// Lazy load the charts component
const DashboardCharts = lazy(() => import("@/components/DashboardCharts"));

export default function SimpleDashboard() {
  const navigate = useNavigate();
  const { userRole } = useHasRole('DG');
  const { hasPermission: canViewApplications } = useHasPermission('view_all_applications');
  const { data: stats, isLoading: statsLoading } = useStats();
  const {
    preloadImportProfiles,
    preloadDatabase,
    preloadAnalytics,
    preloadQualification,
    preloadPublicCandidature,
  } = useNavigationPreload();

  const allModules = [
    {
      icon: FileSpreadsheet,
      title: "Import de Profils",
      description: "Importez vos CVthèques Excel et mappez automatiquement les colonnes",
      status: "active",
      count: `${stats?.totalExperts || 0} profils`,
      color: "bg-gradient-primary",
      path: "/import",
      requiredRole: "DG" as const
    },
    {
      icon: Users,
      title: "Base de Données",
      description: "Consultez et gérez tous vos profils d'experts qualifiés",
      status: "active", 
      count: `${stats?.qualifiedProfiles || 0} validés`,
      color: "bg-gradient-primary",
      path: "/database",
      requiredRole: "RDRH" as const
    },
    {
      icon: UserCheck,
      title: "Qualification Dynamique",
      description: "Envoyez des formulaires personnalisés pour enrichir les profils",
      status: "pending",
      count: `${stats?.pendingApplications || 0} en cours`,
      color: "bg-warning",
      path: "/qualification",
      requiredRole: "RDRH" as const
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "Analysez vos données et générez des rapports détaillés",
      status: "active",
      count: `${stats?.totalExperts || 0} rapports`,
      color: "bg-info",
      path: "/analytics",
      requiredRole: "DG" as const
    }
  ];

  // Filter modules based on user role
  const modules = allModules.filter(module => {
    // SUPERADMIN has access to everything
    if (userRole === 'SUPERADMIN') return true;
    
    const roleHierarchy = { 
      SUPERADMIN: 15,
      DG: 10, 
      SI: 9, 
      DRH: 8, 
      RDRH: 7, 
      RH_ASSISTANT: 5, 
      CONSULTANT: 3, 
      POSTULANT: 1 
    };
    const userRoleLevel = userRole ? roleHierarchy[userRole] : 0;
    const requiredRoleLevel = roleHierarchy[module.requiredRole];
    return userRoleLevel >= requiredRoleLevel;
  });

  const dashboardStats = [
    { 
      label: "Experts Totaux", 
      value: stats?.totalExperts?.toLocaleString() || "0", 
      trend: "+12%", 
      icon: Users 
    },
    { 
      label: "Profils Qualifiés", 
      value: stats?.qualifiedProfiles?.toLocaleString() || "0", 
      trend: "+8%", 
      icon: CheckCircle 
    },
    { 
      label: "Taux de Réponse", 
      value: `${stats?.responseRate || 0}%`, 
      trend: "+5%", 
      icon: TrendingUp 
    },
    { 
      label: "Missions en Cours", 
      value: stats?.activeMissions?.toString() || "0", 
      trend: "+15%", 
      icon: Clock 
    }
  ];

  return (
    <div className="p-6 space-y-8">
        {/* Welcome Hero Section - Compact */}
        <section
        className="relative bg-gradient-hero text-white rounded-xl overflow-hidden"
        aria-labelledby="hero-heading"
      >
        <div className="absolute inset-0 bg-black/20" />
        <img 
          src={heroImage}
          alt=""
          role="presentation"
          className="absolute inset-0 w-full h-full object-cover opacity-10"
          loading="lazy"
          decoding="async"
          width="1920"
          height="400"
        />
        <div className="relative px-8 py-12">
          <h1 id="hero-heading" className="text-4xl font-bold mb-2">QUALI-RH EXPERTS</h1>
          <p className="text-lg text-white/90 mb-6">
            Plateforme complète de gestion d'experts thématiques ANSUT
          </p>
          <div className="flex gap-4">
            <Button 
              size="lg" 
              variant="secondary" 
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => navigate('/candidature')}
              onMouseEnter={preloadPublicCandidature}
              aria-label="Commencer ma candidature en tant qu'expert"
            >
              <UserCircle className="mr-2 h-5 w-5" aria-hidden="true" />
              Commencer ma candidature
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10"
              onClick={() => navigate('/database')}
              onMouseEnter={preloadDatabase}
              aria-label="Rechercher un expert dans la base de données"
            >
              <Search className="mr-2 h-5 w-5" aria-hidden="true" />
              Rechercher Expert
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">Statistiques principales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-32" aria-label="Chargement des statistiques" />
            ))
          ) : (
            dashboardStats.map((stat, index) => (
              <Card key={index} className="shadow-card border-0 bg-gradient-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-success flex items-center mt-1">
                        <TrendingUp className="h-4 w-4 mr-1" aria-hidden="true" />
                        <span aria-label={`Évolution de ${stat.trend}`}>{stat.trend}</span>
                      </p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-full" aria-hidden="true">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* Charts Section - Lazy Loaded */}
      <Suspense fallback={
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      }>
        <DashboardCharts isLoading={statsLoading} stats={stats} />
      </Suspense>

      {/* Public Applications Section - Only for RH */}
      {canViewApplications && (
        <section aria-labelledby="public-applications-heading" className="mt-8">
          <PublicApplicationsSection />
        </section>
      )}

      {/* Module Cards */}
      <section aria-labelledby="modules-heading">
        <div className="flex items-center justify-between mb-8">
          <h2 id="modules-heading" className="text-3xl font-bold text-foreground">Modules Fonctionnels</h2>
          <Button 
            variant="outline" 
            className="border-primary text-primary hover:bg-primary/5"
            aria-label="Filtrer les modules"
          >
            <Filter className="mr-2 h-4 w-4" aria-hidden="true" />
            Filtrer
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {modules.map((module, index) => (
            <Card 
              key={index} 
              className="shadow-card border-0 bg-gradient-card hover:shadow-elegant transition-all duration-300 group cursor-pointer focus-within:ring-2 focus-within:ring-primary"
              onClick={() => navigate(module.path)}
              onMouseEnter={() => {
                if (module.path === '/import') preloadImportProfiles();
                if (module.path === '/database') preloadDatabase();
                if (module.path === '/analytics') preloadAnalytics();
                if (module.path === '/qualification') preloadQualification();
              }}
              tabIndex={0}
              role="button"
              aria-label={`${module.title}: ${module.description}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(module.path);
                }
              }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-full ${module.color} text-white`} aria-hidden="true">
                    <module.icon className="h-6 w-6" />
                  </div>
                  <Badge 
                    variant={module.status === 'active' ? 'default' : module.status === 'pending' ? 'secondary' : 'outline'}
                    className={module.status === 'active' ? 'bg-success text-success-foreground' : ''}
                  >
                    {module.status === 'active' ? 'Actif' : 'En cours'}
                  </Badge>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {module.title}
                </CardTitle>
                <CardDescription className="text-base">
                  {module.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-primary">{module.count}</span>
                  <span className="text-sm group-hover:text-primary transition-colors" aria-hidden="true">
                    Accéder →
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section aria-labelledby="quick-actions-heading">
        <Card className="shadow-card border-0 bg-gradient-card">
          <CardHeader>
            <CardTitle id="quick-actions-heading" className="text-2xl">Actions Rapides</CardTitle>
            <CardDescription>
              Accédez rapidement aux fonctionnalités les plus utilisées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <nav aria-label="Actions rapides">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  className="h-16 text-left justify-start bg-gradient-primary hover:opacity-90" 
                  size="lg"
                  onClick={() => navigate('/import')}
                  onMouseEnter={preloadImportProfiles}
                  aria-label="Importer une CVthèque Excel"
                >
                  <FileSpreadsheet className="mr-3 h-6 w-6" aria-hidden="true" />
                  <div>
                    <div className="font-semibold">Importer Excel</div>
                    <div className="text-sm opacity-90">Nouvelle CVthèque</div>
                  </div>
                </Button>
                <Button
                  variant="outline" 
                  className="h-16 text-left justify-start border-primary text-primary hover:bg-primary/5" 
                  size="lg"
                  onClick={() => navigate('/analytics')}
                  onMouseEnter={preloadAnalytics}
                  aria-label="Générer un rapport d'analyse"
                >
                  <BarChart3 className="mr-3 h-6 w-6" aria-hidden="true" />
                  <div>
                    <div className="font-semibold">Rapport</div>
                    <div className="text-sm">Générer analyse</div>
                  </div>
                </Button>
              </div>
            </nav>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}