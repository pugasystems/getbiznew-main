'use client';

import InputField from '@/components/shared/inputField';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import axios from '@/lib/axios';
import { Product } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, type ReactNode } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  requiredUnits: z
    .number({ required_error: 'Please provide quantity' })
    .positive('Must be greater than 0')
    .int(),
  description: z.string().trim().min(1, 'Please provide requirement details'),
});

type FormType = z.infer<typeof formSchema>;

interface Props {
  children: ReactNode;
  product: Product;
  asChild?: boolean;
}

export default function GetPriceFormDialog({
  children,
  product,
  asChild = true,
}: Props) {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormType>({
    resolver: zodResolver(formSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormType) =>
      axios.post(
        '/leads/',
        {
          ...data,
          userId: session?.user?.userId,
          productId: product.id,
        },
        { headers: { Authorization: `Bearer ${session?.user?.accessToken}` } },
      ),
  });

  const onSubmit: SubmitHandler<FormType> = data => {
    mutate(data, {
      onSuccess: () => {
        setOpen(false);
        toast.success('Form submitted successfully');
        reset();
      },
      onError: err => {
        if (isAxiosError(err))
          toast.error(
            err.response?.data?.message?.[0] || 'Error submitting form',
          );
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={open => {
        setOpen(open);
        if (!open) reset();
      }}
    >
      <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl">
        <div className="flex">
          <section className="w-80 space-y-6 border-r-2 border-grey pr-4">
            <Image
              src={product.images[0].imageUrl}
              alt="Product Image"
              width={320}
              height={240}
              className="h-60 w-full rounded border border-grey bg-grey object-contain"
            />
            <div className="space-y-2">
              <p>{product.name}</p>
              <p>$ {product.price}</p>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-muted">Sold By - </span>
                  {product.vendor.name}
                </p>
                <p>{product.vendor.userAddress.addressLineOne}</p>
                <p>
                  {product.vendor.userAddress.city.name},{' '}
                  {product.vendor.userAddress.state.name}
                </p>
              </div>
            </div>
          </section>
          <section
            className={`flex-grow ${session ? 'space-y-5 pl-4 pr-24' : 'flex flex-col items-center justify-center space-y-8 px-20'}`}
          >
            <DialogHeader>
              <DialogTitle
                className={`tracking-normal ${session ? 'leading-tight' : 'text-center leading-normal'}`}
              >
                {session
                  ? 'Please provide few details to get quick response from the supplier'
                  : 'Please login to contact seller and get details on your email quickly'}
              </DialogTitle>
            </DialogHeader>
            {session ? (
              <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
                <div className="max-w-40">
                  <InputField
                    label="Required Quantity"
                    placeholder="1000"
                    type="number"
                    errorMessage={errors.requiredUnits?.message}
                    {...register('requiredUnits', {
                      setValueAs: value =>
                        value === '' ? undefined : Number(value),
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <label>Requirement Details</label>
                  <Textarea
                    placeholder="Briefly describe what you are looking to buy..."
                    className="max-h-32"
                    {...register('description')}
                  />
                  {errors.description?.message && (
                    <p className="text-xs text-danger">
                      {errors.description?.message}
                    </p>
                  )}
                </div>
                <div className="max-w-80 pb-3">
                  <InputField
                    label="Company / Business Name"
                    placeholder="Eg: Gorkha Brewery Pvt. Ltd."
                  />
                </div>
                <Button className="w-40" isLoading={isPending}>
                  Submit
                </Button>
              </form>
            ) : (
              <Button className="w-40" asChild>
                <Link href="/login">Go to Login</Link>
              </Button>
            )}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
