'use client';

import * as React from 'react';

import { useState } from 'react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'>
>(({ ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const checkHandler = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <Input
        type={showPassword ? 'text' : 'password'}
        {...props}
        ref={ref}
        className={cn('mb-2')}
      />
      <div className='flex items-center space-x-2'>
        <Checkbox
          id='showPasswordCheck'
          className='border-border'
          checked={showPassword}
          onCheckedChange={checkHandler}
        />
        <label
          htmlFor='showPasswordCheck'
          className='text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
        >
          Show password
        </label>
      </div>
    </div>
  );
});
PasswordInput.displayName = 'Input';

export { PasswordInput };
