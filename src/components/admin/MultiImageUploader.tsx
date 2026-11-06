import React, { useRef, useState } from 'react';
import {
  Upload,
  Plus,
  Trash2,
  Star,
  ArrowLeft,
  ArrowRight,
  FolderOpen,
  Image as ImageIcon,
  Check,
  Link as LinkIcon,
} from 'lucide-react';

interface MultiImageUploaderProps {
  label: string;
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

const PRESET_IMAGES = [
  { label: 'Gold Kundan & Polki', path: '/assets/extracted/cat_jewellery.png' },
  { label: 'Pearl Drop Earrings', path: '/assets/extracted/prod_pearl_earrings.png' },
  { label: 'Layered Charm Necklace', path: '/assets/extracted/prod_charm_necklace.png' },
  { label: 'Classic Shoulder Bag', path: '/assets/extracted/prod_classic_bag.png' },
  { label: 'Stackable Rings Set', path: '/assets/extracted/prod_ring_set.png' },
  { label: 'Floral Co-ord Ensemble', path: '/assets/extracted/prod_floral_coord.png' },
  { label: 'Ruched Bodycon Dress', path: '/assets/extracted/prod_bodycon_dress.png' },
  { label: 'Bespoke Strappy Heels', path: '/assets/extracted/prod_strappy_heels.png' },
  { label: 'European Linen Top', path: '/assets/extracted/prod_linen_shirt.png' },
  { label: 'Festive Glamour Banner', path: '/assets/extracted/banner_festive_clean.png' },
  { label: 'Jewellery Edit Banner', path: '/assets/extracted/banner_jewellery_clean.png' },
  { label: 'Editorial Studio Look', path: '/assets/extracted/hero_clean_bg.png' },
];

export const MultiImageUploader: React.FC<MultiImageUploaderProps> = ({
  label,
  images = [],
  onChange,
  maxImages = 8,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPresets, setShowPresets] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Normalize image list (at least empty array)
  const imageList = Array.isArray(images) && images.length > 0 ? images : [];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    let loadedCount = 0;
    const newImages: string[] = [];

    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          newImages.push(reader.result);
        }
        loadedCount++;
        if (loadedCount === fileArray.length) {
          const combined = [...imageList, ...newImages].slice(0, maxImages);
          onChange(combined);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input so same file can be re-selected if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      const updated = [...imageList, customUrl.trim()].slice(0, maxImages);
      onChange(updated);
      setCustomUrl('');
      setShowUrlInput(false);
    }
  };

  const handleSelectPreset = (presetPath: string) => {
    if (!imageList.includes(presetPath)) {
      const updated = [...imageList, presetPath].slice(0, maxImages);
      onChange(updated);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updated = imageList.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const item = imageList[index];
    const rest = imageList.filter((_, idx) => idx !== index);
    onChange([item, ...rest]);
  };

  const handleMoveLeft = (index: number) => {
    if (index === 0) return;
    const updated = [...imageList];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    onChange(updated);
  };

  const handleMoveRight = (index: number) => {
    if (index === imageList.length - 1) return;
    const updated = [...imageList];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    onChange(updated);
  };

  return (
    <div className="space-y-3 bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <label className="font-semibold text-stone-900 block">{label}</label>
          <span className="text-[11px] text-stone-500">
            Add multiple images for Amazon & Flipkart style interactive slideshow ({imageList.length}/{maxImages})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPresets(!showPresets)}
            className="text-stone-600 hover:text-stone-900 text-[11px] font-medium flex items-center gap-1 bg-white border border-stone-300 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
          >
            <FolderOpen className="w-3.5 h-3.5 text-[#E07A5F]" />
            <span>{showPresets ? 'Hide Presets' : 'Preset Gallery'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-stone-600 hover:text-stone-900 text-[11px] font-medium flex items-center gap-1 bg-white border border-stone-300 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
          >
            <LinkIcon className="w-3.5 h-3.5 text-[#E07A5F]" />
            <span>{showUrlInput ? 'Cancel URL' : 'Add Image URL'}</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-stone-900 hover:bg-black text-white text-[11px] font-semibold px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photos</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            multiple
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

      {/* URL Input Bar */}
      {showUrlInput && (
        <form onSubmit={handleAddUrl} className="flex gap-2 pt-1">
          <input
            type="text"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="Paste image link (e.g. https://... or /assets/extracted/...)"
            className="flex-1 bg-white border border-stone-300 rounded-md px-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-[#E07A5F]"
          />
          <button
            type="submit"
            className="bg-[#E07A5F] hover:bg-[#c96a51] text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors cursor-pointer"
          >
            Add to Gallery
          </button>
        </form>
      )}

      {/* Preset Gallery Picker */}
      {showPresets && (
        <div className="p-3 bg-white rounded-lg border border-stone-200">
          <div className="text-[11px] font-semibold text-stone-700 mb-2">
            Click to add studio high-resolution images:
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {PRESET_IMAGES.map((preset, idx) => {
              const isAdded = imageList.includes(preset.path);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(preset.path)}
                  className={`relative group rounded-md overflow-hidden border text-left p-1 transition-all cursor-pointer ${
                    isAdded ? 'border-emerald-500 bg-emerald-50/50' : 'border-stone-200 hover:border-stone-400 bg-stone-50'
                  }`}
                >
                  <img src={preset.path} alt={preset.label} className="w-full aspect-square object-cover rounded-xs" />
                  <span className="block text-[9px] text-stone-600 truncate mt-1">{preset.label}</span>
                  {isAdded && (
                    <div className="absolute top-1 right-1 bg-emerald-600 text-white rounded-full p-0.5">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Image Thumbnails Strip with Slideshow Order & Controls */}
      {imageList.length === 0 ? (
        <div className="py-8 text-center bg-white rounded-lg border border-dashed border-stone-300">
          <ImageIcon className="w-8 h-8 text-stone-300 mx-auto mb-2" />
          <p className="text-stone-600 font-medium">No images uploaded yet</p>
          <p className="text-[11px] text-stone-400 mt-0.5">
            Upload multiple photos or choose from presets to enable the customer slideshow.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {imageList.map((imgUrl, index) => {
              const isPrimary = index === 0;
              return (
                <div
                  key={index}
                  className={`relative group bg-white rounded-lg border p-1.5 transition-all shadow-xs ${
                    isPrimary ? 'border-[#E07A5F] ring-2 ring-[#E07A5F]/20' : 'border-stone-200 hover:border-stone-400'
                  }`}
                >
                  {/* Thumbnail Image */}
                  <div className="relative aspect-[4/5] rounded overflow-hidden bg-stone-100">
                    <img src={imgUrl} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />

                    {/* Badge: Primary / Sequence */}
                    <div className="absolute top-1 left-1">
                      {isPrimary ? (
                        <span className="bg-[#E07A5F] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          <span>Cover</span>
                        </span>
                      ) : (
                        <span className="bg-black/70 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded shadow-xs">
                          Slide #{index + 1}
                        </span>
                      )}
                    </div>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-rose-600 text-white rounded transition-colors cursor-pointer"
                      title="Remove image"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Actions Bar under each thumbnail */}
                  <div className="pt-1.5 flex items-center justify-between text-[10px] text-stone-600">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMoveLeft(index)}
                        className={`p-1 rounded hover:bg-stone-100 ${index === 0 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer text-stone-700'}`}
                        title="Move slide left"
                      >
                        <ArrowLeft className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        disabled={index === imageList.length - 1}
                        onClick={() => handleMoveRight(index)}
                        className={`p-1 rounded hover:bg-stone-100 ${index === imageList.length - 1 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer text-stone-700'}`}
                        title="Move slide right"
                      >
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    {!isPrimary && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(index)}
                        className="text-[#E07A5F] hover:underline font-semibold text-[10px] cursor-pointer"
                      >
                        Set Cover
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick slideshow info */}
          <div className="text-[11px] text-stone-500 flex items-center justify-between pt-1">
            <span>✓ The first image is used as the cover on catalog cards. Subsequent images form the slideshow on the product detail page.</span>
            <span className="font-medium text-stone-700">{imageList.length} slide{imageList.length > 1 ? 's' : ''} in carousel</span>
          </div>
        </div>
      )}
    </div>
  );
};
