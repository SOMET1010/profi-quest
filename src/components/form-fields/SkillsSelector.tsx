import { forwardRef, useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const SUGGESTED_SKILLS = [
  'React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Java', 'C++',
  'Angular', 'Vue.js', 'Next.js', 'Express', 'Django', 'Flask', 'Spring',
  'SQL', 'MongoDB', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes',
  'AWS', 'Azure', 'GCP', 'Git', 'CI/CD', 'Agile', 'Scrum',
  'HTML', 'CSS', 'Tailwind', 'Bootstrap', 'REST API', 'GraphQL',
  'Communication', 'Leadership', 'Travail d\'équipe', 'Résolution de problèmes'
];

interface SkillsSelectorProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export const SkillsSelector = forwardRef<HTMLInputElement, SkillsSelectorProps>(
  ({ value, onChange, onBlur, placeholder, disabled }, ref) => {
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    
    // Parse existing skills from value
    const skills = value ? value.split(',').map(s => s.trim()).filter(Boolean) : [];

    const filteredSuggestions = SUGGESTED_SKILLS.filter(
      skill => 
        !skills.includes(skill) &&
        skill.toLowerCase().includes(inputValue.toLowerCase())
    );

    const addSkill = (skill: string) => {
      if (!skills.includes(skill) && skill.trim()) {
        const newSkills = [...skills, skill.trim()];
        const syntheticEvent = {
          target: { value: newSkills.join(', ') }
        } as React.ChangeEvent<HTMLInputElement>;
        onChange?.(syntheticEvent);
        setInputValue('');
      }
    };

    const removeSkill = (skillToRemove: string) => {
      const newSkills = skills.filter(s => s !== skillToRemove);
      const syntheticEvent = {
        target: { value: newSkills.join(', ') }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(syntheticEvent);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && inputValue.trim()) {
        e.preventDefault();
        addSkill(inputValue);
      } else if (e.key === 'Backspace' && !inputValue && skills.length > 0) {
        removeSkill(skills[skills.length - 1]);
      }
    };

    return (
      <div className="space-y-2">
        {/* Display selected skills */}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="gap-1">
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  disabled={disabled}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Input for adding skills */}
        <div className="relative">
          <Input
            ref={ref}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              setTimeout(() => setShowSuggestions(false), 200);
              onBlur?.();
            }}
            placeholder={placeholder || 'Tapez une compétence et appuyez sur Entrée'}
            disabled={disabled}
          />

          {/* Suggestions dropdown */}
          {showSuggestions && inputValue && filteredSuggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-background border border-input rounded-md shadow-lg max-h-60 overflow-auto">
              {filteredSuggestions.slice(0, 8).map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => addSkill(skill)}
                  className={cn(
                    'w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground',
                    'focus:bg-accent focus:text-accent-foreground focus:outline-none'
                  )}
                >
                  {skill}
                </button>
              ))}
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          {skills.length} compétence{skills.length > 1 ? 's' : ''} ajoutée{skills.length > 1 ? 's' : ''}
        </p>
      </div>
    );
  }
);

SkillsSelector.displayName = 'SkillsSelector';
