'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { Skeleton } from '@/components/ui/skeleton';
import { API_BASE_URL } from '@/utils/constants';

interface Lead {
  id: number;
  productName: string;
  requiredUnits: number;
  estimatedValue?: number;
  location?: string;
  createdAt: string;
  updatedAt: string;
  businessCategoryId: number;
  vendorId: number;
}

interface Props {
  vendorId: number;
}

export default function MyLeadsTab({ vendorId }: Props) {
  const { data: session } = useSession();

  const { data: leads, isPending, isError } = useQuery<Lead[]>({
    queryKey: ['leads-my', vendorId],
    queryFn: () =>
      fetch(
        `${API_BASE_URL}/leads?vendorId=${vendorId}&skip=0&take=25`,
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
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="py-12 text-center text-slate-500">Failed to load your leads.</p>
    );
  }

  const myLeads = Array.isArray(leads) ? leads : [];

  if (!myLeads.length) {
    return (
      <p className="py-12 text-center text-slate-500">
        You haven&apos;t acquired any leads yet. Go to Available Leads to get started.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left">
          <tr>
            <th className="px-4 py-3 font-semibold text-slate-600">Lead #</th>
            <th className="px-4 py-3 font-semibold text-slate-600">Product</th>
            <th className="px-4 py-3 font-semibold text-slate-600">Req. Units</th>
            <th className="px-4 py-3 font-semibold text-slate-600">Est. Value</th>
            <th className="px-4 py-3 font-semibold text-slate-600">Buyer Location</th>
            <th className="px-4 py-3 font-semibold text-slate-600">Date Acquired</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {myLeads.map(lead => (
            <tr key={lead.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 text-slate-400">#{lead.id}</td>
              <td className="px-4 py-3 font-medium">{lead.productName ?? '—'}</td>
              <td className="px-4 py-3">{lead.requiredUnits ?? '—'}</td>
              <td className="px-4 py-3">
                {lead.estimatedValue != null
                  ? `$${lead.estimatedValue.toLocaleString()}`
                  : '—'}
              </td>
              <td className="px-4 py-3">{lead.location ?? '—'}</td>
              <td className="px-4 py-3 text-slate-400">
                {new Date(lead.updatedAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
