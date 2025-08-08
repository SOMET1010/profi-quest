import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileSpreadsheet, Upload, Database, Download, CheckCircle, ArrowRight, AlertCircle } from "lucide-react";
import { useRef, useState } from "react";
import * as XLSX from 'xlsx';

// Types pour le mapping
interface DbField {
  key: string;
  label: string;
  required: boolean;
  type: string;
}

export default function ImportProfiles() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [excelData, setExcelData] = useState<any[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showMapping, setShowMapping] = useState(false);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});

  // Définition des champs de la base de données
  const dbFields: DbField[] = [
    { key: 'first_name', label: 'Prénom', required: true, type: 'text' },
    { key: 'last_name', label: 'Nom', required: true, type: 'text' },
    { key: 'email', label: 'Email', required: true, type: 'email' },
    { key: 'phone', label: 'Téléphone', required: false, type: 'text' },
    { key: 'location', label: 'Localisation', required: false, type: 'text' },
    { key: 'experience_years', label: 'Années d\'expérience', required: false, type: 'number' },
    { key: 'hourly_rate', label: 'Taux horaire', required: false, type: 'number' },
  ];

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

  const handleColumnMappingClick = () => {
    console.log('Bouton mapper les colonnes cliqué');
    console.log('showMapping actuel:', showMapping);
    setShowMapping(true);
    console.log('showMapping après setState:', true);
  };

  const handleMappingChange = (excelColumn: string, dbField: string) => {
    setColumnMapping(prev => ({
      ...prev,
      [excelColumn]: dbField === 'ignore' ? '' : dbField
    }));
  };

  const getRequiredFieldsStatus = () => {
    const requiredFields = dbFields.filter(field => field.required);
    const mappedRequiredFields = requiredFields.filter(field => 
      Object.values(columnMapping).includes(field.key)
    );
    return {
      total: requiredFields.length,
      mapped: mappedRequiredFields.length,
      missing: requiredFields.filter(field => 
        !Object.values(columnMapping).includes(field.key)
      )
    };
  };

  const transformDataForImport = () => {
    return excelData.map(row => {
      const transformedRow: any = {};
      
      headers.forEach((header, index) => {
        const dbField = columnMapping[header];
        if (dbField) {
          let value = row[index];
          
          // Transformation basée sur le type de champ
          const fieldConfig = dbFields.find(f => f.key === dbField);
          if (fieldConfig?.type === 'number' && value) {
            value = parseFloat(value) || 0;
          }
          
          transformedRow[dbField] = value;
        }
      });
      
      return transformedRow;
    });
  };

  const requiredStatus = getRequiredFieldsStatus();

  // Debug logs
  console.log('Current state - showMapping:', showMapping, 'excelData.length:', excelData.length);

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
                <Button 
                  className="bg-gradient-primary"
                  disabled={!showMapping || requiredStatus.mapped < requiredStatus.total}
                >
                  Importer ces données
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleColumnMappingClick}
                  className="bg-secondary hover:bg-secondary/80"
                >
                  Mapper les colonnes
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Interface de mapping des colonnes */}
        {showMapping && excelData.length > 0 && (
          <Card className="mt-8 shadow-card border-0 bg-gradient-card">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <ArrowRight className="mr-3 h-6 w-6 text-primary" />
                Mapping des Colonnes
              </CardTitle>
              <CardDescription>
                Associez les colonnes de votre fichier Excel aux champs de la base de données
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Statut des champs requis */}
              <div className="mb-6 p-4 rounded-lg bg-muted/20">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  <span className="font-medium">Champs requis: {requiredStatus.mapped}/{requiredStatus.total}</span>
                </div>
                {requiredStatus.missing.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    Champs manquants: {requiredStatus.missing.map(field => field.label).join(', ')}
                  </div>
                )}
              </div>

              {/* Mapping des colonnes */}
              <div className="grid gap-4">
                {headers.map((header, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{header}</div>
                      <div className="text-sm text-muted-foreground">
                        Exemple: {excelData[0]?.[index] || 'Pas de données'}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Select
                        value={columnMapping[header] || 'ignore'}
                        onValueChange={(value) => handleMappingChange(header, value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sélectionner un champ" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ignore">
                            <span className="text-muted-foreground">Ignorer cette colonne</span>
                          </SelectItem>
                          {dbFields.map((field) => (
                            <SelectItem key={field.key} value={field.key}>
                              <div className="flex items-center gap-2">
                                <span>{field.label}</span>
                                {field.required && (
                                  <Badge variant="destructive" className="text-xs">
                                    Requis
                                  </Badge>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>

              {/* Aperçu du mapping */}
              {Object.keys(columnMapping).length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium mb-4">Aperçu des données transformées</h4>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {dbFields
                            .filter(field => Object.values(columnMapping).includes(field.key))
                            .map((field) => (
                              <TableHead key={field.key} className="whitespace-nowrap">
                                {field.label}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                              </TableHead>
                            ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transformDataForImport().slice(0, 3).map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
                            {dbFields
                              .filter(field => Object.values(columnMapping).includes(field.key))
                              .map((field) => (
                                <TableCell key={field.key} className="whitespace-nowrap">
                                  {row[field.key] || '-'}
                                </TableCell>
                              ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Aperçu des 3 premières lignes transformées
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}