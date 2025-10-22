import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField as RHFFormField } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, Loader2, Save, User, Briefcase, FileText } from "lucide-react";
import ansutLogo from "@/assets/ansut-logo-official.png";
import { useFormFields } from "@/hooks/useFormFields";
import { useDynamicFormSchema } from "@/hooks/useDynamicFormSchema";
import { DynamicFormField } from "@/components/DynamicFormField";
import { useAuth } from "@/contexts/AuthContext";

const DRAFT_KEY = 'candidature_draft';
const LAST_SAVE_KEY = 'candidature_last_save';

const PublicCandidature = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const [lastSave, setLastSave] = useState<Date | null>(null);

  const { data: formFields = [], isLoading: isLoadingFields } = useFormFields(true);
  const formSchema = useDynamicFormSchema(formFields);

  // Generate default values from form fields
  const defaultValues = useMemo(() => {
    const values: Record<string, any> = {};
    formFields.forEach((field) => {
      if (field.field_type === 'number') {
        values[field.field_key] = 0;
      } else {
        values[field.field_key] = '';
      }
    });
    return values;
  }, [formFields]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Load draft or user profile on mount
  useEffect(() => {
    const loadData = async () => {
      // If user is authenticated, try to load their profile data
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (data) {
          // Pre-fill form with profile data
          Object.keys(defaultValues).forEach(key => {
            if (data[key]) {
              form.setValue(key, data[key]);
            }
          });
          toast.info('Données du profil chargées');
          return;
        }
      }

      // Otherwise, load draft
      const draft = localStorage.getItem(DRAFT_KEY);
      const lastSaveTime = localStorage.getItem(LAST_SAVE_KEY);
      
      if (draft) {
        try {
          const parsedDraft = JSON.parse(draft);
          Object.keys(parsedDraft).forEach(key => {
            form.setValue(key, parsedDraft[key]);
          });
          
          if (lastSaveTime) {
            setLastSave(new Date(lastSaveTime));
            toast.info('Brouillon restauré');
          }
        } catch (error) {
          console.error('Error loading draft:', error);
        }
      }
    };

    loadData();
  }, [user, form, defaultValues]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const values = form.getValues();
      if (Object.keys(values).length > 0) {
        saveDraft(values);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [form]);

  const saveDraft = (values: any) => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
      const now = new Date();
      localStorage.setItem(LAST_SAVE_KEY, now.toISOString());
      setLastSave(now);
      toast.success('Brouillon sauvegardé', { duration: 2000 });
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    localStorage.removeItem(LAST_SAVE_KEY);
    setLastSave(null);
  };

  const handleFileChange = (fieldKey: string, file: File | null) => {
    if (!file) {
      const newFiles = { ...uploadedFiles };
      delete newFiles[fieldKey];
      setUploadedFiles(newFiles);
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(`Le fichier "${file.name}" est trop volumineux. Taille maximale: 5MB`, {
        description: `Taille actuelle: ${(file.size / 1024 / 1024).toFixed(2)}MB`
      });
      return;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast.error(`Format de fichier non supporté pour "${file.name}"`, {
        description: 'Formats acceptés: PDF, DOC, DOCX'
      });
      return;
    }

    setUploadedFiles({ ...uploadedFiles, [fieldKey]: file });
    toast.success(`Fichier "${file.name}" ajouté`);
  };

  const uploadFile = async (file: File, fieldKey: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Determine bucket based on field key
      const bucket = fieldKey.toLowerCase().includes('cv') ? 'diplomas' : 
                     fieldKey.toLowerCase().includes('motivation') ? 'motivation-letters' :
                     'motivation-letters';

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error: any) {
      toast.error(`Erreur lors de l'upload: ${error.message}`);
      return null;
    }
  };

  // Group fields by section for wizard steps
  const stepFields = useMemo(() => {
    const step1 = formFields.filter(f => f.field_section === 'personal');
    const step2 = formFields.filter(f => f.field_section === 'professional');
    const step3 = formFields.filter(f => ['documents', 'links'].includes(f.field_section) || (!['personal', 'professional'].includes(f.field_section)));
    
    return { step1, step2, step3 };
  }, [formFields]);

  // Check if current step can be completed
  const canProceedFromStep = (step: number): boolean => {
    const currentStepFields = step === 1 ? stepFields.step1 : step === 2 ? stepFields.step2 : stepFields.step3;
    const values = form.getValues();
    
    return currentStepFields
      .filter(f => f.is_required)
      .every(field => {
        if (field.field_type === 'file') {
          return !!uploadedFiles[field.field_key];
        }
        return !!values[field.field_key];
      });
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      // Validate required fields
      const missingFields = formFields
        .filter(f => {
          if (!f.is_required) return false;
          
          // Pour les champs fichiers, vérifier uploadedFiles
          if (f.field_type === 'file') {
            return !uploadedFiles[f.field_key];
          }
          
          // Pour les autres champs, vérifier data
          return !data[f.field_key];
        })
        .map(f => f.label_fr);

      if (missingFields.length > 0) {
        toast.error('Champs obligatoires manquants', {
          description: missingFields.join(', ')
        });
        setIsSubmitting(false);
        return;
      }

      const filesData: Record<string, string> = {};
      const totalFiles = Object.keys(uploadedFiles).length;
      let uploadedCount = 0;

      // Upload all files with progress
      for (const [fieldKey, file] of Object.entries(uploadedFiles)) {
        try {
          const url = await uploadFile(file, fieldKey);
          if (!url) {
            toast.error(`Échec de l'upload: ${file.name}`, {
              description: 'Vérifiez les permissions de stockage'
            });
            setIsSubmitting(false);
            return;
          }
          filesData[fieldKey] = url;
          uploadedCount++;
          setUploadProgress(Math.round((uploadedCount / totalFiles) * 100));
        } catch (uploadError: any) {
          console.error('Upload error:', uploadError);
          toast.error(`Erreur lors de l'upload de ${file.name}`, {
            description: uploadError.message || 'Erreur réseau'
          });
          setIsSubmitting(false);
          return;
        }
      }

      // Insert submission
      const { error: insertError } = await supabase
        .from("form_submissions")
        .insert({
          form_data: data,
          files_data: filesData,
          status: "new",
        });

      if (insertError) {
        console.error('Insert error:', insertError);
        
        if (insertError.code === '23505') {
          toast.error('Cette candidature existe déjà');
        } else if (insertError.code === '42501') {
          toast.error('Erreur de permission', {
            description: 'Contactez l\'administrateur'
          });
        } else {
          toast.error('Erreur lors de la soumission', {
            description: insertError.message
          });
        }
        
        setIsSubmitting(false);
        return;
      }

      // Send confirmation email
      try {
        await supabase.functions.invoke('send-application-confirmation', {
          body: {
            firstName: data.firstName || data.first_name || 'Candidat',
            lastName: data.lastName || data.last_name || '',
            email: data.email || '',
          }
        });
      } catch (emailError) {
        console.error("Error sending confirmation email:", emailError);
      }

      clearDraft();
      setIsSuccess(true);
      toast.success("Candidature soumise avec succès!");
    } catch (error: any) {
      console.error("Error submitting application:", error);
      
      if (error.message?.includes('network')) {
        toast.error('Erreur de connexion', {
          description: 'Vérifiez votre connexion internet'
        });
      } else {
        toast.error('Erreur lors de la soumission', {
          description: error.message || 'Erreur inconnue'
        });
      }
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  if (isLoadingFields) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-accent/20 flex items-center justify-center p-4">
        <Card className="max-w-4xl w-full">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <CardTitle>Chargement du formulaire...</CardTitle>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-accent/20 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Candidature soumise avec succès!</CardTitle>
            <CardDescription className="text-base">
              Nous avons bien reçu votre candidature. Notre équipe RH l'examinera dans les plus brefs délais.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Vous recevrez un email de confirmation à l'adresse que vous avez fournie.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/">
                <Button variant="outline">
                  Retour à l'accueil
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const steps = [
    { number: 1, title: 'Informations personnelles', icon: User, completed: canProceedFromStep(1) },
    { number: 2, title: 'Expérience & Compétences', icon: Briefcase, completed: canProceedFromStep(2) },
    { number: 3, title: 'Documents', icon: FileText, completed: canProceedFromStep(3) },
  ];

  const currentStepFields = currentStep === 1 ? stepFields.step1 : 
                           currentStep === 2 ? stepFields.step2 : 
                           stepFields.step3;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted py-8">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span>Retour</span>
          </Link>
          <div className="flex items-center gap-3">
            <img src={ansutLogo} alt="ANSUT" className="h-10 w-auto" />
          </div>
        </div>
      </header>

      {/* Form */}
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Formulaire de candidature</CardTitle>
                <CardDescription>
                  Remplissez ce formulaire pour rejoindre notre réseau d'experts. 
                  Les champs marqués d'un astérisque (*) sont obligatoires.
                </CardDescription>
              </div>
              {lastSave && (
                <p className="text-xs text-muted-foreground">
                  Dernière sauvegarde: {lastSave.toLocaleTimeString()}
                </p>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Step indicators */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-4">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(step.number)}
                      className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors ${
                        currentStep === step.number
                          ? 'border-primary bg-primary text-primary-foreground'
                          : step.completed
                          ? 'border-green-500 bg-green-500 text-white'
                          : 'border-muted-foreground bg-background text-muted-foreground'
                      }`}
                    >
                      {step.completed && currentStep !== step.number ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <step.icon className="w-6 h-6" />
                      )}
                    </button>
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-0.5 mx-4 ${
                        step.completed ? 'bg-green-500' : 'bg-muted'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Step title */}
                <h3 className="text-xl font-semibold">
                  {steps[currentStep - 1].title}
                </h3>

                {/* Current step fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentStepFields.map((field) => (
                    <div key={field.field_key} className={field.field_type === 'textarea' ? 'md:col-span-2' : ''}>
                      <RHFFormField
                        control={form.control}
                        name={field.field_key}
                        render={({ field: formField }) => (
                          <DynamicFormField
                            field={field}
                            formField={formField}
                            onFileChange={handleFileChange}
                          />
                        )}
                      />
                    </div>
                  ))}
                </div>

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Upload des fichiers en cours...</p>
                    <Progress value={uploadProgress} />
                  </div>
                )}

                {/* Navigation buttons */}
                <div className="flex justify-between pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                    disabled={currentStep === 1 || isSubmitting}
                  >
                    Précédent
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => saveDraft(form.getValues())}
                      disabled={isSubmitting}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Sauvegarder
                    </Button>

                    {currentStep < 3 ? (
                      <Button
                        type="button"
                        onClick={() => {
                          if (canProceedFromStep(currentStep)) {
                            setCurrentStep(currentStep + 1);
                          } else {
                            toast.error('Veuillez remplir tous les champs obligatoires');
                          }
                        }}
                        disabled={isSubmitting}
                      >
                        Suivant
                      </Button>
                    ) : (
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Envoi en cours...
                          </>
                        ) : (
                          "Envoyer ma candidature"
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                <p className="text-sm text-center text-muted-foreground">
                  Vous avez déjà un compte ?{" "}
                  <Link to="/auth" className="text-primary hover:underline">
                    Se connecter
                  </Link>
                </p>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PublicCandidature;
