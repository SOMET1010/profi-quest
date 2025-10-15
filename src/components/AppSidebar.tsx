import { 
  ChevronUp,
  Home,
  FileSpreadsheet,
  Users,
  UserCheck,
  Megaphone,
  BarChart3,
  UserCircle,
  LogOut,
  Menu,
  Shield
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useHasRole, AppRole } from "@/hooks/useRole";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ansutLogo from "/lovable-uploads/eebdb674-f051-486d-bb7c-acc1f973cde9.png";

interface NavigationItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredRole?: AppRole;
}

const mainNavigation: NavigationItem[] = [
  {
    title: "Tableau de Bord",
    url: "/",
    icon: Home,
    requiredRole: "FINANCE"
  }
];

const managementNavigation: NavigationItem[] = [
  {
    title: "Import de Profils",
    url: "/import",
    icon: FileSpreadsheet,
    requiredRole: "DG"
  },
  {
    title: "Base de Données",
    url: "/database",
    icon: Users,
    requiredRole: "FINANCE"
  },
  {
    title: "Qualification",
    url: "/qualification",
    icon: UserCheck,
    requiredRole: "FINANCE"
  }
];

const campaignsNavigation: NavigationItem[] = [
  {
    title: "Appels à Candidatures",
    url: "/campaigns",
    icon: Megaphone,
    requiredRole: "FINANCE"
  },
  {
    title: "Candidature",
    url: "/candidature",
    icon: UserCircle,
    requiredRole: "AGENT"
  }
];

const analyticsNavigation: NavigationItem[] = [
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
    requiredRole: "DG"
  }
];

const adminNavigation: NavigationItem[] = [
  {
    title: "Gestion des Rôles",
    url: "/admin/roles",
    icon: Shield,
    requiredRole: "DG"
  }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { userRole } = useHasRole('READONLY');
  
  const currentPath = location.pathname;
  
  const hasPermission = (requiredRole?: AppRole) => {
    if (!requiredRole || !userRole) return false;
    
    const roleHierarchy = { DG: 4, FINANCE: 3, AGENT: 2, READONLY: 1 };
    const userRoleLevel = roleHierarchy[userRole];
    const requiredRoleLevel = roleHierarchy[requiredRole];
    
    return userRoleLevel >= requiredRoleLevel;
  };

  const filterNavigation = (items: NavigationItem[]) => 
    items.filter(item => hasPermission(item.requiredRole));

  const getNavClassName = (url: string) => {
    const isActive = currentPath === url;
    return isActive 
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
      : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground";
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const getUserInitials = () => {
    if (!user?.email) return "U";
    return user.email.split('@')[0].substring(0, 2).toUpperCase();
  };

  const getRoleLabel = () => {
    const roleLabels = {
      DG: "Directeur Général",
      FINANCE: "Finance", 
      AGENT: "Agent",
      READONLY: "Lecture seule"
    };
    return userRole ? roleLabels[userRole] : "Utilisateur";
  };

  return (
    <Sidebar className="border-r border-sidebar-border">
      {/* Header */}
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <img 
            src={ansutLogo} 
            alt="ANSUT" 
            className={`object-contain transition-all duration-200 ${
              collapsed ? "h-8 w-8" : "h-10 w-20"
            }`}
          />
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-sidebar-foreground text-sm">
                QUALI-RH
              </span>
              <span className="text-xs text-sidebar-foreground/70">
                EXPERTS
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* Main Navigation */}
        {filterNavigation(mainNavigation).length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Principal</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filterNavigation(mainNavigation).map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        className={getNavClassName(item.url)}
                      >
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Management Navigation */}
        {filterNavigation(managementNavigation).length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Gestion</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filterNavigation(managementNavigation).map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        className={getNavClassName(item.url)}
                      >
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Campaigns Navigation */}
        {filterNavigation(campaignsNavigation).length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Campagnes</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filterNavigation(campaignsNavigation).map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        className={getNavClassName(item.url)}
                      >
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Analytics Navigation */}
        {filterNavigation(analyticsNavigation).length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Analytics</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filterNavigation(analyticsNavigation).map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        className={getNavClassName(item.url)}
                      >
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Administration Navigation */}
        {filterNavigation(adminNavigation).length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filterNavigation(adminNavigation).map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        className={getNavClassName(item.url)}
                      >
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Footer with User Menu */}
      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton 
                  size="lg" 
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  {!collapsed && (
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user?.email?.split('@')[0]}
                      </span>
                      <span className="truncate text-xs text-sidebar-foreground/70">
                        {getRoleLabel()}
                      </span>
                    </div>
                  )}
                  <ChevronUp className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="right" 
                align="end" 
                sideOffset={4}
              >
                <DropdownMenuItem onClick={handleSignOut} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  <span>Se déconnecter</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}