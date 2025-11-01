import { useMemo } from 'react';
import { UserProfile } from './useUserProfile';

export const useProfileCompletion = (profile: UserProfile | null | undefined) => {
  return useMemo(() => {
    if (!profile) return { percentage: 0, missingFields: [], completedFields: [] };
    
    const fields = [
      { key: 'first_name', label: 'Prénom', value: profile.first_name },
      { key: 'last_name', label: 'Nom', value: profile.last_name },
      { key: 'email', label: 'Email', value: profile.email },
      { key: 'phone', label: 'Téléphone', value: profile.phone },
      { key: 'location', label: 'Localisation', value: profile.location },
      { key: 'experience_years', label: 'Années d\'expérience', value: profile.experience_years },
      { key: 'technical_skills', label: 'Compétences techniques', value: profile.technical_skills },
      { key: 'behavioral_skills', label: 'Compétences comportementales', value: profile.behavioral_skills },
      { key: 'linkedin', label: 'LinkedIn', value: profile.linkedin },
      { key: 'github', label: 'GitHub', value: profile.github },
      { key: 'motivation_letter_url', label: 'Lettre de motivation', value: profile.motivation_letter_url },
      { key: 'diplomas_url', label: 'Diplômes', value: profile.diplomas_url },
      { key: 'certificates_url', label: 'Certificats', value: profile.certificates_url },
    ];
    
    const completedFields = fields.filter(f => f.value !== null && f.value !== '' && f.value !== 0);
    const missingFields = fields.filter(f => !completedFields.includes(f));
    const percentage = Math.round((completedFields.length / fields.length) * 100);
    
    return {
      percentage,
      completedFields: completedFields.map(f => f.label),
      missingFields: missingFields.map(f => f.label),
    };
  }, [profile]);
};
