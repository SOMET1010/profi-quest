import { ReactNode } from "react";
import { ModernHeader } from "./ModernHeader";
import { MigrationHealthCheck } from "./MigrationHealthCheck";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { useLocation } from "react-router-dom";

interface ModernLayoutProps {
  children: ReactNode;
}

export function ModernLayout({ children }: ModernLayoutProps) {
  const location = useLocation();
  
  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    
    const breadcrumbMap: Record<string, string> = {
      'dashboard': 'Tableau de Bord',
      'import': 'Import de Profils',
      'database': 'Base de Données',
      'qualification': 'Qualification',
      'campaigns': 'Appels à Candidatures',
      'candidature': 'Candidature',
      'analytics': 'Analytics',
      'admin': 'Administration',
      'roles': 'Gestion des Rôles',
      'permissions': 'Permissions',
      'form-builder': 'Form Builder',
      'profile': 'Mon Profil',
      'mes-candidatures': 'Mes Candidatures',
    };
    
    if (pathSegments.length === 0) {
      return [{ name: 'Tableau de Bord', path: '/dashboard', isLast: true }];
    }
    
    const breadcrumbs = [
      { name: 'Accueil', path: '/dashboard', isLast: false }
    ];
    
    pathSegments.forEach((segment, index) => {
      const isLast = index === pathSegments.length - 1;
      const path = '/' + pathSegments.slice(0, index + 1).join('/');
      const name = breadcrumbMap[segment] || segment;
      
      breadcrumbs.push({ name, path, isLast });
    });
    
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="min-h-screen flex flex-col w-full">
      <a href="#main-content" className="skip-to-main">
        Aller au contenu principal
      </a>
      
      <ModernHeader />
      
      {/* Breadcrumbs */}
      <div className="border-b bg-muted/30 backdrop-blur-sm">
        <div className="container py-3 px-4">
          <Breadcrumb aria-label="Fil d'Ariane">
            <BreadcrumbList>
              {breadcrumbs.map((breadcrumb, index) => (
                <div key={breadcrumb.path} className="flex items-center">
                  {index > 0 && <BreadcrumbSeparator aria-hidden="true" />}
                  <BreadcrumbItem>
                    {breadcrumb.isLast ? (
                      <BreadcrumbPage className="font-medium" aria-current="page">
                        {breadcrumb.name}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink 
                        href={breadcrumb.path}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {breadcrumb.name}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Main Content */}
      <main id="main-content" className="flex-1 w-full" role="main" tabIndex={-1}>
        {children}
      </main>

      <MigrationHealthCheck />
    </div>
  );
}
