import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, UserPlus, Crown, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RoleStats {
  total: number;
  superadmin: number;
  dg: number;
  si: number;
  drh: number;
  rdrh: number;
  assistant: number;
  consultant: number;
  postulant: number;
  noRole: number;
}

interface RoleStatsCardsProps {
  stats: RoleStats;
}

export function RoleStatsCards({ stats }: RoleStatsCardsProps) {
  const statsConfig = [
    {
      title: "Total Utilisateurs",
      value: stats.total,
      icon: Users,
      color: "text-foreground",
      bgColor: "bg-muted",
      description: "Tous les utilisateurs"
    },
    {
      title: "Super Admins",
      value: stats.superadmin,
      icon: Crown,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-50 dark:bg-yellow-950",
      description: "Accès total"
    },
    {
      title: "Direction Générale",
      value: stats.dg,
      icon: Shield,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950",
      description: "DG"
    },
    {
      title: "Administration",
      value: stats.si + stats.drh + stats.rdrh,
      icon: UserPlus,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      description: "SI + DRH + RDRH"
    },
    {
      title: "Équipe RH",
      value: stats.assistant,
      icon: Users,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950",
      description: "Assistants RH"
    },
    {
      title: "Externes",
      value: stats.consultant + stats.postulant,
      icon: Users,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950",
      description: "Consultants + Postulants"
    },
    {
      title: "Sans Rôle",
      value: stats.noRole,
      icon: AlertCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      description: "À assigner",
      warning: stats.noRole > 0
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
      {statsConfig.map((stat, index) => (
        <Card 
          key={index}
          className={`relative overflow-hidden transition-all hover:shadow-md ${
            stat.warning ? 'border-destructive' : ''
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              {stat.warning && stat.value > 0 && (
                <Badge variant="destructive" className="text-xs">
                  Action requise
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
