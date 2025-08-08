import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserCheck, Plus, Send, FileText, Clock, CheckCircle } from "lucide-react";

export default function Qualification() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-4">Qualification Dynamique</h1>
              <p className="text-lg text-muted-foreground">
                Envoyez des formulaires personnalisés pour enrichir les profils
              </p>
            </div>
            <Button className="bg-gradient-primary" size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Nouveau Formulaire
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card border-0 bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-primary mr-3" />
                <div>
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-sm text-muted-foreground">Formulaires Actifs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card border-0 bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Send className="h-8 w-8 text-info mr-3" />
                <div>
                  <p className="text-2xl font-bold">156</p>
                  <p className="text-sm text-muted-foreground">Envoyés</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card border-0 bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-warning mr-3" />
                <div>
                  <p className="text-2xl font-bold">89</p>
                  <p className="text-sm text-muted-foreground">En Attente</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card border-0 bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-success mr-3" />
                <div>
                  <p className="text-2xl font-bold">67</p>
                  <p className="text-sm text-muted-foreground">Complétés</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Forms */}
        <Card className="shadow-card border-0 bg-gradient-card mb-8">
          <CardHeader>
            <CardTitle>Formulaires de Qualification</CardTitle>
            <CardDescription>
              Gérez vos formulaires de qualification des experts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Qualification Experts IA</h3>
                    <p className="text-muted-foreground">Formulaire de qualification pour les experts en intelligence artificielle</p>
                  </div>
                  <Badge className="bg-success text-success-foreground">Actif</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <p className="font-medium">Envoyés</p>
                    <p className="text-muted-foreground">45 formulaires</p>
                  </div>
                  <div>
                    <p className="font-medium">Taux de réponse</p>
                    <p className="text-muted-foreground">78%</p>
                  </div>
                  <div>
                    <p className="font-medium">Complétés</p>
                    <p className="text-muted-foreground">35 réponses</p>
                  </div>
                  <div>
                    <p className="font-medium">Créé le</p>
                    <p className="text-muted-foreground">15 jan 2024</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Voir Réponses
                  </Button>
                  <Button variant="outline" size="sm">
                    <Send className="h-4 w-4 mr-2" />
                    Envoyer
                  </Button>
                  <Button variant="outline" size="sm">
                    Modifier
                  </Button>
                </div>
              </div>

              <div className="border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Qualification Cybersécurité</h3>
                    <p className="text-muted-foreground">Évaluation des compétences en cybersécurité</p>
                  </div>
                  <Badge variant="secondary">Brouillon</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <p className="font-medium">Envoyés</p>
                    <p className="text-muted-foreground">0 formulaires</p>
                  </div>
                  <div>
                    <p className="font-medium">Taux de réponse</p>
                    <p className="text-muted-foreground">-</p>
                  </div>
                  <div>
                    <p className="font-medium">Complétés</p>
                    <p className="text-muted-foreground">0 réponses</p>
                  </div>
                  <div>
                    <p className="font-medium">Créé le</p>
                    <p className="text-muted-foreground">28 jan 2024</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="bg-gradient-primary">
                    Publier
                  </Button>
                  <Button variant="outline" size="sm">
                    Modifier
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Responses */}
        <Card className="shadow-card border-0 bg-gradient-card">
          <CardHeader>
            <CardTitle>Réponses Récentes</CardTitle>
            <CardDescription>
              Dernières réponses aux formulaires de qualification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center">
                  <UserCheck className="h-5 w-5 text-success mr-3" />
                  <div>
                    <p className="font-medium">Marie Dubois - Qualification IA</p>
                    <p className="text-sm text-muted-foreground">Score: 85/100 • Complété il y a 2h</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Voir Détails
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center">
                  <UserCheck className="h-5 w-5 text-success mr-3" />
                  <div>
                    <p className="font-medium">Jean Martin - Qualification IA</p>
                    <p className="text-sm text-muted-foreground">Score: 92/100 • Complété il y a 4h</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Voir Détails
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-warning mr-3" />
                  <div>
                    <p className="font-medium">Sophie Laurent - Qualification IA</p>
                    <p className="text-sm text-muted-foreground">En cours • Envoyé il y a 1 jour</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Relancer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}