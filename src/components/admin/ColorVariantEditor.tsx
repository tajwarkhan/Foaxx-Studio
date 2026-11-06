import React, { useState, useRef } from 'react';
import {
  Palette,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  Check,
  Link as LinkIcon,
  Sparkles,
} from 'lucide-react';
import { ProductColor } from '../../types';

interface ColorVariantEditorProps {
  colors: ProductColor[];
  onChange: (colors: ProductColor[]) => void;
  defaultFallbackImage?: string;
}

const PRESET_IMAGES = [
  { label: 'Gold Jewellery', url: '/assets/extracted/cat_jewellery.png' },
  { label: 'Silver Necklaces', url: '/assets/extracted/cat_necklaces.png' },
  { label: 'Earrings', url: '/assets/extracted/cat_earrings.png' },
  { label: 'Rings Set', url: '/assets/extracted/cat_rings.png' },
  { label: 'Floral Co-ord', url: '/assets/extracted/prod_floral_coord.png' },
  { label: 'Dresses', url: '/assets/extracted/cat_dresses.png' },
  { label: 'Shoulder Bag', url: '/assets/extracted/prod_classic_bag.png' },
  { label: 'Strappy Heels', url: '/assets/extracted/prod_strappy_heels.png' },
  { label: 'Linen Top', url: '/assets/extracted/prod_linen_shirt.png' },
  { label: 'Pearl Teardrop', url: '/assets/extracted/prod_pearl_earrings.png' },
];

const LUXURY_PRESETS = [
  { name: 'Warm Gold', hex: '#D4AF37', image: '/assets/extracted/cat_jewellery.png' },
  { name: 'Rose Gold', hex: '#B76E79', image: '/assets/extracted/prod_charm_necklace.png' },
  { name: 'Silver Rhodium', hex: '#E5E4E2', image: '/assets/extracted/cat_necklaces.png' },
  { name: 'Midnight Onyx', hex: '#1C1B1A', image: '/assets/extracted/prod_classic_bag.png' },
  { name: 'Pearl Cream', hex: '#F5EFEB', image: '/assets/extracted/prod_pearl_earrings.png' },
  { name: 'Emerald Green', hex: '#1B4D3E', image: '/assets/extracted/banner_festive_glam.png' },
  { name: 'Ruby Wine', hex: '#8B1E2F', image: '/assets/extracted/cat_dresses.png' },
  { name: 'Dusty Rose', hex: '#DE8B98', image: '/assets/extracted/prod_floral_coord.png' },
];

