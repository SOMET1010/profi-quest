import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStats } from "@/hooks/useStats";
import { BarChart3, TrendingUp, Download, Calendar, Users, Target } from "lucide-react";

export default function Analytics() {
  const { data: stats, isLoading } = useStats();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-4">Tableau de Bord Analytics</h1>
              <p className="text-lg text-muted-foreground">
                Analysez vos données et générez des rapports détaillés
              </p>
            </div>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
              <Download className="mr-2 h-4 w-4" />
              Exporter Rapport
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card border-0 bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Experts Totaux</p>
                  <p className="text-3xl font-bold text-foreground">
                    {stats?.totalExperts?.toLocaleString() || "0"}
                  </p>
                  <p className="text-sm text-success flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +12% ce mois
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0 bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Taux de Qualification</p>
                  <p className="text-3xl font-bold text-foreground">
                    {stats ? Math.round((stats.qualifiedProfiles / stats.totalExperts) * 100) : 0}%
                  </p>
                  <p className="text-sm text-success flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +5% ce mois
                  </p>
                </div>
                <div className="p-3 bg-success/10 rounded-full">
                  <Target className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0 bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Taux de Réponse</p>
                  <p className="text-3xl font-bold text-foreground">
                    {stats?.responseRate || 0}%
                  </p>
                  <p className="text-sm text-success flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +8% ce mois
                  </p>
                </div>
                <div className="p-3 bg-warning/10 rounded-full">
                  <BarChart3 className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0 bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Missions Actives</p>
                  <p className="text-3xl font-bold text-foreground">
                    {stats?.activeMissions || 0}
                  </p>
                  <p className="text-sm text-success flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +15% ce mois
                  </p>
                </div>
                <div className="p-3 bg-info/10 rounded-full">
                  <Calendar className="h-6 w-6 text-info" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="shadow-card border-0 bg-gradient-card">
            <CardHeader>
              <CardTitle>Évolution des Profils</CardTitle>
              <CardDescription>
                Nombre de profils ajoutés au fil du temps
              </CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="h-16 w-16 mx-auto mb-4" />
                <p>Graphique d'évolution des profils</p>
                <p className="text-sm">(À implémenter avec les données réelles)</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0 bg-gradient-card">
            <CardHeader>
              <CardTitle>Répartition par Compétences</CardTitle>
              <CardDescription>
                Distribution des experts par domaine
              </CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Target className="h-16 w-16 mx-auto mb-4" />
                <p>Répartition par compétences</p>
                <p className="text-sm">(À implémenter avec les données réelles)</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="shadow-card border-0 bg-gradient-card">
          <CardHeader>
            <CardTitle>Activité Récente</CardTitle>
            <CardDescription>
              Dernières actions sur la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-primary mr-3" />
                  <div>
                    <p className="font-medium">Import de profils réussi</p>
                    <p className="text-sm text-muted-foreground">247 nouveaux profils ajoutés</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Il y a 2h</p>
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center">
                  <Target className="h-5 w-5 text-success mr-3" />
                  <div>
                    <p className="font-medium">Nouvelle campagne lancée</p>
                    <p className="text-sm text-muted-foreground">Experts en IA - Mission gouvernementale</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Il y a 5h</p>
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center">
                  <BarChart3 className="h-5 w-5 text-warning mr-3" />
                  <div>
                    <p className="font-medium">Rapport généré</p>
                    <p className="text-sm text-muted-foreground">Analyse mensuelle exportée</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Hier</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}