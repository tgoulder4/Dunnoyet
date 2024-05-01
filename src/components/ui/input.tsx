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
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, responseFromserver, ...props }, ref) => {
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
          "flex w-full rounded-md border-2 border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#000000] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    </>);
  }
);
Input.displayName = "Input";

export { Input };
