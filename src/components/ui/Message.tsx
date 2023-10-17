"use client";
import { merriweather } from "@/app/fonts";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useRef, memo } from "react";
import { Loader2 } from "lucide-react";
function Message({
  content = "",
  _closed = true,
  className,
  children,
  key,
  ...props
}: {
  content?: string;
  className?: string;
  _closed?: boolean;
  key: number;
  children?: React.ReactNode;
}) {
  return (
    <>
      <div key={key}>{children}</div>
    </>
  );
}

export default Message;
