import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface FileUploadConfig {
  field_key: string;
  bucket_name: string;
  max_size_mb: number;
  allowed_extensions: string[];
  allowed_mime_types: string[];
}

export interface UploadedFileState {
  file: File;
  url: string | null;
  path: string | null;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export function useFileUpload() {
  const [uploadedFiles, setUploadedFiles] = useState<Map<string, UploadedFileState>>(new Map());
  const [configs, setConfigs] = useState<Map<string, FileUploadConfig>>(new Map());
  const [isLoadingConfigs, setIsLoadingConfigs] = useState(true);

  // Charger les configurations au mount
  const loadConfigs = useCallback(async () => {
    setIsLoadingConfigs(true);
    try {
      const { data, error } = await supabase
        .from('file_upload_config')
        .select('*');

      if (error) {
        console.error('Error loading file configs:', error);
        toast.error('Erreur de chargement des configurations');
        return;
      }

      const configMap = new Map<string, FileUploadConfig>();
      data.forEach(config => configMap.set(config.field_key, config));
      setConfigs(configMap);
    } catch (error) {
      console.error('Unexpected error loading configs:', error);
    } finally {
      setIsLoadingConfigs(false);
    }
  }, []);

  useEffect(() => {
    loadConfigs();
  }, [loadConfigs]);

  // Valider un fichier avant upload
  const validateFile = useCallback((fieldKey: string, file: File): { valid: boolean; error?: string } => {
    const config = configs.get(fieldKey);
    if (!config) {
      return { valid: false, error: 'Configuration non trouvée pour ce champ' };
    }

    // Vérifier la taille
    const maxSizeBytes = config.max_size_mb * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return {
        valid: false,
        error: `Fichier trop volumineux (max ${config.max_size_mb}MB, actuel: ${(file.size / 1024 / 1024).toFixed(2)}MB)`
      };
    }

    // Vérifier l'extension
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!fileExt || !config.allowed_extensions.includes(fileExt)) {
      return {
        valid: false,
        error: `Extension non autorisée. Formats acceptés: ${config.allowed_extensions.join(', ')}`
      };
    }

    // Vérifier le type MIME
    if (!config.allowed_mime_types.includes(file.type)) {
      return {
        valid: false,
        error: `Type de fichier non supporté`
      };
    }

    return { valid: true };
  }, [configs]);

  // Ajouter un fichier (sans uploader)
  const addFile = useCallback((fieldKey: string, file: File) => {
    const validation = validateFile(fieldKey, file);
    
    if (!validation.valid) {
      toast.error(validation.error);
      return false;
    }

    setUploadedFiles(prev => {
      const newMap = new Map(prev);
      newMap.set(fieldKey, {
        file,
        url: null,
        path: null,
        status: 'pending',
      });
      return newMap;
    });

    toast.success(`Fichier "${file.name}" prêt pour l'upload`);
    return true;
  }, [validateFile]);

  // Retirer un fichier
  const removeFile = useCallback((fieldKey: string) => {
    setUploadedFiles(prev => {
      const newMap = new Map(prev);
      newMap.delete(fieldKey);
      return newMap;
    });
  }, []);

  // Uploader un fichier
  const uploadFile = useCallback(async (fieldKey: string): Promise<string | null> => {
    const fileState = uploadedFiles.get(fieldKey);
    const config = configs.get(fieldKey);

    if (!fileState || !config) {
      toast.error('Fichier ou configuration introuvable');
      return null;
    }

    // Marquer comme en cours d'upload
    setUploadedFiles(prev => {
      const newMap = new Map(prev);
      const current = newMap.get(fieldKey);
      if (current) {
        newMap.set(fieldKey, { ...current, status: 'uploading' });
      }
      return newMap;
    });

    try {
      const fileExt = fileState.file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from(config.bucket_name)
        .upload(filePath, fileState.file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from(config.bucket_name)
        .getPublicUrl(filePath);

      // Marquer comme succès
      setUploadedFiles(prev => {
        const newMap = new Map(prev);
        const current = newMap.get(fieldKey);
        if (current) {
          newMap.set(fieldKey, {
            ...current,
            url: data.publicUrl,
            path: filePath,
            status: 'success'
          });
        }
        return newMap;
      });

      return data.publicUrl;
    } catch (error: any) {
      console.error(`Upload error for ${fieldKey}:`, error);
      
      // Marquer comme erreur
      setUploadedFiles(prev => {
        const newMap = new Map(prev);
        const current = newMap.get(fieldKey);
        if (current) {
          newMap.set(fieldKey, {
            ...current,
            status: 'error',
            error: error.message
          });
        }
        return newMap;
      });

      toast.error(`Erreur lors de l'upload: ${error.message}`);
      return null;
    }
  }, [uploadedFiles, configs]);

  // Uploader tous les fichiers en attente
  const uploadAllFiles = useCallback(async (): Promise<Record<string, string>> => {
    const filesData: Record<string, string> = {};
    const pendingFiles = Array.from(uploadedFiles.entries()).filter(
      ([, state]) => state.status === 'pending'
    );

    for (const [fieldKey] of pendingFiles) {
      const url = await uploadFile(fieldKey);
      if (url) {
        filesData[fieldKey] = url;
      } else {
        throw new Error(`Échec de l'upload pour le champ ${fieldKey}`);
      }
    }

    // Ajouter les fichiers déjà uploadés avec succès
    const successFiles = Array.from(uploadedFiles.entries()).filter(
      ([, state]) => state.status === 'success' && state.url
    );
    
    for (const [fieldKey, state] of successFiles) {
      if (state.url) {
        filesData[fieldKey] = state.url;
      }
    }

    return filesData;
  }, [uploadedFiles, uploadFile]);

  // Rollback : supprimer tous les fichiers uploadés
  const rollbackAllUploads = useCallback(async () => {
    const uploadedEntries = Array.from(uploadedFiles.entries()).filter(
      ([, state]) => state.status === 'success' && state.path
    );

    for (const [fieldKey, state] of uploadedEntries) {
      const config = configs.get(fieldKey);
      if (config && state.path) {
        try {
          await supabase.storage
            .from(config.bucket_name)
            .remove([state.path]);
          
          console.log(`Rollback: deleted ${state.path} from ${config.bucket_name}`);
        } catch (error) {
          console.error(`Rollback error for ${fieldKey}:`, error);
        }
      }
    }

    setUploadedFiles(new Map());
  }, [uploadedFiles, configs]);

  // Réinitialiser l'état
  const reset = useCallback(() => {
    setUploadedFiles(new Map());
  }, []);

  // Obtenir le statut d'un fichier
  const getFileStatus = useCallback((fieldKey: string) => {
    return uploadedFiles.get(fieldKey);
  }, [uploadedFiles]);

  // Restaurer des fichiers depuis le brouillon
  const restoreUploadedFiles = useCallback((filesData: Array<{
    fieldKey: string;
    url: string;
    path: string;
    fileName: string;
  }>) => {
    const newFiles = new Map<string, UploadedFileState>();
    
    filesData.forEach(({ fieldKey, url, path, fileName }) => {
      // Créer un fichier vide pour référence
      newFiles.set(fieldKey, {
        file: new File([], fileName),
        url,
        path,
        status: 'success'
      });
    });
    
    setUploadedFiles(newFiles);
  }, []);

  return {
    uploadedFiles,
    configs,
    isLoadingConfigs,
    loadConfigs,
    addFile,
    removeFile,
    uploadFile,
    uploadAllFiles,
    rollbackAllUploads,
    reset,
    getFileStatus,
    restoreUploadedFiles,
  };
}
