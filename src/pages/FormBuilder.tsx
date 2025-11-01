import { useState } from 'react';
import { useFormFields, useUpdateFormField, useCreateFormField, useDeleteFormField, FormField } from '@/hooks/useFormFields';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormFieldEditor } from '@/components/FormFieldEditor';
import { FileConfigManager } from '@/components/FileConfigManager';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2, GripVertical, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function FormBuilder() {
  const { data: fields = [], isLoading } = useFormFields(false);
  const updateField = useUpdateFormField();
  const createField = useCreateFormField();
  const deleteField = useDeleteFormField();

  const [editingField, setEditingField] = useState<FormField | undefined>();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [deletingFieldId, setDeletingFieldId] = useState<string | null>(null);

  const handleCreateNew = () => {
    setEditingField(undefined);
    setIsEditorOpen(true);
  };

  const handleEdit = (field: FormField) => {
    setEditingField(field);
    setIsEditorOpen(true);
  };

  const handleSave = async (fieldData: Partial<FormField>) => {
    if (editingField) {
      await updateField.mutateAsync({ id: editingField.id, updates: fieldData });
    } else {
      await createField.mutateAsync(fieldData as any);
    }
  };

  const handleDelete = async () => {
    if (deletingFieldId) {
      await deleteField.mutateAsync(deletingFieldId);
      setDeletingFieldId(null);
    }
  };

  const handleToggleActive = async (field: FormField) => {
    await updateField.mutateAsync({
      id: field.id,
      updates: { is_active: !field.is_active },
    });
  };

  const groupedFields = fields.reduce((acc, field) => {
    if (!acc[field.field_section]) {
      acc[field.field_section] = [];
    }
    acc[field.field_section].push(field);
    return acc;
  }, {} as Record<string, FormField[]>);

  const sectionLabels: Record<string, string> = {
    personal: 'Informations personnelles',
    professional: 'Expérience professionnelle',
    links: 'Liens',
    documents: 'Documents',
    custom: 'Champs personnalisés',
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Constructeur de formulaire</h1>
          <p className="text-muted-foreground">
            Configurez les champs et fichiers du formulaire de candidature
          </p>
        </div>

        <Tabs defaultValue="fields" className="space-y-6">
          <TabsList>
            <TabsTrigger value="fields">Champs du formulaire</TabsTrigger>
            <TabsTrigger value="files">Configuration fichiers</TabsTrigger>
          </TabsList>

          <TabsContent value="fields" className="space-y-6">
            <div className="flex items-center justify-end">
              <Button onClick={handleCreateNew}>
                <Plus className="mr-2 h-4 w-4" />
                Nouveau champ
              </Button>
            </div>

            {Object.entries(groupedFields).map(([section, sectionFields]) => (
          <Card key={section}>
            <CardHeader>
              <CardTitle>{sectionLabels[section] || section}</CardTitle>
              <CardDescription>
                {sectionFields.length} champ(s) dans cette section
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sectionFields.map((field) => (
                  <div
                    key={field.id}
                    className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{field.label_fr}</span>
                        <Badge variant="outline" className="text-xs">
                          {field.field_type}
                        </Badge>
                        {field.is_required && (
                          <Badge variant="secondary" className="text-xs">
                            Obligatoire
                          </Badge>
                        )}
                        {!field.is_active && (
                          <Badge variant="secondary" className="text-xs">
                            Inactif
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <code className="text-xs bg-muted px-2 py-0.5 rounded">
                          {field.field_key}
                        </code>
                        {field.placeholder && (
                          <span className="text-xs">• {field.placeholder}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleActive(field)}
                        title={field.is_active ? 'Désactiver' : 'Activer'}
                      >
                        {field.is_active ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(field)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingFieldId(field.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
          </TabsContent>

          <TabsContent value="files">
            <FileConfigManager />
          </TabsContent>
        </Tabs>

        <FormFieldEditor
          field={editingField}
          isOpen={isEditorOpen}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingField(undefined);
          }}
          onSave={handleSave}
        />

        <AlertDialog open={!!deletingFieldId} onOpenChange={() => setDeletingFieldId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer ce champ ? Cette action est irréversible.
                Les données existantes associées à ce champ seront conservées mais le champ
                n'apparaîtra plus dans le formulaire.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
}
