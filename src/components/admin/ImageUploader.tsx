import React, { useRef, useState } from 'react';
import { Check, FolderOpen, Image as ImageIcon, Upload, X } from 'lucide-react';

interface ImageUploaderProps {
  label: string;
  currentImage: string;
  onImageChange: (newImage: string) => void;
  aspectRatioClass?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  currentImage,
  onImageChange,
  aspectRatioClass = 'aspect-[4/5]',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showGallery, setShowGallery] = useState(false);
  const [customUrl, setCustomUrl] = useState('');

  // Built-in store presets
  const storePresets = [
    { label: 'Floral Co-ord', path: '/assets/extracted/prod_floral_coord.png' },
    { label: 'Pearl Earrings', path: '/assets/extracted/prod_pearl_earrings.png' },
    { label: 'Classic Shoulder Bag', path: '/assets/extracted/prod_classic_bag.png' },
    { label: 'Charm Necklace', path: '/assets/extracted/prod_charm_necklace.png' },
    { label: 'Bodycon Dress', path: '/assets/extracted/prod_bodycon_dress.png' },
    { label: 'Ring Set', path: '/assets/extracted/prod_ring_set.png' },
    { label: 'Linen Top', path: '/assets/extracted/prod_linen_shirt.png' },
    { label: 'Strappy Heels', path: '/assets/extracted/prod_strappy_heels.png' },
    { label: 'Jewellery Edit Banner', path: '/assets/extracted/banner_jewellery_clean.png' },
    { label: 'Everyday Essentials Banner', path: '/assets/extracted/banner_everyday_clean.png' },
    { label: 'Festive Glam Banner', path: '/assets/extracted/banner_festive_clean.png' },
    { label: 'Editorial Hero', path: '/assets/extracted/hero_clean_bg.png' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onImageChange(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyCustomUrl = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (customUrl.trim()) {
      onImageChange(customUrl.trim());
      setCustomUrl('');
    }
  };

  return (
    <div className="space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <label className="font-semibold text-stone-700">{label}</label>
        <button
          type="button"
          onClick={() => setShowGallery(!showGallery)}
          className="text-stone-500 hover:text-stone-900 underline text-[11px] flex items-center gap-1 cursor-pointer"
        >
          <FolderOpen className="w-3 h-3" />
          <span>{showGallery ? 'Hide Presets' : 'Choose from Presets'}</span>
        </button>
      </div>

      <div className="flex gap-3 items-center">
        {/* Preview thumbnail */}
        <div
          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden bg-stone-100 border border-stone-300 shrink-0 relative group`}
        >
          {currentImage ? (
            <img src={currentImage} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-300">
              <ImageIcon className="w-6 h-6" />
            </div>
          )}
        </div>

        {/* Upload controls */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-stone-900 hover:bg-black text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Image File</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            {currentImage && (
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                <Check className="w-3 h-3" />
                Image Loaded
              </span>
            )}
          </div>

          <div className="flex gap-1.5">
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleApplyCustomUrl();
                }
              }}
              placeholder="Or paste image URL / asset path..."
              className="flex-1 bg-white border border-stone-300 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-stone-900"
            />
            <button
              type="button"
              onClick={handleApplyCustomUrl}
              className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs px-2.5 py-1 rounded font-medium border border-stone-200 cursor-pointer"
            >
              Set
            </button>
          </div>
        </div>
      </div>

      {/* Preset Gallery Picker */}
      {showGallery && (
        <div className="p-2.5 bg-stone-50 border border-stone-200 rounded-lg mt-2">
          <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-2 font-medium">
            Select high-res store asset:
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-36 overflow-y-auto">
            {storePresets.map((preset) => (
              <button
                key={preset.path}
                type="button"
                onClick={() => {
                  onImageChange(preset.path);
                  setShowGallery(false);
                }}
                className={`flex flex-col items-center p-1 rounded border transition-all cursor-pointer ${
                  currentImage === preset.path
                    ? 'border-stone-900 bg-white ring-1 ring-stone-900'
                    : 'border-stone-200 bg-white hover:border-stone-400'
                }`}
              >
                <img
                  src={preset.path}
                  alt={preset.label}
                  className="w-10 h-10 object-cover rounded"
                />
                <span className="text-[9px] text-stone-600 truncate max-w-[50px] mt-1">
                  {preset.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
