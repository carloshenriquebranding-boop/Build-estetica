import * as React from 'react';
import { Wand2 } from './icons/index.ts';

interface FeaturePreviewTooltipProps {
  children: React.ReactElement;
  title: string;
  description: string;
}

const FeaturePreviewTooltip: React.FC<FeaturePreviewTooltipProps> = ({ children, title, description }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  
  const handleMouseEnter = () => setIsVisible(true);
  const handleMouseLeave = () => setIsVisible(false);

  const clonedChild = React.cloneElement(children, {
    'aria-describedby': 'feature-preview-tooltip',
    onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        // You can optionally trigger a modal or alert here on click if needed for accessibility
    },
  });

  return (
    <div
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      className="relative cursor-not-allowed w-full"
    >
      {clonedChild}
      {isVisible && (
        <div
          id="feature-preview-tooltip"
          ref={tooltipRef}
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 bg-slate-800 dark:bg-slate-950 text-white p-4 rounded-lg shadow-2xl z-50 animate-fadeIn"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 bg-pink-500/20 text-pink-400 p-2 rounded-md">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-50">{title}</h3>
              <p className="text-sm text-slate-300 mt-1">{description}</p>
            </div>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[-8px] w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-slate-800 dark:border-t-slate-950"></div>
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(5px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fadeIn {
              animation: fadeIn 0.2s ease-out;
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default FeaturePreviewTooltip;
