import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUserApplications } from "@/hooks/useUserApplications";
import { ArrowLeft, FileText, Mail, Phone, MapPin, Calendar, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const statusConfig = {
  new: { label: "Nouveau", variant: "default" as const },
  reviewed: { label: "En révision", variant: "secondary" as const },
  shortlisted: { label: "Présélectionné", variant: "default" as const },
  interview: { label: "Entretien planifié", variant: "default" as const },
  rejected: { label: "Rejeté", variant: "destructive" as const },
  converted: { label: "Converti", variant: "default" as const },
};

export default function MyApplications() {
  const navigate = useNavigate();
  const { data: applications, isLoading } = useUserApplications();

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="space-y-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/profile")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Mes Candidatures</h1>
          <p className="text-muted-foreground">
            Consultez l'état de vos candidatures
          </p>
        </div>
      </div>

      {/* Applications List */}
      {applications && applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((application) => (
            <Card key={application.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      {application.first_name} {application.last_name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <Mail className="h-4 w-4" />
                      {application.email}
                    </CardDescription>
                  </div>
                  <Badge variant={statusConfig[application.status as keyof typeof statusConfig]?.variant || "secondary"}>
                    {statusConfig[application.status as keyof typeof statusConfig]?.label || application.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    {application.phone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        {application.phone}
                      </div>
                    )}
                    {application.location && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {application.location}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(application.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </div>

                  {/* Experience */}
                  {application.experience_years && (
                    <div className="text-sm">
                      <span className="font-medium">Expérience:</span> {application.experience_years} ans
                    </div>
                  )}

                  {/* Skills */}
                  {application.technical_skills && (
                    <div className="text-sm">
                      <span className="font-medium">Compétences techniques:</span>
                      <p className="text-muted-foreground mt-1">{application.technical_skills}</p>
                    </div>
                  )}

                  {/* Documents */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {application.cv_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(application.cv_url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        CV
                      </Button>
                    )}
                    {application.motivation_letter_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(application.motivation_letter_url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Lettre de motivation
                      </Button>
                    )}
                  </div>

                  {/* Notes */}
                  {application.notes && (
                    <div className="mt-3 p-3 bg-muted rounded-lg text-sm">
                      <span className="font-medium">Notes:</span>
                      <p className="text-muted-foreground mt-1">{application.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune candidature</h3>
            <p className="text-muted-foreground text-center mb-4">
              Vous n'avez pas encore soumis de candidature.
            </p>
            <Button onClick={() => navigate("/postuler")}>
              Soumettre une candidature
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
