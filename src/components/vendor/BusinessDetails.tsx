import { Combobox } from '@/components/ui/combobox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import StepButtons from '@/components/vendor/StepButtons';
import axios from '@/lib/axios';
import { BusinessCategory, State, Subscription } from '@/types';
import { API_BASE_URL } from '@/utils/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const businessDetailsSchema = z.object({
  name: z
    .string({ required_error: 'Please provide your business name' })
    .trim()
    .min(1, 'Please provide your business name'),
  taxId: z
    .string({ required_error: 'Please provide your tax id number' })
    .trim()
    .min(1, 'Please provide your tax id number'),
  businessCategoryId: z.number({ required_error: 'Please select category' }),
  registeredAt: z.number({ required_error: 'Please select state' }),
  subscriptionId: z.number({ required_error: 'Please select subscription' }),
});

type BusinessDetailsType = z.infer<typeof businessDetailsSchema>;

export default function BusinessDetails({
  addressId,
}: {
  addressId: number | null;
}) {
  const { data: session } = useSession();
  const router = useRouter();

  const {
    data: businessCategories,
    isPending: businessCategoriesIsPending,
    isError: businessCategoriesIsError,
  } = useQuery<{
    businessCategories: BusinessCategory[];
  }>({
    queryKey: ['businessCategories'],
    queryFn: () =>
      fetch(`${API_BASE_URL}/business-categories`).then(res => res.json()),
  });

  const {
    data: subscriptions,
    isPending: subscriptionsIsPending,
    isError: subscriptionsIsError,
  } = useQuery<{ subscriptions: Subscription[] }>({
    queryKey: ['subscriptions'],
    queryFn: () =>
      fetch(`${API_BASE_URL}/subscriptions`).then(res => res.json()),
  });

  const {
    data: states,
    isPending: statesIsPending,
    isError: statesIsError,
  } = useQuery<{ states: State[] }>({
    queryKey: ['states'],
    queryFn: () => fetch(`${API_BASE_URL}/states`).then(res => res.json()),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: BusinessDetailsType) =>
      axios.post(
        '/vendors',
        {
          ...data,
          userId: session?.user.userId,
          userAddressId: addressId,
          vendorStatus: 'trial',
          paymentStatus: 'unpaid',
        },
        {
          headers: { Authorization: `Bearer ${session?.user?.accessToken}` },
        },
      ),
  });

  const form = useForm<BusinessDetailsType>({
    resolver: zodResolver(businessDetailsSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit: SubmitHandler<BusinessDetailsType> = (
    data: BusinessDetailsType,
  ) => {
    mutate(data, {
      onSuccess: () => {
        router.push('/');
      },
      onError: err => {
        if (isAxiosError(err)) {
          toast.error(
            err.response?.data?.message || 'Error while adding business',
          );
        }
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-4 ml-4 grid grid-cols-3 gap-x-6 gap-y-4 rounded-md border border-grey p-6 pt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="Enter your company name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="businessCategoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Category</FormLabel>
                <FormControl>
                  <Combobox
                    data={businessCategories?.businessCategories}
                    value={field.value}
                    onChange={field.onChange}
                    isError={businessCategoriesIsError}
                    isPending={businessCategoriesIsPending}
                    placeholder="Select category"
                    searchEmptyText="No category found"
                    searchPlaceholder="Search category"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="registeredAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Registration State</FormLabel>
                <FormControl>
                  <Combobox
                    data={states?.states}
                    value={field.value}
                    onChange={field.onChange}
                    isError={statesIsError}
                    isPending={statesIsPending}
                    placeholder="Select state"
                    searchEmptyText="No state found"
                    searchPlaceholder="Search state"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="taxId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax Id No.</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="Enter your tax id number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subscriptionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subscription</FormLabel>
                <FormControl>
                  <Select
                    disabled={
                      isPending ||
                      subscriptionsIsPending ||
                      subscriptionsIsError
                    }
                    value={field.value?.toString()}
                    onValueChange={value => field.onChange(Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          subscriptionsIsPending
                            ? 'Loading...'
                            : subscriptionsIsError
                              ? 'Error fetching data!'
                              : 'Select subscription'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {subscriptions?.subscriptions.map(subscription => (
                        <SelectItem
                          key={subscription.id}
                          value={subscription.id.toString()}
                        >
                          {subscription.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <StepButtons isLoading={isPending} />
      </form>
    </Form>
  );
}
