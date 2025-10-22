import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Save, FileText } from 'lucide-react';
import { useState } from 'react';

interface FileConfig {
  id: string;
  field_key: string;
  bucket_name: string;
  max_size_mb: number;
  allowed_extensions: string[];
  allowed_mime_types: string[];
}

export function FileConfigManager() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<FileConfig>>({});

  const { data: configs = [], isLoading } = useQuery({
    queryKey: ['file-configs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('file_upload_config')
        .select('*')
        .order('field_key');
      if (error) throw error;
      return data as FileConfig[];
    }
  });

  const updateConfig = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<FileConfig> }) => {
      const { error } = await supabase
        .from('file_upload_config')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['file-configs'] });
      toast.success('Configuration mise à jour');
      setEditingId(null);
      setEditValues({});
    },
    onError: (error: any) => {
      toast.error('Erreur lors de la mise à jour', {
        description: error.message
      });
    }
  });

  const handleEdit = (config: FileConfig) => {
    setEditingId(config.id);
    setEditValues(config);
  };

  const handleSave = (id: string) => {
    updateConfig.mutate({ id, updates: editValues });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({});
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Chargement...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Configuration des uploads de fichiers
        </CardTitle>
        <CardDescription>
          Gérez les paramètres de validation pour chaque type de fichier
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Champ</TableHead>
                <TableHead>Bucket</TableHead>
                <TableHead>Taille max (MB)</TableHead>
                <TableHead>Extensions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {configs.map((config) => {
                const isEditing = editingId === config.id;
                
                return (
                  <TableRow key={config.id}>
                    <TableCell className="font-medium">{config.field_key}</TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Input
                          value={editValues.bucket_name || ''}
                          onChange={(e) => setEditValues({ ...editValues, bucket_name: e.target.value })}
                          className="w-40"
                        />
                      ) : (
                        config.bucket_name
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Input
                          type="number"
                          min={1}
                          max={20}
                          value={editValues.max_size_mb || 5}
                          onChange={(e) => setEditValues({ ...editValues, max_size_mb: parseInt(e.target.value) })}
                          className="w-20"
                        />
                      ) : (
                        config.max_size_mb
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Input
                          value={editValues.allowed_extensions?.join(', ') || ''}
                          onChange={(e) => setEditValues({ 
                            ...editValues, 
                            allowed_extensions: e.target.value.split(',').map(s => s.trim()) 
                          })}
                          className="w-48"
                          placeholder="pdf, doc, docx"
                        />
                      ) : (
                        config.allowed_extensions.join(', ')
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {isEditing ? (
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            onClick={() => handleSave(config.id)}
                            disabled={updateConfig.isPending}
                          >
                            {updateConfig.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-1" />
                                Sauvegarder
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancel}
                          >
                            Annuler
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(config)}
                        >
                          Modifier
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
