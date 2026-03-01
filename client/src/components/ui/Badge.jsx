import { CATEGORY_COLORS } from '../../utils/constants';

const colorMap = {
  green: 'bg-green-100 text-green-800',
  red: 'bg-red-100 text-red-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  blue: 'bg-blue-100 text-blue-800',
  purple: 'bg-purple-100 text-purple-800',
  gray: 'bg-gray-100 text-gray-800',
  navy: 'bg-navy-50 text-navy-900',
  gold: 'bg-gold-50 text-gold-800'
};

export default function Badge({ children, color = 'gray', className = '' }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorMap[color] || colorMap.gray} ${className}`}>
      {children}
    </span>
  );
}

export function CategoryBadge({ category }) {
  const bgColor = CATEGORY_COLORS[category] || '#607D8B';
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
      style={{ backgroundColor: bgColor }}
    >
      {category}
    </span>
  );
}
