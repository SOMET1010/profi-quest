import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserPlus, Mail, Phone, Calendar, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface PublicApplication {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  location: string | null;
  experience_years: number | null;
  status: string;
  created_at: string;
  cv_url: string | null;
  motivation_letter_url: string | null;
}

const statusColors = {
  new: "bg-blue-500",
  reviewed: "bg-yellow-500",
  converted: "bg-green-500",
  rejected: "bg-red-500",
};

const statusLabels = {
  new: "Nouveau",
  reviewed: "En cours",
  converted: "Converti",
  rejected: "Rejeté",
};

export function PublicApplicationsSection() {
  const { data: applications, isLoading } = useQuery({
    queryKey: ["public-applications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("public_applications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as PublicApplication[];
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nouvelles candidatures publiques</CardTitle>
          <CardDescription>Chargement...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const newApplicationsCount = applications?.filter(app => app.status === 'new').length || 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Nouvelles candidatures publiques
            </CardTitle>
            <CardDescription>
              Candidatures reçues via le formulaire public
            </CardDescription>
          </div>
          {newApplicationsCount > 0 && (
            <Badge variant="destructive" className="text-lg px-4 py-2">
              {newApplicationsCount} nouveau{newApplicationsCount > 1 ? 'x' : ''}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!applications || applications.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Aucune candidature publique pour le moment
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidat</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Expérience</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <div className="font-medium">
                        {app.first_name} {app.last_name}
                      </div>
                      {app.location && (
                        <div className="text-sm text-muted-foreground">
                          {app.location}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3" />
                          <a href={`mailto:${app.email}`} className="text-primary hover:underline">
                            {app.email}
                          </a>
                        </div>
                        {app.phone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {app.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {app.experience_years !== null ? (
                        <span>{app.experience_years} an{app.experience_years > 1 ? 's' : ''}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(app.created_at), "d MMM yyyy", { locale: fr })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[app.status as keyof typeof statusColors]}>
                        {statusLabels[app.status as keyof typeof statusLabels]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        {app.cv_url && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(app.cv_url!, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            CV
                          </Button>
                        )}
                        {app.motivation_letter_url && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(app.motivation_letter_url!, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            LM
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
