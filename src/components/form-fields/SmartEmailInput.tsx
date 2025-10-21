import { forwardRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SmartEmailInputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

const COMMON_MISTAKES: Record<string, string> = {
  'gmali': 'gmail',
  'gmai': 'gmail',
  'yahou': 'yahoo',
  'yaho': 'yahoo',
  'hotmali': 'hotmail',
  'outlouk': 'outlook',
};

export const SmartEmailInput = forwardRef<HTMLInputElement, SmartEmailInputProps>(
  ({ value, onChange, onBlur, placeholder, disabled }, ref) => {
    const [suggestion, setSuggestion] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const email = e.target.value;
      onChange?.(e);

      // Check for common mistakes
      if (email.includes('@')) {
        const domain = email.split('@')[1]?.split('.')[0]?.toLowerCase();
        if (domain && COMMON_MISTAKES[domain]) {
          setSuggestion(email.replace(domain, COMMON_MISTAKES[domain]));
        } else {
          setSuggestion(null);
        }
      }
    };

    const applySuggestion = () => {
      if (suggestion && onChange) {
        const syntheticEvent = {
          target: { value: suggestion }
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
        setSuggestion(null);
      }
    };

    const isValidEmail = value ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) : true;

    return (
      <div className="relative">
        <Input
          ref={ref}
          type="email"
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            !isValidEmail && value && 'border-destructive'
          )}
        />
        {value && isValidEmail && (
          <span className="absolute right-3 top-2.5 text-green-600">✓</span>
        )}
        {suggestion && (
          <button
            type="button"
            onClick={applySuggestion}
            className="mt-1 text-xs text-muted-foreground hover:text-foreground"
          >
            Vouliez-vous dire : <span className="font-medium">{suggestion}</span> ?
          </button>
        )}
      </div>
    );
  }
);

SmartEmailInput.displayName = 'SmartEmailInput';
