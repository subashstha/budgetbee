import { useSelector } from 'react-redux';
import { formatDate, formatRelativeDate } from '../utils/formatters';
import { adToBS } from '../utils/nepaliDate';

const useDate = () => {
  const dateFormat = useSelector((s) => s.ui.dateFormat);
  const isBS = dateFormat === 'BS';

  const format = (date) => {
    if (!date) return '';
    return isBS ? adToBS(date, false) : formatDate(date);
  };

  const formatRelative = (date) => {
    if (!date) return '';
    if (!isBS) return formatRelativeDate(date);
    const diffDays = Math.floor((Date.now() - new Date(date)) / 86400000);
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return adToBS(date, false);
  };

  return { format, formatRelative, isBS, dateFormat };
};

export default useDate;
