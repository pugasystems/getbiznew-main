import Image from 'next/image';
import logo from '@/assets/logo.svg';
import Link from 'next/link';
import {
  FacebookLogoSvg,
  InstagramLogoSvg,
  LinkedInLogoSvg,
  XLogoSvg,
  YoutubeLogoSvg,
} from '@/assets/icons/Svgs';

const footerContent = [
  {
    heading: 'Shopping Online',
    links: [
      { href: '/register', title: 'Order Status' },
      { href: '/register', title: 'Shipping and Delivery' },
      { href: '/register', title: 'Returns' },
      { href: '/register', title: 'Payment Options' },
    ],
  },
  {
    heading: 'Information',
    links: [
      { href: '/register', title: 'Newsletter' },
      { href: '/register', title: 'Become a member' },
      { href: '/register', title: 'Site Feedback' },
    ],
  },
  {
    heading: 'Contact Us',
    links: [
      { href: 'mailto:getbizusa@gmail.com', title: 'getbizusa@gmail.com' },
      { href: 'tel:+12515219347', title: '+1 (251) 521-9347' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-grey">
      <div className="mx-auto flex max-w-largest justify-between px-14 py-10">
        <section>
          <Image src={logo} alt="logo" className="h-14 w-auto" />
          <div className="mt-6 flex gap-4">
            <Link
              href="/register"
              className="transition-colors hover:fill-primary"
            >
              <FacebookLogoSvg className="h-5 w-5" />
            </Link>
            <Link
              href="/register"
              className="transition-colors hover:fill-primary"
            >
              <XLogoSvg className="h-5 w-5" />
            </Link>
            <Link
              href="/register"
              className="transition-colors hover:fill-primary"
            >
              <LinkedInLogoSvg className="h-5 w-5" />
            </Link>
            <Link
              href="/register"
              className="transition-colors hover:fill-primary"
            >
              <InstagramLogoSvg className="h-5 w-5" />
            </Link>
            <Link
              href="/register"
              className="transition-colors hover:fill-primary"
            >
              <YoutubeLogoSvg className="h-5 w-5" />
            </Link>
          </div>
        </section>
        {footerContent.map((content, i) => (
          <section key={i}>
            <h3 className="font-medium">{content.heading}</h3>
            <ul className="mt-4 space-y-2">
              {content.links.map(({ href, title }, i) => (
                <li key={i} className="text-sm">
                  <Link
                    href={href}
                    className="transition-colors hover:text-primary"
                  >
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <p className="border-t border-grey py-5 text-center">
        © 2024 GetBizzUSA. All rights reserved.
      </p>
    </footer>
  );
}
