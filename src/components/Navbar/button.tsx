import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "text-background border-2 border-input bg-accent-secondary hover:bg-input hover:text-white",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground text-background",
        link: "text-background underline-offset-4 hover:underline",
        grey: "bg-accentGrey text-complementary hover:bg-accentGrey/80",
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
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  icon?: string;
  alt?: string;
  tooltip?: string | React.ReactNode;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      icon,
      size,
      loading,
      alt,
      tooltip = "false",
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    function commonContent() {
      return (
        <Comp
          className={cn(buttonVariants({ variant, className }))}
          ref={ref}
          {...props}
        >
          {loading ? (
            <Loader2 className="animate-spin" color="#000000" />
          ) : icon ? (
            <img src={icon} alt={alt} />
          ) : (
            props.children
          )}
        </Comp>
      );
    }
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
    // return (
    //   <Comp
    //     className={cn(buttonVariants({ variant, size, className }))}
    //     ref={ref}
    //     {...props}
    //   >
    //     {icon ? (
    //       <img src={icon} className="w-full h-full" alt="" />
    //     ) : (
    //       props.children
    //     )}
    //   </Comp>
    // );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
