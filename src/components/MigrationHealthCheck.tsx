import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-react';
import { FEATURES } from '@/config/features';

type HealthMetric = {
  metric: string;
  count: number;
  status: 'ok' | 'warning' | 'error' | 'info';
};

/**
 * Composant de vérification de santé du système de rôles
 * Affiche l'état de la migration et les métriques importantes
 */
export function MigrationHealthCheck() {
  const { data: health, isLoading } = useQuery({
    queryKey: ['role-system-health'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('check_role_system_health');
      
      if (error) {
        console.error('Error checking role system health:', error);
        return [];
      }
      
      return data as HealthMetric[];
    },
    enabled: FEATURES.MIGRATION_WARNING,
    refetchInterval: 60000, // Rafraîchir toutes les minutes
  });

  // Ne pas afficher si le feature flag est désactivé
  if (!FEATURES.MIGRATION_WARNING) {
    return null;
  }

  if (isLoading) {
    return null; // Silencieux pendant le chargement
  }

  if (!health || health.length === 0) {
    return null;
  }

  // Vérifier s'il y a des problèmes
  const hasErrors = health.some(h => h.status === 'error');
  const hasWarnings = health.some(h => h.status === 'warning');

  // Ne rien afficher si tout va bien
  if (!hasErrors && !hasWarnings) {
    return null;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      ok: 'default',
      warning: 'outline',
      error: 'destructive',
      info: 'secondary',
    } as const;
    
    return variants[status as keyof typeof variants] || 'secondary';
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      {hasErrors && (
        <Alert variant="destructive" className="mb-2">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Problème de migration détecté</AlertTitle>
          <AlertDescription>
            Le système de rôles nécessite une attention. Contactez un administrateur.
          </AlertDescription>
        </Alert>
      )}
      
      {hasWarnings && !hasErrors && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              État du système de rôles
            </CardTitle>
            <CardDescription className="text-xs">
              Migration en cours - Quelques anomalies détectées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {health
                .filter(h => h.status !== 'ok' && h.status !== 'info')
                .map((metric, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(metric.status)}
                      <span className="text-xs">{metric.metric}</span>
                    </div>
                    <Badge variant={getStatusBadge(metric.status)} className="text-xs">
                      {metric.count}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
