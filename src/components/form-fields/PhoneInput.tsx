import { forwardRef } from 'react';
import PhoneInputLib from 'react-phone-number-input';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
import 'react-phone-number-input/style.css';
import { cn } from '@/lib/utils';

interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value, onChange, onBlur, placeholder, disabled }, ref) => {
    const isValid = value ? isValidPhoneNumber(value) : true;

    return (
      <div className="relative">
        <PhoneInputLib
          international
          defaultCountry="CI"
          value={value}
          onChange={(val) => onChange?.(val || '')}
          onBlur={onBlur}
          placeholder={placeholder || '+225 XX XX XX XX XX'}
          disabled={disabled}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            !isValid && value && 'border-destructive'
          )}
        />
        {value && isValid && (
          <span className="absolute right-3 top-2.5 text-green-600">✓</span>
        )}
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';
