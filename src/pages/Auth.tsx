import { useState, useEffect, memo } from 'react';
import { Navigate, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Eye, EyeOff, UserPlus, LogIn, AlertCircle, Clock } from 'lucide-react';

const Auth = memo(() => {
  const { user, loading: authLoading, signUp, signIn, resetPassword, resendConfirmationEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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

  // Restore cooldown from localStorage on mount with robust validation
  useEffect(() => {
    let executed = false;
    
    if (executed) return;
    executed = true;

    const storedTimestamp = localStorage.getItem('signUpTimestamp');
    const storedEmail = localStorage.getItem('lastSignUpEmail');
    
    if (storedTimestamp && storedEmail) {
      const timestamp = parseInt(storedTimestamp);
      const elapsed = Math.floor((Date.now() - timestamp) / 1000);
      const remaining = Math.max(0, 60 - elapsed);
      
      console.log('[Cooldown Debug - ONCE]', { timestamp, elapsed, remaining });
      
      // Si le timestamp est trop ancien (>2 minutes), on le supprime
      if (elapsed > 120) {
        localStorage.removeItem('signUpTimestamp');
        localStorage.removeItem('lastSignUpEmail');
        console.log('[Cooldown] Données expirées supprimées (>2min)');
        return;
      }
      
      if (remaining > 0) {
        setSignUpCooldown(remaining);
        setLastSignUpEmail(storedEmail);
        console.log('[Cooldown] Restauré:', remaining, 'secondes restantes');
      } else {
        // Cleanup expired data
        localStorage.removeItem('signUpTimestamp');
        localStorage.removeItem('lastSignUpEmail');
        console.log('[Cooldown] Nettoyage des données expirées');
      }
    } else {
      console.log('[Cooldown] Aucun cooldown actif');
    }
  }, []);

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
    } else if (signUpCooldown === 0 && lastSignUpEmail) {
      // Cleanup localStorage when cooldown ends
      localStorage.removeItem('signUpTimestamp');
      localStorage.removeItem('lastSignUpEmail');
    }
  }, [signUpCooldown, lastSignUpEmail]);

  // 🔥 NOUVEAU : Protection contre l'état loading bloqué
  useEffect(() => {
    // Reset loading après 30 secondes si bloqué
    if (loading) {
      const timeout = setTimeout(() => {
        console.warn('[Auth] Loading state stuck, forcing reset');
        setLoading(false);
        toast.error('La requête a pris trop de temps. Veuillez réessayer.');
      }, 30000);
      return () => clearTimeout(timeout);
    }
  }, [loading]);

  // Redirect if already authenticated with intelligent routing
  useEffect(() => {
    if (user && !authLoading) {
      const checkProfileAndRedirect = async () => {
        try {
          // Check if user has a complete profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, application_submitted_at, first_name, last_name')
            .eq('id', user.id)
            .maybeSingle();

          // Check if user has any applications
          const { data: applications } = await supabase
            .from('public_applications')
            .select('id')
            .eq('user_id', user.id)
            .limit(1);

          // Intelligent redirection logic
          if (!profile || !profile.first_name || !profile.last_name) {
            // New user or incomplete profile -> redirect to profile page
            navigate('/profile?firstTime=true', { replace: true });
          } else if (!applications || applications.length === 0) {
            // Existing profile but no applications -> redirect to profile
            navigate('/profile', { replace: true });
          } else {
            // User with profile and applications -> use default routing
            const from = (location.state as any)?.from || '/dashboard';
            navigate(from, { replace: true });
          }
        } catch (error) {
          console.error('[Auth] Error checking profile:', error);
          // Fallback to dashboard on error
          const from = (location.state as any)?.from || '/dashboard';
          navigate(from, { replace: true });
        }
      };

      checkProfileAndRedirect();
    }
  }, [user, authLoading, navigate, location]);

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
    
    try {
      const { error } = await signUp(email, password);

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
        
        // Persist cooldown in localStorage
        localStorage.setItem('signUpTimestamp', Date.now().toString());
        localStorage.setItem('lastSignUpEmail', email);
      }
    } catch (err) {
      console.error('[SignUp Error]', err);
      toast.error('Une erreur inattendue s\'est produite');
    } finally {
      // 🔥 AMÉLIORATION : Toujours désactiver loading
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!lastSignUpEmail) {
      toast.error('Aucune adresse email trouvée');
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await resendConfirmationEmail(lastSignUpEmail);

      if (error) {
        toast.error('Erreur lors du renvoi: ' + error.message);
      } else {
        toast.success('Email de confirmation renvoyé !');
        setSignUpCooldown(60); // Reset cooldown
        
        // Update localStorage timestamp
        localStorage.setItem('signUpTimestamp', Date.now().toString());
      }
    } catch (err) {
      console.error('[Resend Error]', err);
      toast.error('Une erreur inattendue s\'est produite');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('[Auth] Début de la connexion');
    console.log('[Auth] Email:', email);
    console.log('[Auth] Loading avant:', loading);
    
    setLoading(true);
    
    try {
      console.log('[Auth] Appel de signIn...');
      const { error } = await signIn(email, password);
      console.log('[Auth] Réponse de signIn:', { error });

      if (error) {
        console.error('[Auth] Erreur détectée:', error);
        
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Email ou mot de passe incorrect');
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('Veuillez confirmer votre email avant de vous connecter');
        } else if (error.message.includes('requested path is invalid')) {
          toast.error('Configuration Supabase incorrecte. Vérifiez les URLs de redirection.');
          console.error('[Auth] Erreur de configuration Supabase - vérifiez Site URL et Redirect URLs');
        } else {
          toast.error('Erreur lors de la connexion: ' + error.message);
        }
        
        setLoading(false);
      } else {
        console.log('[Auth] Connexion réussie !');
        toast.success('Connexion réussie !');
        // Rediriger vers la page d'origine ou le dashboard
        const from = (location.state as any)?.from || '/dashboard';
        navigate(from);
      }
    } catch (err) {
      console.error('[Auth] Exception capturée:', err);
      toast.error('Une erreur inattendue s\'est produite');
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await resetPassword(resetEmail);

      if (error) {
        toast.error('Erreur lors de l\'envoi de l\'email: ' + error.message);
      } else {
        toast.success('Email de réinitialisation envoyé ! Vérifiez votre boîte de réception.');
        setForgotPasswordMode(false);
        setResetEmail('');
      }
    } catch (err) {
      console.error('[Reset Password Error]', err);
      toast.error('Une erreur inattendue s\'est produite');
    } finally {
      setLoading(false);
    }
  };

  // 🔥 NOUVEAU : Fonction pour forcer le reset des états bloqués
  const forceResetStates = () => {
    setLoading(false);
    setSignUpCooldown(0);
    setLastSignUpEmail('');
    localStorage.removeItem('signUpTimestamp');
    localStorage.removeItem('lastSignUpEmail');
    toast.info('États réinitialisés');
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
            Système de gestion des évaluations du personnel
          </p>
        </div>

        <Card className="backdrop-blur-sm bg-white/80 shadow-elegant border-0">
          <CardContent className="pt-6">
            {otpError && (
              <Alert className="mb-4 bg-destructive/10 border-destructive/20">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <AlertDescription className="text-destructive">
                  Le lien de confirmation a expiré. Demandez un nouveau lien ci-dessous.
                </AlertDescription>
              </Alert>
            )}

            {forgotPasswordMode ? (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h2 className="text-xl font-semibold text-primary">Réinitialiser le mot de passe</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Entrez votre adresse email pour recevoir un lien de réinitialisation
                  </p>
                </div>
                
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
                  
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setForgotPasswordMode(false)}
                      className="flex-1"
                      disabled={loading}
                    >
                      Annuler
                    </Button>
                    <Button type="submit" className="flex-1" disabled={loading}>
                      {loading ? 'Envoi...' : 'Envoyer'}
                    </Button>
                  </div>
                </form>
              </div>
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
                        disabled={loading}
                        className="bg-white/50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="signin-password">Mot de passe</Label>
                        <button
                          type="button"
                          onClick={() => setForgotPasswordMode(true)}
                          disabled={loading}
                          className="text-sm text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
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
                          disabled={loading}
                          className="bg-white/50 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={loading}
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
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Connexion...
                        </span>
                      ) : (
                        'Se connecter'
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4 mt-6">
                  {signUpCooldown > 0 && lastSignUpEmail ? (
                    <div className="space-y-4">
                      <Alert className="bg-primary/10 border-primary/20">
                        <AlertCircle className="h-4 w-4 text-primary" />
                        <AlertDescription className="text-sm space-y-2">
                          <p className="font-medium text-primary">
                            📧 Email de confirmation envoyé à :
                          </p>
                          <p className="font-mono text-xs bg-white/80 p-2 rounded border">
                            {lastSignUpEmail}
                          </p>
                          <div className="text-muted-foreground space-y-1 pt-2">
                            <p>✓ Vérifiez votre boîte de réception</p>
                            <p>✓ Consultez également le dossier <strong>spam/courrier indésirable</strong></p>
                            <p>✓ Le lien de confirmation est valide pendant 24 heures</p>
                          </div>
                        </AlertDescription>
                      </Alert>

                      <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>
                            Vous pourrez renvoyer l'email dans <strong className="text-primary">{signUpCooldown}</strong> seconde{signUpCooldown > 1 ? 's' : ''}
                          </span>
                        </div>
                        
                        <Button
                          onClick={handleResendConfirmation}
                          disabled={signUpCooldown > 0 || loading}
                          variant="outline"
                          className="w-full"
                        >
                          {loading ? (
                            <span className="flex items-center gap-2">
                              <span className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                              Envoi en cours...
                            </span>
                          ) : signUpCooldown > 0 ? (
                            `Renvoyer l'email (${signUpCooldown}s)`
                          ) : (
                            "Renvoyer l'email de confirmation"
                          )}
                        </Button>
                      </div>

                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setSignUpCooldown(0);
                            setLastSignUpEmail('');
                            localStorage.removeItem('signUpTimestamp');
                            localStorage.removeItem('lastSignUpEmail');
                          }}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors underline"
                        >
                          Essayer avec une autre adresse email
                        </button>
                      </div>
                    </div>
                  ) : (
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
                          disabled={loading}
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
                            disabled={loading}
                            className="bg-white/50 pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={loading}
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
                          disabled={loading}
                          className="bg-white/50"
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full h-11" 
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Inscription...
                          </span>
                        ) : (
                          'Créer un compte'
                        )}
                      </Button>

                      {/* Debug button - Development only */}
                      {import.meta.env.DEV && signUpCooldown > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="w-full text-xs text-amber-600"
                          onClick={() => {
                            localStorage.removeItem('signUpTimestamp');
                            localStorage.removeItem('lastSignUpEmail');
                            setSignUpCooldown(0);
                            setLastSignUpEmail('');
                            toast.info('Cooldown réinitialisé (mode développement)');
                          }}
                        >
                          [DEV] Réinitialiser le cooldown
                        </Button>
                      )}
                    </form>
                  )}
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
});

export default Auth;