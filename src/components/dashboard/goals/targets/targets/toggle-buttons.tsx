import React from "react";

type Props = {
  action: any;
  options: {
    a: {
      value: string;
      active: boolean;
    };
    b: {
      value: string;
      active: boolean;
    };
  };
};

export default function ToggleButtons({ action, options }: Props) {
  return (
    <div className="w-3/4 grid grid-cols-2 mx-auto border border-purple-500 rounded-md  divide-x divide-purple-500 ">
      <button
        type="button"
        className={`${
          options.a.active
            ? "bg-purple-500 text-white "
            : "text-purple-500 bg-transparent"
        } text-sm font-medium inline-flex items-center justify-center py-3 px-2 focus:outline-none`}
        onClick={action}
      >
        {options.a.value}
      </button>
      <button
        type="button"
        className={`${
          options.b.active
            ? "bg-purple-500 text-white "
            : "text-purple-500 bg-transparent"
        } text-sm font-medium inline-flex items-center justify-center py-3 px-2 focus:outline-none`}
        onClick={action}
      >
        {options.b.value}
      </button>
    </div>
  );
}
