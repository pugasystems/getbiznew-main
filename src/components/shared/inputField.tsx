'use client';

import * as React from 'react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { EyeClosedSvg, EyeOpenSvg } from '@/assets/icons/Svgs';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errorMessage?: string;
  showRequired?: boolean;
  Icon?: ({ className }: Props) => JSX.Element;
}

const InputField = React.forwardRef<HTMLInputElement, Props>(
  (
    {
      className,
      label,
      errorMessage,
      showRequired,
      Icon,
      type = 'text',
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={props.name}
            className={cn(
              'space-x-1 text-sm font-medium leading-none peer-hover:text-normal peer-focus-visible:text-primary peer-disabled:opacity-70',
              className,
            )}
          >
            <span>{label}</span>
            {showRequired ? <span className="text-danger">*</span> : null}
          </label>
        )}
        <div className="relative flex items-center">
          <Input
            ref={ref}
            className={`peer h-10 focus:border-primary ${Icon ? 'pl-11' : ''} ${type === 'password' ? 'pr-11' : ''}`}
            type={
              type === 'password' ? (showPassword ? 'text' : 'password') : type
            }
            {...props}
          />
          {Icon && (
            <Icon className="absolute left-3 h-5 w-5 text-muted peer-hover:text-normal peer-focus:text-primary" />
          )}
          {type === 'password' && props.value ? (
            <div
              className="absolute right-3 h-6 w-6 cursor-pointer text-muted hover:text-primary peer-hover:text-normal peer-focus:text-primary"
              onClick={() => setShowPassword(prev => !prev)}
              title={showPassword ? 'Hide Password' : 'Show Password'}
            >
              {showPassword ? <EyeClosedSvg /> : <EyeOpenSvg />}
            </div>
          ) : null}
        </div>
        {errorMessage && (
          <span className="text-xs text-danger">{errorMessage}</span>
        )}
      </div>
    );
  },
);

InputField.displayName = 'InputField';

export default InputField;
