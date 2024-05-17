import * as React from "react";

import { cn } from "@/lib/utils";
import { ruda } from "@/app/fonts";
import { colours, sizing } from "@/lib/constants";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  responseFromserver?: null | {
    type: 'error' | 'success',
    message: string
  };
  children?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, children, type, responseFromserver, ...props }, ref) => {
    const [showMessage, setShowMessage] = React.useState(false);
    return (<>
      {
        showMessage && responseFromserver && <div className="p-[20px]" style={{ color: 'white', backgroundColor: responseFromserver?.type === 'error' ? colours.error : responseFromserver?.type === 'success' ? colours.success : colours.inputBorder }}>{responseFromserver?.message}</div>
      }
      <input
        onMouseLeave={() => setShowMessage(false)}
        style={{ fontFamily: ruda.style.fontFamily, fontSize: sizing.globalFontSize, borderColor: showMessage ? responseFromserver?.type === 'error' ? colours.error : responseFromserver?.type === 'success' ? colours.success : colours.inputBorder : colours.inputBorder }}
        type={type}
        className={cn(
          "transition-all flex w-full rounded-md border border-input bg-background pl-[18px] pr-[10px] py-[15px] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#000000] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
      {children}
    </>);
  }
);
Input.displayName = "Input";

export { Input };
