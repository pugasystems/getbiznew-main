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
import { useStepper } from '@/components/ui/stepper';
import StepButtons from '@/components/vendor/StepButtons';
import axios from '@/lib/axios';
import { City, Country, District, State } from '@/types';
import { API_BASE_URL } from '@/utils/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const addressDetailsSchema = z.object({
  countryId: z.number({ required_error: 'Please select country' }),
  stateId: z.number({ required_error: 'Please select state' }),
  // districtId: z.number({ required_error: 'Please select district' }),
  cityId: z.number({ required_error: 'Please select city' }),
  addressLineOne: z
    .string({ required_error: 'Please enter address line one' })
    .trim()
    .min(1, 'Please enter address line one'),
  addressLineTwo: z.string().optional(),
  zipCode: z
    .string({ required_error: 'Please enter zip code' })
    .trim()
    .min(1, 'Please enter zip code'),
});

type AddressDetailsType = z.infer<typeof addressDetailsSchema>;

export default function AddressDetails({
  setAddressId,
}: {
  setAddressId: (addressId: number | null) => void;
}) {
  const { nextStep } = useStepper();
  const { data: session } = useSession();

  const form = useForm<AddressDetailsType>({
    resolver: zodResolver(addressDetailsSchema),
    defaultValues: {
      addressLineOne: '',
      addressLineTwo: '',
      zipCode: '',
    },
  });

  const countryId = form.watch('countryId');
  const stateId = form.watch('stateId');

  const {
    data: countries,
    isLoading: countriesIsLoading,
    isError: countriesIsError,
  } = useQuery<{ countries: Country[] }>({
    queryKey: ['countries'],
    queryFn: () => fetch(`${API_BASE_URL}/countries`).then(res => res.json()),
  });

  const {
    data: states,
    isLoading: statesIsLoading,
    isError: statesIsError,
  } = useQuery<{ states: State[] }>({
    queryKey: ['states', countryId],
    queryFn: () =>
      fetch(`${API_BASE_URL}/states?countryId=${countryId}`).then(res =>
        res.json(),
      ),
    enabled: !!countryId,
  });

  /* const {
    data: districts,
    isLoading: districtsIsLoading,
    isError: districtsIsError,
  } = useQuery<{ districts: District[] }>({
    queryKey: ['districts'],
    queryFn: () => fetch(`${API_BASE_URL}/districts`).then(res => res.json()),
  }); */

  const {
    data: cities,
    isLoading: citiesIsLoading,
    isError: citiesIsError,
  } = useQuery<{ cities: City[] }>({
    queryKey: ['cities', stateId],
    queryFn: () =>
      fetch(`${API_BASE_URL}/cities?stateId=${stateId}`).then(res =>
        res.json(),
      ),
    enabled: !!stateId,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: AddressDetailsType) =>
      axios.post(
        '/shipping-addresses',
        { ...data, userId: session?.user.userId },
        {
          headers: { Authorization: `Bearer ${session?.user?.accessToken}` },
        },
      ),
  });

  const onSubmit: SubmitHandler<AddressDetailsType> = (
    data: AddressDetailsType,
  ) => {
    mutate(data, {
      onSuccess: res => {
        toast.success('Address added successfully');
        setAddressId(res.data.id);
        nextStep();
      },
      onError: err => {
        if (isAxiosError(err)) {
          toast.error(
            err.response?.data?.message || 'Error while adding address',
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
            name="countryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Combobox
                    data={countries?.countries}
                    value={field.value}
                    onChange={field.onChange}
                    isError={countriesIsError}
                    isPending={countriesIsLoading}
                    placeholder="Select country"
                    searchEmptyText="No country found"
                    searchPlaceholder="Search country"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stateId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Combobox
                    data={states?.states}
                    value={field.value}
                    onChange={field.onChange}
                    isError={statesIsError}
                    isPending={statesIsLoading}
                    placeholder="Select state"
                    searchEmptyText="No state found"
                    searchPlaceholder="Search state"
                    disabled={isPending || !countryId}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name="districtId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>District</FormLabel>
                <FormControl>
                  <Combobox
                    data={districts?.districts}
                    value={field.value}
                    onChange={field.onChange}
                    isError={districtsIsError}
                    isPending={districtsIsLoading}
                    placeholder="Select district"
                    searchEmptyText="No district found"
                    searchPlaceholder="Search district"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <FormField
            control={form.control}
            name="cityId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Combobox
                    data={cities?.cities}
                    value={field.value}
                    onChange={field.onChange}
                    isError={citiesIsError}
                    isPending={citiesIsLoading}
                    placeholder="Select city"
                    searchEmptyText="No city found"
                    searchPlaceholder="Search city"
                    disabled={isPending || !stateId}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="addressLineOne"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address 1</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="Enter address line one"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="addressLineTwo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address 2</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="Enter address line two"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zip Code</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="Enter zip code"
                    {...field}
                  />
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
