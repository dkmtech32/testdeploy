import React from 'react';

interface ProgressBarProps {
  percentage: number;
  color?: string;
  height?: string;
  label?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  color = 'bg-blue-500',
  height = 'h-4',
  label = false,
}) => {
  const safePercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className="w-full bg-gray-200 rounded-full overflow-hidden">
      <div
        className={`${color} ${height} rounded-full transition-all duration-300 ease-in-out`}
        style={{ width: `${safePercentage}%` }}
      >
        {label && (
          <span className="text-xs font-semibold text-white px-2 py-1">
            {safePercentage.toFixed(0)}%
          </span>
        )}
      </div>
    </div>
  );
};

export default React.memo(ProgressBar);
