import ProductCard from '@/components/home/productCard';
import { Product } from '@/types';
import { API_BASE_URL } from '@/utils/constants';
import { QueryClient } from '@tanstack/react-query';
import notFoundImage from '@/assets/not-found.svg';
import Image from 'next/image';

interface Props {
  params: { categoryId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function CategoryResults({ params, searchParams }: Props) {
  const queryClient = new QueryClient();

  const { products } = await queryClient.fetchQuery<{ products: Product[] }>({
    queryKey: ['products', searchParams],
    queryFn: () =>
      fetch(`${API_BASE_URL}/products?categoryId=${params.categoryId}`).then(
        res => res.json(),
      ),
  });

  return (
    <div className="mb-24 pt-6">
      <h1 className="mb-6 border-b-2 border-grey pb-3 text-xl font-semibold">
        Category Results ( {products[0]?.category.name ?? 0} )
      </h1>
      {products.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,_minmax(220px,_1fr))] gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <Image src={notFoundImage} alt="Not Found" className="h-80 w-auto" />
          <h1 className="text-3xl font-bold">No Results Found</h1>
          <p className="mt-2 text-lg">Please try another search</p>
        </div>
      )}
    </div>
  );
}
