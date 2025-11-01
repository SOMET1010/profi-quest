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
  Plus,
  Search,
  Filter,
  TrendingUp,
  Clock,
  CheckCircle,
  LogOut,
  UserCircle
} from "lucide-react";
import { lazy, Suspense } from "react";
import heroImage from "@/assets/ansut-cote-divoire-background.jpg";
import ansutLogo from "/lovable-uploads/eebdb674-f051-486d-bb7c-acc1f973cde9.png";
import { useStats } from "@/hooks/useStats";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigationPreload } from "@/hooks/useNavigationPreload";
import { useHasRole } from "@/hooks/useRole";

// Lazy load the charts component
const DashboardCharts = lazy(() => import("@/components/DashboardCharts"));

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { hasRole: isDG, userRole } = useHasRole('DG');
  const { hasRole: isDRH } = useHasRole('DRH');
  const { data: stats, isLoading: statsLoading } = useStats();
  const {
    preloadImportProfiles,
    preloadDatabase,
    preloadAnalytics,
    preloadQualification,
    preloadPublicCandidature,
  } = useNavigationPreload();

  const handleSignOut = async () => {
    await signOut();
  };

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
      requiredRole: "RH_ASSISTANT" as const
    },
    {
      icon: UserCheck,
      title: "Qualification Dynamique",
      description: "Envoyez des formulaires personnalisés pour enrichir les profils",
      status: "pending",
      count: `${stats?.pendingApplications || 0} en cours`,
      color: "bg-warning",
      path: "/qualification",
      requiredRole: "RH_ASSISTANT" as const
    },
    {
      icon: BarChart3,
      title: "Tableau de Bord",
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
    const roleHierarchy = { 
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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-hero text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
          <img 
            src={heroImage}
            alt="QUALI-RH EXPERTS - Plateforme de gestion d'experts"
            className="absolute inset-0 w-full h-full object-cover opacity-10"
            loading="lazy"
            decoding="async"
          />
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="flex justify-between items-start">
            <div className="max-w-4xl">
              <div className="flex items-center mb-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mr-6">
                  <img 
                    src={ansutLogo} 
                    alt="ANSUT - Agence Nationale du Service Universel des Télécommunications" 
                    className="h-20 w-40 object-contain"
                    loading="eager"
                    decoding="async"
                    width="160"
                    height="80"
                  />
                </div>
                <div>
                  <h1 className="text-5xl font-bold font-sans">
                    QUALI-RH EXPERTS
                  </h1>
                  <p className="text-lg text-white/90 mt-2 font-medium">
                    Agence Nationale du Service Universel des Télécommunications
                  </p>
                  <p className="text-sm text-primary-glow/80 uppercase tracking-wide">
                    Plateforme de Gestion d'Experts
                  </p>
                </div>
              </div>
              <p className="text-xl mb-8 text-white/90">
                Plateforme complète de gestion, qualification et mobilisation d'experts thématiques
              </p>
              <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                variant="secondary" 
                className="bg-white text-primary hover:bg-white/90"
                onClick={() => navigate('/profile')}
              >
                <UserCircle className="mr-2 h-5 w-5" />
                Voir mon profil
              </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10"
                  onClick={() => navigate('/database')}
                  onMouseEnter={preloadDatabase}
                  onFocus={preloadDatabase}
                >
                  <Search className="mr-2 h-5 w-5" />
                  Rechercher Expert
                </Button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/80 mb-4">Connecté en tant que:</p>
              <p className="text-white font-semibold mb-4">{user?.email}</p>
              <Button 
                variant="outline" 
                size="sm"
                className="border-white text-white hover:bg-white/10"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Se déconnecter
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 content-[auto] contain-intrinsic-size-[1px_160px]">
          {statsLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-32" />
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
                        <TrendingUp className="h-4 w-4 mr-1" />
                        {stat.trend}
                      </p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-full">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Charts Section - Lazy Loaded */}
        <Suspense fallback={
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
          </div>
        }>
          <DashboardCharts isLoading={statsLoading} stats={stats} />
        </Suspense>

        {/* Module Cards */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-foreground">Modules Fonctionnels</h2>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
              <Filter className="mr-2 h-4 w-4" />
              Filtrer
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {modules.map((module, index) => (
              <Card 
                key={index} 
                className="shadow-card border-0 bg-gradient-card hover:shadow-elegant transition-all duration-300 group cursor-pointer"
                onClick={() => navigate(module.path)}
                onMouseEnter={() => {
                  if (module.path === '/import') preloadImportProfiles();
                  if (module.path === '/database') preloadDatabase();
                  if (module.path === '/analytics') preloadAnalytics();
                  if (module.path === '/qualification') preloadQualification();
                }}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-full ${module.color} text-white`}>
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
                    <Button variant="ghost" size="sm" className="group-hover:bg-primary/10">
                      Accéder →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-card border-0 bg-gradient-card">
          <CardHeader>
            <CardTitle className="text-2xl">Actions Rapides</CardTitle>
            <CardDescription>
              Accédez rapidement aux fonctionnalités les plus utilisées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                className="h-16 text-left justify-start bg-gradient-primary hover:opacity-90" 
                size="lg"
                onClick={() => navigate('/import')}
                onMouseEnter={preloadImportProfiles}
                onFocus={preloadImportProfiles}
              >
                <FileSpreadsheet className="mr-3 h-6 w-6" />
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
                onFocus={preloadAnalytics}
              >
                <BarChart3 className="mr-3 h-6 w-6" />
                <div>
                  <div className="font-semibold">Rapport</div>
                  <div className="text-sm">Générer analyse</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}