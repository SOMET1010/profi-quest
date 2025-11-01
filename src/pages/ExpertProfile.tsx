import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  FileText,
  Award,
  LogOut,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useUserApplications } from "@/hooks/useUserApplications";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import ansutLogo from "/lovable-uploads/eebdb674-f051-486d-bb7c-acc1f973cde9.png";

export default function ExpertProfile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: applications, isLoading } = useUserApplications();
  const { data: profile } = useUserProfile();
  const { percentage: completionPercentage, missingFields } = useProfileCompletion(profile);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="p-6 space-y-6">
        {/* Welcome Message */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Bienvenue dans votre espace expert
            </CardTitle>
            <CardDescription>
              Gérez votre profil et consultez vos candidatures en cours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              {user?.email}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Management */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate('/profile')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Mon Profil
              </CardTitle>
              <CardDescription>
                Complétez et mettez à jour vos informations professionnelles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Profil complété</span>
                  <Badge variant="outline">{completionPercentage}%</Badge>
                </div>
                {completionPercentage < 100 && missingFields.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Champs manquants : {missingFields.slice(0, 3).join(', ')}
                    {missingFields.length > 3 && ` +${missingFields.length - 3} autres`}
                  </p>
                )}
                <Button className="w-full mt-4">
                  Voir / Modifier mon profil
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Applications Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Mes Candidatures
              </CardTitle>
              <CardDescription>
                Statut de vos candidatures et missions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {applications && applications.length === 0 && !isLoading && (
                  <Alert className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Aucune candidature</AlertTitle>
                    <AlertDescription>
                      Complétez votre profil pour soumettre votre première candidature.
                      {missingFields.length > 0 && completionPercentage < 100 && (
                        <p className="mt-2 text-sm font-medium">
                          Complétez encore {100 - completionPercentage}% de votre profil
                        </p>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
                
                {isLoading ? (
                  <div className="text-sm text-muted-foreground">Chargement...</div>
                ) : applications && applications.length > 0 ? (
                  <>
                    {applications.slice(0, 2).map((app) => (
                      <div key={app.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{app.first_name} {app.last_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(app.created_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <Badge variant={app.status === 'new' ? 'default' : 'secondary'}>
                          {app.status === 'new' ? 'Nouveau' : 
                           app.status === 'reviewed' ? 'En révision' :
                           app.status === 'converted' ? 'Converti' : app.status}
                        </Badge>
                      </div>
                    ))}
                  </>
                ) : null}
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/mes-candidatures')}
                  disabled={!applications || applications.length === 0}
                >
                  Voir toutes les candidatures
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Actions disponibles</CardTitle>
              <CardDescription>
                Fonctionnalités accessibles depuis votre espace expert
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="h-16 flex-col gap-2"
                  onClick={() => navigate('/profile')}
                >
                  <FileText className="h-5 w-5" />
                  <span className="text-sm">Compléter profil</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-16 flex-col gap-2"
                  disabled
                >
                  <Calendar className="h-5 w-5" />
                  <span className="text-sm">Planifier entretien</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-16 flex-col gap-2"
                  disabled
                >
                  <Award className="h-5 w-5" />
                  <span className="text-sm">Mes certifications</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Besoin d'aide ?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Pour toute question concernant votre candidature ou l'utilisation de la plateforme, 
              contactez notre équipe RH.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>rh@ansut.ci</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>+225 27 XX XX XX XX</span>
              </div>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}