import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  FileText,
  Award,
  LogOut
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ansutLogo from "/lovable-uploads/eebdb674-f051-486d-bb7c-acc1f973cde9.png";

export default function ExpertProfile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen w-full p-6 space-y-8">
        {/* Welcome Header - Compact version for sidebar layout */}
        <div className="bg-gradient-hero text-white rounded-xl p-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Espace Expert</h1>
            <p className="text-white/90">QUALI-RH EXPERTS - ANSUT</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
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
                onClick={() => navigate('/candidature')}>
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
                  <Badge variant="outline">75%</Badge>
                </div>
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
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Mission Télécoms</p>
                    <p className="text-xs text-muted-foreground">Candidature envoyée</p>
                  </div>
                  <Badge variant="secondary">En cours</Badge>
                </div>
                <Button variant="outline" className="w-full">
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
                  onClick={() => navigate('/candidature')}
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
    </div>
  );
}