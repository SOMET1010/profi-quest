import { UserPlus, Trash2, Shield, User, Users, Crown, Terminal, UserCheck, UserCog, Settings, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { AppRole } from "@/hooks/useUnifiedRole";

interface UserWithRole {
  id: string;
  email: string;
  created_at: string;
  role?: AppRole;
  role_created_at?: string;
}

interface RoleManagementTableProps {
  users: UserWithRole[];
  isLoading: boolean;
  onAssignRole: (user: UserWithRole) => void;
  onRemoveRole: (userId: string) => void;
}

function getRoleIcon(role?: AppRole) {
  switch (role) {
    case 'SUPERADMIN':
      return <Crown className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />;
    case 'DG':
      return <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />;
    case 'SI':
      return <Settings className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
    case 'DRH':
      return <Users className="h-4 w-4 text-green-600 dark:text-green-400" />;
    case 'RDRH':
      return <UserCheck className="h-4 w-4 text-teal-600 dark:text-teal-400" />;
    case 'RH_ASSISTANT':
      return <UserPlus className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />;
    case 'CONSULTANT':
      return <Briefcase className="h-4 w-4 text-orange-600 dark:text-orange-400" />;
    case 'POSTULANT':
      return <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />;
    default:
      return <User className="h-4 w-4 text-muted-foreground" />;
  }
}

function getRoleBadge(role?: AppRole) {
  if (!role) {
    return <Badge variant="outline" className="text-destructive border-destructive">Aucun rôle</Badge>;
  }

  const roleConfig: Record<AppRole, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className?: string }> = {
    SUPERADMIN: { label: "SUPERADMIN", variant: "default", className: "bg-yellow-600 text-white hover:bg-yellow-700" },
    DG: { label: "DG", variant: "default", className: "bg-purple-600 text-white hover:bg-purple-700" },
    SI: { label: "SI", variant: "default", className: "bg-blue-600 text-white hover:bg-blue-700" },
    DRH: { label: "DRH", variant: "default", className: "bg-green-600 text-white hover:bg-green-700" },
    RDRH: { label: "RDRH", variant: "default", className: "bg-teal-600 text-white hover:bg-teal-700" },
    RH_ASSISTANT: { label: "Assistant RH", variant: "secondary" },
    CONSULTANT: { label: "Consultant", variant: "outline" },
    POSTULANT: { label: "Postulant", variant: "outline" },
  };

  const config = roleConfig[role];
  return (
    <Badge variant={config.variant} className={`gap-1 ${config.className || ''}`}>
      {getRoleIcon(role)}
      {config.label}
    </Badge>
  );
}

const getUserInitials = (email: string) => {
  return email.split('@')[0].substring(0, 2).toUpperCase();
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export function RoleManagementTable({
  users,
  isLoading,
  onAssignRole,
  onRemoveRole,
}: RoleManagementTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Aucun utilisateur trouvé
        </h3>
        <p className="text-muted-foreground">
          Aucun utilisateur ne correspond aux critères de recherche.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Utilisateur</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Date d'inscription</TableHead>
            <TableHead>Rôle assigné le</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="hover:bg-muted/50 transition-colors">
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 border-2 border-primary/10">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                      {getUserInitials(user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground">ID: {user.id.slice(0, 8)}...</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {getRoleBadge(user.role)}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(user.created_at)}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {user.role_created_at ? formatDate(user.role_created_at) : (
                  <span className="text-muted-foreground/50">-</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAssignRole(user)}
                    className="flex items-center gap-1.5 hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    {user.role ? 'Modifier' : 'Assigner'}
                  </Button>
                  {user.role && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRemoveRole(user.id)}
                      className="flex items-center gap-1.5 text-destructive border-destructive/30 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Retirer
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
