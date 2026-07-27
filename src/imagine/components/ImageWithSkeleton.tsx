import { useState } from 'react';

interface ImageWithSkeletonProps {
  src: string;
  alt: string;
  className?: string;
  ratio?: string;
}

export function ImageWithSkeleton({ src, alt, className = "", ratio }: ImageWithSkeletonProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Convert "16:9" to "16/9" CSS aspect-ratio format
  const style = ratio ? { aspectRatio: ratio.replace(':', '/') } : undefined;

  return (
    <div 
      className={`image-skeleton-container ${isLoaded ? 'loaded' : 'loading'}`}
      style={style}
    >
      {!isLoaded && <div className="skeleton-shimmer"></div>}
      <img
        src={src}
        alt={alt}
        className={`${className} skeleton-target-img`}
        onLoad={() => setIsLoaded(true)}
        loading="lazy"
      />
    </div>
  );
}
