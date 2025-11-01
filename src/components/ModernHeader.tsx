import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, ChevronDown, LogOut, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useUnifiedRole } from "@/hooks/useUnifiedRole";
import ansutLogo from "@/assets/ansut-logo-official.png";

const getRoleLabel = (role: string | null): string => {
  const labels: Record<string, string> = {
    SUPERADMIN: "Super Administrateur",
    DG: "Directeur Général",
    SI: "Système d'Information",
    DRH: "Directeur RH",
    RDRH: "Responsable DRH",
    RH_ASSISTANT: "Assistant RH",
    CONSULTANT: "Consultant",
    POSTULANT: "Postulant",
  };
  return role ? labels[role] || role : "Aucun rôle";
};

interface NavItem {
  title: string;
  href: string;
  requiredRole?: string[];
}

interface NavGroup {
  label: string;
  items: NavItem[];
  requiredRole?: string[];
}

export function ModernHeader() {
  const { user, signOut } = useAuth();
  const { role } = useUnifiedRole();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const roleLabel = getRoleLabel(role);

  const navGroups: NavGroup[] = [
    {
      label: "Dashboard",
      items: [{ title: "Tableau de Bord", href: "/dashboard" }],
    },
    {
      label: "Gestion",
      items: [
        { title: "Import de Profils", href: "/import", requiredRole: ["SUPERADMIN", "DG", "SI", "DRH", "RDRH"] },
        { title: "Base de Données", href: "/database", requiredRole: ["SUPERADMIN", "DG", "SI", "DRH", "RDRH"] },
        { title: "Qualification", href: "/qualification", requiredRole: ["SUPERADMIN", "DG", "SI", "DRH", "RDRH", "RH_ASSISTANT"] },
      ],
      requiredRole: ["SUPERADMIN", "DG", "SI", "DRH", "RDRH", "RH_ASSISTANT"],
    },
    {
      label: "Analytics",
      items: [{ title: "Analytics", href: "/analytics", requiredRole: ["SUPERADMIN", "DG", "SI", "DRH"] }],
      requiredRole: ["SUPERADMIN", "DG", "SI", "DRH"],
    },
    {
      label: "Administration",
      items: [
        { title: "Gestion des Rôles", href: "/admin/roles", requiredRole: ["SUPERADMIN"] },
        { title: "Permissions", href: "/admin/permissions", requiredRole: ["SUPERADMIN"] },
        { title: "Form Builder", href: "/admin/form-builder", requiredRole: ["SUPERADMIN"] },
      ],
      requiredRole: ["SUPERADMIN"],
    },
  ];

  const hasPermission = (requiredRoles?: string[]) => {
    if (!requiredRoles || requiredRoles.length === 0) return true;
    return role ? requiredRoles.includes(role) : false;
  };

  const filteredNavGroups = navGroups
    .filter(group => hasPermission(group.requiredRole))
    .map(group => ({
      ...group,
      items: group.items.filter(item => hasPermission(item.requiredRole)),
    }))
    .filter(group => group.items.length > 0);

  const isActive = (href: string) => location.pathname === href;

  const userInitials = user?.email
    ?.split("@")[0]
    .split(".")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl border-border/40 shadow-soft">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo + Title */}
        <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img src={ansutLogo} alt="ANSUT" className="h-10 w-auto object-contain" />
          <div className="hidden md:block">
            <span className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">
              QUALI-RH
            </span>
            <span className="text-xs text-muted-foreground"> EXPERTS</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {filteredNavGroups.map((group) => {
            if (group.items.length === 1) {
              // Single item - render as button
              const item = group.items[0];
              return (
                <Button
                  key={item.href}
                  variant={isActive(item.href) ? "default" : "ghost"}
                  size="sm"
                  asChild
                  className="transition-all duration-200"
                >
                  <Link to={item.href}>{item.title}</Link>
                </Button>
              );
            } else {
              // Multiple items - render as dropdown
              return (
                <DropdownMenu key={group.label}>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant={group.items.some(item => isActive(item.href)) ? "default" : "ghost"} 
                      size="sm"
                      className="transition-all duration-200"
                    >
                      {group.label}
                      <ChevronDown className="ml-1 h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56 bg-background/95 backdrop-blur-xl border-border/40">
                    {group.items.map((item) => (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link
                          to={item.href}
                          className={`w-full cursor-pointer ${
                            isActive(item.href) ? "bg-accent text-accent-foreground font-medium" : ""
                          }`}
                        >
                          {item.title}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }
          })}
        </nav>

        {/* Right Section: User Menu + Mobile Trigger */}
        <div className="flex items-center gap-2">
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 hover:bg-accent/50 transition-all duration-200">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs bg-gradient-primary text-white">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-xs font-medium">{user?.email?.split("@")[0]}</span>
                  <span className="text-[10px] text-muted-foreground">{roleLabel}</span>
                </div>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-xl border-border/40">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.email}</p>
                  <p className="text-xs text-muted-foreground">{roleLabel}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Mon Profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/mes-candidatures" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Mes Candidatures
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="icon" className="border-border/40">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 bg-background/95 backdrop-blur-xl">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <img src={ansutLogo} alt="ANSUT" className="h-8 w-auto" />
                  <span className="bg-gradient-primary bg-clip-text text-transparent">QUALI-RH</span>
                </SheetTitle>
                <SheetDescription>
                  Navigation principale
                </SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col gap-2 mt-6">
                {filteredNavGroups.map((group) => (
                  <div key={group.label} className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground px-2 py-1">
                      {group.label}
                    </p>
                    {group.items.map((item) => (
                      <Button
                        key={item.href}
                        variant={isActive(item.href) ? "default" : "ghost"}
                        className="w-full justify-start"
                        asChild
                        onClick={() => setMobileOpen(false)}
                      >
                        <Link to={item.href}>{item.title}</Link>
                      </Button>
                    ))}
                  </div>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
