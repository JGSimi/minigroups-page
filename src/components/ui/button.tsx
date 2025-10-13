import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border-2 border-border/50 bg-transparent hover:border-gaming-blue hover:bg-gaming-blue/5 hover:text-gaming-blue transition-all duration-300",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "bg-transparent hover:bg-accent/80 hover:text-foreground transition-colors duration-200 rounded-lg",
        link: "text-primary underline-offset-4 hover:underline",
        gaming: "bg-gradient-to-r from-gaming-blue to-gaming-blue-light text-white font-semibold hover:from-gaming-blue-hover hover:to-gaming-blue shadow-gaming hover:shadow-xl hover:scale-105 rounded-full border-0",
        "gaming-outline": "border-2 border-gaming-blue text-gaming-blue bg-transparent hover:bg-gaming-blue hover:text-white shadow-lg hover:shadow-gaming transition-all duration-300 rounded-full",
        "gaming-neon": "bg-gradient-to-r from-neon-cyan to-neon-pink text-white font-bold hover:scale-105 shadow-lg hover:shadow-2xl rounded-full animate-pulse-glow",
        "gaming-purple": "bg-gradient-to-r from-gaming-purple to-gaming-pink text-white font-semibold hover:from-gaming-purple-hover hover:to-gaming-pink-hover shadow-lg hover:shadow-xl hover:scale-105 rounded-full",
        "nav-link": "text-foreground hover:text-gaming-blue transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gaming-blue after:transition-all after:duration-300 hover:after:w-full",
        "nav-icon": "text-muted-foreground hover:text-foreground active:text-gaming-blue transition-colors duration-200 bg-transparent border-0 rounded-none",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; id: number }>>([]);
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newRipple = { x, y, id: Date.now() };
      setRipples((prev) => [...prev, newRipple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);

      if (props.onClick) {
        props.onClick(e);
      }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      setMousePosition({ x: x * 0.1, y: y * 0.1 });
    };

    const handleMouseLeave = () => {
      setMousePosition({ x: 0, y: 0 });
    };

    if (asChild) {
      return <Slot className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
    }

    return (
      <motion.button
        ref={(node) => {
          buttonRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn(buttonVariants({ variant, size, className }), "relative overflow-hidden")}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ x: mousePosition.x, y: mousePosition.y }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="ripple"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 10,
              height: 10,
            }}
          />
        ))}
        {props.children}
      </motion.button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
