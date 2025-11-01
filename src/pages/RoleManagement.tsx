import { useState } from "react";
import { Users, Shield, UserPlus, Search, Filter } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RoleManagementTable } from "@/components/RoleManagementTable";
import { AssignRoleDialog } from "@/components/AssignRoleDialog";
import { RoleStatsCards } from "@/components/RoleStatsCards";
import { toast } from "sonner";
import { AppRole } from "@/hooks/useUnifiedRole";

interface UserWithRole {
  id: string;
  email: string;
  created_at: string;
  role?: AppRole;
  role_created_at?: string;
}

export default function RoleManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<AppRole | "all">("all");
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  
  const queryClient = useQueryClient();

  // Fetch all users with their roles using Edge Function
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users-with-roles'],
    queryFn: async (): Promise<UserWithRole[]> => {
      try {
        const { data, error } = await supabase.functions.invoke('get-users-with-roles');
        
        if (error) {
          console.error('Error fetching users with roles:', error);
          return [];
        }

        return data || [];
      } catch (error) {
        console.error('Error fetching users with roles:', error);
        return [];
      }
    },
    staleTime: 30000, // 30 seconds
  });

  // Filter users based on search and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Mutation to assign/update role
  const assignRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase
        .from('user_roles')
        .upsert([{ 
          user_id: userId, 
          role: role as any, // Type will be regenerated after migration
          updated_at: new Date().toISOString()
        }], {
          onConflict: 'user_id'
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-with-roles'] });
      toast.success("Rôle assigné avec succès");
      setIsAssignDialogOpen(false);
      setSelectedUser(null);
    },
    onError: (error) => {
      console.error('Error assigning role:', error);
      toast.error("Erreur lors de l'assignation du rôle");
    }
  });

  // Mutation to remove role
  const removeRoleMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-with-roles'] });
      toast.success("Rôle supprimé avec succès");
    },
    onError: (error) => {
      console.error('Error removing role:', error);
      toast.error("Erreur lors de la suppression du rôle");
    }
  });

  const handleAssignRole = (user: UserWithRole) => {
    setSelectedUser(user);
    setIsAssignDialogOpen(true);
  };

  const handleRemoveRole = (userId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce rôle ?")) {
      removeRoleMutation.mutate(userId);
    }
  };

  const roleStats = {
    total: users.length,
    superadmin: users.filter(u => u.role === 'SUPERADMIN').length,
    dg: users.filter(u => u.role === 'DG').length,
    si: users.filter(u => u.role === 'SI').length,
    drh: users.filter(u => u.role === 'DRH').length,
    rdrh: users.filter(u => u.role === 'RDRH').length,
    assistant: users.filter(u => u.role === 'RH_ASSISTANT').length,
    consultant: users.filter(u => u.role === 'CONSULTANT').length,
    postulant: users.filter(u => u.role === 'POSTULANT').length,
    noRole: users.filter(u => !u.role).length,
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Gestion des Rôles</h1>
              <p className="text-muted-foreground">
                Gérez les permissions et rôles des utilisateurs
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <RoleStatsCards stats={roleStats} />

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtres et Recherche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={roleFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRoleFilter("all")}
                >
                  Tous ({roleStats.total})
                </Button>
                <Button
                  variant={roleFilter === "SUPERADMIN" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRoleFilter("SUPERADMIN")}
                >
                  SUPERADMIN ({roleStats.superadmin})
                </Button>
                <Button
                  variant={roleFilter === "DG" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRoleFilter("DG")}
                >
                  DG ({roleStats.dg})
                </Button>
                <Button
                  variant={roleFilter === "DRH" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRoleFilter("DRH")}
                >
                  DRH ({roleStats.drh})
                </Button>
                <Button
                  variant={roleFilter === "RH_ASSISTANT" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRoleFilter("RH_ASSISTANT")}
                >
                  Assistants ({roleStats.assistant})
                </Button>
                {roleStats.noRole > 0 && (
                  <Button
                    variant={roleFilter === "all" ? "outline" : "outline"}
                    size="sm"
                    onClick={() => setSearchTerm("")}
                    className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    Sans rôle ({roleStats.noRole})
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Utilisateurs ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RoleManagementTable
              users={filteredUsers}
              isLoading={isLoading}
              onAssignRole={handleAssignRole}
              onRemoveRole={handleRemoveRole}
            />
          </CardContent>
        </Card>

        {/* Assign Role Dialog */}
        <AssignRoleDialog
          open={isAssignDialogOpen}
          onOpenChange={setIsAssignDialogOpen}
          user={selectedUser}
          onAssignRole={(role) => {
            if (selectedUser) {
              assignRoleMutation.mutate({ userId: selectedUser.id, role });
            }
          }}
          isLoading={assignRoleMutation.isPending}
        />
      </div>
    </div>
  );
}
