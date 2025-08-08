import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCampaigns } from "@/hooks/useCampaigns";
import { Megaphone, Plus, Calendar, Euro, Users, Eye } from "lucide-react";

export default function Campaigns() {
  const { data: campaigns, isLoading } = useCampaigns();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success text-success-foreground">Actif</Badge>;
      case 'draft':
        return <Badge variant="secondary">Brouillon</Badge>;
      case 'completed':
        return <Badge variant="outline">Terminé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-4">Appels à Candidatures</h1>
              <p className="text-lg text-muted-foreground">
                Lancez des campagnes ciblées et gérez les réponses
              </p>
            </div>
            <Button className="bg-gradient-primary" size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Nouvelle Campagne
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card border-0 bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Megaphone className="h-8 w-8 text-primary mr-3" />
                <div>
                  <p className="text-2xl font-bold">{campaigns?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Total Campagnes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card border-0 bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Megaphone className="h-8 w-8 text-success mr-3" />
                <div>
                  <p className="text-2xl font-bold">
                    {campaigns?.filter(c => c.status === 'active').length || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Actives</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card border-0 bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Euro className="h-8 w-8 text-warning mr-3" />
                <div>
                  <p className="text-2xl font-bold">
                    {campaigns?.reduce((sum, c) => sum + (c.budget || 0), 0).toLocaleString()}€
                  </p>
                  <p className="text-sm text-muted-foreground">Budget Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card border-0 bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-info mr-3" />
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Candidatures</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaigns List */}
        <Card className="shadow-card border-0 bg-gradient-card">
          <CardHeader>
            <CardTitle>Vos Campagnes</CardTitle>
            <CardDescription>
              Gérez et suivez toutes vos campagnes de recrutement
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Chargement des campagnes...</p>
              </div>
            ) : !campaigns || campaigns.length === 0 ? (
              <div className="text-center py-12">
                <Megaphone className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucune campagne pour le moment</h3>
                <p className="text-muted-foreground mb-6">
                  Créez votre première campagne pour commencer à recruter des experts
                </p>
                <Button className="bg-gradient-primary">
                  <Plus className="mr-2 h-4 w-4" />
                  Créer une campagne
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="border border-border rounded-lg p-6 hover:shadow-subtle transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{campaign.title}</h3>
                          {getStatusBadge(campaign.status)}
                        </div>
                        <p className="text-muted-foreground mb-4">{campaign.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center">
                            <Euro className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>Budget: {campaign.budget?.toLocaleString()}€</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>Deadline: {new Date(campaign.deadline).toLocaleDateString('fr-FR')}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>0 candidatures</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Voir
                        </Button>
                        <Button variant="outline" size="sm">
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