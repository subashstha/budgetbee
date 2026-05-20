import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MdCalendarToday, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { forwardRef, useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';
import { adToBS } from '../../utils/nepaliDate';
import NepaliDate from 'nepali-date-converter';

const BS_MONTHS = [
  'Baisakh','Jestha','Ashadh','Shrawan',
  'Bhadra','Ashwin','Kartik','Mangsir',
  'Poush','Magh','Falgun','Chaitra',
];
const WEEK_DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

const strToDate = (s) => {
  if (!s) return null;
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d, 12);
};

const dateToStr = (date) => {
  if (!date) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const getDaysInBSMonth = (year, month) => {
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear  = month === 11 ? year + 1 : year;
  try {
    const firstOfNext = new NepaliDate(nextYear, nextMonth, 1).toJsDate();
    const lastDay = new Date(firstOfNext);
    lastDay.setDate(lastDay.getDate() - 1);
    return new NepaliDate(lastDay).getDate();
  } catch {
    return 30;
  }
};

const getFirstWeekdayOfBSMonth = (year, month) => {
  try {
    return new NepaliDate(year, month, 1).toJsDate().getDay();
  } catch {
    return 0;
  }
};

/* ── BS Calendar popup ── */
const BSCalendar = ({ value, onChange }) => {
  const adDate   = strToDate(value);
  const initBS   = adDate ? new NepaliDate(adDate) : new NepaliDate(new Date());
  const todayBS  = new NepaliDate(new Date());

  const [viewYear,  setViewYear]  = useState(initBS.getYear());
  const [viewMonth, setViewMonth] = useState(initBS.getMonth()); // 0-indexed

  const selectedBS = adDate ? new NepaliDate(adDate) : null;
  const daysInMonth = getDaysInBSMonth(viewYear, viewMonth);
  const firstWeekday = getFirstWeekdayOfBSMonth(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const handleDay = (day) => {
    try {
      const ad = new NepaliDate(viewYear, viewMonth, day).toJsDate();
      onChange(dateToStr(ad));
    } catch {}
  };

  const cells = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-3 w-[272px]">
      {/* Month / Year header */}
      <div className="flex items-center justify-between mb-2 px-1">
        <button type="button" onClick={prevMonth} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <MdChevronLeft className="text-lg text-gray-600 dark:text-gray-300" />
        </button>
        <span className="text-sm font-bold text-gray-800 dark:text-gray-100">
          {BS_MONTHS[viewMonth]} {viewYear}
        </span>
        <button type="button" onClick={nextMonth} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <MdChevronRight className="text-lg text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Week-day labels */}
      <div className="grid grid-cols-7 mb-1">
        {WEEK_DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] font-bold text-gray-400 py-1">{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />;
          const isSelected = selectedBS &&
            selectedBS.getYear()  === viewYear &&
            selectedBS.getMonth() === viewMonth &&
            selectedBS.getDate()  === day;
          const isToday = todayBS.getYear()  === viewYear &&
            todayBS.getMonth() === viewMonth &&
            todayBS.getDate()  === day;
          return (
            <button
              key={day}
              type="button"
              onClick={() => handleDay(day)}
              className={`
                w-full aspect-square flex items-center justify-center text-xs font-medium rounded-full transition-all
                ${isSelected
                  ? 'bg-emerald-500 text-white font-bold shadow'
                  : isToday
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ── AD custom input (for react-datepicker) ── */
const CustomInput = forwardRef(({ value, onClick, placeholder }, ref) => (
  <button
    type="button"
    ref={ref}
    onClick={onClick}
    className="input-field w-full flex items-center justify-between gap-2 text-left cursor-pointer"
  >
    <span className={value ? 'text-gray-800 dark:text-gray-100' : 'text-gray-400'}>
      {value || placeholder || 'Select date'}
    </span>
    <MdCalendarToday className="text-emerald-500 text-base flex-shrink-0" />
  </button>
));
CustomInput.displayName = 'CustomInput';

/* ── Main DatePicker ── */
const DatePicker = ({ value, onChange, placeholder, className = '' }) => {
  const isBS = useSelector((s) => s.ui.dateFormat) === 'BS';
  const [open, setOpen] = useState(false);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const popupRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e) => {
      if (
        btnRef.current && !btnRef.current.contains(e.target) &&
        popupRef.current && !popupRef.current.contains(e.target)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  const handleToggle = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const calendarHeight = 320;
      const spaceBelow = window.innerHeight - rect.bottom;
      const top = spaceBelow >= calendarHeight
        ? rect.bottom + 4
        : rect.top - calendarHeight - 4;
      setPopupPos({ top, left: rect.left });
    }
    setOpen((o) => !o);
  };

  if (!isBS) {
    return (
      <div className={`bb-datepicker-wrapper ${className}`}>
        <ReactDatePicker
          selected={strToDate(value)}
          onChange={(date) => onChange(dateToStr(date))}
          customInput={<CustomInput placeholder={placeholder} />}
          dateFormat="MMM d, yyyy"
          calendarClassName="bb-calendar"
          popperClassName="bb-popper"
          showPopperArrow={false}
          popperPlacement="bottom-start"
        />
      </div>
    );
  }

  const displayValue = value ? adToBS(strToDate(value), false) : '';

  return (
    <div className={className}>
      <button
        ref={btnRef}
        type="button"
        onClick={handleToggle}
        className="input-field w-full flex items-center justify-between gap-2 text-left cursor-pointer"
      >
        <span className={displayValue ? 'text-gray-800 dark:text-gray-100' : 'text-gray-400'}>
          {displayValue || placeholder || 'Select date'}
        </span>
        <MdCalendarToday className="text-emerald-500 text-base flex-shrink-0" />
      </button>

      {open && ReactDOM.createPortal(
        <div
          ref={popupRef}
          style={{ position: 'fixed', top: popupPos.top, left: popupPos.left, zIndex: 9999 }}
        >
          <BSCalendar
            value={value}
            onChange={(val) => { onChange(val); setOpen(false); }}
          />
        </div>,
        document.body
      )}
    </div>
  );
};

export default DatePicker;
