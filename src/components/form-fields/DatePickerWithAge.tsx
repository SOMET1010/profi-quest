import { forwardRef, useMemo } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DatePickerWithAgeProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export const DatePickerWithAge = forwardRef<HTMLInputElement, DatePickerWithAgeProps>(
  ({ value, onChange, onBlur, placeholder, disabled }, ref) => {
    const date = value ? new Date(value) : undefined;

    const age = useMemo(() => {
      if (!date) return null;
      const today = new Date();
      let calculatedAge = today.getFullYear() - date.getFullYear();
      const monthDiff = today.getMonth() - date.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
        calculatedAge--;
      }
      return calculatedAge;
    }, [date]);

    const isValidAge = age === null || age >= 18;

    return (
      <div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal',
                !date && 'text-muted-foreground',
                !isValidAge && 'border-destructive'
              )}
              disabled={disabled}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP', { locale: fr }) : <span>{placeholder || 'Sélectionner une date'}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(selectedDate) => {
                if (selectedDate) {
                  onChange?.(format(selectedDate, 'yyyy-MM-dd'));
                }
              }}
              disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        {age !== null && (
          <p className={cn(
            'text-sm mt-1',
            isValidAge ? 'text-muted-foreground' : 'text-destructive'
          )}>
            Âge : {age} ans {!isValidAge && '(minimum 18 ans requis)'}
          </p>
        )}
      </div>
    );
  }
);

DatePickerWithAge.displayName = 'DatePickerWithAge';
