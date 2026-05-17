import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MdKeyboardArrowDown, MdCheck } from 'react-icons/md';

/**
 * options: string[] | { value, label }[]
 * onChange: (value) => void
 */
const CustomSelect = ({ value, onChange, options = [], placeholder = 'Select...', className = '', compact = false }) => {
  const [open, setOpen]       = useState(false);
  const [pos, setPos]         = useState({ top: 0, left: 0, width: 0 });
  const containerRef          = useRef(null);
  const triggerRef            = useRef(null);
  const dropdownRef           = useRef(null);

  useEffect(() => {
    const onMouseDown = (e) => {
      const insideContainer = containerRef.current?.contains(e.target);
      const insideDropdown  = dropdownRef.current?.contains(e.target);
      if (!insideContainer && !insideDropdown) setOpen(false);
    };
    const onEsc = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  const handleToggle = () => {
    if (!open && triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + window.scrollY + 4, left: r.left + window.scrollX, width: r.width });
    }
    setOpen((v) => !v);
  };

  const norm     = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  const selected = norm.find((o) => String(o.value) === String(value));

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        className={`w-full flex items-center justify-between gap-2 rounded-xl border transition-all duration-200 cursor-pointer text-left focus:outline-none
          ${compact ? 'px-3 py-2 text-sm font-semibold rounded-lg whitespace-nowrap' : 'px-4 py-2.5 text-sm font-medium'}
          ${open
            ? 'border-emerald-400 dark:border-emerald-500 ring-2 ring-emerald-400/30 dark:ring-emerald-500/30 bg-white dark:bg-gray-800'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-emerald-300 dark:hover:border-emerald-600'
          }
          text-gray-800 dark:text-gray-100`}
      >
        <span className={selected ? 'text-gray-800 dark:text-gray-100' : 'text-gray-400'}>
          {selected?.label ?? placeholder}
        </span>
        <MdKeyboardArrowDown
          className={`flex-shrink-0 transition-transform duration-200 ${compact ? 'text-base' : 'text-lg'} ${open ? 'rotate-180 text-emerald-500' : 'text-gray-400'}`}
        />
      </button>

      {/* Portal dropdown — renders at document.body to escape overflow:hidden parents */}
      {open && createPortal(
        <div
          ref={dropdownRef}
          style={{ position: 'absolute', top: pos.top, left: pos.left, minWidth: pos.width, zIndex: 9999 }}
          className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden animate-fade-in w-max"
        >
          <div className="max-h-56 overflow-y-auto py-1">
            {norm.map((opt) => {
              const active = String(opt.value) === String(value);
              return (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm font-medium text-left whitespace-nowrap transition-colors ${
                    active
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <span>{opt.label}</span>
                  {active && <MdCheck className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default CustomSelect;
