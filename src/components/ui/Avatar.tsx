import React from 'react';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ name, size = 'md', className = '' }) => {
  const initials = name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  // Generate consistent muted gradient based on name
  const getGradient = (name: string) => {
    const gradients = [
      'from-blue-100 to-blue-200',
      'from-emerald-100 to-emerald-200',
      'from-purple-100 to-purple-200',
      'from-pink-100 to-pink-200',
      'from-amber-100 to-amber-200',
      'from-teal-100 to-teal-200',
      'from-indigo-100 to-indigo-200',
      'from-rose-100 to-rose-200',
    ];
    
    const index = name.length % gradients.length;
    return gradients[index];
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${getGradient(name)} flex items-center justify-center text-slate-700 font-semibold ${className}`}>
      {initials}
    </div>
  );
};

export default Avatar;
