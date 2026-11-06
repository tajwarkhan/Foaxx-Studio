import React, { useState } from 'react';
import { HelpCircle, Info, Ruler, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, setIsSizeGuideOpen, sizeGuideCategory } = useStore();

  const getInitialTab = () => {
    const cat = (sizeGuideCategory || '').toLowerCase();
    if (cat.includes('ring')) return 'rings';
    if (cat.includes('necklace') || cat.includes('jewellery') || cat.includes('earring')) return 'necklaces';
    if (cat.includes('footwear') || cat.includes('heel') || cat.includes('shoe')) return 'footwear';
    return 'apparel';
  };

  const [activeTab, setActiveTab] = useState<'rings' | 'necklaces' | 'apparel' | 'footwear'>('rings');

  // Sync tab when opened
  React.useEffect(() => {
    if (isSizeGuideOpen) {
      setActiveTab(getInitialTab());
    }
  }, [isSizeGuideOpen, sizeGuideCategory]);

  if (!isSizeGuideOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsSizeGuideOpen(false)}
      />

      <div className="min-h-full flex items-center justify-center p-3 sm:p-5">
        <div
          className="relative bg-white w-full max-w-2xl rounded-xl shadow-2xl border border-stone-200 overflow-hidden z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
            <div className="flex items-center gap-2">
              <Ruler className="w-5 h-5 text-[#E07A5F]" />
              <div>
                <h3 className="text-base font-semibold text-stone-900 font-serif-luxury">
                  FOAXX Sizing Guide & Fit Finder
                </h3>
                <p className="text-[11px] text-stone-500">
                  Standard Indian & International measurements to guarantee a perfect fit.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="p-1 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-stone-200 px-5 pt-2 gap-4 text-xs font-semibold overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('rings')}
              className={`pb-2.5 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
                activeTab === 'rings'
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              Ring Sizer
            </button>
            <button
              onClick={() => setActiveTab('necklaces')}
              className={`pb-2.5 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
                activeTab === 'necklaces'
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              Necklace Lengths
            </button>
            <button
              onClick={() => setActiveTab('apparel')}
              className={`pb-2.5 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
                activeTab === 'apparel'
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              Clothing & Dresses
            </button>
            <button
              onClick={() => setActiveTab('footwear')}
              className={`pb-2.5 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
                activeTab === 'footwear'
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              Footwear & Heels
            </button>
          </div>

          {/* Content Area */}
          <div className="p-5 max-h-[70vh] overflow-y-auto">
            {/* RINGS */}
            {activeTab === 'rings' && (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border border-stone-200 rounded-lg overflow-hidden">
                    <thead className="bg-stone-100/70 text-stone-700 font-semibold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3">India / Asia Size</th>
                        <th className="py-2.5 px-3">US / Canada</th>
                        <th className="py-2.5 px-3">Inside Diameter (mm)</th>
                        <th className="py-2.5 px-3">Finger Circumference (mm)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-600">
                      <tr>
                        <td className="py-2 px-3 font-semibold text-stone-900">Size 6</td>
                        <td className="py-2 px-3">3.5</td>
                        <td className="py-2 px-3">14.6 mm</td>
                        <td className="py-2 px-3">45.8 mm</td>
                      </tr>
                      <tr className="bg-stone-50/50">
                        <td className="py-2 px-3 font-semibold text-stone-900">Size 7 (Standard Women's)</td>
                        <td className="py-2 px-3">4</td>
                        <td className="py-2 px-3">15.0 mm</td>
                        <td className="py-2 px-3">47.1 mm</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-semibold text-stone-900">Size 8</td>
                        <td className="py-2 px-3">4.5</td>
                        <td className="py-2 px-3">15.3 mm</td>
                        <td className="py-2 px-3">48.0 mm</td>
                      </tr>
                      <tr className="bg-stone-50/50">
                        <td className="py-2 px-3 font-semibold text-stone-900">Size 9</td>
                        <td className="py-2 px-3">5</td>
                        <td className="py-2 px-3">15.7 mm</td>
                        <td className="py-2 px-3">49.3 mm</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-semibold text-stone-900">Size 10</td>
                        <td className="py-2 px-3">5.5</td>
                        <td className="py-2 px-3">16.1 mm</td>
                        <td className="py-2 px-3">50.6 mm</td>
                      </tr>
                      <tr className="bg-stone-50/50">
                        <td className="py-2 px-3 font-semibold text-stone-900">Size 12</td>
                        <td className="py-2 px-3">6</td>
                        <td className="py-2 px-3">16.5 mm</td>
                        <td className="py-2 px-3">51.8 mm</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-semibold text-stone-900">Size 14</td>
                        <td className="py-2 px-3">7</td>
                        <td className="py-2 px-3">17.3 mm</td>
                        <td className="py-2 px-3">54.4 mm</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-[#FAF7F2] p-3.5 rounded-lg border border-[#EDE5DA] text-xs text-stone-700">
                  <div className="flex items-center gap-1.5 font-semibold text-stone-900 mb-1">
                    <Info className="w-4 h-4 text-[#E07A5F]" />
                    <span>How to measure at home (String Method):</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-stone-600 pl-1">
                    <li>Wrap a non-stretchy strip of paper or string snug around the base of your finger.</li>
                    <li>Mark the exact spot where the strip overlaps with a pen.</li>
                    <li>Measure the length against a ruler in millimeters (mm) to get your circumference.</li>
                    <li>Match with the table above. If you are between sizes, we recommend sizing up.</li>
                  </ol>
                </div>
              </div>
            )}

            {/* NECKLACES */}
            {activeTab === 'necklaces' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200/60">
                    <span className="font-semibold text-stone-900 block text-sm">14" - Collar</span>
                    <span className="text-[11px] text-[#E07A5F] font-medium">Fits tightly around the throat</span>
                    <p className="text-stone-500 mt-1">Best paired with open-shoulder, V-neck, and sweetheart necklines.</p>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200/60">
                    <span className="font-semibold text-stone-900 block text-sm">16" - Choker</span>
                    <span className="text-[11px] text-[#E07A5F] font-medium">Rests right at base of neck</span>
                    <p className="text-stone-500 mt-1">Flattering on almost all collar types; classic heirloom bridal and sangeet look.</p>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200/60">
                    <span className="font-semibold text-stone-900 block text-sm">18" - Princess (Most Popular)</span>
                    <span className="text-[11px] text-[#E07A5F] font-medium">Falls delicately over collarbones</span>
                    <p className="text-stone-500 mt-1">The versatile everyday standard for single pendants and minimal chains.</p>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200/60">
                    <span className="font-semibold text-stone-900 block text-sm">20" - 24" Matinee</span>
                    <span className="text-[11px] text-[#E07A5F] font-medium">Sits at center of bust</span>
                    <p className="text-stone-500 mt-1">Ideal for high-neck blouses, turtlenecks, and tiered necklace layering sets.</p>
                  </div>
                </div>

                <div className="bg-[#FAF7F2] p-3 rounded-lg border border-[#EDE5DA] text-xs text-stone-700">
                  <p className="font-semibold text-stone-900">Extender Chain Included:</p>
                  <p className="text-stone-600 mt-0.5">
                    All FOAXX necklaces come with a 2-inch (5 cm) micro-adjustable extender chain so you can customize the drape to your outfit!
                  </p>
                </div>
              </div>
            )}

            {/* APPAREL */}
            {activeTab === 'apparel' && (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border border-stone-200 rounded-lg overflow-hidden">
                    <thead className="bg-stone-100/70 text-stone-700 font-semibold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3">Size</th>
                        <th className="py-2.5 px-3">Bust (Inches / cm)</th>
                        <th className="py-2.5 px-3">Waist (Inches / cm)</th>
                        <th className="py-2.5 px-3">Hips (Inches / cm)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-600">
                      <tr>
                        <td className="py-2 px-3 font-semibold text-stone-900">XS (UK 6 / US 2)</td>
                        <td className="py-2 px-3">32" (81 cm)</td>
                        <td className="py-2 px-3">25" (63 cm)</td>
                        <td className="py-2 px-3">35" (89 cm)</td>
                      </tr>
                      <tr className="bg-stone-50/50">
                        <td className="py-2 px-3 font-semibold text-stone-900">S (UK 8 / US 4)</td>
                        <td className="py-2 px-3">34" (86 cm)</td>
                        <td className="py-2 px-3">27" (68 cm)</td>
                        <td className="py-2 px-3">37" (94 cm)</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-semibold text-stone-900">M (UK 10 / US 6)</td>
                        <td className="py-2 px-3">36" (91 cm)</td>
                        <td className="py-2 px-3">29" (74 cm)</td>
                        <td className="py-2 px-3">39" (99 cm)</td>
                      </tr>
                      <tr className="bg-stone-50/50">
                        <td className="py-2 px-3 font-semibold text-stone-900">L (UK 12 / US 8)</td>
                        <td className="py-2 px-3">38" (96 cm)</td>
                        <td className="py-2 px-3">31" (79 cm)</td>
                        <td className="py-2 px-3">41" (104 cm)</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-semibold text-stone-900">XL (UK 14 / US 10)</td>
                        <td className="py-2 px-3">40" (102 cm)</td>
                        <td className="py-2 px-3">33" (84 cm)</td>
                        <td className="py-2 px-3">43" (109 cm)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* FOOTWEAR */}
            {activeTab === 'footwear' && (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border border-stone-200 rounded-lg overflow-hidden">
                    <thead className="bg-stone-100/70 text-stone-700 font-semibold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3">India / UK</th>
                        <th className="py-2.5 px-3">Euro (EU)</th>
                        <th className="py-2.5 px-3">US Women</th>
                        <th className="py-2.5 px-3">Foot Length (cm)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-600">
                      <tr>
                        <td className="py-2 px-3 font-semibold text-stone-900">Size 3</td>
                        <td className="py-2 px-3">EU 36</td>
                        <td className="py-2 px-3">US 5</td>
                        <td className="py-2 px-3">22.5 cm</td>
                      </tr>
                      <tr className="bg-stone-50/50">
                        <td className="py-2 px-3 font-semibold text-stone-900">Size 4</td>
                        <td className="py-2 px-3">EU 37</td>
                        <td className="py-2 px-3">US 6</td>
                        <td className="py-2 px-3">23.5 cm</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-semibold text-stone-900">Size 5</td>
                        <td className="py-2 px-3">EU 38</td>
                        <td className="py-2 px-3">US 7</td>
                        <td className="py-2 px-3">24.0 cm</td>
                      </tr>
                      <tr className="bg-stone-50/50">
                        <td className="py-2 px-3 font-semibold text-stone-900">Size 6</td>
                        <td className="py-2 px-3">EU 39</td>
                        <td className="py-2 px-3">US 8</td>
                        <td className="py-2 px-3">25.0 cm</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-semibold text-stone-900">Size 7</td>
                        <td className="py-2 px-3">EU 40</td>
                        <td className="py-2 px-3">US 9</td>
                        <td className="py-2 px-3">25.5 cm</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="p-4 border-t border-stone-100 bg-stone-50 flex items-center justify-between text-xs">
            <span className="text-stone-500">
              Still unsure? Enjoy hassle-free 7-day doorstep size exchanges.
            </span>
            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="bg-stone-900 hover:bg-black text-white px-4 py-1.5 rounded-md font-medium cursor-pointer transition-colors"
            >
              Got It
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
