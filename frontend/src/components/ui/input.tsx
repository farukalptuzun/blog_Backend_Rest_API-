import clsx from "clsx";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={clsx(
        "w-full rounded-xl border border-border bg-transparent px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring",
        className
      )}
    />
  );
}
