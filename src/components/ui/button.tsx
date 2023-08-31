import { VariantProps, cva } from "class-variance-authority";
import React, { HTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../utils/cn";

export const buttonVariants = cva(
  "rounded-md shadow-sm text-white text-sm  inline-flex items-center justify-center ",
  {
    variants: {
      variant: {
        default:
          "w-full inline-flex items-center justify-center bg-purple-500 hover:bg-purple-600 disabled:bg-purple-400 disabled:bg-opacity-80 focus:shadow-purple-300    ",
        ghost: "bg-transparent text-green-600 hover:underline ",
        link: "bg-green-500 text-white w-full  focus:bg-green-400 hover:bg-green-600 focus:outline-none  focus:border-green-600 hover:border-green-500  ",
        empty: "bg-transparent text-green-600 hover:underline ",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 py-2 px-4 rounded-md",
        lg: "h-11 py-2 px-4 rounded-md",
        xl: "h-11 py-2 px-8 rounded-md",
      },
      defaultVariants: {
        variant: "default",
        size: "default",
      },
    },
  }
);

interface Props
  extends HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, Props>(
  ({ isLoading, className, children, variant, size, ...props }: Props, ref) => {
    return (
      <button
        {...props}
        disabled={isLoading}
        className={cn(buttonVariants({ variant, size, className }))}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
