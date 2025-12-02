import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft,
  Mail, 
  Phone, 
  MapPin, 
  Briefcase,
  Award,
  FileText,
  Download,
  Calendar
} from "lucide-react";

export default function ExpertDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-5xl mx-auto">
          <Skeleton className="h-12 w-48 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-96 lg:col-span-2" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Profil non trouvé</h2>
          <Button onClick={() => navigate('/database')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la base de données
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/database')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                {profile.first_name} {profile.last_name}
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Profil Expert
              </p>
            </div>
            <Badge 
              variant={profile.application_status === 'submitted' ? 'default' : 'secondary'}
              className="text-sm"
            >
              {profile.application_status === 'submitted' ? 'Candidature soumise' : 'Brouillon'}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <Card className="shadow-card border-0 bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Coordonnées
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                {profile.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.location}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Experience */}
            <Card className="shadow-card border-0 bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Expérience & Tarifs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.experience_years && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Années d'expérience</p>
                    <p className="font-semibold">{profile.experience_years} ans</p>
                  </div>
                )}
                {profile.hourly_rate > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Taux horaire</p>
                    <p className="font-semibold">{profile.hourly_rate}€ / heure</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Skills */}
            {profile.technical_skills && (
              <Card className="shadow-card border-0 bg-gradient-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Compétences Techniques
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground whitespace-pre-wrap">{profile.technical_skills}</p>
                </CardContent>
              </Card>
            )}

            {profile.behavioral_skills && (
              <Card className="shadow-card border-0 bg-gradient-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Compétences Comportementales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground whitespace-pre-wrap">{profile.behavioral_skills}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Documents */}
            <Card className="shadow-card border-0 bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Documents
                </CardTitle>
                <CardDescription>
                  Documents fournis par le candidat
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile.motivation_letter_url && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-between"
                    onClick={() => window.open(profile.motivation_letter_url, '_blank')}
                  >
                    <span>Lettre de motivation</span>
                    <Download className="h-4 w-4" />
                  </Button>
                )}
                {profile.diplomas_url && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-between"
                    onClick={() => window.open(profile.diplomas_url, '_blank')}
                  >
                    <span>Diplômes</span>
                    <Download className="h-4 w-4" />
                  </Button>
                )}
                {profile.certificates_url && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-between"
                    onClick={() => window.open(profile.certificates_url, '_blank')}
                  >
                    <span>Certificats</span>
                    <Download className="h-4 w-4" />
                  </Button>
                )}
                {!profile.motivation_letter_url && !profile.diplomas_url && !profile.certificates_url && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Aucun document disponible
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="shadow-card border-0 bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile.application_submitted_at && (
                  <div className="border-l-2 border-primary pl-4 py-2">
                    <p className="text-sm font-semibold">Candidature soumise</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(profile.application_submitted_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
                <div className="border-l-2 border-muted pl-4 py-2">
                  <p className="text-sm font-semibold">Profil créé</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(profile.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="shadow-card border-0 bg-gradient-card">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  className="w-full bg-gradient-primary"
                  onClick={() => navigate(`/postuler?profile=${profile.id}`)}
                >
                  Modifier le profil
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  disabled
                >
                  Planifier un entretien
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
