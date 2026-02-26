import CategoryNavigation from '@/components/home/categoryNavigation';
import Products from '@/components/home/products';
import { BannerCarousel } from '@/components/home/bannerCarousel';
import Features from '@/components/home/features';
import SupplierCities from '@/components/home/supplierCities';

export default async function Home() {
  return (
    <div>
      <BannerCarousel />
      <CategoryNavigation />
      <Products />
      <Features />
      <SupplierCities />
    </div>
  );
}
