import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, TrendingUp, PieChart } from "lucide-react";

interface DashboardChartsProps {
  isLoading?: boolean;
  stats?: any;
}

export default function DashboardCharts({ isLoading, stats }: DashboardChartsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        <Card className="shadow-card border-0 bg-gradient-card">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
        <Card className="shadow-card border-0 bg-gradient-card">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12 content-[auto] contain-intrinsic-size-[1px_400px]">
      <Card className="shadow-card border-0 bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <BarChart3 className="mr-2 h-5 w-5 text-primary" />
            Évolution des Candidatures
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 text-primary/50" />
              <p>Graphique disponible prochainement</p>
              <p className="text-sm">Données: {stats?.pendingApplications || 0} candidatures</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card border-0 bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <PieChart className="mr-2 h-5 w-5 text-primary" />
            Répartition par Domaine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <PieChart className="h-12 w-12 mx-auto mb-4 text-primary/50" />
              <p>Graphique disponible prochainement</p>
              <p className="text-sm">Experts: {stats?.totalExperts || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}