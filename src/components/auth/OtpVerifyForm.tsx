'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import axios from '@/lib/axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const otpVerifySchema = z.object({
  verificationCode: z
    .string()
    .min(1, 'Please provide verification code')
    .length(6, 'Must be exactly 6 digits'),
});

type OtpVerifyFormType = z.infer<typeof otpVerifySchema>;

interface Props {
  email: string;
  password: string;
  role: 'vendor' | 'customer';
}

export default function OtpVerifyForm({ email, password, role }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<OtpVerifyFormType>({
    resolver: zodResolver(otpVerifySchema),
    defaultValues: {
      verificationCode: '',
    },
  });

  const userId = localStorage.getItem('userId');
  const { mutate, isPending } = useMutation({
    mutationFn: (data: OtpVerifyFormType) =>
      axios.post('/auth/email/verify/', {
        verificationCode: Number(data.verificationCode),
        userId: Number(userId),
      }),
  });

  const onSubmit: SubmitHandler<OtpVerifyFormType> = data => {
    setIsSubmitting(true);
    mutate(data, {
      onSuccess: async () => {
        try {
          const response = await signIn('credentials', {
            username: email,
            password,
            redirect: false,
          });
          if (!response || response.error === 'fetch failed')
            toast.error('No Server Response!');
          else if (typeof response.error === 'string') {
            const error = JSON.parse(response.error);
            toast.error(error.message);
          } else {
            if (role === 'vendor') router.push('/vendor/complete-profile');
            else window.location.replace('/');
          }
        } catch (err) {
          toast.error('Something went wrong');
        } finally {
          setIsSubmitting(false);
        }
      },
      onError: err => {
        if (isAxiosError(err))
          toast.error(
            err.response?.data?.message || 'Error while verifying OTP',
          );
        setIsSubmitting(false);
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-[424px]">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Verify Account</CardTitle>
            <CardDescription className="text-[15px] font-medium">
              Enter the OTP below for verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="verificationCode"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      containerClassName="justify-evenly"
                      autoFocus
                      disabled={isPending || isSubmitting}
                      {...field}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                      </InputOTPGroup>
                      <InputOTPGroup>
                        <InputOTPSlot index={1} />
                      </InputOTPGroup>
                      <InputOTPGroup>
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                      </InputOTPGroup>
                      <InputOTPGroup>
                        <InputOTPSlot index={4} />
                      </InputOTPGroup>
                      <InputOTPGroup>
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage className="text-center" />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex-col gap-3">
            <Button
              type="submit"
              className="w-full"
              isLoading={isPending || isSubmitting}
            >
              Continue
            </Button>
            <div className="flex justify-center gap-2 text-sm">
              <p className="text-muted">Didn&apos;t receive code?</p>
              <Button
                type="button"
                className="h-auto p-0 font-normal text-primary underline-offset-1"
                variant="link"
              >
                Resend Code
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
