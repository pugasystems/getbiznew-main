'use client';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuArrow,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { LogOutSvg, UserOutlineSvg } from '@/assets/icons/Svgs';
import Link from 'next/link';

export default function ProfileDropdown({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        <DropdownMenuItem onClick={() => setOpen(false)}>
          <Link href="/profile" className="flex flex-grow items-center gap-2">
            <UserOutlineSvg className="h-4 w-4" />
            <span>View Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            localStorage.clear();
            signOut({ callbackUrl: '/login' });
          }}
          className="gap-2"
        >
          <LogOutSvg className="h-4 w-4" />
          <span>Log Out</span>
        </DropdownMenuItem>
        <DropdownMenuArrow className="fill-white" />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
