import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GlowingBadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "error" | "info" | "default" | "secondary";
  className?: string;
}

export const GlowingBadge = ({
  children,
  variant = "default",
  className,
}: GlowingBadgeProps) => {
  const variants = {
    success: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 shadow-green-500/20",
    warning: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20 shadow-yellow-500/20",
    error: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20 shadow-red-500/20",
    info: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 shadow-blue-500/20",
    default: "bg-primary/10 text-primary border-primary/20 shadow-primary/20",
    secondary: "bg-secondary/50 text-secondary-foreground border-secondary/20 shadow-secondary/20",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all",
        "shadow-sm hover:shadow-lg",
        variants[variant],
        className
      )}
    >
      <span className="relative flex h-2 w-2 mr-1.5">
        <span
          className={cn(
            "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
            variant === "success" && "bg-green-400",
            variant === "warning" && "bg-yellow-400",
            variant === "error" && "bg-red-400",
            variant === "info" && "bg-blue-400",
            variant === "default" && "bg-primary",
            variant === "secondary" && "bg-gray-400"
          )}
        ></span>
        <span
          className={cn(
            "relative inline-flex rounded-full h-2 w-2",
            variant === "success" && "bg-green-500",
            variant === "warning" && "bg-yellow-500",
            variant === "error" && "bg-red-500",
            variant === "info" && "bg-blue-500",
            variant === "default" && "bg-primary",
            variant === "secondary" && "bg-gray-500"
          )}
        ></span>
      </span>
      {children}
    </motion.div>
  );
};
