import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message = '처리 중...',
  fullScreen = false
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 border-3',
    md: 'w-12 h-12 border-4',
    lg: 'w-16 h-16 border-[5px]'
  };

  const messageSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Neo-Brutalism Spinner */}
      <div className="relative">
        <div className={`${sizeClasses[size]} border-black border-solid rounded-full animate-spin border-t-cyan-400 border-r-violet-400 border-b-lime-400 border-l-orange-400 shadow-neo-md`}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className={`${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'} bg-black rounded-full`}></div>
        </div>
      </div>

      {/* Loading Message */}
      {message && (
        <p className={`${messageSizeClasses[size]} font-black text-black`}>
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-yellow-200 bg-opacity-90 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="card-neo p-8 bg-white">
          {spinner}
        </div>
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
