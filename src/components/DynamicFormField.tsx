import { FormField } from '@/hooks/useFormFields';
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ControllerRenderProps } from 'react-hook-form';
import { PhoneInput } from './form-fields/PhoneInput';
import { SmartEmailInput } from './form-fields/SmartEmailInput';
import { LocationAutocomplete } from './form-fields/LocationAutocomplete';
import { DatePickerWithAge } from './form-fields/DatePickerWithAge';
import { FileUploadZone } from './form-fields/FileUploadZone';
import { SkillsSelector } from './form-fields/SkillsSelector';
import { useState } from 'react';

interface DynamicFormFieldProps {
  field: FormField;
  formField: ControllerRenderProps<any, any>;
  onFileChange?: (fieldKey: string, file: File | null) => void;
}

export function DynamicFormField({ field, formField, onFileChange }: DynamicFormFieldProps) {
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  const renderInput = () => {
    // Handle phone fields
    if (field.field_type === 'tel') {
      return (
        <PhoneInput
          value={formField.value}
          onChange={(val) => formField.onChange(val)}
          onBlur={formField.onBlur}
          placeholder={field.placeholder}
        />
      );
    }

    // Handle email fields
    if (field.field_type === 'email') {
      return (
        <SmartEmailInput
          value={formField.value}
          onChange={formField.onChange}
          onBlur={formField.onBlur}
          placeholder={field.placeholder}
        />
      );
    }

    // Handle date fields - use special picker for birth date
    if (field.field_type === 'date') {
      if (field.field_key.includes('birth') || field.field_key.includes('naissance')) {
        return (
          <DatePickerWithAge
            value={formField.value}
            onChange={(val) => formField.onChange(val)}
            onBlur={formField.onBlur}
            placeholder={field.placeholder}
          />
        );
      }
      return (
        <Input
          {...formField}
          type="date"
          placeholder={field.placeholder}
        />
      );
    }

    // Handle file uploads
    if (field.field_type === 'file') {
      return (
        <FileUploadZone
          currentFile={currentFile}
          onChange={(file) => {
            setCurrentFile(file);
            if (onFileChange) {
              onFileChange(field.field_key, file);
            }
          }}
          onBlur={formField.onBlur}
          accept=".pdf,.doc,.docx"
          maxSize={5 * 1024 * 1024}
        />
      );
    }

    // Handle location/city fields
    if (field.field_type === 'text' && 
        (field.field_key.includes('location') || 
         field.field_key.includes('ville') || 
         field.field_key.includes('city'))) {
      return (
        <LocationAutocomplete
          value={formField.value}
          onChange={formField.onChange}
          onBlur={formField.onBlur}
          placeholder={field.placeholder}
        />
      );
    }

    // Handle skills/competencies in textarea
    if (field.field_type === 'textarea' && 
        (field.field_key.includes('skill') || 
         field.field_key.includes('competen') ||
         field.field_key.includes('expertise'))) {
      return (
        <SkillsSelector
          value={formField.value}
          onChange={formField.onChange}
          onBlur={formField.onBlur}
          placeholder={field.placeholder}
        />
      );
    }

    // Default textarea
    if (field.field_type === 'textarea') {
      return (
        <Textarea
          {...formField}
          placeholder={field.placeholder}
          rows={4}
        />
      );
    }

    // Handle number fields
    if (field.field_type === 'number') {
      return (
        <Input
          {...formField}
          type="number"
          placeholder={field.placeholder}
          min={field.validation_rules?.min}
          max={field.validation_rules?.max}
        />
      );
    }

    // Default input
    return (
      <Input
        {...formField}
        type={field.field_type}
        placeholder={field.placeholder}
      />
    );
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
