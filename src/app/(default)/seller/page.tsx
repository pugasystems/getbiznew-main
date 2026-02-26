import {
  AddLocationSvg,
  NoDollarSvg,
  RegisterSvg,
  ServicesSvg,
  TruckFastSvg,
} from '@/assets/icons/Svgs';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import growthSvg from '@/assets/icons/growth.svg';
import Image from 'next/image';

const box1 = [
  {
    Icon: growthSvg,
    title: '20 million+',
    description: 'Buyers',
  },
  {
    Icon: TruckFastSvg,
    title: '8 million+',
    description: 'Suppliers',
  },
  {
    Icon: ServicesSvg,
    title: '12 million+',
    description: 'Products & Services',
  },
];

const box2 = [
  {
    Icon: growthSvg,
    title: 'Grow your Business',
    description: 'Sell to buyers anytime, anywhere',
  },
  {
    Icon: NoDollarSvg,
    title: 'Zero Cost',
    description: 'No commission or transaction fee',
  },
  {
    Icon: ServicesSvg,
    title: 'Manage your Business Better',
    description: 'Lead Management System & other features',
  },
];

const box3 = [
  {
    Icon: RegisterSvg,
    title: 'Create Account',
    description: 'Add your name and phone number to get started',
  },
  {
    Icon: AddLocationSvg,
    title: 'Add Business',
    description: 'Add name, address & e-mail of your company, store/ business.',
  },
  {
    Icon: ServicesSvg,
    title: 'Add Products/ Services',
    description:
      'Minimum 3 products/ services needed for your free listing page.',
  },
];

export default function SellerTools() {
  return (
    <div className="mb-24 pt-6">
      <div className="flex justify-between gap-56">
        <section className="flex-grow">
          <h3 className="text-xl font-medium">
            <span className="font-semibold">Sell for free </span> on USA&apos;s
            largest online B2B marketplace
          </h3>
          <ul className="mt-4 flex justify-between px-6">
            {box1.map(({ Icon, title, description }, i) => (
              <li key={i} className="flex flex-col items-center">
                {i === 0 ? (
                  <Image
                    src={Icon}
                    alt="growth"
                    width={56}
                    height={56}
                    className="h-14 w-14"
                  />
                ) : (
                  <Icon className="h-14 w-14 text-primary" />
                )}
                <h4 className="mt-3 text-lg font-semibold">{title}</h4>
                <p>{description}</p>
              </li>
            ))}
          </ul>
        </section>
        <section className="flex flex-col items-center gap-4 rounded-lg bg-grey p-6">
          <h3 className="text-[22px] font-bold">Free Registration / Sign In</h3>
          <Button asChild className="h-12">
            <Link href="/login" className="relative w-full">
              <span>Start Selling</span>
              <ArrowRightIcon className="absolute right-4 h-5 w-5" />
            </Link>
          </Button>
        </section>
      </div>
      <div className="mt-14 flex gap-6">
        <section className="shrink-0">
          <h3 className="text-xl font-semibold">Sell on GetBizzUSA</h3>
          <ul className="mt-4 space-y-4 rounded-lg bg-grey p-6 pt-4">
            {box2.map(({ Icon, title, description }, i) => (
              <li key={i} className="flex items-center gap-4">
                {i === 0 ? (
                  <Image
                    src={Icon}
                    alt="growth"
                    width={44}
                    height={44}
                    className="h-11 w-11"
                  />
                ) : (
                  <Icon className="h-11 w-11 text-primary" />
                )}
                <div>
                  <h4 className="text-lg font-semibold">{title}</h4>
                  <p className="mt-1 text-[15px]">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
        <section className="flex flex-col self-stretch">
          <h3 className="text-xl font-semibold">
            Get a free listing in 3 simple steps:
          </h3>
          <ul className="mt-4 flex flex-grow items-center justify-between gap-2 rounded-lg bg-grey p-6 pt-4">
            {box3.map(({ Icon, title, description }, i) => (
              <li key={i} className="flex flex-col items-center">
                <Icon className="h-11 w-11 text-primary" />
                <h4 className="mt-4 text-lg font-semibold">{title}</h4>
                <p className="mt-1 text-center text-[15px]">{description}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
