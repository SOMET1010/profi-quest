import { useState } from "react";
import { Shield, Users, User, UserCheck, UserCog, Crown, Terminal, Settings, UserPlus, Briefcase } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AppRole } from "@/hooks/useUnifiedRole";

interface UserWithRole {
  id: string;
  email: string;
  created_at: string;
  role?: AppRole;
  role_created_at?: string;
}

interface AssignRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserWithRole | null;
  onAssignRole: (role: AppRole) => void;
  isLoading: boolean;
}

const roles: Array<{
  value: AppRole;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}> = [
  {
    value: 'SUPERADMIN',
    label: 'Super Administrateur',
    description: 'Accès complet au système sans restriction. Gère tous les aspects de la plateforme.',
    icon: Crown,
    color: 'text-yellow-600 dark:text-yellow-400',
  },
  {
    value: 'DG',
    label: 'Directeur Général',
    description: 'Accès complet, gestion stratégique et validation finale.',
    icon: Shield,
    color: 'text-purple-600 dark:text-purple-400',
  },
  {
    value: 'SI',
    label: 'Système d\'Information',
    description: 'Accès technique complet, administration système.',
    icon: Settings,
    color: 'text-blue-600 dark:text-blue-400',
  },
  {
    value: 'DRH',
    label: 'Directeur RH',
    description: 'Gestion complète RH, validation des recrutements.',
    icon: Users,
    color: 'text-green-600 dark:text-green-400',
  },
  {
    value: 'RDRH',
    label: 'Responsable DRH',
    description: 'Supervision RH, validation intermédiaire.',
    icon: UserCheck,
    color: 'text-teal-600 dark:text-teal-400',
  },
  {
    value: 'RH_ASSISTANT',
    label: 'Assistant RH',
    description: 'Traitement des candidatures, saisie.',
    icon: UserPlus,
    color: 'text-cyan-600 dark:text-cyan-400',
  },
  {
    value: 'CONSULTANT',
    label: 'Consultant Expert',
    description: 'Consultation du profil expert, missions.',
    icon: Briefcase,
    color: 'text-orange-600 dark:text-orange-400',
  },
  {
    value: 'POSTULANT',
    label: 'Postulant',
    description: 'Soumission candidature uniquement.',
    icon: User,
    color: 'text-gray-600 dark:text-gray-400',
  },
];

const getUserInitials = (email: string) => {
  return email.split('@')[0].substring(0, 2).toUpperCase();
};

export function AssignRoleDialog({
  open,
  onOpenChange,
  user,
  onAssignRole,
  isLoading,
}: AssignRoleDialogProps) {
  const [selectedRole, setSelectedRole] = useState<AppRole | null>(user?.role || null);

  const handleAssignRole = () => {
    if (selectedRole) {
      onAssignRole(selectedRole);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSelectedRole(user?.role || null);
    }
    onOpenChange(newOpen);
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Gestion du rôle utilisateur
          </DialogTitle>
          <DialogDescription>
            Sélectionnez le rôle à attribuer à cet utilisateur. Le rôle détermine les permissions et l'accès aux fonctionnalités.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Info */}
          <Card className="border-2">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    {getUserInitials(user.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-muted-foreground">
                      Rôle actuel:
                    </p>
                    {user.role ? (
                      <Badge variant="secondary" className="font-medium">{user.role}</Badge>
                    ) : (
                      <Badge variant="outline" className="text-destructive border-destructive">
                        Aucun rôle
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role Selection */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Sélectionner un rôle :
            </h4>
            <div className="grid gap-3">
              {roles.map((role) => {
                const isSelected = selectedRole === role.value;
                const Icon = role.icon;
                
                return (
                  <Card
                    key={role.value}
                    className={`cursor-pointer transition-all duration-200 border-2 ${
                      isSelected 
                        ? 'ring-2 ring-primary ring-offset-2 bg-primary/5 border-primary' 
                        : 'hover:bg-muted/50 hover:border-primary/30'
                    }`}
                    onClick={() => setSelectedRole(role.value)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary/10' : 'bg-muted'}`}>
                          <Icon className={`h-5 w-5 ${isSelected ? role.color : 'text-muted-foreground'}`} />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <h5 className="font-semibold text-foreground">
                              {role.label}
                            </h5>
                            {isSelected && (
                              <Badge variant="default" className="text-xs">
                                ✓ Sélectionné
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {role.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            onClick={handleAssignRole}
            disabled={!selectedRole || isLoading}
            className="min-w-[140px]"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Attribution...
              </div>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Attribuer le rôle
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
