import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';

interface DropdownItem {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'destructive';
}

interface AdminActionsDropdownProps {
  items: DropdownItem[];
}

export function AdminActionsDropdown({ items }: AdminActionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-md text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
        aria-label="Ações"
      >
        <MoreVertical className="size-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-44 rounded-lg border border-neutral-800 bg-neutral-900 shadow-xl z-50 focus:outline-none py-1">
          {items.map((item, index) => (
            <button
              key={index}
              disabled={item.disabled}
              onClick={() => {
                setIsOpen(false);
                item.onClick();
              }}
              className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none ${
                item.variant === 'destructive'
                  ? 'text-red-400 hover:bg-red-500/10'
                  : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
