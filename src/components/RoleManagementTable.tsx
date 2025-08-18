import { UserPlus, Trash2, Shield, User, Users } from "lucide-react";
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
import { AppRole } from "@/hooks/useRole";

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

const getRoleIcon = (role?: AppRole) => {
  switch (role) {
    case 'admin':
      return <Shield className="h-4 w-4 text-destructive" />;
    case 'hr_manager':
      return <Users className="h-4 w-4 text-primary" />;
    case 'expert':
      return <User className="h-4 w-4 text-accent-foreground" />;
    default:
      return <User className="h-4 w-4 text-muted-foreground" />;
  }
};

const getRoleBadge = (role?: AppRole) => {
  switch (role) {
    case 'admin':
      return <Badge variant="destructive">Administrateur</Badge>;
    case 'hr_manager':
      return <Badge variant="default">Gestionnaire RH</Badge>;
    case 'expert':
      return <Badge variant="secondary">Expert</Badge>;
    default:
      return <Badge variant="outline">Aucun rôle</Badge>;
  }
};

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
      <div className="text-center py-8">
        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
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
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                      {getUserInitials(user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{user.email}</p>
                    <p className="text-sm text-muted-foreground">ID: {user.id.slice(0, 8)}...</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getRoleIcon(user.role)}
                  {getRoleBadge(user.role)}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(user.created_at)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {user.role_created_at ? formatDate(user.role_created_at) : '-'}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAssignRole(user)}
                    className="flex items-center gap-1"
                  >
                    <UserPlus className="h-3 w-3" />
                    {user.role ? 'Modifier' : 'Assigner'}
                  </Button>
                  {user.role && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRemoveRole(user.id)}
                      className="flex items-center gap-1 hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="h-3 w-3" />
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