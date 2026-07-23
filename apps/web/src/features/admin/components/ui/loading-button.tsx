import React from 'react';
import { Button } from '@/components/ui/button';
import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { type VariantProps } from 'class-variance-authority';
import { buttonVariants } from '@/components/ui/button';

interface LoadingButtonProps extends ButtonPrimitive.Props {
  loading?: boolean;
  variant?: VariantProps<typeof buttonVariants>['variant'];
  size?: VariantProps<typeof buttonVariants>['size'];
}

export function LoadingButton({
  children,
  loading = false,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <Button disabled={disabled || loading} {...props}>
      {loading && (
        <span className="mr-2 size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </Button>
  );
}
