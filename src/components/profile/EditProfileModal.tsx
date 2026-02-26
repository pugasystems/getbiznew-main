'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import axios from '@/lib/axios';
import { User } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil2Icon } from '@radix-ui/react-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const profileSchema = z.object({
  firstName: z.string().trim().min(1, 'Please tell us your first name').max(30),
  lastName: z.string().trim().min(1, 'Please tell us your last name').max(30),
  mobileNumber: z
    .number({ required_error: 'Please provide your mobile number' })
    .positive('Must be greater than 0')
    .int()
    .min(1000000000, 'Must be exactly 10 digits')
    .max(9999999999, 'Must be exactly 10 digits'),
  email: z
    .string()
    .min(1, 'Please provide your email')
    .email('Please enter a valid email'),
});

type ProfileType = z.infer<typeof profileSchema>;

export default function EditProfileModal({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ProfileType) =>
      axios.patch(`/users/${user.id}`, data, {
        headers: { Authorization: `Bearer ${session?.user?.accessToken}` },
      }),
  });

  const form = useForm<ProfileType>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      mobileNumber: Number(user.mobileNumber),
      email: user.email,
    },
  });

  const onSubmit: SubmitHandler<ProfileType> = data => {
    mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['profile'] });
        setOpen(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="gap-2 text-primary hover:text-primary"
        >
          <Pencil2Icon className="h-4 w-4" />
          <span>Edit Profile</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="Enter your first name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="Enter your last name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="Enter your email address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mobileNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="Enter your mobile number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-6 flex justify-end">
              <Button
                isLoading={isPending}
                disabled={!form.formState.isDirty}
                className="w-32"
              >
                Update Profile
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
