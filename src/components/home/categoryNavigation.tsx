import { Category, type BusinessCategory } from '@/types';
import { API_BASE_URL } from '@/utils/constants';
import { QueryClient } from '@tanstack/react-query';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Button } from '@/components/ui/button';
import { CategorySvg } from '@/assets/icons/Svgs';
import Link from 'next/link';
import { getSlug } from '@/lib/utils';
import Image from 'next/image';

export default async function CategoryNavigation() {
  const queryClient = new QueryClient();

  const data = await queryClient.fetchQuery<{
    categories: Category[];
  }>({
    queryKey: ['categories'],
    queryFn: () => fetch(`${API_BASE_URL}/categories`).then(res => res.json()),
  });

  return (
    <section className="mt-4 flex items-center justify-between border-b-2 border-slate-300 pb-2">
      <div>
        {data.categories
          .filter(category => category.parentCategoryId === null)
          .map((category, i) => (
            <HoverCard key={i} openDelay={100} closeDelay={100}>
              <HoverCardTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-auto gap-2 whitespace-normal text-left font-semibold"
                >
                  {category.imageUrl ? (
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      className="h-8 w-8"
                      width={32}
                      height={32}
                    />
                  ) : (
                    <CategorySvg className="h-8 w-8" />
                  )}
                  <span>{category.name}</span>
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-auto max-w-7xl">
                <ul className="grid grid-cols-4 gap-x-20 gap-y-3 px-6 py-2">
                  {data.categories
                    .filter(
                      subCategory =>
                        subCategory.parentCategoryId === category.id,
                    )
                    .map(subCategory => (
                      <li key={subCategory.id}>
                        <Link
                          href={`/categories/${getSlug(subCategory.name)}/${subCategory.id}`}
                          className="text-sm font-medium text-slate-700 hover:underline"
                        >
                          {subCategory.name}
                        </Link>
                      </li>
                    ))}
                </ul>
              </HoverCardContent>
            </HoverCard>
          ))}
      </div>
      <Button variant="ghost" className="font-semibold" asChild>
        <Link href="/categories">View All Categories</Link>
      </Button>
    </section>
  );
}
