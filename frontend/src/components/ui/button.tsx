import clsx from "clsx";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
};

export function Button({ className, variant = "primary", size = "md", ...props }: Props) {
  return (
    <button
      {...props}
      className={clsx(
        "inline-flex items-center justify-center rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-sm",
        variant === "primary" && "bg-primary text-primary-foreground hover:opacity-90",
        variant === "secondary" && "border border-border bg-background hover:bg-muted",
        variant === "ghost" && "hover:bg-muted",
        className
      )}
    />
  );
}
