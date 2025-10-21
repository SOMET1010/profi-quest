import { useState, useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Eye, EyeOff, UserPlus, LogIn, AlertCircle, Clock } from 'lucide-react';

const Auth = () => {
  const { user, signUp, signIn, resetPassword, resendConfirmationEmail } = useAuth();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [signUpCooldown, setSignUpCooldown] = useState(0);
  const [lastSignUpEmail, setLastSignUpEmail] = useState('');
  const [otpError, setOtpError] = useState(false);

  // Check for OTP errors in URL
  useEffect(() => {
    const errorCode = searchParams.get('error_code');
    const errorDescription = searchParams.get('error_description');
    
    if (errorCode === 'otp_expired') {
      setOtpError(true);
      toast.error('Le lien de confirmation a expiré. Demandez-en un nouveau.');
    } else if (errorDescription) {
      toast.error(`Erreur d'authentification: ${errorDescription}`);
    }
  }, [searchParams]);

  // Countdown timer for signup cooldown
  useEffect(() => {
    if (signUpCooldown > 0) {
      const timer = setTimeout(() => setSignUpCooldown(signUpCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [signUpCooldown]);

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    
    if (password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password);
    setLoading(false);

    if (error) {
      if (error.message.includes('already registered')) {
        toast.error('Cette adresse email est déjà utilisée');
      } else {
        toast.error('Erreur lors de l\'inscription: ' + error.message);
      }
    } else {
      toast.success('Inscription réussie ! Vérifiez votre email pour confirmer votre compte.');
      setLastSignUpEmail(email);
      setSignUpCooldown(60); // 60 seconds cooldown
      setOtpError(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!lastSignUpEmail) {
      toast.error('Aucune adresse email trouvée');
      return;
    }

    setLoading(true);
    const { error } = await resendConfirmationEmail(lastSignUpEmail);
    setLoading(false);

    if (error) {
      toast.error('Erreur lors du renvoi: ' + error.message);
    } else {
      toast.success('Email de confirmation renvoyé !');
      setSignUpCooldown(60); // Reset cooldown
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        toast.error('Email ou mot de passe incorrect');
      } else {
        toast.error('Erreur lors de la connexion: ' + error.message);
      }
    } else {
      toast.success('Connexion réussie !');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await resetPassword(resetEmail);
    setLoading(false);

    if (error) {
      toast.error('Erreur lors de l\'envoi de l\'email: ' + error.message);
    } else {
      toast.success('Email de réinitialisation envoyé ! Vérifiez votre boîte de réception.');
      setForgotPasswordMode(false);
      setResetEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* ANSUT Logo et branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-32 h-20 rounded-lg bg-white shadow-elegant mb-4 p-4">
            <img 
              src="/lovable-uploads/eebdb674-f051-486d-bb7c-acc1f973cde9.webp" 
              alt="ANSUT - Agence Nationale du Service Universel des Télécommunications-TIC" 
              className="w-full h-full object-contain"
              width="128"
              height="80"
              loading="eager"
            />
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">QUALI-RH EXPERTS</h1>
          <p className="text-muted-foreground text-sm">
            Plateforme de gestion d'experts thématiques
          </p>
        </div>

        <Card className="shadow-elegant border-0 bg-gradient-card">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-semibold">
              {forgotPasswordMode ? 'Réinitialiser le mot de passe' : 'Accès à la plateforme'}
            </CardTitle>
            <CardDescription>
              {forgotPasswordMode 
                ? 'Saisissez votre email pour recevoir un lien de réinitialisation'
                : 'Connectez-vous pour accéder à vos données d\'experts'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {otpError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="flex flex-col gap-2">
                  <span>Le lien de confirmation a expiré.</span>
                  {lastSignUpEmail && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleResendConfirmation}
                      disabled={loading || signUpCooldown > 0}
                    >
                      {loading ? 'Envoi...' : signUpCooldown > 0 ? `Attendre ${signUpCooldown}s` : 'Renvoyer l\'email'}
                    </Button>
                  )}
                </AlertDescription>
              </Alert>
            )}
            
            {forgotPasswordMode ? (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Adresse email</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="votre.email@ansut.ci"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    className="bg-white/50"
                  />
                </div>
                
                <div className="space-y-3">
                  <Button type="submit" className="w-full h-11" disabled={loading}>
                    {loading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="w-full"
                    onClick={() => {
                      setForgotPasswordMode(false);
                      setResetEmail('');
                    }}
                  >
                    Retour à la connexion
                  </Button>
                </div>
              </form>
            ) : (
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/50">
                  <TabsTrigger value="signin" className="flex items-center gap-2 data-[state=active]:bg-white">
                    <LogIn className="h-4 w-4" />
                    Connexion
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="flex items-center gap-2 data-[state=active]:bg-white">
                    <UserPlus className="h-4 w-4" />
                    Inscription
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin" className="space-y-4 mt-6">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Adresse email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="votre.email@ansut.ci"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-white/50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="signin-password">Mot de passe</Label>
                        <button
                          type="button"
                          onClick={() => setForgotPasswordMode(true)}
                          className="text-sm text-primary hover:text-primary/80 transition-colors"
                        >
                          Mot de passe oublié ?
                        </button>
                      </div>
                      <div className="relative">
                        <Input
                          id="signin-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="bg-white/50"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full h-11" disabled={loading}>
                      {loading ? 'Connexion...' : 'Se connecter'}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4 mt-6">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Adresse email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="votre.email@ansut.ci"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-white/50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Mot de passe</Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Minimum 6 caractères"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          minLength={6}
                          className="bg-white/50"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                      <Input
                        id="confirm-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Répétez votre mot de passe"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                        className="bg-white/50"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-11" 
                      disabled={loading || signUpCooldown > 0}
                    >
                      {loading ? 'Inscription...' : signUpCooldown > 0 ? (
                        <span className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Attendre {signUpCooldown}s
                        </span>
                      ) : 'Créer un compte'}
                    </Button>

                    {signUpCooldown > 0 && lastSignUpEmail && (
                      <p className="text-sm text-center text-muted-foreground">
                        Vous n'avez pas reçu l'email ? Vous pourrez en demander un nouveau dans {signUpCooldown} secondes.
                      </p>
                    )}

                    {signUpCooldown === 0 && lastSignUpEmail && (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={handleResendConfirmation}
                        disabled={loading}
                      >
                        {loading ? 'Envoi...' : 'Renvoyer l\'email de confirmation'}
                      </Button>
                    )}
                  </form>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
        
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            © 2024 ANSUT - Tous droits réservés
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;