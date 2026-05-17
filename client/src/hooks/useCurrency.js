import { useSelector } from 'react-redux';
import { formatCurrency } from '../utils/formatters';

const useCurrency = () => {
  const { user } = useSelector((s) => s.auth);
  const { rates, base } = useSelector((s) => s.rates);
  const currency = user?.currency || 'NPR';

  const convert = (amount) => {
    if (!amount || !rates || !Object.keys(rates).length) return amount || 0;
    if (currency === base) return amount;
    const rate = rates[currency];
    return rate ? amount * rate : amount;
  };

  const format = (amount) => formatCurrency(convert(amount), currency);

  return { currency, convert, format };
};

export default useCurrency;
