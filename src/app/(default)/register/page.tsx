'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

import authImage from '@/assets/auth.webp';
import {
  CallOutlineSvg,
  ConfirmPasswordSvg,
  EmailSvg,
  LockSvg,
  PersonMoneySvg,
  UserOutlineSvg,
} from '@/assets/icons/Svgs';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import axios from '@/lib/axios';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, 'Please tell us your first name')
      .max(30),
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
    password: z
      .string()
      .min(1, 'Please provide a password')
      .regex(new RegExp('.*[A-Z].*'), 'Must contain a uppercase character')
      .regex(new RegExp('.*[a-z].*'), 'Must contain a lowercase character')
      .regex(new RegExp('.*\\d.*'), 'Must contain a number')
      .regex(
        new RegExp('.*[`~<>?,./!@#$%^&*()\\-_+="\'|{}\\[\\];:\\\\].*'),
        'Must contain a special character',
      )
      .min(8, 'Password must be at least 8 characters'),
    cPassword: z.string().min(1, 'Please confirm your password'),
    roleName: z.enum(['customer', 'vendor'], {
      required_error: 'Please select your role',
    }),
    terms: z.literal(true, {
      errorMap: () => ({ message: 'Required' }),
    }),
  })
  .refine(({ password, cPassword }) => password === cPassword, {
    path: ['cPassword'],
    message: 'Password and Confirm password must match',
  });

type SignupFormType = z.infer<typeof registerSchema>;

export default function Signup() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<'register' | 'otp'>('register');

  const form = useForm<SignupFormType>({
    resolver: zodResolver(registerSchema),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
  } = form;

  const mutation = useMutation({
    mutationFn: ({ terms, cPassword, mobileNumber, ...data }: SignupFormType) =>
      axios.post('/auth/register/', {
        ...data,
        mobileNumber: mobileNumber.toString(),
      }),
  });

  const onSubmit: SubmitHandler<SignupFormType> = data => {
    mutation.mutate(data, {
      onSuccess: res => {
        localStorage.setItem('userId', res.data.id);
        setActiveView('otp');
      },
      onError: err => {
        if (isAxiosError(err))
          toast.error(err.response?.data?.message || 'Something went wrong!');
      },
    });
  };

  return (
    <div
      className={`flex items-center justify-around ${activeView === 'register' ? 'py-12' : 'py-24'}`}
    >
      <section
        className={`flex flex-col  ${activeView === 'register' ? 'relative justify-center gap-10 self-stretch' : ''}`}
      >
        <div
          className={`flex items-center gap-2 ${activeView === 'register' ? 'absolute left-0 top-0' : ''}`}
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <Button
            variant="link"
            className="px-0"
            onClick={() => router.push('/')}
          >
            Back to store
          </Button>
        </div>
        <div
          className={`flex items-center gap-6 ${activeView === 'register' ? '' : 'mb-10 mt-4'}`}
        >
          <span className="text-2xl font-semibold">Welcome to </span>
          <Image src={logo} alt="logo" className="h-14 w-auto" />
        </div>
        <Image src={authImage} alt="Auth Image" className="h-80 w-auto" />
      </section>
      {activeView === 'register' ? (
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="w-[424px]">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Create an account</CardTitle>
                <CardDescription className="text-[15px] font-medium">
                  Enter details below to create account
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <SignInButtons disabled={mutation.isPending} />
                <div className="relative z-10 text-center">
                  <hr className="absolute left-0 right-0 top-1/2 -z-10" />
                  <p className="inline-block bg-white px-4 text-sm uppercase text-muted">
                    Or Register With Phone
                  </p>
                </div>
                <div className="flex gap-4">
                  <InputField
                    placeholder="First Name"
                    type="text"
                    Icon={UserOutlineSvg}
                    errorMessage={errors.firstName?.message}
                    disabled={mutation.isPending}
                    {...register('firstName')}
                  />
                  <InputField
                    placeholder="Last Name"
                    type="text"
                    Icon={UserOutlineSvg}
                    errorMessage={errors.lastName?.message}
                    disabled={mutation.isPending}
                    {...register('lastName')}
                  />
                </div>
                <InputField
                  Icon={CallOutlineSvg}
                  type="number"
                  placeholder="Mobile Number"
                  disabled={mutation.isPending}
                  {...register('mobileNumber', {
                    setValueAs: value =>
                      value === '' ? undefined : Number(value),
                  })}
                  errorMessage={errors.mobileNumber?.message}
                />
                <InputField
                  Icon={EmailSvg}
                  placeholder="Email"
                  type="email"
                  errorMessage={errors.email?.message}
                  disabled={mutation.isPending}
                  {...register('email')}
                />
                <InputField
                  Icon={LockSvg}
                  placeholder="Password"
                  type="password"
                  value={watch('password') || ''}
                  errorMessage={errors.password?.message}
                  disabled={mutation.isPending}
                  {...register('password')}
                />
                <InputField
                  Icon={ConfirmPasswordSvg}
                  placeholder="Confirm Password"
                  type="password"
                  value={watch('cPassword') || ''}
                  errorMessage={errors.cPassword?.message}
                  disabled={mutation.isPending}
                  {...register('cPassword')}
                />
                <FormField
                  control={form.control}
                  name="roleName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          disabled={mutation.isPending}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <div className="flex items-center gap-4">
                              <PersonMoneySvg className="h-5 w-5 text-muted group-hover:text-normal group-data-[state=open]:text-primary" />
                              <SelectValue placeholder="Select Role" />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="customer">Buyer</SelectItem>
                            <SelectItem value="vendor">Seller</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-xs font-normal" />
                    </FormItem>
                  )}
                />
                <article className="flex justify-between">
                  <div className="flex items-center px-2">
                    <input
                      type="checkbox"
                      id="terms"
                      className="xs:h-3 xs:w-3 h-3.5 w-3.5 cursor-pointer accent-primary"
                      disabled={mutation.isPending}
                      {...register('terms')}
                    />
                    <label
                      htmlFor="terms"
                      className="xs:pl-1.5 xs:text-xs cursor-pointer pl-2 text-sm md:text-[13px]"
                    >
                      I accept {''}
                      <Link
                        href="#"
                        className="text-blue-700 hover:text-blue-800 hover:underline"
                      >
                        Terms and Conditions
                      </Link>
                    </label>
                  </div>
                  {errors.terms ? (
                    <p className="text-xs text-danger">
                      {errors.terms?.message}
                    </p>
                  ) : null}
                </article>
              </CardContent>
              <CardFooter className="flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full"
                  isLoading={mutation.isPending}
                >
                  Sign Up
                </Button>
                <div className="flex justify-center gap-2 text-sm">
                  <p className="text-muted">Already have an account?</p>
                  <Link className="text-primary hover:underline" href="/login">
                    Sign In
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </form>
        </Form>
      ) : (
        <OtpVerifyForm
          email={getValues('email')}
          password={getValues('password')}
          role={getValues('roleName')}
        />
      )}
    </div>
  );
}
