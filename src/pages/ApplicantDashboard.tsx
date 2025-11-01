import { useAuth } from "@/contexts/AuthContext";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useUserApplications } from "@/hooks/useUserApplications";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  FileText, 
  Calendar, 
  Award,
  Mail,
  Phone,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const statusConfig = {
  new: { label: "Nouveau", variant: "default" as const },
  in_review: { label: "En révision", variant: "secondary" as const },
  shortlisted: { label: "Présélectionné", variant: "default" as const },
  interview: { label: "Entretien", variant: "default" as const },
  rejected: { label: "Rejeté", variant: "destructive" as const },
  accepted: { label: "Accepté", variant: "default" as const },
};

export default function ApplicantDashboard() {
  const { user } = useAuth();
  const { navigateToProfile, navigateToApplications, navigate, ROUTES } = useAppNavigation();
  const { data: applications, isLoading: isLoadingApplications } = useUserApplications();
  const { data: profile } = useUserProfile();
  const { percentage: completionPercentage, missingFields } = useProfileCompletion(profile);

  const recentApplications = applications?.slice(0, 3) || [];
  const hasApplications = (applications?.length || 0) > 0;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Bienvenue, {profile?.full_name || user?.email?.split("@")[0]}</h1>
        <p className="text-muted-foreground">Gérez vos candidatures et votre profil professionnel</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mon Profil */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Mon Profil
            </CardTitle>
            <CardDescription>
              Complétez votre profil pour augmenter vos chances d'être retenu
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Complétude du profil</span>
                <span className="text-sm text-muted-foreground">{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>

            {missingFields.length > 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Profil incomplet</AlertTitle>
                <AlertDescription>
                  Champs manquants : {missingFields.join(", ")}
                </AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={navigateToProfile}
              className="w-full"
            >
              {completionPercentage === 100 ? "Modifier mon profil" : "Compléter mon profil"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate(ROUTES.PUBLIC_SIGNUP)}
            >
              <FileText className="mr-2 h-4 w-4" />
              Nouvelle candidature
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={navigateToApplications}
            >
              <Clock className="mr-2 h-4 w-4" />
              Mes candidatures
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={navigateToProfile}
            >
              <User className="mr-2 h-4 w-4" />
              Modifier mon profil
            </Button>
          </CardContent>
        </Card>

        {/* Applications Status */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  État des candidatures
                </CardTitle>
                <CardDescription>
                  Suivez l'évolution de vos candidatures
                </CardDescription>
              </div>
              {hasApplications && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={navigateToApplications}
                >
                  Voir tout
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingApplications ? (
              <p className="text-center text-muted-foreground py-8">Chargement...</p>
            ) : !hasApplications ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Aucune candidature</AlertTitle>
                <AlertDescription className="mt-2">
                  <p className="mb-3">Vous n'avez pas encore soumis de candidature.</p>
                  {completionPercentage < 100 && (
                    <p className="mb-3 text-amber-600">
                      ⚠️ Complétez d'abord votre profil ({completionPercentage}% complété) pour maximiser vos chances.
                    </p>
                  )}
                  <Button onClick={() => navigate(ROUTES.PUBLIC_SIGNUP)}>
                    Soumettre une candidature
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                {recentApplications.map((application) => {
                  const status = statusConfig[application.status as keyof typeof statusConfig] || statusConfig.new;
                  return (
                    <div
                      key={application.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">Candidature</h3>
                            <Badge variant={status.variant}>{status.label}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Soumis le {new Date(application.created_at).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={navigateToApplications}
                      >
                        Détails
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Need Help */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Besoin d'aide ?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Notre équipe RH est là pour vous accompagner dans votre parcours de candidature.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" size="sm">
                <Mail className="mr-2 h-4 w-4" />
                Contacter le support
              </Button>
              <Button variant="outline" size="sm">
                <Phone className="mr-2 h-4 w-4" />
                Assistance téléphonique
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