export const ColorVariantEditor: React.FC<ColorVariantEditorProps> = ({
  colors,
  onChange,
  defaultFallbackImage = '/assets/extracted/cat_jewellery.png',
}) => {
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#D4AF37');
  const [newColorImage, setNewColorImage] = useState('');
  const [openPresetForIndex, setOpenPresetForIndex] = useState<number | null>(null);
  const [openUrlInputForIndex, setOpenUrlInputForIndex] = useState<number | null>(null);
  const [tempUrl, setTempUrl] = useState('');

  const newFileInputRef = useRef<HTMLInputElement>(null);

  const handleAddCustomColor = () => {
    if (!newColorName.trim()) return;
    const variantImage = newColorImage.trim() || defaultFallbackImage;
    const updated = [
      ...colors,
      {
        name: newColorName.trim(),
        hex: newColorHex,
        image: variantImage,
      },
    ];
    onChange(updated);
    setNewColorName('');
    setNewColorHex('#D4AF37');
    setNewColorImage('');
  };

  const handleAddPreset = (preset: { name: string; hex: string; image: string }) => {
    if (colors.some((c) => c.name.toLowerCase() === preset.name.toLowerCase())) {
      return;
    }
    onChange([...colors, preset]);
  };

  const handleAddThreeTrio = () => {
    const trio = [
      { name: 'Warm Gold', hex: '#D4AF37', image: '/assets/extracted/cat_jewellery.png' },
      { name: 'Rose Gold', hex: '#B76E79', image: '/assets/extracted/prod_charm_necklace.png' },
      { name: 'Silver Rhodium', hex: '#E5E4E2', image: '/assets/extracted/cat_necklaces.png' },
    ];
    // Merge without duplicates
    const filtered = trio.filter(
      (t) => !colors.some((c) => c.name.toLowerCase() === t.name.toLowerCase())
    );
    onChange([...colors, ...filtered]);
  };

  const handleRemoveColor = (index: number) => {
    onChange(colors.filter((_, i) => i !== index));
  };

  const handleUpdateColor = (index: number, updatedField: Partial<ProductColor>) => {
    const updated = colors.map((c, i) => (i === index ? { ...c, ...updatedField } : c));
    onChange(updated);
  };

  const handleFileUpload = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        handleUpdateColor(index, { image: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleNewColorFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setNewColorImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-4 text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-[#E07A5F]" />
          <div>
            <h5 className="font-bold text-stone-900 text-xs">
              Color Variants & Variant Pictures ({colors.length} Available)
            </h5>
            <p className="text-[11px] text-stone-500">
              Each color gets its own uploaded picture. When a shopper clicks that color, the matching photo is shown and ordered.
            </p>
          </div>
        </div>

        {colors.length === 0 && (
          <button
            type="button"
            onClick={handleAddThreeTrio}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-900 text-white rounded text-[11px] font-semibold hover:bg-black transition-colors cursor-pointer shrink-0"
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Add 3-Color Trio (Gold, Rose, Silver)</span>
          </button>
        )}
      </div>

      {/* List of active color variants */}
      {colors.length === 0 ? (
        <div className="p-4 text-center border border-dashed border-stone-300 rounded-lg bg-white">
          <p className="text-[11px] text-stone-500 font-medium">No color variants added yet.</p>
          <p className="text-[10px] text-stone-400 mt-0.5">
            Add 2 or 3 colors below and attach a picture for each shade.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {colors.map((color, index) => {
            const variantImg = color.image || defaultFallbackImage;
            return (
              <div
                key={index}
                className="p-3 bg-white rounded-lg border border-stone-200 shadow-2xs space-y-2.5"
              >
                {/* Variant Header Row: Color Picker + Name + Hex + Delete */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-stone-400 w-5 shrink-0">
                    #{index + 1}
                  </span>

                  {/* Swatch & Color Picker */}
                  <div className="relative flex items-center shrink-0">
                    <input
                      type="color"
                      value={color.hex}
                      onChange={(e) => handleUpdateColor(index, { hex: e.target.value })}
                      className="w-7 h-7 rounded border border-stone-300 cursor-pointer p-0 bg-transparent"
                      title="Choose custom shade"
                    />
                  </div>

                  {/* Color Name Input */}
                  <input
                    type="text"
                    value={color.name}
                    onChange={(e) => handleUpdateColor(index, { name: e.target.value })}
                    placeholder="Color Name (e.g. Warm Gold, Jet Black)"
                    className="flex-1 bg-stone-50 border border-stone-200 rounded px-2.5 py-1.5 text-xs font-medium text-stone-800 focus:outline-none focus:border-stone-900"
                  />

                  {/* Hex input */}
                  <input
                    type="text"
                    value={color.hex}
                    onChange={(e) => handleUpdateColor(index, { hex: e.target.value })}
                    placeholder="#HEX"
                    className="w-20 font-mono text-[11px] bg-stone-50 border border-stone-200 rounded px-2 py-1.5 uppercase text-stone-600 shrink-0"
                  />

                  {/* Remove variant button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(index)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer shrink-0"
                    title="Remove variant"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Variant Picture Row */}
                <div className="flex items-center gap-3 pt-2 border-t border-stone-100">
                  {/* Thumbnail Preview */}
                  <div className="w-14 h-16 rounded-md overflow-hidden bg-stone-100 border border-stone-200 shrink-0 relative group">
                    <img
                      src={variantImg}
                      alt={color.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <span className="text-[9px] text-white font-medium">Active</span>
                    </div>
                  </div>

                  {/* Picture Controls */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Upload Picture Button */}
                      <label className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-stone-900 hover:bg-black text-white rounded text-[11px] font-semibold transition-colors cursor-pointer shadow-2xs">
                        <Upload className="w-3 h-3" />
                        <span>Upload {color.name || `Color #${index + 1}`} Picture</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(index, file);
                          }}
                        />
                      </label>

                      {/* Pick From Gallery Presets */}
                      <button
                        type="button"
                        onClick={() =>
                          setOpenPresetForIndex(openPresetForIndex === index ? null : index)
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-[11px] font-medium transition-colors cursor-pointer border border-stone-200"
                      >
                        <ImageIcon className="w-3 h-3 text-stone-500" />
                        <span>Gallery Presets</span>
                      </button>

                      {/* Custom URL Input Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setOpenUrlInputForIndex(openUrlInputForIndex === index ? null : index);
                          setTempUrl(color.image || '');
                        }}
                        className="inline-flex items-center gap-1 px-2 py-1.5 text-stone-500 hover:text-stone-800 rounded text-[11px] transition-colors cursor-pointer"
                      >
                        <LinkIcon className="w-3 h-3" />
                        <span>Paste Link</span>
                      </button>
                    </div>

                    <p className="text-[10px] text-stone-400 truncate">
                      Photo Source: <span className="text-stone-600 font-mono">{color.image ? 'Custom Picture Linked' : 'Using Product Default'}</span>
                    </p>
                  </div>
                </div>

                {/* Popover / Drawer: Custom URL Input */}
                {openUrlInputForIndex === index && (
                  <div className="p-2.5 bg-stone-50 rounded border border-stone-200 flex items-center gap-2">
                    <input
                      type="url"
                      value={tempUrl}
                      onChange={(e) => setTempUrl(e.target.value)}
                      placeholder="https://example.com/product-color-photo.jpg"
                      className="flex-1 bg-white border border-stone-300 rounded px-2 py-1 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (tempUrl.trim()) {
                          handleUpdateColor(index, { image: tempUrl.trim() });
                        }
                        setOpenUrlInputForIndex(null);
                      }}
                      className="px-3 py-1 bg-stone-900 text-white rounded text-xs font-semibold cursor-pointer"
                    >
                      Apply
                    </button>
                    <button
                      type="button"
                      onClick={() => setOpenUrlInputForIndex(null)}
                      className="px-2 py-1 text-stone-500 hover:text-black cursor-pointer text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {/* Popover / Drawer: Preset Photos */}
                {openPresetForIndex === index && (
                  <div className="p-2.5 bg-stone-50 rounded border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-stone-700">
                        Choose Reference Picture for {color.name || 'this variant'}:
                      </span>
                      <button
                        type="button"
                        onClick={() => setOpenPresetForIndex(null)}
                        className="text-stone-400 hover:text-stone-700 text-xs cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                      {PRESET_IMAGES.map((preset) => (
                        <button
                          key={preset.url}
                          type="button"
                          onClick={() => {
                            handleUpdateColor(index, { image: preset.url });
                            setOpenPresetForIndex(null);
                          }}
                          className={`group relative aspect-square rounded overflow-hidden border-2 transition-all cursor-pointer bg-white ${
                            color.image === preset.url
                              ? 'border-stone-900 ring-2 ring-stone-900/20'
                              : 'border-stone-200 hover:border-stone-400'
                          }`}
                          title={preset.label}
                        >
                          <img
                            src={preset.url}
                            alt={preset.label}
                            className="w-full h-full object-cover"
                          />
                          {color.image === preset.url && (
                            <div className="absolute inset-0 bg-stone-900/40 flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add New Color Variant Box */}
      <div className="pt-3 border-t border-stone-200 space-y-2.5">
        <label className="block text-[11px] font-semibold text-stone-700">
          + Add Another Color Variant (with Picture):
        </label>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Swatch & Picker */}
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={newColorHex}
              onChange={(e) => setNewColorHex(e.target.value)}
              className="w-8 h-8 rounded border border-stone-300 cursor-pointer p-0 bg-transparent shrink-0"
              title="Pick color shade"
            />
            <input
              type="text"
              value={newColorName}
              onChange={(e) => setNewColorName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomColor();
                }
              }}
              placeholder="Color name (e.g. Rose Gold, Emerald Green)"
              className="flex-1 sm:w-56 bg-white border border-stone-300 rounded px-2.5 py-1.5 text-xs font-medium text-stone-800 focus:outline-none focus:border-stone-900"
            />
          </div>

          {/* Picture for new color */}
          <div className="flex items-center gap-2 flex-1">
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-xs font-medium cursor-pointer border border-stone-300 shrink-0">
              <Upload className="w-3 h-3 text-stone-500" />
              <span>{newColorImage ? 'Picture Selected ✓' : 'Upload Picture'}</span>
              <input
                ref={newFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleNewColorFileUpload(file);
                }}
              />
            </label>

            {newColorImage && (
              <img
                src={newColorImage}
                alt="New preview"
                className="w-7 h-7 object-cover rounded border border-stone-300"
              />
            )}

            <button
              type="button"
              onClick={handleAddCustomColor}
              disabled={!newColorName.trim()}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-1.5 bg-stone-900 hover:bg-black disabled:opacity-50 text-white rounded text-xs font-semibold transition-colors cursor-pointer ml-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Color Variant</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1-Click Luxury Color Swatches */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
            Quick 1-Click Luxury Shade Presets:
          </span>
          <button
            type="button"
            onClick={handleAddThreeTrio}
            className="text-[11px] text-[#E07A5F] hover:underline font-semibold cursor-pointer"
          >
            + Add Standard 3-Color Trio
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {LUXURY_PRESETS.map((p) => {
            const alreadyAdded = colors.some((c) => c.name.toLowerCase() === p.name.toLowerCase());
            return (
              <button
                key={p.name}
                type="button"
                onClick={() => handleAddPreset(p)}
                disabled={alreadyAdded}
                className={`flex items-center gap-1.5 px-2 py-1 rounded text-[11px] border transition-all cursor-pointer ${
                  alreadyAdded
                    ? 'border-stone-200 bg-stone-100 text-stone-400 opacity-50 cursor-not-allowed'
                    : 'border-stone-200 bg-white hover:border-stone-400 text-stone-700 shadow-2xs'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block"
                  style={{ backgroundColor: p.hex }}
                />
                <span>{p.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
