import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useProfiles } from "@/hooks/useProfiles";
import { Users, Search, Filter, Plus, Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Database() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { data: profiles, isLoading } = useProfiles();

  const filteredProfiles = profiles?.filter(profile => 
    profile.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Base de Données Experts</h1>
          <p className="text-lg text-muted-foreground">
            Consultez et gérez tous vos profils d'experts qualifiés
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="shadow-card border-0 bg-gradient-card mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, email, compétences..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
                <Filter className="mr-2 h-4 w-4" />
                Filtres
              </Button>
              <Button className="bg-gradient-primary">
                <Plus className="mr-2 h-4 w-4" />
                Nouveau Profil
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-card border-0 bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-primary mr-3" />
                <div>
                  <p className="text-2xl font-bold">{profiles?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Total Profils</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card border-0 bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-success mr-3" />
                <div>
                  <p className="text-2xl font-bold">{filteredProfiles.length}</p>
                  <p className="text-sm text-muted-foreground">Résultats</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card border-0 bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-warning mr-3" />
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Qualité élevée</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profiles List */}
        <Card className="shadow-card border-0 bg-gradient-card">
          <CardHeader>
            <CardTitle>Profils d'Experts</CardTitle>
            <CardDescription>
              Liste complète des experts dans votre base de données
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Chargement des profils...</p>
              </div>
            ) : filteredProfiles.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm ? "Aucun profil trouvé pour cette recherche" : "Aucun profil dans la base de données"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProfiles.map((profile) => (
                  <div key={profile.id} className="border border-border rounded-lg p-4 hover:shadow-subtle transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">
                            {profile.first_name} {profile.last_name}
                          </h3>
                          <Badge variant="outline">
                            Profil Expert
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-muted-foreground mb-3">
                          {profile.email && (
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-2" />
                              {profile.email}
                            </div>
                          )}
                          {profile.phone && (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-2" />
                              {profile.phone}
                            </div>
                          )}
                        </div>

                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/expert/${profile.id}`)}
                        >
                          Voir
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/candidature?profile=${profile.id}`)}
                        >
                          Modifier
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}