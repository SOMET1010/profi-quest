import { useState } from "react";
import { Shield, Users, User } from "lucide-react";
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
import { AppRole } from "@/hooks/useRole";

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
    value: 'DG',
    label: 'Directeur Général',
    description: 'Accès complet à toutes les fonctionnalités, gestion des utilisateurs et paramètres système.',
    icon: Shield,
    color: 'text-destructive',
  },
  {
    value: 'FINANCE',
    label: 'Finance',
    description: 'Gestion des chèques, factures, fournisseurs et finances.',
    icon: Users,
    color: 'text-primary',
  },
  {
    value: 'AGENT',
    label: 'Agent',
    description: 'Accès aux opérations courantes et consultation des données.',
    icon: User,
    color: 'text-accent-foreground',
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Gestion du rôle utilisateur
          </DialogTitle>
          <DialogDescription>
            Sélectionnez le rôle à attribuer à cet utilisateur.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    {getUserInitials(user.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-muted-foreground">
                      Rôle actuel:
                    </p>
                    {user.role ? (
                      <Badge variant="secondary">{user.role}</Badge>
                    ) : (
                      <Badge variant="outline">Aucun rôle</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role Selection */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">
              Sélectionner un rôle :
            </h4>
            <div className="grid gap-3">
              {roles.map((role) => {
                const isSelected = selectedRole === role.value;
                const Icon = role.icon;
                
                return (
                  <Card
                    key={role.value}
                    className={`cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedRole(role.value)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Icon className={`h-5 w-5 mt-0.5 ${role.color}`} />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <h5 className="font-medium text-foreground">
                              {role.label}
                            </h5>
                            {isSelected && (
                              <Badge variant="default" className="text-xs">
                                Sélectionné
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

        <DialogFooter>
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
            className="min-w-[120px]"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Attribution...
              </div>
            ) : (
              'Attribuer le rôle'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}