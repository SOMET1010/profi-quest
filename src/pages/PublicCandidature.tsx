import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Upload } from "lucide-react";
import ansutLogo from "@/assets/ansut-logo-official.png";

const formSchema = z.object({
  firstName: z.string().trim().min(2, "Le prénom doit contenir au moins 2 caractères").max(100),
  lastName: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères").max(100),
  email: z.string().trim().email("Email invalide").max(255),
  phone: z.string().trim().min(10, "Numéro invalide").max(20).optional().or(z.literal("")),
  location: z.string().trim().max(200).optional().or(z.literal("")),
  experienceYears: z.coerce.number().min(0).max(50).optional(),
  technicalSkills: z.string().trim().max(1000).optional().or(z.literal("")),
  behavioralSkills: z.string().trim().max(1000).optional().or(z.literal("")),
  linkedin: z.string().trim().url("URL LinkedIn invalide").max(500).optional().or(z.literal("")),
  github: z.string().trim().url("URL GitHub invalide").max(500).optional().or(z.literal("")),
});

type FormData = z.infer<typeof formSchema>;

const PublicCandidature = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [motivationFile, setMotivationFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      experienceYears: 0,
      technicalSkills: "",
      behavioralSkills: "",
      linkedin: "",
      github: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'cv' | 'motivation') => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error("Le fichier ne doit pas dépasser 5 MB");
        return;
      }
      if (type === 'cv') {
        setCvFile(file);
      } else {
        setMotivationFile(file);
      }
    }
  };

  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(folder === 'cv' ? 'diplomas' : 'motivation-letters')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(folder === 'cv' ? 'diplomas' : 'motivation-letters')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      // Upload files if present
      let cvUrl = null;
      let motivationUrl = null;

      if (cvFile) {
        cvUrl = await uploadFile(cvFile, 'cv');
        if (!cvUrl) {
          toast.error("Erreur lors du téléchargement du CV");
          setIsSubmitting(false);
          return;
        }
      }

      if (motivationFile) {
        motivationUrl = await uploadFile(motivationFile, 'motivation');
        if (!motivationUrl) {
          toast.error("Erreur lors du téléchargement de la lettre de motivation");
          setIsSubmitting(false);
          return;
        }
      }

      // Insert application
      const { error: insertError } = await supabase
        .from('public_applications')
        .insert({
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone || null,
          location: data.location || null,
          experience_years: data.experienceYears || null,
          technical_skills: data.technicalSkills || null,
          behavioral_skills: data.behavioralSkills || null,
          linkedin: data.linkedin || null,
          github: data.github || null,
          cv_url: cvUrl,
          motivation_letter_url: motivationUrl,
          status: 'new',
        });

      if (insertError) {
        console.error('Insert error:', insertError);
        toast.error("Erreur lors de la soumission de votre candidature");
        setIsSubmitting(false);
        return;
      }

      // Success
      setIsSuccess(true);
      toast.success("Candidature envoyée avec succès !");
      
      // Redirect to success page or home after 3 seconds
      setTimeout(() => {
        navigate("/");
      }, 3000);

    } catch (error) {
      console.error('Submission error:', error);
      toast.error("Une erreur est survenue");
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center space-y-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold">Candidature envoyée !</h2>
            <p className="text-muted-foreground">
              Merci pour votre candidature. Notre équipe RH va examiner votre profil 
              et vous contactera par email prochainement.
            </p>
            <Link to="/">
              <Button className="w-full">Retour à l'accueil</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Informations personnelles</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prénom *</FormLabel>
                          <FormControl>
                            <Input placeholder="Jean" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom *</FormLabel>
                          <FormControl>
                            <Input placeholder="Kouassi" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="jean.kouassi@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone</FormLabel>
                          <FormControl>
                            <Input placeholder="+225 XX XX XX XX" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Localisation</FormLabel>
                          <FormControl>
                            <Input placeholder="Abidjan, Côte d'Ivoire" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Expérience professionnelle</h3>
                  
                  <FormField
                    control={form.control}
                    name="experienceYears"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Années d'expérience</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="technicalSkills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Compétences techniques</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Ex: Gestion de projet, transformation digitale, analyse de données..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Décrivez vos compétences techniques principales
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="behavioralSkills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Compétences comportementales</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Ex: Leadership, communication, travail d'équipe..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Décrivez vos soft skills
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Links */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Profils professionnels</h3>
                  
                  <FormField
                    control={form.control}
                    name="linkedin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn</FormLabel>
                        <FormControl>
                          <Input placeholder="https://linkedin.com/in/votre-profil" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="github"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GitHub</FormLabel>
                        <FormControl>
                          <Input placeholder="https://github.com/votre-profil" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* File Uploads */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Documents</h3>
                  
                  <div className="space-y-2">
                    <FormLabel>CV (optionnel)</FormLabel>
                    <div className="flex items-center gap-4">
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileChange(e, 'cv')}
                        className="flex-1"
                      />
                      {cvFile && (
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <Upload className="h-4 w-4" />
                          {cvFile.name}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Formats acceptés: PDF, DOC, DOCX (max 5 MB)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <FormLabel>Lettre de motivation (optionnel)</FormLabel>
                    <div className="flex items-center gap-4">
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileChange(e, 'motivation')}
                        className="flex-1"
                      />
                      {motivationFile && (
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <Upload className="h-4 w-4" />
                          {motivationFile.name}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Formats acceptés: PDF, DOC, DOCX (max 5 MB)
                    </p>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Envoi en cours..." : "Envoyer ma candidature"}
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
