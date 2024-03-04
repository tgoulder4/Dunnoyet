import "../globals.css";
import type { Metadata } from "next";
import { merriweather, ruda } from "../fonts";
import { DunnoyetLogo, changeColour, colours, sizing } from "@/lib/constants";
import DisplacingButton from "@/components/ui/displacingButton";
import { spacing } from "../../lib/constants";
import UserAuthButton from "@/components/Navbar/UserAuthButton";
import NewButton from "@/components/ui/NewButton";
import AuthProvider from "@/components/auth/context/CustomSessionProvider";
import { SessionProvider } from "next-auth/react";
import CustomSessionProvider from "@/components/auth/context/CustomSessionProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CustomSessionProvider>
      {children}
    </CustomSessionProvider>
  );
}
