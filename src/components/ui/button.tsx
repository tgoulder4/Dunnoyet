"use client";
import React, { useState } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-none hover:bg-input hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        orange: "bg-accentOrange text-complementary hover:bg-accentOrange/80",
        teal: "bg-accentTeal text-complementary hover:bg-accentTeal/80",
        purple: "bg-accentPurple text-complementary hover:bg-accentPurple/80",
        blue: "bg-accentBlue text-complementary hover:bg-accentBlue/80",
        grey: "bg-accentGrey text-complementary hover:bg-accentGrey/80",
      },
      size: {
        default: "h-10 px-7 py-2",
        tighter: "h-10 py-3 px-3",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  icon?: string;
  alt?: string;
  tooltip?: string | React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      tooltip = "false",
      icon,
      alt,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const [loading, setLoading] = useState(false);
    function commonContent() {
      return (
        <Comp
          className={cn(
            buttonVariants({ variant, size: "tighter", className })
          )}
          ref={ref}
          {...props}
          onClick={() => setLoading(true)}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" color="#000000" />
            </>
          ) : icon ? (
            <img src={icon} alt={alt} />
          ) : (
            props.children
          )}
        </Comp>
      );
    }
    const Comp = asChild ? Slot : "button";
    return (
      <>
        {tooltip == "false" ? (
          commonContent()
        ) : (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>{commonContent()}</TooltipTrigger>
                <TooltipContent>
                  {typeof tooltip === "string" ? <p>{tooltip}</p> : tooltip}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}
      </>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
