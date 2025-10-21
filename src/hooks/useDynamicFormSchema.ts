import { useMemo } from 'react';
import { z } from 'zod';
import { FormField } from './useFormFields';

export function useDynamicFormSchema(fields: FormField[]) {
  return useMemo(() => {
    const schemaObject: Record<string, z.ZodTypeAny> = {};

    fields.forEach((field) => {
      let validator: z.ZodTypeAny;

      switch (field.field_type) {
        case 'email':
          validator = z.string().trim().email('Email invalide');
          break;

        case 'url':
          validator = z.string().trim().url('URL invalide');
          break;

        case 'number':
          validator = z.coerce.number();
          if (field.validation_rules?.min !== undefined) {
            validator = (validator as z.ZodNumber).min(field.validation_rules.min);
          }
          if (field.validation_rules?.max !== undefined) {
            validator = (validator as z.ZodNumber).max(field.validation_rules.max);
          }
          break;

        case 'tel':
          validator = z.string().trim().min(10, 'Numéro invalide');
          break;

        case 'date':
          validator = z.string().trim();
          break;

        case 'file':
          // For file fields, we'll handle validation separately
          validator = z.any().optional();
          break;

        default:
          validator = z.string().trim();
          if (field.validation_rules?.min) {
            validator = (validator as z.ZodString).min(
              field.validation_rules.min,
              `Minimum ${field.validation_rules.min} caractères`
            );
          }
          if (field.validation_rules?.max) {
            validator = (validator as z.ZodString).max(field.validation_rules.max);
          }
      }

      // Make field optional if not required
      if (!field.is_required) {
        if (field.field_type === 'email' || field.field_type === 'url') {
          // For email/url: either empty or valid format
          validator = z.union([
            z.literal(''),
            validator
          ]).optional();
        } else if (field.field_type === 'number') {
          // For number: can be undefined
          validator = validator.optional();
        } else {
          // For text: can be empty or undefined
          validator = validator.optional().or(z.literal(''));
        }
      }

      schemaObject[field.field_key] = validator;
    });

    return z.object(schemaObject);
  }, [fields]);
}
