import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  
  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    
    const breadcrumbMap: Record<string, string> = {
      '': 'Tableau de Bord',
      'import': 'Import de Profils',
      'database': 'Base de Données',
      'qualification': 'Qualification',
      'campaigns': 'Appels à Candidatures',
      'candidature': 'Candidature',
      'analytics': 'Analytics'
    };
    
    if (pathSegments.length === 0) {
      return [{ name: 'Tableau de Bord', path: '/', isLast: true }];
    }
    
    const breadcrumbs = [
      { name: 'Accueil', path: '/', isLast: false }
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
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border bg-background px-6">
            <div className="flex items-center gap-4 flex-1">
              <SidebarTrigger className="h-8 w-8" />
              
              {/* Breadcrumbs */}
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((breadcrumb, index) => (
                    <div key={breadcrumb.path} className="flex items-center">
                      {index > 0 && <BreadcrumbSeparator />}
                      <BreadcrumbItem>
                        {breadcrumb.isLast ? (
                          <BreadcrumbPage className="font-medium">
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
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}