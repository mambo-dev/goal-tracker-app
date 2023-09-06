type Props = {
  heading: string;
  description: string;
};

export default function FormHeader({ heading, description }: Props) {
  return (
    <div className="w-fit mr-auto flex flex-col space-y-1.5 text-center sm:text-left ">
      <h4 className="text-lg font-semibold leading-none tracking-tight">
        {heading}
      </h4>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}
