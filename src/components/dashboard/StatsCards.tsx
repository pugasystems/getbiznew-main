import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Props {
  leadsCount: number;
  leadsConsumed: number;
  productsCount: number;
  vendorStatus: string;
  paymentStatus: string;
}

export default function StatsCards({
  leadsCount,
  leadsConsumed,
  productsCount,
  vendorStatus,
  paymentStatus,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-500">Lead Credits Available</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-green-600">{leadsCount}</p>
          <p className="mt-1 text-xs text-slate-400">Credits you can spend</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-500">Leads Acquired</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600">{leadsConsumed}</p>
          <p className="mt-1 text-xs text-slate-400">Total leads contacted</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-500">Products Listed</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-purple-600">{productsCount}</p>
          <p className="mt-1 text-xs text-slate-400">Active product listings</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-500">Account Status</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Badge
            variant={vendorStatus === 'active' ? 'default' : 'secondary'}
            className="w-fit capitalize"
          >
            {vendorStatus}
          </Badge>
          <Badge
            variant={paymentStatus === 'paid' ? 'default' : 'destructive'}
            className="w-fit capitalize"
          >
            {paymentStatus}
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
