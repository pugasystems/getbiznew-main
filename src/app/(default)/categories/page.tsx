import { CategorySvg } from '@/assets/icons/Svgs';
import { getSlug } from '@/lib/utils';
import { Category } from '@/types';
import { API_BASE_URL } from '@/utils/constants';
import { QueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';

export default async function CategoryResults() {
  const queryClient = new QueryClient();

  const data = await queryClient.fetchQuery<{
    categories: Category[];
  }>({
    queryKey: ['categories'],
    queryFn: () => fetch(`${API_BASE_URL}/categories`).then(res => res.json()),
  });

  return (
    <div className="mb-20 mt-8 grid grid-cols-[repeat(auto-fill,_minmax(324px,_1fr))] gap-5">
      {data.categories
        .filter(category => category.parentCategoryId === null)
        .map(category => (
          <Link
            href={`/categories/${getSlug(category.name)}/${category.id}`}
            className="flex cursor-pointer gap-4 rounded-md border border-grey p-4 text-sm font-medium shadow-sm hover:border-primary/50 hover:shadow"
            key={category.id}
          >
            {category.imageUrl ? (
              <Image
                src={category.imageUrl}
                alt={category.name}
                className="h-16 w-16 rounded-full border border-grey"
                width={64}
                height={64}
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-grey bg-grey">
                <CategorySvg className="h-7 w-7" />
              </div>
            )}
            <div>
              <h3>{category.name}</h3>
              <ul className="mt-1.5 space-y-1">
                {data.categories
                  .filter(
                    subCategory => subCategory.parentCategoryId === category.id,
                  )
                  .map(subCategory => (
                    <li key={subCategory.id}>
                      <Link
                        href={`/categories/${getSlug(subCategory.name)}/${subCategory.id}`}
                        className="text-sm font-medium text-muted transition-colors hover:text-normal hover:underline"
                      >
                        {subCategory.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </Link>
        ))}
    </div>
  );
}
