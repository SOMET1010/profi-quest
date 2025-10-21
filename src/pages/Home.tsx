import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Users, Target, Award, TrendingUp } from "lucide-react";
import ansutLogo from "@/assets/ansut-logo-official.png";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={ansutLogo} alt="ANSUT" className="h-12 w-auto" />
            <div>
              <h1 className="text-xl font-bold">ANSUT</h1>
              <p className="text-sm text-muted-foreground">Programme d'Experts RH</p>
            </div>
          </div>
          <Link to="/auth">
            <Button variant="outline">Se connecter</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Rejoignez notre réseau d'experts
          </h2>
          <p className="text-xl text-muted-foreground">
            L'ANSUT recrute des consultants qualifiés pour accompagner la transformation 
            numérique en Côte d'Ivoire
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/postuler">
              <Button size="lg" className="text-lg px-8">
                Postuler maintenant
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Créer un compte
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Réseau d'experts</h3>
              <p className="text-sm text-muted-foreground">
                Intégrez un réseau de consultants expérimentés
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Missions variées</h3>
              <p className="text-sm text-muted-foreground">
                Participez à des projets stratégiques de transformation digitale
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Expertise reconnue</h3>
              <p className="text-sm text-muted-foreground">
                Valorisez votre expertise auprès d'institutions publiques
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Évolution continue</h3>
              <p className="text-sm text-muted-foreground">
                Développez vos compétences sur des projets innovants
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-12 text-center space-y-6">
            <h2 className="text-3xl font-bold">Prêt à rejoindre l'ANSUT ?</h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Déposez votre candidature en quelques minutes. Notre équipe RH 
              examinera votre profil et vous contactera rapidement.
            </p>
            <Link to="/postuler">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Démarrer ma candidature
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-muted border-t mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>© 2025 ANSUT - Agence Nationale du Service Universel des Télécommunications</p>
          <p className="mt-2">Tous droits réservés</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
