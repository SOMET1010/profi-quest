import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Upload, X, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface FileUploadZoneProps {
  value?: string;
  onChange?: (file: File | null) => void;
  onBlur?: () => void;
  accept?: string;
  maxSize?: number;
  disabled?: boolean;
  currentFile?: File | null;
  fileStatus?: 'pending' | 'uploading' | 'success' | 'error';
  errorMessage?: string;
}

export function FileUploadZone({
  onChange,
  onBlur,
  accept = '.pdf,.doc,.docx',
  maxSize = 5 * 1024 * 1024, // 5MB
  disabled,
  currentFile,
  fileStatus,
  errorMessage,
}: FileUploadZoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onChange?.(acceptedFiles[0]);
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize,
    multiple: false,
    disabled,
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
          isDragActive && 'border-primary bg-primary/5',
          !isDragActive && 'border-input hover:border-primary/50',
          disabled && 'opacity-50 cursor-not-allowed',
          currentFile && 'bg-accent/50'
        )}
        onBlur={onBlur}
      >
        <input {...getInputProps()} />
        
        {currentFile ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div className="text-left">
                  <p className="font-medium">{currentFile.name}</p>
                  <p className="text-sm text-muted-foreground">{formatFileSize(currentFile.size)}</p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                disabled={disabled || fileStatus === 'uploading'}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {fileStatus === 'uploading' && (
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Upload en cours...</span>
              </div>
            )}

            {fileStatus === 'success' && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Fichier uploadé avec succès</span>
              </div>
            )}

            {fileStatus === 'error' && (
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <XCircle className="h-4 w-4" />
                <span className="text-sm">{errorMessage || 'Erreur lors de l\'upload'}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
            <div>
              <p className="font-medium">
                {isDragActive ? 'Déposez le fichier ici' : 'Glissez-déposez votre fichier'}
              </p>
              <p className="text-sm text-muted-foreground">
                ou cliquez pour sélectionner (PDF, DOC, DOCX - max {formatFileSize(maxSize)})
              </p>
            </div>
          </div>
        )}
      </div>

      {fileRejections.length > 0 && (
        <p className="text-sm text-destructive mt-2">
          {fileRejections[0].errors[0].code === 'file-too-large'
            ? `Fichier trop volumineux (max ${formatFileSize(maxSize)})`
            : 'Format de fichier non accepté'}
        </p>
      )}
    </div>
  );
}
