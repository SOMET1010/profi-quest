import { useAuth } from "@/contexts/AuthContext";
import { useUnifiedRole } from "@/hooks/useUnifiedRole";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Shield } from "lucide-react";

const getRoleLabel = (role: string | null): string => {
  if (!role) return 'Aucun rôle';
  
  const labels: Record<string, string> = {
    SUPERADMIN: 'Super Administrateur',
    DG: 'Directeur Général',
    SI: 'Service Informatique',
    DRH: 'Directeur RH',
    RDRH: 'Responsable DRH',
    RH_ASSISTANT: 'Assistant RH',
    CONSULTANT: 'Consultant',
    POSTULANT: 'Candidat',
  };
  
  return labels[role] || role;
};

export default function Account() {
  const { user } = useAuth();
  const { role } = useUnifiedRole();

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
          <User className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-4xl font-bold">Mon Compte</h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos informations personnelles et préférences
          </p>
        </div>
      </div>
      
      <div className="grid gap-6">
        <Card className="bg-card/60 backdrop-blur-xl border-border/40 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Informations du compte
            </CardTitle>
            <CardDescription>
              Vos informations d'identification et de connexion
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Adresse email</Label>
              <p className="text-base font-medium">{user?.email}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Identifiant</Label>
              <p className="text-sm font-mono text-muted-foreground">{user?.id}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/60 backdrop-blur-xl border-border/40 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Rôle et permissions
            </CardTitle>
            <CardDescription>
              Votre niveau d'accès dans le système
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Rôle actuel</Label>
              <div>
                <Badge variant="secondary" className="text-base px-4 py-1">
                  {getRoleLabel(role)}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Niveau d'accès</Label>
              <p className="text-sm text-muted-foreground">
                {role === 'SUPERADMIN' && 'Accès complet à toutes les fonctionnalités du système'}
                {role === 'DG' && 'Accès administratif complet avec gestion stratégique'}
                {role === 'SI' && 'Accès administratif avec gestion technique'}
                {(role === 'DRH' || role === 'RDRH') && 'Accès à la gestion des ressources humaines'}
                {role === 'RH_ASSISTANT' && 'Accès aux fonctionnalités RH de base'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
