import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Upload, Database, Download } from "lucide-react";

export default function ImportProfiles() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Import de Profils</h1>
          <p className="text-lg text-muted-foreground">
            Importez vos CVthèques Excel et mappez automatiquement les colonnes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-card border-0 bg-gradient-card">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Upload className="mr-3 h-6 w-6 text-primary" />
                Nouvel Import
              </CardTitle>
              <CardDescription>
                Téléchargez votre fichier Excel contenant les profils d'experts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center bg-muted/20">
                <FileSpreadsheet className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  Glissez-déposez votre fichier Excel ici ou cliquez pour sélectionner
                </p>
                <Button className="bg-gradient-primary">
                  Sélectionner fichier
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Formats acceptés: .xlsx, .xls</p>
                <p>Taille maximum: 50 MB</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0 bg-gradient-card">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Database className="mr-3 h-6 w-6 text-primary" />
                Imports Récents
              </CardTitle>
              <CardDescription>
                Historique de vos derniers imports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">CVtheque_Experts_2024.xlsx</p>
                      <p className="text-sm text-muted-foreground">1,247 profils • 28 jan 2024</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Rapport
                    </Button>
                  </div>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Profils_Techniques_Jan.xlsx</p>
                      <p className="text-sm text-muted-foreground">892 profils • 15 jan 2024</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Rapport
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}