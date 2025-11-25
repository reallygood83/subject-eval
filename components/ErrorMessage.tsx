import React from 'react';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  type?: 'error' | 'warning';
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = '오류 발생',
  message,
  onRetry,
  retryLabel = '다시 시도',
  type = 'error'
}) => {
  const bgColor = type === 'error' ? 'bg-red-200' : 'bg-orange-200';
  const textColor = type === 'error' ? 'text-red-800' : 'text-orange-800';
  const icon = type === 'error' ? '⚠️' : '⚡';

  return (
    <div className={`p-3 sm:p-4 md:p-6 ${bgColor} border-black border-3 sm:border-4 shadow-neo-sm`}>
      <div className="flex flex-col gap-3 sm:gap-4">
        {/* Header */}
        <div className="flex items-start gap-2 sm:gap-3">
          <span className="text-2xl sm:text-3xl md:text-4xl flex-shrink-0">{icon}</span>
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg md:text-xl font-black text-black border-black border-b-2 pb-1 mb-2">
              {title}
            </h3>
            <p className={`text-sm sm:text-base font-bold ${textColor} break-words`}>
              {message}
            </p>
          </div>
        </div>

        {/* Retry Button */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="btn-neo-secondary px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base w-full sm:w-auto self-end"
          >
            🔄 {retryLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
