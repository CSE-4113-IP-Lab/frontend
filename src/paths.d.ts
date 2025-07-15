// This file helps TypeScript understand path aliases in your project
declare module '@/components/ui/alert' {
  import { FC, HTMLAttributes } from 'react';
  
  interface AlertProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'destructive' | 'success' | 'info' | 'warning';
  }

  interface AlertTitleProps extends HTMLAttributes<HTMLHeadingElement> {}
  interface AlertDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}
  interface AlertIconProps {
    variant?: 'default' | 'destructive' | 'success' | 'info' | 'warning';
  }

  export const Alert: FC<AlertProps>;
  export const AlertTitle: FC<AlertTitleProps>;
  export const AlertDescription: FC<AlertDescriptionProps>;
  export const AlertIcon: FC<AlertIconProps>;
}
