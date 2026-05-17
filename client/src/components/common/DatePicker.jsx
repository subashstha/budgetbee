import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MdCalendarToday } from 'react-icons/md';
import { forwardRef } from 'react';

/* Convert "YYYY-MM-DD" string → Date (local noon to avoid timezone shifts) */
const strToDate = (s) => {
  if (!s) return null;
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d, 12);
};

/* Convert Date → "YYYY-MM-DD" string */
const dateToStr = (date) => {
  if (!date) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

/* Custom input so it looks like our input-field */
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

const DatePicker = ({ value, onChange, placeholder, className = '' }) => (
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

export default DatePicker;
