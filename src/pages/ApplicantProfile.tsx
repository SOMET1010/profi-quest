import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ApplicantProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: profile, isLoading, refetch } = useUserProfile();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    first_name: profile?.first_name || "",
    last_name: profile?.last_name || "",
    phone: profile?.phone || "",
    location: profile?.location || "",
    linkedin: profile?.linkedin || "",
    github: profile?.github || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user.id);

      if (error) throw error;

      toast.success("Profil mis à jour avec succès");
      refetch();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error("Erreur lors de la mise à jour du profil");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Skeleton className="h-8 w-64 mb-6" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Mon Profil</h1>
          <p className="text-muted-foreground">Gérez vos informations personnelles</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
            <CardDescription>
              Complétez votre profil pour améliorer vos chances d'être retenu
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">Prénom *</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Jean"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">Nom *</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Dupont"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+225 XX XX XX XX XX"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Localisation</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Abidjan, Côte d'Ivoire"
              />
            </div>

          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Liens professionnels</CardTitle>
            <CardDescription>
              Ajoutez vos profils en ligne pour enrichir votre candidature
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                name="linkedin"
                type="url"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="github">GitHub</Label>
              <Input
                id="github"
                name="github"
                type="url"
                value={formData.github}
                onChange={handleChange}
                placeholder="https://github.com/..."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
            <CardDescription>
              Téléchargez vos documents (CV, diplômes, certificats)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button type="button" variant="outline" className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              Télécharger des documents
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Formats acceptés : PDF, DOC, DOCX (max 5 Mo)
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </form>
    </div>
  );
}
