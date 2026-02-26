import { CallOutlineSvg } from '@/assets/icons/Svgs';
import GetPriceFormDialog from '@/components/home/getPriceFormDialog';
import { Button } from '@/components/ui/button';
import { getSlug } from '@/lib/utils';
import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <article className="group overflow-hidden rounded-md border border-grey shadow transition-shadow duration-200 hover:shadow-md">
      <div className="relative h-44 w-full">
        <Link href={`/products/${getSlug(product.name)}/${product.id}`}>
          <Image
            src={product.images[0].imageUrl}
            alt="Product Image"
            fill
            className="cursor-pointer bg-grey object-contain transition-transform duration-300 ease-in-out hover:scale-105"
          />
        </Link>
      </div>
      <div className="flex flex-col gap-1 p-4 pt-2">
        <h2 className="truncate text-[15px] font-medium">
          <Link
            className="hover:underline"
            href={`/products/${getSlug(product.name)}/${product.id}`}
          >
            {product.name}
          </Link>
        </h2>
        <p className="truncate text-[13px] font-medium">
          <Link
            className="hover:underline"
            href={`/vendors/${getSlug(product.vendor.name)}/${product.vendorId}`}
          >
            {product.vendor.name}
          </Link>
        </p>
        <p className="truncate text-[11px] text-slate-600">
          {product.vendor.userAddress.city.name},{' '}
          {product.vendor.userAddress.state.name}
        </p>
        <div className="mt-2 flex items-end justify-between leading-none">
          <p className="text-xl font-semibold leading-none">
            $ {product.price}{' '}
            <span className="text-[13px] font-normal text-slate-600">
              / Unit
            </span>
          </p>
          <div>
            <span className="text-[13px] text-slate-600">In Stock: </span>
            <span className="font-medium leading-none">{product.quantity}</span>
          </div>
        </div>
        <Button variant="outline" className="mt-2 gap-2">
          <CallOutlineSvg className="h-4 w-4" />
          <span>View Number</span>
        </Button>
        <GetPriceFormDialog product={product}>
          <Button className="mt-1">Get Best Price</Button>
        </GetPriceFormDialog>
      </div>
    </article>
  );
}
