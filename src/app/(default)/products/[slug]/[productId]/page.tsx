import GetPriceFormDialog from '@/components/home/getPriceFormDialog';
import ProductCard from '@/components/home/productCard';
import ImageCarousel from '@/components/productDetail/imageCarousel';
import { Button } from '@/components/ui/button';
import { getSlug } from '@/lib/utils';
import type { Product } from '@/types';
import { API_BASE_URL } from '@/utils/constants';
import { QueryClient } from '@tanstack/react-query';
import dayjs from '@/lib/dayjs';
import Link from 'next/link';

interface Props {
  params: { productId: string };
}

export async function generateMetadata({ params }: Props) {
  const productId = params.productId;

  const queryClient = new QueryClient();
  const data = await queryClient.fetchQuery<Product>({
    queryKey: ['products', productId],
    queryFn: () =>
      fetch(`${API_BASE_URL}/products/${productId}`).then(res => res.json()),
  });

  return {
    title: data.name,
    description: data.description,
    openGraph: {
      images: { url: data.images[0].imageUrl, itemProp: 'image' },
      title: data.name,
      description: data.description,
      url: `${process.env.NEXTAUTH_URL}/products/${getSlug(data.name)}/${productId}/`,
      siteName: 'GetBizzUSA',
      type: 'website',
      locale: 'en_US',
    },
  };
}

export default async function ProductDetail({ params }: Props) {
  const queryClient = new QueryClient();
  const { productId } = params;

  const product = await queryClient.fetchQuery<Product>({
    queryKey: ['products', productId],
    queryFn: () =>
      fetch(`${API_BASE_URL}/products/${productId}`).then(res => res.json()),
  });

  const { products } = await queryClient.fetchQuery<{ products: Product[] }>({
    queryKey: ['products', product.categoryId],
    queryFn: () =>
      fetch(`${API_BASE_URL}/products?categoryId=${product.categoryId}`).then(
        res => res.json(),
      ),
  });

  const images = product.images.map(image => image.imageUrl);

  const productDetails = [
    {
      label: 'Category',
      value: product.category.name,
    },
    ...product.attributes.map(attribute => ({
      label: attribute.name,
      value: attribute.value,
    })),
    {
      label: 'Posted At',
      value: new Date(product.createdAt).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    },
    {
      label: 'Posted Since',
      value: dayjs(product.createdAt).fromNow(),
    },
  ];

  const vendorDetails = [
    {
      label: 'Name',
      value: product.vendor.name,
    },
    {
      label: 'Country',
      value: product.vendor.userAddress.country.name,
    },
    {
      label: 'State',
      value: product.vendor.userAddress.state.name,
    },
    {
      label: 'City',
      value: product.vendor.userAddress.city.name,
    },
    {
      label: 'Address',
      value: product.vendor.userAddress.addressLineOne,
    },
  ];

  return (
    <div className="mb-24 pt-6">
      <article className="flex gap-6">
        <ImageCarousel images={images} />
        <section className="flex-grow space-y-2 border-r-2 border-grey pr-6">
          <h3 className="text-xl font-semibold">{product.name}</h3>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold">
              $ {product.price}
              <span className="text-base font-normal text-slate-600">
                {' '}
                / Unit
              </span>
            </p>
            <div>
              <span className="text-xl font-semibold leading-none">
                {product.quantity}
              </span>
              <span className="text-slate-600"> units left</span>
            </div>
          </div>
          <ul>
            {productDetails.map(({ label, value }, i) => (
              <li
                key={i}
                className="flex border-b border-grey py-2 text-sm font-medium"
              >
                <div className="w-44 capitalize text-muted">{label}</div>
                <div>: &nbsp; {value}</div>
              </li>
            ))}
          </ul>
          <div className="space-y-1 pt-2">
            <h3 className="text-lg font-medium text-primary">Description</h3>
            <p className="text-[15px]">{product.description}</p>
          </div>
          <div className="flex justify-center pt-4">
            <GetPriceFormDialog product={product} asChild>
              <Button className="h-auto w-64 flex-col gap-1 py-2">
                <p className="text-lg font-semibold leading-none">
                  Get Latest Price
                </p>
                <p className="text-[13px]">Request a quote</p>
              </Button>
            </GetPriceFormDialog>
          </div>
        </section>
        <section className="w-[348px]">
          <div className="space-y-3 rounded-md border border-grey bg-grey px-5 py-3 shadow-sm">
            <h3 className="text-lg font-semibold text-primary">
              Vendor Details
            </h3>
            <ul className="space-y-3">
              {vendorDetails.map(({ label, value }, i) => (
                <li key={i} className="flex text-sm font-medium">
                  <div className="w-16 capitalize text-muted">{label}</div>
                  <div>
                    :&nbsp;{' '}
                    {label === 'Name' ? (
                      <Link
                        href={`/vendors/${getSlug(product.vendor.name)}/${product.vendorId}`}
                        className="hover:underline"
                      >
                        {value}
                      </Link>
                    ) : (
                      value
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </article>
      <article className="mt-12">
        <h2 className="text-xl font-medium">
          Products similar to{' '}
          <span className="font-semibold">{product.name}</span>
        </h2>
        <div className="mt-6 grid grid-cols-[repeat(auto-fill,_minmax(220px,_1fr))] gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </article>
    </div>
  );
}
