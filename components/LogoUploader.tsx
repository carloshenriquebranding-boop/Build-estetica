import * as React from 'react';
import { UploadCloud } from './icons/UploadCloud.tsx';
import { X } from './icons/X.tsx';

interface LogoUploaderProps {
  logoUrl: string | null;
  onUpload: (base64Url: string) => void;
}

const LogoUploader: React.FC<LogoUploaderProps> = ({ logoUrl, onUpload }) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onUpload(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  if (logoUrl) {
    return (
      <div className="relative">
        <p className="font-semibold mb-2">Logotipo</p>
        <div className="p-2 border border-dashed rounded-lg">
          <img src={logoUrl} alt="Logo preview" className="max-h-20 mx-auto" />
        </div>
        <button onClick={() => onUpload('')} className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full">
          <X className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <p className="font-semibold mb-2">Logotipo</p>
      <div
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-4 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
          isDragging ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/30' : 'border-gray-300 dark:border-slate-600 hover:border-pink-400'
        }`}
      >
        <input type="file" ref={fileInputRef} onChange={onFileChange} accept="image/*" className="hidden" />
        <UploadCloud className="w-8 h-8 mx-auto text-gray-400" />
        <p className="text-xs mt-1 text-gray-500 dark:text-slate-400">Arraste e solte ou clique para enviar</p>
      </div>
    </div>
  );
};

export default LogoUploader;