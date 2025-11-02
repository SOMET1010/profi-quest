import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Clock, Eye, Mail, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface PendingApplication {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  created_at: string;
}

const statusConfig = {
  new: { label: "Nouveau", color: "bg-blue-500" },
  reviewed: { label: "Examiné", color: "bg-yellow-500" },
  shortlisted: { label: "Présélectionné", color: "bg-purple-500" },
};

export const PendingApplicationsWidget = () => {
  const navigate = useNavigate();

  const { data: applications, isLoading } = useQuery({
    queryKey: ["pending-applications-widget"],
    queryFn: async (): Promise<PendingApplication[]> => {
      const { data, error } = await supabase
        .from("public_applications")
        .select("id, first_name, last_name, email, status, created_at")
        .in("status", ["new", "reviewed", "shortlisted"])
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data || [];
    },
    staleTime: 60_000, // 1 minute
  });

  return (
    <Card className="shadow-card border-0 bg-gradient-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Candidatures en Attente
            </CardTitle>
            <CardDescription className="mt-2">
              Les candidatures les plus récentes nécessitant une action
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/admin/candidatures")}
            className="border-primary text-primary hover:bg-primary/5"
          >
            Voir toutes
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : applications && applications.length > 0 ? (
          <div className="space-y-3">
            {applications.map((app) => {
              const statusInfo =
                statusConfig[app.status as keyof typeof statusConfig] ||
                statusConfig.new;
              
              return (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                  onClick={() => navigate("/admin/candidatures")}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">
                        {app.first_name} {app.last_name}
                      </p>
                      <Badge className={`${statusInfo.color} text-xs`}>
                        {statusInfo.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {app.email}
                      </span>
                      <span>
                        {format(new Date(app.created_at), "dd MMM yyyy", {
                          locale: fr,
                        })}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/admin/candidatures");
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Aucune candidature en attente</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
