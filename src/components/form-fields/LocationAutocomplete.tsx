import { forwardRef, useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import Fuse from 'fuse.js';
import { cn } from '@/lib/utils';

const COTE_DIVOIRE_CITIES = [
  'Abidjan', 'Bouaké', 'Yamoussoukro', 'Daloa', 'San-Pédro', 'Korhogo',
  'Man', 'Divo', 'Gagnoa', 'Abengourou', 'Agboville', 'Grand-Bassam',
  'Dabou', 'Bondoukou', 'Séguéla', 'Odienné', 'Ferkessédougou', 'Dimbokro',
  'Soubré', 'Issia', 'Anyama', 'Bingerville', 'Adzopé', 'Duékoué'
];

interface LocationAutocompleteProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export const LocationAutocomplete = forwardRef<HTMLInputElement, LocationAutocompleteProps>(
  ({ value, onChange, onBlur, placeholder, disabled }, ref) => {
    const [showSuggestions, setShowSuggestions] = useState(false);

    const fuse = useMemo(() => new Fuse(COTE_DIVOIRE_CITIES, {
      threshold: 0.3,
      distance: 100,
    }), []);

    const suggestions = useMemo(() => {
      if (!value || value.length < 2) return [];
      return fuse.search(value).slice(0, 5).map(result => result.item);
    }, [value, fuse]);

    const handleSelect = (city: string) => {
      if (onChange) {
        const syntheticEvent = {
          target: { value: city }
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
      setShowSuggestions(false);
    };

    return (
      <div className="relative">
        <Input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => {
            onChange?.(e);
            setShowSuggestions(true);
          }}
          onBlur={() => {
            setTimeout(() => setShowSuggestions(false), 200);
            onBlur?.();
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder || 'Abidjan, Bouaké...'}
          disabled={disabled}
        />
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-background border border-input rounded-md shadow-lg max-h-60 overflow-auto">
            {suggestions.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => handleSelect(city)}
                className={cn(
                  'w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground',
                  'focus:bg-accent focus:text-accent-foreground focus:outline-none'
                )}
              >
                {city}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);

LocationAutocomplete.displayName = 'LocationAutocomplete';
