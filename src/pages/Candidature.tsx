import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  CheckCircle, 
  Circle, 
  Upload, 
  FileText, 
  GraduationCap, 
  Award,
  User,
  Briefcase,
  Brain
} from 'lucide-react';

interface ApplicationData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  location: string;
  experience_years: number | null;
  hourly_rate: number;
  technical_skills: string;
  behavioral_skills: string;
  motivation_letter_url: string;
  diplomas_url: string;
  certificates_url: string;
  application_status: string;
}

const Candidature = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ApplicationData>({
    first_name: '',
    last_name: '',
    email: user?.email || '',
    phone: '',
    location: '',
    experience_years: null,
    hourly_rate: 0,
    technical_skills: '',
    behavioral_skills: '',
    motivation_letter_url: '',
    diplomas_url: '',
    certificates_url: '',
    application_status: 'draft'
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    loadExistingApplication();
  }, [user]);

  const loadExistingApplication = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (data) {
      setFormData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        email: data.email || user.email || '',
        phone: data.phone || '',
        location: data.location || '',
        experience_years: data.experience_years,
        hourly_rate: data.hourly_rate || 0,
        technical_skills: data.technical_skills || '',
        behavioral_skills: data.behavioral_skills || '',
        motivation_letter_url: data.motivation_letter_url || '',
        diplomas_url: data.diplomas_url || '',
        certificates_url: data.certificates_url || '',
        application_status: data.application_status || 'draft'
      });
    }
  };

  const uploadFile = async (file: File, bucket: string, fileName: string) => {
    const filePath = `${user!.id}/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string,
    bucket: string
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading({ ...uploading, [field]: true });

    try {
      const fileName = `${field}_${Date.now()}_${file.name}`;
      const url = await uploadFile(file, bucket, fileName);
      
      setFormData({ ...formData, [field]: url });
      toast.success('Fichier uploadé avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'upload du fichier');
    } finally {
      setUploading({ ...uploading, [field]: false });
    }
  };

  const canProceedToStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.first_name && formData.last_name && formData.email && formData.phone && formData.location);
      case 2:
        return !!(formData.technical_skills && formData.behavioral_skills);
      case 3:
        return !!(formData.motivation_letter_url && formData.diplomas_url);
      default:
        return true;
    }
  };

  const saveApplication = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          ...formData,
          id: user.id,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      toast.success('Candidature sauvegardée');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const submitApplication = async () => {
    if (!canProceedToStep(3)) {
      toast.error('Veuillez compléter tous les champs obligatoires');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          ...formData,
          id: user!.id,
          application_status: 'submitted',
          application_submitted_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      toast.success('Candidature soumise avec succès !');
      setFormData({ ...formData, application_status: 'submitted' });
    } catch (error) {
      toast.error('Erreur lors de la soumission');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Informations personnelles', icon: User, completed: canProceedToStep(1) },
    { number: 2, title: 'Expérience et compétences', icon: Briefcase, completed: canProceedToStep(2) },
    { number: 3, title: 'Documents', icon: FileText, completed: canProceedToStep(3) },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-elegant">
          <CardHeader className="pb-8">
            <CardTitle className="text-3xl font-bold text-center">
              Ma candidature d'expert
            </CardTitle>
            {formData.application_status === 'submitted' && (
              <div className="text-center">
                <Badge variant="outline" className="bg-success/10 text-success border-success">
                  Candidature soumise
                </Badge>
              </div>
            )}
          </CardHeader>
          
          <CardContent>
            {/* Step indicators */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-4">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                        currentStep === step.number
                          ? 'border-primary bg-primary text-primary-foreground'
                          : step.completed
                          ? 'border-success bg-success text-success-foreground'
                          : 'border-muted-foreground bg-background text-muted-foreground'
                      }`}
                    >
                      {step.completed && currentStep !== step.number ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <step.icon className="w-6 h-6" />
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-0.5 mx-4 ${
                        step.completed ? 'bg-success' : 'bg-muted'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step content */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4">Informations personnelles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">Prénom *</Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Nom *</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="location">Localisation *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="hourly_rate">Taux horaire (€)</Label>
                    <Input
                      id="hourly_rate"
                      type="number"
                      value={formData.hourly_rate}
                      onChange={(e) => setFormData({ ...formData, hourly_rate: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4">Expérience et compétences</h3>
                <div>
                  <Label htmlFor="experience_years">Années d'expérience (optionnel)</Label>
                  <Input
                    id="experience_years"
                    type="number"
                    value={formData.experience_years || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      experience_years: e.target.value ? Number(e.target.value) : null 
                    })}
                    placeholder="Ex: 5"
                  />
                </div>
                <div>
                  <Label htmlFor="technical_skills">Compétences techniques *</Label>
                  <Textarea
                    id="technical_skills"
                    value={formData.technical_skills}
                    onChange={(e) => setFormData({ ...formData, technical_skills: e.target.value })}
                    placeholder="Décrivez vos compétences techniques..."
                    rows={4}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="behavioral_skills">Compétences comportementales *</Label>
                  <Textarea
                    id="behavioral_skills"
                    value={formData.behavioral_skills}
                    onChange={(e) => setFormData({ ...formData, behavioral_skills: e.target.value })}
                    placeholder="Décrivez vos compétences comportementales..."
                    rows={4}
                    required
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4">Documents requis</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>Lettre de motivation *</Label>
                    <div className="mt-2 p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                      <div className="text-center">
                        {formData.motivation_letter_url ? (
                          <div className="flex items-center justify-center space-x-2 text-success">
                            <FileText className="w-5 h-5" />
                            <span>Lettre de motivation uploadée</span>
                          </div>
                        ) : (
                          <div>
                            <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">
                              Cliquez pour uploader votre lettre de motivation
                            </p>
                          </div>
                        )}
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileUpload(e, 'motivation_letter_url', 'motivation-letters')}
                          className="mt-2"
                          disabled={uploading.motivation_letter_url}
                        />
                        {uploading.motivation_letter_url && <p className="text-sm text-muted-foreground">Upload en cours...</p>}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Diplômes *</Label>
                    <div className="mt-2 p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                      <div className="text-center">
                        {formData.diplomas_url ? (
                          <div className="flex items-center justify-center space-x-2 text-success">
                            <GraduationCap className="w-5 h-5" />
                            <span>Diplômes uploadés</span>
                          </div>
                        ) : (
                          <div>
                            <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">
                              Cliquez pour uploader vos diplômes
                            </p>
                          </div>
                        )}
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.png"
                          onChange={(e) => handleFileUpload(e, 'diplomas_url', 'diplomas')}
                          className="mt-2"
                          disabled={uploading.diplomas_url}
                        />
                        {uploading.diplomas_url && <p className="text-sm text-muted-foreground">Upload en cours...</p>}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Certificats (optionnel)</Label>
                    <div className="mt-2 p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                      <div className="text-center">
                        {formData.certificates_url ? (
                          <div className="flex items-center justify-center space-x-2 text-success">
                            <Award className="w-5 h-5" />
                            <span>Certificats uploadés</span>
                          </div>
                        ) : (
                          <div>
                            <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">
                              Cliquez pour uploader vos certificats
                            </p>
                          </div>
                        )}
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.png"
                          onChange={(e) => handleFileUpload(e, 'certificates_url', 'certificates')}
                          className="mt-2"
                          disabled={uploading.certificates_url}
                        />
                        {uploading.certificates_url && <p className="text-sm text-muted-foreground">Upload en cours...</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                Précédent
              </Button>
              
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  onClick={saveApplication}
                  disabled={loading}
                >
                  Sauvegarder
                </Button>
                
                {currentStep < 3 ? (
                  <Button
                    onClick={() => {
                      if (canProceedToStep(currentStep)) {
                        setCurrentStep(currentStep + 1);
                      } else {
                        toast.error('Veuillez compléter tous les champs obligatoires avant de continuer');
                      }
                    }}
                  >
                    Suivant
                  </Button>
                ) : (
                  <Button
                    onClick={submitApplication}
                    disabled={loading || formData.application_status === 'submitted'}
                  >
                    {formData.application_status === 'submitted' ? 'Déjà soumise' : 'Soumettre ma candidature'}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Candidature;