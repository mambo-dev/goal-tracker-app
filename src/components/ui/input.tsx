import * as React from "react";
import { cn } from "../utils/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, ...props }, ref) => {
    if (label) {
      return (
        <div className="flex flex-col gap-2 w-full ">
          <label className="font-medium text-sm text-slate-800">{label}</label>
          <input
            className={cn(
              "flex  h-10 w-full rounded-md border border-gray-300  bg-gray-50 py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:border-purple-400 hover:border-purple-500  ring-opacity-30 ring-purple-300 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-purple-300 dark:focus:ring-offset-purple-900",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
      );
    }
    return (
      <input
        className={cn(
          "flex  h-10 w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:border-purple-600 hover:border-purple-500  ring-opacity-30 ring-purple-300 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-purple-300 dark:focus:ring-offset-purple-900",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
