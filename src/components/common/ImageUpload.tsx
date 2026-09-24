import React, { useState, useRef } from 'react';
import { UploadCloud, X, Check, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadImage, validateImageFile } from '../../services/storageService';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder: 'logos' | 'services' | 'projects' | 'blog' | 'testimonials' | 'quote-uploads';
  label?: string;
  helperText?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  folder,
  label = 'Upload Image',
  helperText = 'PNG, JPG, or WebP up to 5MB',
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid image file');
      return;
    }

    setError(null);
    setUploading(true);
    setProgress(0);

    try {
      const result = await uploadImage(file, folder, (p) => setProgress(p));
      onChange(result.url);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    onChange('');
    setError(null);
  };

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>}

      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50 aspect-video max-h-56">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 bg-white text-slate-800 rounded-lg hover:bg-slate-100 transition-colors shadow-md text-xs font-semibold"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md text-xs font-semibold"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
            uploading
              ? 'border-emerald-400 bg-emerald-50/50'
              : 'border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/20'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-8 h-8 text-emerald-700 animate-spin mb-2" />
              <p className="text-sm font-semibold text-slate-800">Uploading image... {progress}%</p>
              <div className="w-48 bg-slate-200 rounded-full h-2 mt-3 overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-800">
                Click to upload or drag & drop
              </p>
              <p className="text-xs text-slate-500 mt-1">{helperText}</p>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-600 mt-1.5">{error}</p>}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp, image/gif"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};
