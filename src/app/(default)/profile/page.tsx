import { DetailSection } from '@/app/(default)/vendors/[slug]/[vendorId]/page';
import {
  CalendarSvg,
  CallOutlineSvg,
  EmailSvg,
  UserCircleSvg,
} from '@/assets/icons/Svgs';
import EditProfileModal from '@/components/profile/EditProfileModal';
import authOptions from '@/lib/auth';
import dayjs from '@/lib/dayjs';
import { User } from '@/types';
import { API_BASE_URL } from '@/utils/constants';
import { QueryClient } from '@tanstack/react-query';
import { getServerSession } from 'next-auth';

export default async function Profile() {
  const session = await getServerSession(authOptions);
  const queryClient = new QueryClient();

  const user = await queryClient.fetchQuery<User>({
    queryKey: ['profile'],
    queryFn: () =>
      fetch(`${API_BASE_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${session?.user?.accessToken}` },
      }).then(res => res.json()),
  });

  return (
    <div className="mb-24">
      <section className="mt-6 flex items-center rounded-md border border-grey px-8 py-4 shadow-sm">
        <div className="flex basis-1/2 items-center gap-3">
          <UserCircleSvg className="h-20 w-20 text-muted" />
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">
              {user?.firstName} {user?.lastName}
            </h2>
            <div className="flex items-center gap-1">
              <CallOutlineSvg className="h-4 w-4 text-muted" />
              <p className="text-sm font-medium">
                {user?.mobileNumber || '---'}
              </p>
            </div>
          </div>
        </div>
        <DetailSection
          label="Member Since"
          value={dayjs(user.createdAt).fromNow(true)}
          Icon={CalendarSvg}
          className="basis-1/4"
        />
        <DetailSection
          label="Email Address"
          value={user?.email || '---'}
          Icon={EmailSvg}
          className="basis-1/4"
        />
      </section>
      <section className="mt-8 rounded-md border border-grey shadow-sm">
        <div className="flex items-center justify-between border-b border-grey px-8 py-4">
          <h2 className="font-semibold">Profile Information</h2>
          <EditProfileModal user={user} />
        </div>
        <article className="grid grid-cols-2 gap-y-8 p-8 pt-6">
          <DetailSection
            label="Date Joined"
            value={new Date(user?.createdAt).toLocaleDateString('en-US', {
              dateStyle: 'medium',
            })}
            Icon={CalendarSvg}
          />
          <DetailSection
            label="Status"
            value={user?.isActive ? 'Active' : 'Inactive'}
            Icon={CalendarSvg}
          />
          <DetailSection
            label="Verified"
            value={user?.hasVerified ? 'Yes' : 'No'}
            Icon={CalendarSvg}
          />
          <DetailSection
            label="Verified Date"
            value={new Date(user?.verifiedAt).toLocaleDateString('en-US', {
              dateStyle: 'medium',
            })}
            Icon={CalendarSvg}
          />
        </article>
      </section>
    </div>
  );
}
