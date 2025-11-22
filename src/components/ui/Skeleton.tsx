import * as React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'circular' | 'rounded';
  animation?: 'pulse' | 'shimmer' | 'none';
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className = '', variant = 'default', animation = 'shimmer', ...props }, ref) => {
    const variantStyles = {
      default: 'rounded-md',
      circular: 'rounded-full',
      rounded: 'rounded-lg',
    };

    const animationStyles = {
      pulse: 'animate-pulse-soft',
      shimmer: 'bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 bg-[length:200%_100%] animate-shimmer',
      none: '',
    };

    const baseStyles = animation === 'shimmer'
      ? ''
      : 'bg-gray-200 dark:bg-gray-800';

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${animationStyles[animation]} ${className}`}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

// 포스트 카드 스켈레톤
function PostCardSkeleton() {
  return (
    <div className="py-10 first:pt-0">
      <div className="flex gap-8 items-start">
        <div className="flex-1 min-w-0 space-y-4">
          {/* 제목 */}
          <Skeleton className="h-7 w-3/4" />

          {/* 본문 2줄 */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
          </div>

          {/* 메타 정보 */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-12" />
          </div>

          {/* 태그 */}
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>

        {/* 썸네일 */}
        <div className="hidden sm:block">
          <Skeleton className="w-28 h-28" variant="rounded" />
        </div>
      </div>
    </div>
  );
}

// 텍스트 라인 스켈레톤
function TextSkeleton({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 ? 'w-4/5' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

// 아바타 스켈레톤
function AvatarSkeleton({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeStyles = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
  };

  return <Skeleton className={sizeStyles[size]} variant="circular" />;
}

export { Skeleton, PostCardSkeleton, TextSkeleton, AvatarSkeleton };
