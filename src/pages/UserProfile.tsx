import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useUserApplications } from "@/hooks/useUserApplications";
import { ArrowLeft, Mail, Phone, MapPin, Briefcase, Calendar, ExternalLink, FileText, Award, Github, Linkedin } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  new: { label: "Nouveau", variant: "default" },
  in_review: { label: "En révision", variant: "secondary" },
  converted: { label: "Converti", variant: "outline" },
  rejected: { label: "Rejeté", variant: "destructive" },
};

const UserProfile = () => {
  const navigate = useNavigate();
  const { data: profile, isLoading: isLoadingProfile } = useUserProfile();
  const { data: applications = [], isLoading: isLoadingApps } = useUserApplications();

  if (isLoadingProfile || isLoadingApps) {
    return (
      <div className="container mx-auto p-6 max-w-5xl">
        <Skeleton className="h-12 w-48 mb-6" />
        <div className="grid gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto p-6 max-w-5xl">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au tableau de bord
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Profil non trouvé</CardTitle>
            <CardDescription>
              Aucun profil trouvé. Veuillez compléter votre candidature.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/postuler")}>
              Soumettre une candidature
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const completionPercentage = (() => {
    const fields = [
      profile.first_name,
      profile.last_name,
      profile.email,
      profile.phone,
      profile.location,
      profile.experience_years,
      profile.technical_skills,
      profile.behavioral_skills,
    ];
    const filledFields = fields.filter(f => f !== null && f !== "").length;
    return Math.round((filledFields / fields.length) * 100);
  })();

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour au tableau de bord
      </Button>

      <div className="grid gap-6">
        {/* Profile Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">
                  {profile.full_name || `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || "Profil"}
                </CardTitle>
                <CardDescription className="mt-2">
                  Membre depuis {format(new Date(profile.created_at), "MMMM yyyy", { locale: fr })}
                </CardDescription>
              </div>
              {profile.application_status && (
                <Badge variant={statusConfig[profile.application_status]?.variant || "default"}>
                  {statusConfig[profile.application_status]?.label || profile.application_status}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <span className="text-sm font-medium">Complétude du profil</span>
              <span className="text-2xl font-bold">{completionPercentage}%</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              {profile.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.email}</span>
                </div>
              )}
              {profile.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.phone}</span>
                </div>
              )}
              {profile.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile.experience_years !== null && (
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.experience_years} ans d'expérience</span>
                </div>
              )}
            </div>

            {/* Social Links */}
            {(profile.linkedin || profile.github) && (
              <div className="flex gap-2 pt-4">
                {profile.linkedin && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn
                    </a>
                  </Button>
                )}
                {profile.github && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={profile.github} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </a>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Skills & Experience */}
        <Card>
          <CardHeader>
            <CardTitle>Compétences & Expérience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.technical_skills && (
              <div>
                <h4 className="text-sm font-medium mb-2">Compétences techniques</h4>
                <p className="text-sm text-muted-foreground">{profile.technical_skills}</p>
              </div>
            )}
            {profile.behavioral_skills && (
              <div>
                <h4 className="text-sm font-medium mb-2">Compétences comportementales</h4>
                <p className="text-sm text-muted-foreground">{profile.behavioral_skills}</p>
              </div>
            )}
            {!profile.technical_skills && !profile.behavioral_skills && (
              <p className="text-sm text-muted-foreground">Aucune compétence renseignée</p>
            )}
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {profile.motivation_letter_url && (
                <Button variant="outline" className="justify-start" asChild>
                  <a href={profile.motivation_letter_url} target="_blank" rel="noopener noreferrer">
                    <FileText className="h-4 w-4 mr-2" />
                    Lettre de motivation
                    <ExternalLink className="h-4 w-4 ml-auto" />
                  </a>
                </Button>
              )}
              {profile.diplomas_url && (
                <Button variant="outline" className="justify-start" asChild>
                  <a href={profile.diplomas_url} target="_blank" rel="noopener noreferrer">
                    <Award className="h-4 w-4 mr-2" />
                    Diplômes
                    <ExternalLink className="h-4 w-4 ml-auto" />
                  </a>
                </Button>
              )}
              {profile.certificates_url && (
                <Button variant="outline" className="justify-start" asChild>
                  <a href={profile.certificates_url} target="_blank" rel="noopener noreferrer">
                    <Award className="h-4 w-4 mr-2" />
                    Certificats
                    <ExternalLink className="h-4 w-4 ml-auto" />
                  </a>
                </Button>
              )}
              {!profile.motivation_letter_url && !profile.diplomas_url && !profile.certificates_url && (
                <p className="text-sm text-muted-foreground">Aucun document disponible</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Applications Summary */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Mes candidatures</CardTitle>
              {applications.length > 0 && (
                <Button variant="outline" size="sm" onClick={() => navigate("/mes-candidatures")}>
                  Voir toutes ({applications.length})
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Aucune candidature trouvée</p>
                <Button onClick={() => navigate("/postuler")}>
                  Soumettre une candidature
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.slice(0, 3).map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{app.first_name} {app.last_name}</p>
                      <p className="text-xs text-muted-foreground">
                        <Calendar className="inline h-3 w-3 mr-1" />
                        {format(new Date(app.created_at), "dd MMM yyyy", { locale: fr })}
                      </p>
                    </div>
                    <Badge variant={statusConfig[app.status]?.variant || "default"}>
                      {statusConfig[app.status]?.label || app.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button onClick={() => navigate("/postuler")} className="flex-1">
            Mettre à jour mon profil
          </Button>
          <Button variant="outline" onClick={() => navigate("/mes-candidatures")} className="flex-1">
            Voir mes candidatures
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
