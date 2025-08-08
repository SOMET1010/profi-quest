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
  CheckCircle
} from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import { useStats } from "@/hooks/useStats";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: campaigns, isLoading: campaignsLoading } = useCampaigns(10);

  const modules = [
    {
      icon: FileSpreadsheet,
      title: "Import de Profils",
      description: "Importez vos CVthèques Excel et mappez automatiquement les colonnes",
      status: "active",
      count: `${stats?.totalExperts || 0} profils`,
      color: "bg-gradient-primary",
      path: "/import"
    },
    {
      icon: Users,
      title: "Base de Données",
      description: "Consultez et gérez tous vos profils d'experts qualifiés",
      status: "active", 
      count: `${stats?.qualifiedProfiles || 0} validés`,
      color: "bg-gradient-primary",
      path: "/database"
    },
    {
      icon: UserCheck,
      title: "Qualification Dynamique",
      description: "Envoyez des formulaires personnalisés pour enrichir les profils",
      status: "pending",
      count: `${stats?.pendingApplications || 0} en cours`,
      color: "bg-warning",
      path: "/qualification"
    },
    {
      icon: Megaphone,
      title: "Appels à Candidatures",
      description: "Lancez des campagnes ciblées et gérez les réponses",
      status: "active",
      count: `${stats?.activeCampaigns || 0} actifs`,
      color: "bg-success",
      path: "/campaigns"
    },
    {
      icon: BarChart3,
      title: "Tableau de Bord",
      description: "Analysez vos données et générez des rapports détaillés",
      status: "active",
      count: `${campaigns?.length || 0} rapports`,
      color: "bg-info",
      path: "/analytics"
    }
  ];

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
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold mb-6">
              QUALI-RH EXPERTS
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Plateforme complète de gestion, qualification et mobilisation d'experts thématiques
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                variant="secondary" 
                className="bg-white text-primary hover:bg-white/90"
                onClick={() => navigate('/database')}
              >
                <Plus className="mr-2 h-5 w-5" />
                Nouveau Profil
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
                onClick={() => navigate('/database')}
              >
                <Search className="mr-2 h-5 w-5" />
                Rechercher Expert
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
                onClick={() => navigate('/campaigns')}
              >
                <Megaphone className="mr-3 h-6 w-6" />
                <div>
                  <div className="font-semibold">Nouvel Appel</div>
                  <div className="text-sm">Lancer campagne</div>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="h-16 text-left justify-start border-primary text-primary hover:bg-primary/5" 
                size="lg"
                onClick={() => navigate('/analytics')}
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