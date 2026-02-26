import ProductCard from '@/components/home/productCard';
import { Product } from '@/types';
import { API_BASE_URL } from '@/utils/constants';
import { QueryClient } from '@tanstack/react-query';

export default async function Products() {
  const queryClient = new QueryClient();

  const { products } = await queryClient.fetchQuery<{ products: Product[] }>({
    queryKey: ['products'],
    queryFn: () => fetch(`${API_BASE_URL}/products`).then(res => res.json()),
  });

  return (
    <section className="mt-6">
      <h2 className="mb-6 text-2xl font-semibold">Products You May Like</h2>
      <div className="grid grid-cols-[repeat(auto-fill,_minmax(220px,_1fr))] gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
