import { CityOutlineSvg } from '@/assets/icons/Svgs';

const cities = [
  {
    name: 'Austin',
    image: null,
  },
  {
    name: 'San Francisco',
    image: null,
  },
  {
    name: 'New York',
    image: null,
  },
  {
    name: 'Seattle',
    image: null,
  },
  {
    name: 'Chicago',
    image: null,
  },
  {
    name: 'Denver',
    image: null,
  },
  {
    name: 'Portland',
    image: null,
  },
  {
    name: 'Los Angeles',
    image: null,
  },
  {
    name: 'Washington, D.C.',
    image: null,
  },
  {
    name: 'New Orleans',
    image: null,
  },
];

export default function SupplierCities() {
  return (
    <article className="mb-32 mt-28 rounded-3xl border border-grey pb-16 pt-8 shadow-sm">
      <h2 className="text-center text-2xl font-semibold">
        Find suppliers from top cities
      </h2>
      <div className="mt-16 grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-14">
        {cities.map(({ name }, i) => (
          <div key={i} className="flex flex-col items-center gap-3">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-grey border border-grey">
              <CityOutlineSvg className="h-9 w-9 text-slate-600" />
            </div>
            <p className="text-sm font-medium">{name}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
