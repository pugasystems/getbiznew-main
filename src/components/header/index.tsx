import Image from 'next/image';
import logo from '@/assets/logo.svg';
import Link from 'next/link';
import {
  // CartSvg,
  MessageSvg,
  ShoppingSvg,
  StoreFrontSvg,
} from '@/assets/icons/Svgs';
import { UserRoundSvg } from '@/assets/icons/Svgs';
import SearchBox from '@/components/header/searchBox';
import ProfileDropdown from '@/components/header/profileDropdown';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth';

export default async function Header() {
  const session = await getServerSession(authOptions);

  const buttons = [
    {
      title: 'Seller Tools',
      link: '/seller',
      Icon: StoreFrontSvg,
    },
    {
      title: 'Messages',
      link: '/messages',
      Icon: MessageSvg,
    },
    {
      title: 'Shopping',
      link: '/categories',
      Icon: ShoppingSvg,
    },
    // {
    //   title: 'Cart',
    //   link: '/',
    //   Icon: CartSvg,
    // },
    {
      title: 'Sign In',
      link: '/login',
      Icon: UserRoundSvg,
    },
  ];

  if (session) buttons.pop();

  return (
    <header className="fixed left-0 right-0 top-0 z-30 h-14 bg-header">
      <div className="mx-auto flex h-full max-w-largest items-center justify-between px-14">
        <div className="flex items-center gap-6">
          <Link href="/">
            <Image src={logo} className="h-11 w-auto" alt="Logo" priority />
          </Link>
          <SearchBox />
        </div>
        <div className="flex items-center gap-6">
          {buttons.map(({ title, link, Icon }, i) => (
            <Link
              key={i}
              href={link}
              className="flex flex-col items-center gap-1 text-white transition-all duration-200 hover:border-b"
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{title}</span>
            </Link>
          ))}
          {session && (
            <ProfileDropdown>
              <div className="flex flex-col items-center gap-1 text-white">
                <UserRoundSvg className="h-5 w-5" />
                <span className="text-xs font-medium">Profile</span>
              </div>
            </ProfileDropdown>
          )}
        </div>
      </div>
    </header>
  );
}
