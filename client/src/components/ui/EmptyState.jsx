import { Inbox } from 'lucide-react';

export default function EmptyState({ message = 'No data found', description = '', icon: Icon = Inbox, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-gray-100 rounded-full p-4 mb-4">
        <Icon size={32} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-600 mb-1">{message}</h3>
      {description && <p className="text-sm text-gray-400 mb-4 max-w-sm">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
