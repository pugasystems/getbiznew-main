'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from '@/components/ui/carousel';
import Image from 'next/image';
import { useRef } from 'react';
import Autoplay from 'embla-carousel-autoplay';

interface Props {
  images: string[];
}

const CarouselIndicator = ({ images }: Props) => {
  const { api, activeIndex } = useCarousel();

  return (
    <div className="flex gap-4">
      {images.map((image, index) => (
        <button
          key={index}
          className={`bg-grey h-14 w-14 overflow-hidden rounded-lg border-2 border-grey shadow-sm transition duration-200 hover:shadow ${activeIndex === index ? 'border-primary' : ''}`}
          onClick={() => api?.scrollTo(index)}
        >
          <Image
            src={image}
            alt="small product image"
            width={56}
            height={56}
            className="h-full w-full object-contain"
          />
        </button>
      ))}
    </div>
  );
};

export default function ImageCarousel({ images }: Props) {
  const plugin = useRef(Autoplay({ stopOnInteraction: false }));

  return (
    <Carousel plugins={[plugin.current]} opts={{ loop: true }}>
      <div className="flex w-[424px] flex-col items-center space-y-4">
        <div className="bg-grey cursor-grab overflow-hidden rounded-xl border border-grey shadow-sm">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <Image
                  src={image}
                  alt="product image"
                  width={424}
                  height={480}
                  className="h-[480px] w-full object-contain"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </div>
        <CarouselIndicator images={images} />
      </div>
    </Carousel>
  );
}
