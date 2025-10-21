import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField as RHFFormField } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import ansutLogo from "@/assets/ansut-logo-official.png";
import { useFormFields } from "@/hooks/useFormFields";
import { useDynamicFormSchema } from "@/hooks/useDynamicFormSchema";
import { DynamicFormField } from "@/components/DynamicFormField";

const PublicCandidature = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({});

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

  const handleFileChange = (fieldKey: string, file: File | null) => {
    if (!file) {
      const newFiles = { ...uploadedFiles };
      delete newFiles[fieldKey];
      setUploadedFiles(newFiles);
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("Le fichier est trop volumineux (max 5MB)");
      return;
    }

    if (!file.type.includes("pdf") && !file.type.includes("doc")) {
      toast.error("Format de fichier non supporté. Utilisez PDF ou DOC");
      return;
    }

    setUploadedFiles({ ...uploadedFiles, [fieldKey]: file });
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

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);

    try {
      const filesData: Record<string, string> = {};

      // Upload all files
      for (const [fieldKey, file] of Object.entries(uploadedFiles)) {
        const url = await uploadFile(file, fieldKey);
        if (!url) {
          setIsSubmitting(false);
          return;
        }
        filesData[fieldKey] = url;
      }

      const { error: insertError } = await supabase
        .from("form_submissions")
        .insert({
          form_data: data,
          files_data: filesData,
          status: "new",
        });

      if (insertError) throw insertError;

      // Send confirmation email
      try {
        await supabase.functions.invoke('send-application-confirmation', {
          body: {
            firstName: data.firstName || data.first_name || 'Candidat',
            lastName: data.lastName || data.last_name || '',
            email: data.email || '',
          }
        });
        console.log("Confirmation email sent");
      } catch (emailError) {
        console.error("Error sending confirmation email:", emailError);
        // Don't block submission if email fails
      }

      setIsSuccess(true);
      toast.success("Candidature soumise avec succès!");
    } catch (error: any) {
      console.error("Error submitting application:", error);
      toast.error("Erreur lors de la soumission: " + error.message);
    } finally {
      setIsSubmitting(false);
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

  // Group fields by section
  const groupedFields = formFields.reduce((acc, field) => {
    if (!acc[field.field_section]) {
      acc[field.field_section] = [];
    }
    acc[field.field_section].push(field);
    return acc;
  }, {} as Record<string, typeof formFields>);

  const sectionLabels: Record<string, string> = {
    personal: 'Informations personnelles',
    professional: 'Expérience professionnelle',
    links: 'Profils en ligne',
    documents: 'Documents',
    custom: 'Informations complémentaires',
  };

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
            <CardTitle>Formulaire de candidature</CardTitle>
            <CardDescription>
              Remplissez ce formulaire pour rejoindre notre réseau d'experts. 
              Les champs marqués d'un astérisque (*) sont obligatoires.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {Object.entries(groupedFields).map(([section, fields]) => (
                  <div key={section} className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">
                      {sectionLabels[section] || section}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {fields.map((field) => (
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
                  </div>
                ))}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    "Envoyer ma candidature"
                  )}
                </Button>

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
