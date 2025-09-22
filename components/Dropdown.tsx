import * as React from 'react';

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactElement<{ close?: () => void }>;
}

const Dropdown: React.FC<DropdownProps> = ({ trigger, children }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const ref = React.useRef<HTMLDivElement>(null);
    
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [ref]);
    
    return (
        <div className="relative" ref={ref}>
            <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white dark:bg-slate-700 rounded-md shadow-lg border dark:border-slate-600 z-10">
                    {React.cloneElement(children, { close: () => setIsOpen(false) })}
                </div>
            )}
        </div>
    );
};

export default Dropdown;
