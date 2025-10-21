import { useState } from 'react';
import { FormField } from '@/hooks/useFormFields';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface FormFieldEditorProps {
  field?: FormField;
  isOpen: boolean;
  onClose: () => void;
  onSave: (field: Partial<FormField>) => void;
}

const FIELD_TYPES = [
  { value: 'text', label: 'Texte' },
  { value: 'number', label: 'Nombre' },
  { value: 'email', label: 'Email' },
  { value: 'tel', label: 'Téléphone' },
  { value: 'textarea', label: 'Zone de texte' },
  { value: 'select', label: 'Liste déroulante' },
  { value: 'file', label: 'Fichier' },
  { value: 'url', label: 'URL' },
  { value: 'date', label: 'Date' },
];

const SECTIONS = [
  { value: 'personal', label: 'Informations personnelles' },
  { value: 'professional', label: 'Expérience professionnelle' },
  { value: 'links', label: 'Liens' },
  { value: 'documents', label: 'Documents' },
  { value: 'custom', label: 'Personnalisé' },
];

export function FormFieldEditor({ field, isOpen, onClose, onSave }: FormFieldEditorProps) {
  const [formData, setFormData] = useState<Partial<FormField>>(
    field || {
      field_key: '',
      field_type: 'text',
      label_fr: '',
      placeholder: '',
      description: '',
      is_required: false,
      is_active: true,
      display_order: 0,
      field_section: 'custom',
      validation_rules: {},
    }
  );

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{field ? 'Modifier le champ' : 'Nouveau champ'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="field_key">Clé du champ *</Label>
              <Input
                id="field_key"
                value={formData.field_key}
                onChange={(e) => setFormData({ ...formData, field_key: e.target.value })}
                placeholder="firstName"
                disabled={!!field}
              />
              <p className="text-xs text-muted-foreground">
                Identifiant unique (camelCase, pas d'espaces)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="field_type">Type de champ *</Label>
              <Select
                value={formData.field_type}
                onValueChange={(value: any) => setFormData({ ...formData, field_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="label_fr">Label *</Label>
            <Input
              id="label_fr"
              value={formData.label_fr}
              onChange={(e) => setFormData({ ...formData, label_fr: e.target.value })}
              placeholder="Prénom"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="placeholder">Placeholder</Label>
            <Input
              id="placeholder"
              value={formData.placeholder || ''}
              onChange={(e) => setFormData({ ...formData, placeholder: e.target.value })}
              placeholder="Entrez votre prénom"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (aide)</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Texte d'aide affiché sous le champ"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="field_section">Section</Label>
              <Select
                value={formData.field_section}
                onValueChange={(value) => setFormData({ ...formData, field_section: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SECTIONS.map((section) => (
                    <SelectItem key={section.value} value={section.value}>
                      {section.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="display_order">Ordre d'affichage</Label>
              <Input
                id="display_order"
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor="is_required">Champ obligatoire</Label>
              <p className="text-xs text-muted-foreground">
                L'utilisateur doit remplir ce champ
              </p>
            </div>
            <Switch
              id="is_required"
              checked={formData.is_required}
              onCheckedChange={(checked) => setFormData({ ...formData, is_required: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor="is_active">Champ actif</Label>
              <p className="text-xs text-muted-foreground">
                Afficher ce champ dans le formulaire
              </p>
            </div>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSave}>
            {field ? 'Mettre à jour' : 'Créer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
