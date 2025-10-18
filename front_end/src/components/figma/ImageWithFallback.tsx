import React, { useState } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

export interface ImageWithFallbackProps {
  src?: string;
  alt?: string;
  className?: string;
  style?: any;
  loading?: "eager" | "lazy";
  quality?: "low" | "medium" | "high";
  [key: string]: any;
}

export function ImageWithFallback({
  src,
  alt,
  className,
  style,
  loading = "lazy",
  quality = "medium",
  ...rest
}: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false)

  // Log image source for debugging
  React.useEffect(() => {
    console.log('ImageWithFallback received src:', src);
  }, [src]);

  const handleError = () => {
    console.log('Image failed to load:', src);
    setDidError(true)
  }

  // If src is empty or undefined, show error image
  if (!src) {
    console.log('ImageWithFallback: No src provided, showing error image');
    return (
      <div
        className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
        style={style}
      >
        <div className="flex items-center justify-center w-full h-full">
          <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} />
        </div>
      </div>
    )
  }

  // Quality-based styling
  const qualityStyles = {
    low: {
      imageRendering: 'pixelated',
    },
    medium: {
      imageRendering: 'crisp-edges',
    },
    high: {
      imageRendering: 'crisp-edges',
      imageResolution: 'from-image',
    }
  };

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} data-original-url={src} />
      </div>
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{
        ...style,
        ...qualityStyles[quality],
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        contain: 'layout style paint',
      }}
      loading={loading}
      {...rest}
      onError={handleError}
      onLoad={() => console.log('Image loaded successfully:', src)}
    />
  )
}