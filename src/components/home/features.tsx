import {
  CartCheckSvg,
  MoneyBagSvg,
  MoneySvg,
  TruckFastSvg,
} from '@/assets/icons/Svgs';

const features = [
  {
    title: 'Fast Shipping',
    description:
      'Swift delivery is our priority. Expect your orders to arrive promptly with our expedited shipping.',
    Icon: TruckFastSvg,
  },
  {
    title: 'Easy Payments',
    description:
      'All payments are processed instantly over a secure payment protocol.',
    Icon: MoneySvg,
  },
  {
    title: 'Money-Back Guarantee',
    description:
      "If an item arrived damaged or you've changed your mind, you can send it back for a full refund.",
    Icon: MoneyBagSvg,
  },
  {
    title: 'Finest Quality',
    description:
      'Designed to last, each of our products has been crafted with the finest materials.',
    Icon: CartCheckSvg,
  },
];

export default function Features() {
  return (
    <article className="mt-28">
      <h2 className="text-center text-2xl font-semibold">
        Why should you choose us?
      </h2>
      <div className="mt-16 grid grid-cols-[repeat(auto-fit,_minmax(232px,_1fr))] gap-14">
        {features.map(({ Icon, title, description }, i) => (
          <article key={i} className="rounded-md border-grey">
            <div className="bg-grey flex h-16 w-16 items-center justify-center rounded-lg">
              <Icon className="h-7 w-7 text-slate-700" />
            </div>
            <h3 className="mt-6 text-xl font-medium">{title}</h3>
            <p className="mt-3 text-[13px] text-slate-700">{description}</p>
          </article>
        ))}
      </div>
    </article>
  );
}
