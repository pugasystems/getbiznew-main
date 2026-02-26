import {
  CalendarSvg,
  CallOutlineSvg,
  CategorySvg,
  EmailSvg,
  IdCardSvg,
  LocationSvg,
  PersonMoneySvg,
  UserCircleSvg,
} from '@/assets/icons/Svgs';
import ProductCard from '@/components/home/productCard';
import dayjs from '@/lib/dayjs';
import { cn } from '@/lib/utils';
import { Product, Vendor } from '@/types';
import { API_BASE_URL } from '@/utils/constants';
import { QueryClient } from '@tanstack/react-query';

export const DetailSection = ({
  label,
  value,
  Icon,
  className,
}: {
  label: string;
  value?: string | null;
  Icon: ({ className }: { className: string }) => JSX.Element;
  className?: string;
}) => {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex h-9 w-9 items-center justify-center rounded bg-primary-background">
        <Icon className="h-[18px] w-[18px] text-primary" />
      </div>
      <div className="text-sm font-medium">
        <h3 className="text-muted">{label}</h3>
        <p>{value || '---'}</p>
      </div>
    </div>
  );
};

interface Props {
  params: { vendorId: string };
}

export default async function VendorProfile({ params }: Props) {
  const queryClient = new QueryClient();
  const { vendorId } = params;

  const vendor = await queryClient.fetchQuery<Vendor>({
    queryKey: ['vendors', vendorId],
    queryFn: () =>
      fetch(`${API_BASE_URL}/vendors/${vendorId}`).then(res => res.json()),
  });

  const { products } = await queryClient.fetchQuery<{ products: Product[] }>({
    queryKey: ['products', vendorId],
    queryFn: () =>
      fetch(`${API_BASE_URL}/products?vendorId=${vendorId}`).then(res =>
        res.json(),
      ),
  });

  return (
    <div className="mb-24">
      <section className="mt-6 flex items-center rounded-md border border-grey px-8 py-4 shadow-sm">
        <div className="flex basis-1/2 items-center gap-3">
          <UserCircleSvg className="h-20 w-20 text-muted" />
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">{vendor.name}</h2>
            <div className="flex items-center gap-1">
              <LocationSvg className="h-4 w-4 text-muted" />
              <p className="text-sm font-medium">
                {vendor.userAddress.city.name}, {vendor.userAddress.state.name}
              </p>
            </div>
          </div>
        </div>
        <DetailSection
          label="Member Since"
          value={dayjs(vendor.createdAt).fromNow(true)}
          Icon={CalendarSvg}
          className="basis-1/4"
        />
        <DetailSection
          label="Business Category"
          value={vendor.businessCategory.name}
          Icon={CategorySvg}
          className="basis-1/4"
        />
      </section>
      <section className="mt-8 rounded-md border border-grey shadow-sm">
        <h2 className="border-b border-grey px-8 py-4 font-semibold">
          Address Information
        </h2>
        <article className="grid grid-cols-2 gap-y-8 p-8 pt-6">
          <DetailSection
            label="Country"
            value={vendor.userAddress.country.name}
            Icon={LocationSvg}
          />
          <DetailSection
            label="State"
            value={vendor.userAddress.state.name}
            Icon={LocationSvg}
          />
          <DetailSection
            label="City"
            value={vendor.userAddress.city.name}
            Icon={LocationSvg}
          />
          <DetailSection
            label="Address Line 1"
            value={vendor.userAddress.addressLineOne}
            Icon={LocationSvg}
          />
          <DetailSection
            label="Address Line 2"
            value={vendor.userAddress.addressLineTwo}
            Icon={LocationSvg}
          />
          <DetailSection
            label="Zip Code"
            value={vendor.userAddress.zipCode}
            Icon={LocationSvg}
          />
        </article>
      </section>
      <section className="mt-8 rounded-md border border-grey shadow-sm">
        <h2 className="border-b border-grey px-8 py-4 font-semibold">
          Company Information
        </h2>
        <article className="grid grid-cols-2 gap-y-8 p-8 pt-6">
          <DetailSection
            label="Owner Name"
            value={
              vendor.userAddress.user.firstName +
              ' ' +
              vendor.userAddress.user.lastName
            }
            Icon={PersonMoneySvg}
          />
          <DetailSection
            label="Email"
            value={vendor.userAddress.user.email}
            Icon={EmailSvg}
          />
          <DetailSection
            label="Mobile Number"
            value={null}
            Icon={CallOutlineSvg}
          />
          <DetailSection
            label="Tax ID Number"
            value={vendor.taxId}
            Icon={IdCardSvg}
          />
        </article>
      </section>
      <section className="mt-12">
        <h2 className="mb-6 border-b-2 border-grey pb-3 text-xl font-semibold">
          Our Products
        </h2>
        <div className="grid grid-cols-[repeat(auto-fill,_minmax(220px,_1fr))] gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
