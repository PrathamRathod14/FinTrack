import { MONTHS } from '../../utils/constants';
import { getCurrentMonth, getCurrentYear } from '../../utils/helpers';

export default function MonthYearPicker({ month, year, onChange }) {
  const currentYear = getCurrentYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="flex items-center gap-2">
      <select
        value={month}
        onChange={(e) => onChange(parseInt(e.target.value), year)}
        className="select-field w-auto"
      >
        {MONTHS.map((name, idx) => (
          <option key={idx} value={idx + 1}>
            {name}
          </option>
        ))}
      </select>
      <select
        value={year}
        onChange={(e) => onChange(month, parseInt(e.target.value))}
        className="select-field w-auto"
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
}
