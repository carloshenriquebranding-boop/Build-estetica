import * as React from 'react';
import { Camera, UserCircle } from './icons/index.ts';

interface AvatarUploaderProps {
  currentAvatarUrl: string | null;
  onAvatarChange: (base64Url: string) => void;
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({ currentAvatarUrl, onAvatarChange }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        if (loadEvent.target?.result) {
          onAvatarChange(loadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative group w-24 h-24 cursor-pointer" onClick={handleTriggerUpload}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />
      {currentAvatarUrl ? (
        <img
          src={currentAvatarUrl}
          alt="Avatar do cliente"
          className="w-full h-full rounded-full object-cover ring-4 ring-pink-200 dark:ring-pink-800"
        />
      ) : (
        <div className="w-full h-full rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center ring-4 ring-gray-300 dark:ring-slate-600">
          <UserCircle className="w-16 h-16 text-gray-400 dark:text-slate-500" />
        </div>
      )}
      <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
        <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
};

export default AvatarUploader;
