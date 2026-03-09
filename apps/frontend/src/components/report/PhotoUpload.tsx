import { useRef, useState } from 'react';
import { X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface PhotoUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
}

export function PhotoUpload({ files, onChange, maxFiles = 3 }: PhotoUploadProps) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const added = Array.from(newFiles).slice(0, maxFiles - files.length);
    const updated = [...files, ...added].slice(0, maxFiles);
    onChange(updated);
    const newPreviews = added.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...newPreviews].slice(0, maxFiles));
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    onChange(updated);
    setPreviews(updatedPreviews);
  };

  return (
    <div>
      <p className="text-sm font-medium mb-2">{t('report.photos')}</p>
      <p className="text-xs text-muted-foreground mb-3">{t('report.photosHint')}</p>
      <div className="flex flex-wrap gap-3">
        {previews.map((src, i) => (
          <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border">
            <img src={src} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeFile(i)}
              className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5"
              aria-label={`Foto ${i + 1} entfernen`}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        {files.length < maxFiles && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-24 h-24 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 hover:border-primary/50 hover:bg-primary/5 transition-colors"
            aria-label="Foto hinzufügen"
          >
            <Upload className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Foto</span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
        aria-label="Fotos hochladen"
      />
    </div>
  );
}
