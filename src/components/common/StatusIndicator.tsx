import { Project } from '@/types/project';

interface StatusIndicatorProps {
  status?: Project['status'];
  size?: 'sm' | 'md';
}

export const StatusIndicator = ({ status, size = 'md' }: StatusIndicatorProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500';
      case 'processing':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-emerald-500';
    }
  };

  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full ${getStatusColor()} ml-2 inline-block`} />
  );
}; 