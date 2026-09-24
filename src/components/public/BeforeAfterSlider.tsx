import React, { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage?: string;
  afterImage?: string;
  title?: string;
  location?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage = 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80',
  afterImage = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  title = 'The Aspen Ridge Craftsman Transformation',
  location = 'Denver, CO',
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderMove = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#ea580c] mb-2">
            <span className="w-6 h-0.5 bg-[#ea580c]" />
            <span>Proven Transformations</span>
            <span className="w-6 h-0.5 bg-[#ea580c]" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0d3b2e] tracking-tight">
            Before & After Precision
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Drag the slider to reveal the dramatic difference between storm-beaten roofs and PeakShield master installations.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Slider Container */}
          <div className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl border-4 border-stone-200 select-none">
            {/* After Image (Full background) */}
            <img
              src={afterImage}
              alt="After roof restoration"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-[#0d3b2e]/90 text-white text-xs font-bold px-3 py-1.5 rounded-xl backdrop-blur-xs z-20 shadow-md">
              AFTER (PeakShield)
            </div>

            {/* Before Image (Cleanly clipped without distorting image aspect ratio) */}
            <div
              className="absolute inset-0 z-10"
              style={{
                clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
                WebkitClipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
              }}
            >
              <img
                src={beforeImage}
                alt="Before roof repair"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-slate-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-xl backdrop-blur-xs z-20 shadow-md">
                BEFORE
              </div>
            </div>

            {/* Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white shadow-xl flex items-center justify-center text-[#0d3b2e]">
                <SlidersHorizontal className="w-4 h-4 rotate-90" />
              </div>
            </div>

            {/* Hidden Range Input overlay */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={handleSliderMove}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
              aria-label="Before and after comparison slider"
            />
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 px-2 font-medium">
            <span>{title} • {location}</span>
            <span>Slide left/right to compare</span>
          </div>
        </div>
      </div>
    </section>
  );
};
