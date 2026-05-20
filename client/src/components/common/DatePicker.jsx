import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MdCalendarToday, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { forwardRef } from 'react';
import { useSelector } from 'react-redux';
import { adToBS, getBSFromAD } from '../../utils/nepaliDate';

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

const CustomInput = forwardRef(({ value, onClick, placeholder, displayValue }, ref) => (
  <button
    type="button"
    ref={ref}
    onClick={onClick}
    className="input-field w-full flex items-center justify-between gap-2 text-left cursor-pointer"
  >
    <span className={displayValue || value ? 'text-gray-800 dark:text-gray-100' : 'text-gray-400'}>
      {displayValue || value || placeholder || 'Select date'}
    </span>
    <MdCalendarToday className="text-emerald-500 text-base flex-shrink-0" />
  </button>
));
CustomInput.displayName = 'CustomInput';

const DatePicker = ({ value, onChange, placeholder, className = '' }) => {
  const isBS = useSelector((s) => s.ui.dateFormat) === 'BS';
  const selectedDate = strToDate(value);

  const displayValue = selectedDate && isBS ? adToBS(selectedDate, false) : null;

  const renderHeader = ({
    date,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }) => {
    const adMonth = date.getMonth() + 1;
    const adYear = date.getFullYear();
    const label = isBS
      ? `${getBSFromAD(adMonth, adYear).monthName} ${getBSFromAD(adMonth, adYear).year}`
      : date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
      <div className="flex items-center justify-between px-2 py-1">
        <button
          type="button"
          onClick={decreaseMonth}
          disabled={prevMonthButtonDisabled}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors"
        >
          <MdChevronLeft className="text-lg text-gray-600 dark:text-gray-300" />
        </button>
        <span className="text-sm font-bold text-gray-800 dark:text-gray-100">{label}</span>
        <button
          type="button"
          onClick={increaseMonth}
          disabled={nextMonthButtonDisabled}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors"
        >
          <MdChevronRight className="text-lg text-gray-600 dark:text-gray-300" />
        </button>
      </div>
    );
  };

  return (
    <div className={`bb-datepicker-wrapper ${className}`}>
      <ReactDatePicker
        selected={selectedDate}
        onChange={(date) => onChange(dateToStr(date))}
        customInput={<CustomInput placeholder={placeholder} displayValue={displayValue} />}
        dateFormat="MMM d, yyyy"
        calendarClassName="bb-calendar"
        popperClassName="bb-popper"
        showPopperArrow={false}
        popperPlacement="bottom-start"
        renderCustomHeader={renderHeader}
      />
    </div>
  );
};

export default DatePicker;
