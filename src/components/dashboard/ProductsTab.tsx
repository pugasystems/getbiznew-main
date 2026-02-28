'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { API_BASE_URL } from '@/utils/constants';
import { Product } from '@/types';

interface Props {
  vendorId: number;
}

export default function ProductsTab({ vendorId }: Props) {
  const { data: session } = useSession();

  const { data: products, isPending, isError } = useQuery<Product[]>({
    queryKey: ['products-vendor', vendorId],
    queryFn: () =>
      fetch(
        `${API_BASE_URL}/products?vendorId=${vendorId}&skip=0&take=25`,
        {
          headers: { Authorization: `Bearer ${session?.user?.accessToken}` },
          cache: 'no-store',
        },
      ).then(res => res.json()),
    enabled: !!session?.user?.accessToken,
  });

  if (isPending) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="py-12 text-center text-slate-500">Failed to load your products.</p>
    );
  }

  const productList = Array.isArray(products) ? products : [];

  if (!productList.length) {
    return (
      <div className="py-12 text-center">
        <p className="text-slate-500">You haven&apos;t listed any products yet.</p>
        <Link
          href="/seller"
          className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline"
        >
          Add your first product →
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left">
          <tr>
            <th className="px-4 py-3 font-semibold text-slate-600">Image</th>
            <th className="px-4 py-3 font-semibold text-slate-600">Product Name</th>
            <th className="px-4 py-3 font-semibold text-slate-600">Category</th>
            <th className="px-4 py-3 font-semibold text-slate-600">Price</th>
            <th className="px-4 py-3 font-semibold text-slate-600">Stock</th>
            <th className="px-4 py-3 font-semibold text-slate-600">Date Added</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {productList.map(product => (
            <tr key={product.id} className="hover:bg-slate-50">
              <td className="px-4 py-3">
                {product.images?.[0]?.imageUrl ? (
                  <Image
                    src={product.images[0].imageUrl}
                    alt={product.name}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-md object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-md bg-slate-100" />
                )}
              </td>
              <td className="px-4 py-3 font-medium">{product.name}</td>
              <td className="px-4 py-3 text-slate-500">{product.category?.name ?? '—'}</td>
              <td className="px-4 py-3">${product.price?.toLocaleString()}</td>
              <td className="px-4 py-3">{product.quantity}</td>
              <td className="px-4 py-3 text-slate-400">
                {new Date(product.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
