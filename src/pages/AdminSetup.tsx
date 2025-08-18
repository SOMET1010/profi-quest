import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function AdminSetup() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const assignAdminRole = async () => {
    if (!user?.id) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour obtenir le rôle admin",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // First check if any admin already exists
      const { data: existingAdmins, error: checkError } = await supabase
        .from('user_roles')
        .select('id')
        .eq('role', 'admin')
        .limit(1);

      if (checkError) {
        console.error('Error checking existing admins:', checkError);
        toast({
          title: "Erreur",
          description: "Erreur lors de la vérification des administrateurs existants",
          variant: "destructive"
        });
        return;
      }

      // If admins already exist, don't allow self-assignment
      if (existingAdmins && existingAdmins.length > 0) {
        toast({
          title: "Accès refusé",
          description: "Un administrateur existe déjà. Contactez l'administrateur pour obtenir des permissions.",
          variant: "destructive"
        });
        return;
      }

      // Insert admin role only if no admin exists
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: user.id,
          role: 'admin'
        });

      if (error) {
        console.error('Error assigning admin role:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'attribuer le rôle admin: " + error.message,
          variant: "destructive"
        });
      } else {
        setIsCompleted(true);
        toast({
          title: "Succès",
          description: "Rôle administrateur attribué avec succès! Rechargez la page.",
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-green-600">Configuration terminée</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Le rôle administrateur a été attribué avec succès.
            </p>
            <Button 
              onClick={() => window.location.reload()}
              className="w-full"
            >
              Recharger la page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
          <CardTitle>Configuration Administrateur</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <span className="font-medium text-sm">Configuration de développement</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Cliquez sur le bouton ci-dessous pour vous attribuer le rôle administrateur 
                et accéder à toutes les fonctionnalités de la plateforme.
              </p>
            </div>
            
            {user && (
              <div className="text-sm text-muted-foreground">
                <strong>Utilisateur:</strong> {user.email}
              </div>
            )}
            
            <Button 
              onClick={assignAdminRole}
              disabled={isLoading || !user}
              className="w-full"
            >
              {isLoading ? "Attribution en cours..." : "Devenir Administrateur"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}