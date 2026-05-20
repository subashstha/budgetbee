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
    return isBS ? adToBS(date, false) : formatRelativeDate(date);
  };

  return { format, formatRelative, isBS, dateFormat };
};

export default useDate;
