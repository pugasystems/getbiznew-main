import Image from 'next/image';
import logo from '@/assets/logo.svg';
import Link from 'next/link';
import { CategorySvg, MessageSvg, StoreFrontSvg, UserRoundSvg } from '@/assets/icons/Svgs';
import SearchBox from '@/components/header/searchBox';
import ProfileDropdown from '@/components/header/profileDropdown';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth';

const trendingKeywords = ['Steel', 'Electronics', 'Machinery', 'Packaging', 'Apparel', 'Food & Bev'];

export default async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="fixed left-0 right-0 top-0 z-30 bg-header">
      {/* Row 1: Logo | SearchBox | Actions */}
      <div className="mx-auto flex max-w-largest items-center gap-4 px-14 py-3">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image src={logo} className="h-10 w-auto" alt="Logo" priority />
        </Link>

        {/* SearchBox — takes remaining space */}
        <div className="flex-1">
          <SearchBox />
        </div>

        {/* Right actions */}
        <div className="flex shrink-0 items-center gap-4">
          <Link
            href="/seller"
            className="flex items-center gap-1.5 text-white transition-opacity hover:opacity-80"
          >
            <StoreFrontSvg className="h-4 w-4" />
            <span className="text-sm font-medium">Become a Seller</span>
          </Link>
          {session?.user?.vendors?.length > 0 && (
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-white transition-opacity hover:opacity-80"
            >
              <CategorySvg className="h-4 w-4" />
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
          )}
          <Link
            href="/messages"
            className="flex items-center gap-1.5 text-white transition-opacity hover:opacity-80"
          >
            <MessageSvg className="h-4 w-4" />
            <span className="text-sm font-medium">Messages</span>
          </Link>

          {session ? (
            <ProfileDropdown>
              <div className="flex items-center gap-1.5 text-white">
                <UserRoundSvg className="h-4 w-4" />
                <span className="text-sm font-medium">Profile</span>
              </div>
            </ProfileDropdown>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-white transition-opacity hover:opacity-80"
              >
                <UserRoundSvg className="h-4 w-4" />
                <span className="text-sm font-medium">Sign In</span>
              </Link>
              <Link
                href="/register"
                className="rounded-md border border-white/30 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                Register
              </Link>
            </>
          )}

          <Link
            href="/register"
            className="rounded-md bg-[#f97316] px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-[#ea6c00]"
          >
            Post Buy Requirement
          </Link>
        </div>
      </div>

      {/* Row 2: Browse Categories + trending chips */}
      <div className="border-t border-white/10 bg-[#1a2332]">
        <div className="mx-auto flex max-w-largest items-center gap-4 px-14 py-2">
          <Link
            href="/categories"
            className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-white transition-opacity hover:opacity-80"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Browse Categories ▾
          </Link>
          <div className="h-4 w-px bg-white/20" />
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="shrink-0 text-xs text-white/50">Trending:</span>
            {trendingKeywords.map((kw) => (
              <Link
                key={kw}
                href={`/search?query=${encodeURIComponent(kw)}`}
                className="shrink-0 rounded-full border border-white/20 px-3 py-0.5 text-xs text-white/80 transition-colors hover:border-[#f97316] hover:text-[#f97316]"
              >
                {kw}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
