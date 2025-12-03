import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Link2, X, CheckCircle, XCircle, AlertTriangle, Map, BarChart3, Trash2 } from 'lucide-react';
import { ROUTE_REGISTRY, isValidRoute, getRouteConfig } from '@/config/routes';
import { generateRouteAudit } from '@/utils/routeAudit';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Global warnings storage
interface RouteWarning {
  path: string;
  timestamp: Date;
  source: string;
}

let routeWarnings: RouteWarning[] = [];
let warningListeners: Array<() => void> = [];

export function registerRouteWarning(path: string, source: string = 'SafeLink') {
  const exists = routeWarnings.some(w => w.path === path);
  if (!exists) {
    routeWarnings = [...routeWarnings, { path, timestamp: new Date(), source }];
    warningListeners.forEach(listener => listener());
  }
}

export function clearRouteWarnings() {
  routeWarnings = [];
  warningListeners.forEach(listener => listener());
}

export function DevRouteAuditOverlay() {
  // Only render in development
  if (!import.meta.env.DEV) return null;

  const [isOpen, setIsOpen] = useState(false);
  const [warnings, setWarnings] = useState<RouteWarning[]>(routeWarnings);
  const location = useLocation();
  const audit = generateRouteAudit();
  const currentRouteConfig = getRouteConfig(location.pathname);
  const isCurrentValid = isValidRoute(location.pathname);

  // Subscribe to warning updates
  useEffect(() => {
    const updateWarnings = () => setWarnings([...routeWarnings]);
    warningListeners.push(updateWarnings);
    return () => {
      warningListeners = warningListeners.filter(l => l !== updateWarnings);
    };
  }, []);

  const handleClearWarnings = () => {
    clearRouteWarnings();
  };

  const accessColors: Record<string, string> = {
    public: 'bg-green-500/20 text-green-400 border-green-500/30',
    authenticated: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    applicant: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    admin: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-200 hover:scale-105"
        title="Route Audit Overlay"
      >
        <Link2 className="w-5 h-5" />
        {warnings.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center animate-pulse">
            {warnings.length}
          </span>
        )}
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-[400px] max-h-[500px] bg-card/95 backdrop-blur-md border border-border rounded-lg shadow-2xl overflow-hidden animate-in slide-in-from-bottom-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-border bg-muted/50">
            <div className="flex items-center gap-2">
              <Link2 className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm">Route Audit</span>
              {isCurrentValid ? (
                <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Valid
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-destructive/20 text-destructive border-destructive/30 text-xs">
                  <XCircle className="w-3 h-3 mr-1" />
                  Invalid
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Current Route Info */}
          <div className="p-3 border-b border-border bg-muted/30">
            <div className="text-xs text-muted-foreground mb-1">Current Route</div>
            <div className="font-mono text-sm text-foreground">{location.pathname}</div>
            {currentRouteConfig && (
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={`text-xs ${accessColors[currentRouteConfig.access]}`}>
                  {currentRouteConfig.access}
                </Badge>
                <span className="text-xs text-muted-foreground">{currentRouteConfig.label}</span>
              </div>
            )}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="stats" className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent h-9 p-0">
              <TabsTrigger value="stats" className="text-xs rounded-none data-[state=active]:bg-muted h-9 px-3">
                <BarChart3 className="w-3 h-3 mr-1" />
                Stats
              </TabsTrigger>
              <TabsTrigger value="routes" className="text-xs rounded-none data-[state=active]:bg-muted h-9 px-3">
                <Map className="w-3 h-3 mr-1" />
                Routes ({audit.totalRoutes})
              </TabsTrigger>
              <TabsTrigger value="warnings" className="text-xs rounded-none data-[state=active]:bg-muted h-9 px-3">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Warnings ({warnings.length})
              </TabsTrigger>
            </TabsList>

            {/* Stats Tab */}
            <TabsContent value="stats" className="p-3 m-0">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded bg-muted/50 border border-border">
                  <div className="text-2xl font-bold text-foreground">{audit.totalRoutes}</div>
                  <div className="text-xs text-muted-foreground">Total Routes</div>
                </div>
                <div className="p-2 rounded bg-green-500/10 border border-green-500/20">
                  <div className="text-2xl font-bold text-green-400">{audit.publicRoutes.length}</div>
                  <div className="text-xs text-green-400/70">Public</div>
                </div>
                <div className="p-2 rounded bg-blue-500/10 border border-blue-500/20">
                  <div className="text-2xl font-bold text-blue-400">{audit.protectedRoutes.length}</div>
                  <div className="text-xs text-blue-400/70">Protected</div>
                </div>
                <div className="p-2 rounded bg-purple-500/10 border border-purple-500/20">
                  <div className="text-2xl font-bold text-purple-400">{audit.dynamicRoutes.length}</div>
                  <div className="text-xs text-purple-400/70">Dynamic</div>
                </div>
              </div>
            </TabsContent>

            {/* Routes Tab */}
            <TabsContent value="routes" className="m-0">
              <ScrollArea className="h-[280px]">
                <div className="p-2 space-y-1">
                  {ROUTE_REGISTRY.map((route) => (
                    <div
                      key={route.path}
                      className={`p-2 rounded text-xs border ${
                        location.pathname === route.path || 
                        (route.isDynamic && isValidRoute(location.pathname) && getRouteConfig(location.pathname)?.path === route.path)
                          ? 'bg-primary/20 border-primary/40'
                          : 'bg-muted/30 border-border'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <code className="font-mono text-foreground">{route.path}</code>
                        <Badge variant="outline" className={`text-[10px] ${accessColors[route.access]}`}>
                          {route.access}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-muted-foreground">{route.label}</span>
                        {route.isDynamic && (
                          <Badge variant="outline" className="text-[10px] bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                            dynamic
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Warnings Tab */}
            <TabsContent value="warnings" className="m-0">
              <div className="p-2">
                {warnings.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mb-2 h-7 text-xs"
                    onClick={handleClearWarnings}
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Clear All
                  </Button>
                )}
              </div>
              <ScrollArea className="h-[240px]">
                <div className="px-2 pb-2 space-y-1">
                  {warnings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                      <CheckCircle className="w-8 h-8 mb-2 text-green-400" />
                      <span className="text-sm">No broken links detected</span>
                    </div>
                  ) : (
                    warnings.map((warning, index) => (
                      <div
                        key={`${warning.path}-${index}`}
                        className="p-2 rounded bg-destructive/10 border border-destructive/20"
                      >
                        <div className="flex items-center gap-2">
                          <XCircle className="w-3 h-3 text-destructive" />
                          <code className="font-mono text-xs text-destructive">{warning.path}</code>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] text-muted-foreground">{warning.source}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {warning.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </>
  );
}
