'use client';

import { Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import StatsCards from '@/components/dashboard/StatsCards';
import AvailableLeadsTab from '@/components/dashboard/AvailableLeadsTab';
import MyLeadsTab from '@/components/dashboard/MyLeadsTab';
import ProductsTab from '@/components/dashboard/ProductsTab';
import { API_BASE_URL } from '@/utils/constants';
import { Vendor, Product } from '@/types';

const TABS = [
  { key: 'leads', label: 'Available Leads' },
  { key: 'my-leads', label: 'My Leads' },
  { key: 'products', label: 'Products' },
] as const;

type Tab = (typeof TABS)[number]['key'];

function DashboardContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = (searchParams.get('tab') as Tab) ?? 'leads';

  const userId = session?.user?.userId;
  const vendorRef = session?.user?.vendors?.[0];

  const { data: vendors, isPending: isVendorPending } = useQuery<Vendor[]>({
    queryKey: ['vendor', userId],
    queryFn: () =>
      fetch(`${API_BASE_URL}/vendors?userId=${userId}`, {
        headers: { Authorization: `Bearer ${session?.user?.accessToken}` },
        cache: 'no-store',
      }).then(res => res.json()),
    enabled: !!userId && !!session?.user?.accessToken,
  });

  const vendor = vendors?.[0];

  const { data: products } = useQuery<Product[]>({
    queryKey: ['products-vendor', vendor?.id],
    queryFn: () =>
      fetch(`${API_BASE_URL}/products?vendorId=${vendor!.id}&skip=0&take=25`, {
        headers: { Authorization: `Bearer ${session?.user?.accessToken}` },
        cache: 'no-store',
      }).then(res => res.json()),
    enabled: !!vendor?.id && !!session?.user?.accessToken,
  });

  // No vendor profile → prompt to complete setup
  if (!isVendorPending && !vendorRef) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-semibold text-slate-700">No vendor profile found</h2>
        <p className="mt-2 text-slate-500">
          Complete your seller profile to access the dashboard.
        </p>
        <Link
          href="/vendor/complete-profile"
          className="mt-4 inline-block rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary/90"
        >
          Complete Profile
        </Link>
      </div>
    );
  }

  function setTab(tab: Tab) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    router.push(`/dashboard?${params.toString()}`);
  }

  return (
    <div className="space-y-6 py-8">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          {isVendorPending ? (
            <Skeleton className="h-7 w-48" />
          ) : (
            `${vendor?.name ?? 'Your'} Dashboard`
          )}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your leads, products, and account stats
        </p>
      </div>

      {/* Stats cards */}
      {isVendorPending ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      ) : vendor ? (
        <StatsCards
          leadsCount={vendor.leadsCount}
          leadsConsumed={vendor.leadsConsumed}
          productsCount={Array.isArray(products) ? products.length : 0}
          vendorStatus={vendor.vendorStatus}
          paymentStatus={vendor.paymentStatus}
        />
      ) : null}

      {/* Tab navigation */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-1" aria-label="Dashboard tabs">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setTab(tab.key)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      {vendor ? (
        <div>
          {activeTab === 'leads' && (
            <AvailableLeadsTab
              businessCategoryId={vendor.businessCategoryId}
              vendorId={vendor.id}
            />
          )}
          {activeTab === 'my-leads' && <MyLeadsTab vendorId={vendor.id} />}
          {activeTab === 'products' && <ProductsTab vendorId={vendor.id} />}
        </div>
      ) : isVendorPending ? null : (
        <p className="py-8 text-center text-slate-500">Vendor data unavailable.</p>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 py-8">
          <Skeleton className="h-7 w-48" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-xl" />
            ))}
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
