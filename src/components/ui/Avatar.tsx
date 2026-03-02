import React from 'react';

interface AvatarProps {
  initials: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ initials, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  return (
    <div className={`rounded-full flex items-center justify-center bg-gray-800 border border-gray-600 font-semibold text-gray-200 ${sizeClasses[size]} ${className}`}>
      {initials}
    </div>
  );
};
