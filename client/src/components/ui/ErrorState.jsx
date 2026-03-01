import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';

export default function ErrorState({ message = 'Something went wrong', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-red-100 rounded-full p-4 mb-4">
        <AlertTriangle size={32} className="text-red-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-700 mb-1">Error</h3>
      <p className="text-sm text-gray-500 mb-4 max-w-sm">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} size="sm">
          <RefreshCw size={16} />
          Retry
        </Button>
      )}
    </div>
  );
}
