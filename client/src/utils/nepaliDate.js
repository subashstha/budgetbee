import NepaliDate from 'nepali-date-converter';

const BS_MONTHS_EN = [
  'Baisakh', 'Jestha', 'Ashadh', 'Shrawan',
  'Bhadra', 'Ashwin', 'Kartik', 'Mangsir',
  'Poush', 'Magh', 'Falgun', 'Chaitra',
];

const BS_MONTHS_NP = [
  'बैशाख', 'जेठ', 'असार', 'श्रावण',
  'भाद्र', 'आश्विन', 'कार्तिक', 'मंसिर',
  'पौष', 'माघ', 'फाल्गुन', 'चैत्र',
];

const NP_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

const toNpDigits = (num) =>
  String(num).split('').map((d) => NP_DIGITS[parseInt(d)] ?? d).join('');

export const adToBS = (date, useDevanagari = false) => {
  try {
    const d = new Date(date);
    if (isNaN(d)) return '';
    const bs = new NepaliDate(d);
    const year  = bs.getYear();
    const month = bs.getMonth(); // 0-indexed
    const day   = bs.getDate();

    if (useDevanagari) {
      return `${BS_MONTHS_NP[month]} ${toNpDigits(day)}, ${toNpDigits(year)}`;
    }
    return `${BS_MONTHS_EN[month]} ${day}, ${year}`;
  } catch {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
};

export const formatDateBS = (date) => adToBS(date, false);
export const formatDateBSNp = (date) => adToBS(date, true);

export const getMonthNameBS = (month, year, useDevanagari = false) => {
  const idx = month - 1;
  const m = useDevanagari ? BS_MONTHS_NP[idx] : BS_MONTHS_EN[idx];
  const y = useDevanagari ? toNpDigits(year) : year;
  return `${m} ${y}`;
};

// Convert AD month (1-12) + AD year to BS label using the 15th as representative date
export const getBSFromAD = (adMonth, adYear) => {
  try {
    const bs = new NepaliDate(new Date(adYear, adMonth - 1, 15));
    return {
      month: bs.getMonth() + 1,
      year: bs.getYear(),
      monthName: BS_MONTHS_EN[bs.getMonth()],
    };
  } catch {
    return { month: adMonth, year: adYear, monthName: BS_MONTHS_EN[adMonth - 1] };
  }
};
