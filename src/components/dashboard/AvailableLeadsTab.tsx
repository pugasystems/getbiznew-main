'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { API_BASE_URL } from '@/utils/constants';

interface Lead {
  id: number;
  productName: string;
  requiredUnits: number;
  estimatedValue?: number;
  location?: string;
  createdAt: string;
  businessCategoryId: number;
  vendorId?: number | null;
}

interface Props {
  businessCategoryId: number;
  vendorId: number;
}

export default function AvailableLeadsTab({ businessCategoryId, vendorId }: Props) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { data: leads, isPending, isError } = useQuery<Lead[]>({
    queryKey: ['leads-available', businessCategoryId],
    queryFn: () =>
      fetch(
        `${API_BASE_URL}/leads?businessCategoryId=${businessCategoryId}&skip=0&take=25`,
        {
          headers: { Authorization: `Bearer ${session?.user?.accessToken}` },
          cache: 'no-store',
        },
      ).then(res => res.json()),
    enabled: !!session?.user?.accessToken,
  });

  const { mutate: contactLead, isPending: isContacting } = useMutation({
    mutationFn: (leadId: number) =>
      fetch(`${API_BASE_URL}/vendors/${vendorId}/leads/${leadId}/contact`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${session?.user?.accessToken}` },
      }).then(res => {
        if (!res.ok) throw new Error('Failed to acquire lead');
        return res.json();
      }),
    onSuccess: () => {
      toast.success('Lead acquired successfully!');
      queryClient.invalidateQueries({ queryKey: ['vendor'] });
      queryClient.invalidateQueries({ queryKey: ['leads-available'] });
    },
    onError: () => {
      toast.error('Failed to acquire lead. Please try again.');
    },
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
      <p className="py-12 text-center text-slate-500">Failed to load available leads.</p>
    );
  }

  const available = Array.isArray(leads) ? leads.filter(l => !l.vendorId) : [];

  if (!available.length) {
    return (
      <p className="py-12 text-center text-slate-500">
        No available leads in your business category right now.
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
            <th className="px-4 py-3 font-semibold text-slate-600">Location</th>
            <th className="px-4 py-3 font-semibold text-slate-600">Date</th>
            <th className="px-4 py-3 font-semibold text-slate-600">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {available.map(lead => (
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
                {new Date(lead.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <Button
                  size="sm"
                  onClick={() => contactLead(lead.id)}
                  disabled={isContacting}
                  isLoading={isContacting}
                >
                  Contact Lead
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
