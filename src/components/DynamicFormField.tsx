import { FormField } from '@/hooks/useFormFields';
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ControllerRenderProps } from 'react-hook-form';

interface DynamicFormFieldProps {
  field: FormField;
  formField: ControllerRenderProps<any, any>;
  onFileChange?: (fieldKey: string, file: File | null) => void;
}

export function DynamicFormField({ field, formField, onFileChange }: DynamicFormFieldProps) {
  const renderInput = () => {
    switch (field.field_type) {
      case 'textarea':
        return (
          <Textarea
            {...formField}
            placeholder={field.placeholder}
            rows={4}
          />
        );

      case 'file':
        return (
          <Input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              if (onFileChange) {
                onFileChange(field.field_key, file);
              }
            }}
          />
        );

      case 'number':
        return (
          <Input
            {...formField}
            type="number"
            placeholder={field.placeholder}
            min={field.validation_rules?.min}
            max={field.validation_rules?.max}
          />
        );

      case 'date':
        return (
          <Input
            {...formField}
            type="date"
            placeholder={field.placeholder}
          />
        );

      default:
        return (
          <Input
            {...formField}
            type={field.field_type}
            placeholder={field.placeholder}
          />
        );
    }
  };

  return (
    <FormItem>
      <FormLabel>
        {field.label_fr}
        {field.is_required && <span className="text-destructive ml-1">*</span>}
      </FormLabel>
      <FormControl>
        {renderInput()}
      </FormControl>
      {field.description && (
        <FormDescription>{field.description}</FormDescription>
      )}
      <FormMessage />
    </FormItem>
  );
}
