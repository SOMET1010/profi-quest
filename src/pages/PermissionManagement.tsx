import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Shield, Search, Users, Check, X } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Permission {
  code: string;
  label: string;
  description: string;
  category: string;
}

interface UserPermission {
  user_id: string;
  permission_code: string;
  granted: boolean;
}

interface UserWithRole {
  id: string;
  email: string;
  role: string;
}

const PermissionManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch all permissions
  const { data: permissions = [] } = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('category', { ascending: true });
      
      if (error) throw error;
      return data as Permission[];
    }
  });

  // Fetch all users with roles
  const { data: users = [] } = useQuery({
    queryKey: ['users-with-roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_users_with_roles');
      
      if (error) throw error;
      return data as UserWithRole[];
    }
  });

  // Fetch user permissions for selected user
  const { data: userPermissions = [] } = useQuery({
    queryKey: ['user-permissions-detail', selectedUser?.id],
    queryFn: async () => {
      if (!selectedUser?.id) return [];
      
      const { data, error } = await supabase
        .from('user_permissions')
        .select('*')
        .eq('user_id', selectedUser.id);
      
      if (error) throw error;
      return data as UserPermission[];
    },
    enabled: !!selectedUser?.id
  });

  // Fetch default permissions for user's role
  const { data: roleDefaultPermissions = [] } = useQuery({
    queryKey: ['role-default-permissions', selectedUser?.role],
    queryFn: async () => {
      if (!selectedUser?.role) return [];
      
      const { data, error } = await supabase
        .from('role_default_permissions')
        .select('permission_code')
        .eq('role_code', selectedUser.role);
      
      if (error) throw error;
      return data.map(d => d.permission_code);
    },
    enabled: !!selectedUser?.role
  });

  // Toggle permission mutation
  const togglePermission = useMutation({
    mutationFn: async ({ userId, permissionCode, granted }: { userId: string, permissionCode: string, granted: boolean }) => {
      const { error } = await supabase
        .from('user_permissions')
        .upsert({
          user_id: userId,
          permission_code: permissionCode,
          granted,
          granted_by: (await supabase.auth.getUser()).data.user?.id
        }, {
          onConflict: 'user_id,permission_code'
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-permissions-detail'] });
      toast.success('Permission mise à jour');
    },
    onError: (error) => {
      console.error('Error toggling permission:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  });

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const permissionsByCategory = permissions.reduce((acc, perm) => {
    if (!acc[perm.category]) acc[perm.category] = [];
    acc[perm.category].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  const categoryLabels: Record<string, string> = {
    candidatures: '📋 Candidatures',
    database: '💼 Base de Données',
    admin: '⚙️ Administration',
    courriers: '📨 Courriers & Diligences',
    analytics: '📊 Analytics'
  };

  const getPermissionStatus = (permCode: string) => {
    const isDefault = roleDefaultPermissions.includes(permCode);
    const userPerm = userPermissions.find(up => up.permission_code === permCode);
    
    if (userPerm) {
      return {
        active: userPerm.granted,
        type: 'custom' as const
      };
    }
    
    return {
      active: isDefault,
      type: 'default' as const
    };
  };

  const handlePermissionToggle = (permCode: string) => {
    if (!selectedUser) return;
    
    const status = getPermissionStatus(permCode);
    const newGranted = !status.active;
    
    togglePermission.mutate({
      userId: selectedUser.id,
      permissionCode: permCode,
      granted: newGranted
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Gestion des Permissions</h1>
            <p className="text-muted-foreground">
              Attribuez des permissions spécifiques aux utilisateurs
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Utilisateurs
            </CardTitle>
            <CardDescription>
              Sélectionnez un utilisateur pour gérer ses permissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="grid gap-2">
              {filteredUsers.map((user) => (
                <Card 
                  key={user.id} 
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => {
                    setSelectedUser(user);
                    setIsDialogOpen(true);
                  }}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{user.email}</p>
                      <Badge variant="outline" className="mt-1">
                        {user.role}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm">
                      Gérer
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Permissions de {selectedUser?.email}</DialogTitle>
              <DialogDescription>
                Rôle actuel: <Badge variant="outline">{selectedUser?.role}</Badge>
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="h-[500px] pr-4">
              <Accordion type="multiple" className="w-full">
                {Object.entries(permissionsByCategory).map(([category, perms]) => (
                  <AccordionItem key={category} value={category}>
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <span>{categoryLabels[category] || category}</span>
                        <Badge variant="secondary">{perms.length}</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pt-2">
                        {perms.map((perm) => {
                          const status = getPermissionStatus(perm.code);
                          return (
                            <div key={perm.code} className="flex items-start gap-3 p-3 border rounded-lg">
                              <Checkbox
                                checked={status.active}
                                onCheckedChange={() => handlePermissionToggle(perm.code)}
                                className="mt-1"
                              />
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{perm.label}</span>
                                  <Badge 
                                    variant={status.type === 'default' ? 'secondary' : 'default'}
                                    className="text-xs"
                                  >
                                    {status.type === 'default' ? 'Par défaut' : 'Personnalisé'}
                                  </Badge>
                                  {status.active ? (
                                    <Check className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <X className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">{perm.description}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollArea>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PermissionManagement;
