'use client';

import authImage from '@/assets/auth.webp';
import { CallOutlineSvg, LockSvg } from '@/assets/icons/Svgs';
import logo from '@/assets/logo.svg';
import OtpVerifyForm from '@/components/auth/OtpVerifyForm';
import SignInButtons from '@/components/auth/SignInButtons';
import InputField from '@/components/shared/inputField';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';

interface FormType {
  username: string;
  password: string;
}

export default function Login() {
  const [activeView, setActiveView] = useState<'login' | 'otp'>('login');
  const { register, handleSubmit, watch, getValues } = useForm<FormType>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('callbackUrl') ?? '/';

  const onSubmit: SubmitHandler<FormType> = async data => {
    setIsSubmitting(true);
    try {
      const response = await signIn('credentials', {
        ...data,
        redirect: false, // To deal with the errors on the same page and disable the default redirection
      });
      if (!response || response.error === 'fetch failed')
        toast.error('No Server Response!');
      else if (typeof response.error === 'string') {
        const error = JSON.parse(response.error);
        toast.error(error.message);
        if (error.statusCode === 403) setActiveView('otp');
      } else {
        window.location.replace(from);
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-around py-24">
      <section className="flex flex-col">
        <div className="flex items-center gap-2">
          <ArrowLeftIcon className="h-5 w-5" />
          <Button
            variant="link"
            className="px-0"
            onClick={() => router.push('/')}
          >
            Back to store
          </Button>
        </div>
        <div className="mb-10 mt-4 flex items-center gap-6">
          <span className="text-2xl font-semibold">Welcome to </span>
          <Image src={logo} alt="logo" className="h-14 w-auto" />
        </div>
        <Image src={authImage} alt="Auth Image" className="h-80 w-auto" />
      </section>
      {activeView === 'login' ? (
        <form onSubmit={handleSubmit(onSubmit)} className="w-[424px]">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Sign In</CardTitle>
              <CardDescription className="text-[15px] font-medium">
                Sign in to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <SignInButtons disabled={isSubmitting} />
              <div className="relative z-10 text-center">
                <hr className="absolute left-0 right-0 top-1/2 -z-10" />
                <p className="inline-block bg-white px-4 text-sm uppercase text-muted">
                  Or Login With Phone
                </p>
              </div>
              <InputField
                Icon={CallOutlineSvg}
                placeholder="Phone / Email"
                required
                disabled={isSubmitting}
                {...register('username')}
              />
              <InputField
                Icon={LockSvg}
                type="password"
                placeholder="Password"
                required
                value={watch('password') || ''}
                disabled={isSubmitting}
                {...register('password')}
              />
              <div className="flex items-center justify-between px-0.5">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember-me"
                    className="h-3.5 w-3.5 cursor-pointer accent-primary"
                    disabled={isSubmitting}
                    defaultChecked={true}
                    /* checked={persist}
                onChange={() => {
                  setPersist(prev => !prev);
                }} */
                  />
                  <label
                    htmlFor="remember-me"
                    className="cursor-pointer pl-2 text-sm"
                  >
                    Stay signed in
                  </label>
                </div>
                <Link
                  href="#"
                  className="cursor-pointer text-sm underline underline-offset-2 hover:text-primary hover:decoration-primary"
                >
                  Forgot password?
                </Link>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-3">
              <Button type="submit" className="w-full" isLoading={isSubmitting}>
                Sign In
              </Button>
              <div className="flex justify-center gap-2 text-sm">
                <p className="text-muted">Don&#39;t have an account yet?</p>
                <Link className="text-primary hover:underline" href="/register">
                  Sign Up
                </Link>
              </div>
            </CardFooter>
          </Card>
        </form>
      ) : (
        <OtpVerifyForm
          email={getValues('username')}
          password={getValues('password')}
          role="customer"
        />
      )}
    </div>
  );
}
