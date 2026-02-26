import ProductCard from '@/components/home/productCard';
import { Product, Vendor } from '@/types';
import { API_BASE_URL } from '@/utils/constants';
import { QueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import notFoundImage from '@/assets/not-found.svg';
import { LocationSvg, UserCircleSvg } from '@/assets/icons/Svgs';
import Link from 'next/link';
import { getSlug } from '@/lib/utils';

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function SearchResults({ searchParams }: Props) {
  const queryClient = new QueryClient();

  const { products } = await queryClient.fetchQuery<{ products: Product[] }>({
    queryKey: ['products', searchParams],
    queryFn: () =>
      fetch(
        `${API_BASE_URL}/products?search=${searchParams.query}&stateId=${searchParams.stateId}`,
      ).then(res => res.json()),
  });

  const { vendors } = await queryClient.fetchQuery<{ vendors: Vendor[] }>({
    queryKey: ['vendors', searchParams],
    queryFn: () =>
      fetch(
        `${API_BASE_URL}/vendors?search=${searchParams.query}&take=10`,
      ).then(res => res.json()),
  });

  return (
    <div className="mb-24 pt-6">
      <h1 className="mb-6 border-b-2 border-grey pb-3 text-xl font-semibold">
        Search Results
      </h1>
      {products.length === 0 && vendors.length === 0 ? (
        <div className="flex flex-col items-center justify-center">
          <Image src={notFoundImage} alt="Not Found" className="h-80 w-auto" />
          <h1 className="text-3xl font-bold">No Results Found</h1>
          <p className="mt-2 text-lg">Please try another search</p>
        </div>
      ) : (
        <article>
          {vendors.length > 0 && (
            <div className="mb-12 grid grid-cols-3 gap-8">
              {vendors.map(vendor => (
                <Link
                  href={`/vendors/${getSlug(vendor.name)}/${vendor.id}`}
                  key={vendor.id}
                  className="flex items-center gap-2"
                >
                  <div className="h-12 w-12">
                    <UserCircleSvg className="h-12 w-12 text-muted" />
                  </div>
                  <div className="space-y-0.5 font-medium">
                    <h3 className="hover:underline">{vendor.name}</h3>
                    <div className="flex items-center gap-1">
                      <LocationSvg className="h-4 w-4 text-muted" />
                      <p className="text-sm">
                        {vendor.userAddress.city.name},{' '}
                        {vendor.userAddress.state.name}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {products.length > 0 && (
            <div>
              {vendors.length > 0 && (
                <h2 className="mb-6 text-xl font-semibold">Product Results</h2>
              )}
              <div className="grid grid-cols-[repeat(auto-fill,_minmax(220px,_1fr))] gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </article>
      )}
    </div>
  );
}
