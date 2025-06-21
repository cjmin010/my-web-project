"use client";

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface ImageWithFallbackProps extends ImageProps {
  fallbackSrc?: string;
}

const ImageWithFallback = (props: ImageWithFallbackProps) => {
  const { src, alt, fallbackSrc, ...rest } = props;
  const [imgSrc, setImgSrc] = useState(src);

  const placeholderUrl = fallbackSrc || '/placeholder.svg';

  return (
    <Image
      {...rest}
      src={imgSrc || placeholderUrl}
      alt={alt}
      onError={() => {
        setImgSrc(placeholderUrl);
      }}
    />
  );
};

export default ImageWithFallback; 