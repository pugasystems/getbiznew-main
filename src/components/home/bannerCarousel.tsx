'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Image from 'next/image';
import banner1 from '@/assets/banner1.webp';
import banner2 from '@/assets/banner2.webp';
import { useRef } from 'react';
import Autoplay from 'embla-carousel-autoplay';

export function BannerCarousel() {
  const plugin = useRef(Autoplay());

  return (
    <Carousel
      className="cursor-grab"
      plugins={[plugin.current]}
      opts={{ loop: true }}
    >
      <CarouselContent className='h-96'>
        <CarouselItem>
          <Image src={banner1} alt="banner" className="h-full w-full" />
        </CarouselItem>
        <CarouselItem>
          <Image src={banner2} alt="banner" className="h-full w-full" />
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  );
}
