'use client';

import React, { useState } from 'react';
import { X, Ruler, Sparkles, Check, Info, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryName?: string;
  onSelectSize?: (size: string) => void;
  currentSize?: string;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  categoryName = 'T-Shirts',
  onSelectSize,
  currentSize,
}) => {
  const [activeTab, setActiveTab] = useState<'chart' | 'advisor'>('chart');
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  // Fit Calculator form state
  const [heightFeet, setHeightFeet] = useState<number>(5);
  const [heightInches, setHeightInches] = useState<number>(10);
  const [weightKg, setWeightKg] = useState<number>(72);
  const [fitPreference, setFitPreference] = useState<'fitted' | 'oversized' | 'baggy'>('oversized');
  const [recommendedSize, setRecommendedSize] = useState<string | null>(null);
  const [recommendationRationale, setRecommendationRationale] = useState<string>('');

  if (!isOpen) return null;

  // Measurements data for tops (Oversized Tees & Hoodies)
  const isHoodieOrJacket = categoryName.toLowerCase().includes('hoodie') || categoryName.toLowerCase().includes('jacket');
  const isBottom = categoryName.toLowerCase().includes('bottom') || categoryName.toLowerCase().includes('pant');

  const teeMeasurementsInches = [
    { size: 'S', chest: '42.0', length: '28.0', shoulder: '21.0', sleeve: '9.0' },
    { size: 'M', chest: '44.0', length: '29.0', shoulder: '22.0', sleeve: '9.5' },
    { size: 'L', chest: '46.0', length: '30.0', shoulder: '23.0', sleeve: '10.0' },
    { size: 'XL', chest: '48.0', length: '31.0', shoulder: '24.0', sleeve: '10.5' },
    { size: 'XXL', chest: '50.0', length: '32.0', shoulder: '25.0', sleeve: '11.0' },
  ];

  const hoodieMeasurementsInches = [
    { size: 'S', chest: '44.0', length: '27.5', shoulder: '22.0', sleeve: '24.0' },
    { size: 'M', chest: '46.0', length: '28.5', shoulder: '23.0', sleeve: '24.5' },
    { size: 'L', chest: '48.0', length: '29.5', shoulder: '24.0', sleeve: '25.0' },
    { size: 'XL', chest: '50.0', length: '30.5', shoulder: '25.0', sleeve: '25.5' },
    { size: 'XXL', chest: '52.0', length: '31.5', shoulder: '26.0', sleeve: '26.0' },
  ];

  const bottomMeasurementsInches = [
    { size: 'S', waist: '28 - 30', length: '39.0', inseam: '28.0', thigh: '26.0' },
    { size: 'M', waist: '31 - 32', length: '40.0', inseam: '29.0', thigh: '27.0' },
    { size: 'L', waist: '33 - 34', length: '41.0', inseam: '30.0', thigh: '28.0' },
    { size: 'XL', waist: '35 - 36', length: '42.0', inseam: '30.5', thigh: '29.0' },
    { size: 'XXL', waist: '37 - 38', length: '42.5', inseam: '31.0', thigh: '30.0' },
  ];

  const activeMeasurements = isBottom
    ? bottomMeasurementsInches
    : isHoodieOrJacket
    ? hoodieMeasurementsInches
    : teeMeasurementsInches;

  // Convert inches to cm helper
  const toUnit = (val: string) => {
    if (unit === 'in') return `${val}"`;
    if (val.includes('-')) {
      const parts = val.split('-').map((v) => Math.round(parseFloat(v.trim()) * 2.54));
      return `${parts[0]}-${parts[1]} cm`;
    }
    return `${Math.round(parseFloat(val) * 2.54)} cm`;
  };

  // Smart Fit Recommendation Algorithm
  const calculateFit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalInches = heightFeet * 12 + heightInches;

    // Baseline size determination based on height + weight
    let base = 'M';
    if (totalInches <= 66) {
      // <= 5'6"
      base = weightKg < 60 ? 'S' : weightKg < 72 ? 'M' : 'L';
    } else if (totalInches <= 70) {
      // 5'7" - 5'10"
      base = weightKg < 65 ? 'M' : weightKg < 78 ? 'L' : 'XL';
    } else if (totalInches <= 73) {
      // 5'11" - 6'1"
      base = weightKg < 75 ? 'L' : weightKg < 88 ? 'XL' : 'XXL';
    } else {
      // >= 6'2"
      base = weightKg < 85 ? 'XL' : 'XXL';
    }

    // Adjust based on fit preference
    const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
    let idx = sizes.indexOf(base);

    if (fitPreference === 'fitted' && idx > 0) {
      idx -= 1;
    } else if (fitPreference === 'baggy' && idx < sizes.length - 1) {
      idx += 1;
    }

    const calculatedSize = sizes[idx];
    setRecommendedSize(calculatedSize);

    const fitDescriptions: Record<string, string> = {
      fitted: 'Offers a cleaner, tailored drape with reduced shoulder drop while maintaining comfortable ease.',
      oversized: 'Delivers our signature luxury streetwear aesthetic: 3-inch dropped shoulders with a boxy, fluid drape.',
      baggy: 'Provides an exaggerated, underground Tokyo street silhouette with relaxed extra length and maximum volume.',
    };

    setRecommendationRationale(
      `For your height (${heightFeet}'${heightInches}") and weight (${weightKg} kg), Size ${calculatedSize} is recommended. ${fitDescriptions[fitPreference]}`
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-sage-950/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="min-h-full flex items-center justify-center p-4 sm:p-6 text-center">
        <div
          className="w-full max-w-2xl bg-linen-50 border border-sage-200 rounded-3xl shadow-2xl p-6 sm:p-8 text-left relative z-10 animate-in fade-in zoom-in-95 duration-200"
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-sage-200/80 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-terracotta-600 mb-1">
                <Ruler className="w-3.5 h-3.5" />
                <span>Fit & Measurement Advisory</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-sage-900 leading-tight uppercase">
                {categoryName} Size Guide
              </h3>
              <p className="text-xs text-sage-600 mt-0.5">
                Engineered for an intentional drop-shoulder oversized silhouette.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-sage-500 hover:text-sage-900 p-2 rounded-full hover:bg-linen-200/60 transition-colors"
              aria-label="Close size guide"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center justify-between border-b border-sage-200 pt-4 pb-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('chart')}
                className={cn(
                  'px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all',
                  activeTab === 'chart'
                    ? 'bg-sage-900 text-white shadow-xs'
                    : 'text-sage-600 hover:text-sage-900 hover:bg-linen-200/50'
                )}
              >
                Measurement Chart
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('advisor')}
                className={cn(
                  'px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all flex items-center gap-1.5',
                  activeTab === 'advisor'
                    ? 'bg-terracotta-500 text-white shadow-xs'
                    : 'text-sage-600 hover:text-sage-900 hover:bg-linen-200/50'
                )}
              >
                <Sparkles className="w-3 h-3 text-ochre-300" />
                <span>Smart Fit Finder</span>
              </button>
            </div>

            {/* Units Toggle (Chart tab only) */}
            {activeTab === 'chart' && (
              <div className="flex items-center bg-linen-200/70 p-1 rounded-full border border-sage-200/80 text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setUnit('in')}
                  className={cn(
                    'px-2.5 py-1 rounded-full transition-all',
                    unit === 'in' ? 'bg-white text-sage-900 shadow-2xs' : 'text-sage-600'
                  )}
                >
                  INCHES
                </button>
                <button
                  type="button"
                  onClick={() => setUnit('cm')}
                  className={cn(
                    'px-2.5 py-1 rounded-full transition-all',
                    unit === 'cm' ? 'bg-white text-sage-900 shadow-2xs' : 'text-sage-600'
                  )}
                >
                  CM
                </button>
              </div>
            )}
          </div>

          {/* Tab 1: Measurement Table */}
          {activeTab === 'chart' && (
            <div className="pt-5 space-y-6">
              <div className="overflow-x-auto rounded-2xl border border-sage-200/80 bg-white shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-linen-100/80 text-sage-800 uppercase font-serif text-[11px] tracking-wider border-b border-sage-200">
                    <tr>
                      <th className="py-3 px-4 font-bold">Size</th>
                      {isBottom ? (
                        <>
                          <th className="py-3 px-4 font-bold">Waist</th>
                          <th className="py-3 px-4 font-bold">Length</th>
                          <th className="py-3 px-4 font-bold">Inseam</th>
                          <th className="py-3 px-4 font-bold">Thigh</th>
                        </>
                      ) : (
                        <>
                          <th className="py-3 px-4 font-bold">Chest</th>
                          <th className="py-3 px-4 font-bold">Length</th>
                          <th className="py-3 px-4 font-bold">Shoulder Drop</th>
                          <th className="py-3 px-4 font-bold">Sleeve</th>
                        </>
                      )}
                      <th className="py-3 px-4 font-bold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sage-100">
                    {activeMeasurements.map((row: any) => {
                      const isCurrent = currentSize?.toUpperCase() === row.size;
                      return (
                        <tr
                          key={row.size}
                          className={cn(
                            'hover:bg-linen-50/80 transition-colors',
                            isCurrent && 'bg-terracotta-50/50 font-semibold'
                          )}
                        >
                          <td className="py-3 px-4 font-bold text-sage-900 flex items-center gap-1.5">
                            <span>{row.size}</span>
                            {isCurrent && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-terracotta-100 text-terracotta-700 font-semibold">
                                SELECTED
                              </span>
                            )}
                          </td>
                          {isBottom ? (
                            <>
                              <td className="py-3 px-4 text-sage-700">{toUnit(row.waist)}</td>
                              <td className="py-3 px-4 text-sage-700">{toUnit(row.length)}</td>
                              <td className="py-3 px-4 text-sage-700">{toUnit(row.inseam)}</td>
                              <td className="py-3 px-4 text-sage-700">{toUnit(row.thigh)}</td>
                            </>
                          ) : (
                            <>
                              <td className="py-3 px-4 text-sage-700">{toUnit(row.chest)}</td>
                              <td className="py-3 px-4 text-sage-700">{toUnit(row.length)}</td>
                              <td className="py-3 px-4 text-sage-700">{toUnit(row.shoulder)}</td>
                              <td className="py-3 px-4 text-sage-700">{toUnit(row.sleeve)}</td>
                            </>
                          )}
                          <td className="py-3 px-4 text-center">
                            {onSelectSize && (
                              <button
                                type="button"
                                onClick={() => {
                                  onSelectSize(row.size);
                                  onClose();
                                }}
                                className="text-[11px] font-bold text-terracotta-600 hover:text-terracotta-800 transition-colors uppercase underline underline-offset-2"
                              >
                                Pick {row.size}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* How to Measure Guidelines */}
              <div className="p-4 bg-linen-100/90 rounded-2xl border border-sage-200/80 space-y-2 text-xs text-sage-700">
                <div className="flex items-center gap-1.5 font-bold text-sage-900 uppercase font-serif text-[11px]">
                  <Info className="w-3.5 h-3.5 text-terracotta-500" />
                  <span>How To Measure Correctly:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-[11.5px] leading-relaxed">
                  <li>
                    <strong className="text-sage-900">Chest:</strong> Measure around the fullest point of your chest, keeping the tape comfortably horizontal.
                  </li>
                  <li>
                    <strong className="text-sage-900">Length:</strong> Measure straight down from the highest point of your neck shoulder seam to the hemline.
                  </li>
                  <li>
                    <strong className="text-sage-900">Pre-Shrunk:</strong> All Amice Amarine fabrics are treated with high-temp bio-washing. Less than 1% shrinkage after cold machine wash.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Tab 2: Smart Fit Calculator */}
          {activeTab === 'advisor' && (
            <div className="pt-5 space-y-5">
              <form onSubmit={calculateFit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Height Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-sage-800 uppercase tracking-wide">
                      Your Height
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center border border-sage-200 bg-white rounded-xl px-3 py-2 text-xs">
                        <input
                          type="number"
                          min={4}
                          max={7}
                          value={heightFeet}
                          onChange={(e) => setHeightFeet(parseInt(e.target.value) || 5)}
                          className="w-full bg-transparent text-sage-900 font-bold focus:outline-none"
                        />
                        <span className="text-sage-500 font-medium">FT</span>
                      </div>
                      <div className="flex items-center border border-sage-200 bg-white rounded-xl px-3 py-2 text-xs">
                        <input
                          type="number"
                          min={0}
                          max={11}
                          value={heightInches}
                          onChange={(e) => setHeightInches(parseInt(e.target.value) || 0)}
                          className="w-full bg-transparent text-sage-900 font-bold focus:outline-none"
                        />
                        <span className="text-sage-500 font-medium">IN</span>
                      </div>
                    </div>
                  </div>

                  {/* Weight Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-sage-800 uppercase tracking-wide">
                      Your Weight
                    </label>
                    <div className="flex items-center border border-sage-200 bg-white rounded-xl px-3 py-2 text-xs">
                      <input
                        type="number"
                        min={35}
                        max={160}
                        value={weightKg}
                        onChange={(e) => setWeightKg(parseInt(e.target.value) || 65)}
                        className="w-full bg-transparent text-sage-900 font-bold focus:outline-none"
                      />
                      <span className="text-sage-500 font-medium">KG</span>
                    </div>
                  </div>
                </div>

                {/* Desired Fit Preference */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-sage-800 uppercase tracking-wide">
                    Preferred Fit Silhouette
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'fitted', title: 'Regular', desc: 'Less drape' },
                      { id: 'oversized', title: 'Signature Oversized', desc: 'Recommended' },
                      { id: 'baggy', title: 'Ultra Baggy', desc: 'Tokyo volume' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setFitPreference(opt.id as any)}
                        className={cn(
                          'p-2.5 rounded-xl border text-center transition-all',
                          fitPreference === opt.id
                            ? 'bg-terracotta-50 border-terracotta-500 text-terracotta-700 shadow-xs'
                            : 'bg-white border-sage-200 text-sage-700 hover:border-sage-300'
                        )}
                      >
                        <div className="text-xs font-bold leading-tight">{opt.title}</div>
                        <div className="text-[10px] text-sage-500 mt-0.5">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <Button variant="primary" size="md" fullWidth type="submit" className="py-2.5 mt-2">
                  <Sparkles className="w-4 h-4 mr-1.5 text-ochre-300" />
                  Calculate Optimal Size
                </Button>
              </form>

              {/* Recommendation Output */}
              {recommendedSize && (
                <div className="p-4 bg-terracotta-50 border border-terracotta-200 rounded-2xl space-y-3 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-bold tracking-wider text-terracotta-600">
                        Tailored Recommendation
                      </div>
                      <div className="text-2xl font-serif font-bold text-sage-900">
                        Size {recommendedSize}
                      </div>
                    </div>
                    {onSelectSize && (
                      <Button
                        variant="glow"
                        size="sm"
                        onClick={() => {
                          onSelectSize(recommendedSize);
                          onClose();
                        }}
                        className="shadow-xs"
                      >
                        Select Size {recommendedSize} <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-sage-700 leading-relaxed">
                    {recommendationRationale}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
