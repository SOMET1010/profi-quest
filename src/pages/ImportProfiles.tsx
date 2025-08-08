import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileSpreadsheet, Upload, Database, Download, CheckCircle } from "lucide-react";
import { useRef, useState } from "react";
import * as XLSX from 'xlsx';

export default function ImportProfiles() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [excelData, setExcelData] = useState<any[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setIsProcessing(true);
      console.log('Fichier sélectionné:', file.name);
      readExcelFile(file);
    }
  };

  const readExcelFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length > 0) {
          setHeaders(jsonData[0] as string[]);
          setExcelData(jsonData.slice(1) as any[][]);
        }
        setIsProcessing(false);
        console.log('Données Excel chargées:', jsonData.length, 'lignes');
      } catch (error) {
        console.error('Erreur lors de la lecture du fichier:', error);
        setIsProcessing(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

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
              <Input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center bg-muted/20">
                {isProcessing ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                    <p className="text-muted-foreground">Traitement du fichier en cours...</p>
                  </div>
                ) : selectedFile ? (
                  <div className="flex flex-col items-center">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                    <p className="text-foreground font-medium mb-2">{selectedFile.name}</p>
                    <p className="text-muted-foreground text-sm mb-4">
                      {excelData.length} lignes détectées
                    </p>
                    <Button className="bg-gradient-primary" onClick={handleFileSelect}>
                      Changer de fichier
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <FileSpreadsheet className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Glissez-déposez votre fichier Excel ici ou cliquez pour sélectionner
                    </p>
                    <Button className="bg-gradient-primary" onClick={handleFileSelect}>
                      Sélectionner fichier
                    </Button>
                  </div>
                )}
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

        {/* Aperçu des données */}
        {excelData.length > 0 && (
          <Card className="mt-8 shadow-card border-0 bg-gradient-card">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Database className="mr-3 h-6 w-6 text-primary" />
                Aperçu des Données
              </CardTitle>
              <CardDescription>
                Prévisualisation des {excelData.length} lignes importées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {headers.map((header, index) => (
                        <TableHead key={index} className="whitespace-nowrap">
                          {header}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {excelData.slice(0, 10).map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <TableCell key={cellIndex} className="whitespace-nowrap">
                            {cell || '-'}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {excelData.length > 10 && (
                <p className="text-sm text-muted-foreground mt-4">
                  Affichage des 10 premières lignes sur {excelData.length} au total
                </p>
              )}
              <div className="mt-6 flex gap-4">
                <Button className="bg-gradient-primary">
                  Importer ces données
                </Button>
                <Button variant="outline">
                  Mapper les colonnes
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}