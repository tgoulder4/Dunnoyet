import "./../globals.css";
import type { Metadata } from "next";
import { Button } from "../../components/Navbar/button";
import { merriweather, ruda } from "@/app/fonts";
import Link from "next/link";
import { DunnoyetLogo, colours, sizing, spacing, maxLandingWidth } from "../../lib/constants";
import NewButton from "@/components/ui/NewButton";
import { useState } from "react";


export const metadata: Metadata = {
  title: "dunnoyet - Serious in depth learning",
  description: "Serious in depth learning.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={` bg-white flex flex-col`} style={{ fontFamily: ruda.style.fontFamily, fontSize: sizing.globalFontSize }}>
      <nav style={{
        // paddingLeft: spacing.padding.normalY, paddingRight: spacing.padding.normalY
      }
      }
        className={`grid place-items-center shadow bg-white py-[28px] px-[56px] sticky top-0 z-50`}>
        <div className="flex items-center justify-between w-full" style={{}}>

          <div id="brandSide" className={`flex items-center gap-4 h-full`}>
            <NewButton noAnimation style={{ scale: 2 }} buttonVariant="ghost" actionOrLink="/"> {DunnoyetLogo({ colour: colours.primary })}</NewButton>
            <div className="flex">
              <div className="badge"></div>
            </div>
          </div>
          <div id="userSide" className="flex gap-2 h-full items-center">
            {/* after learning about authentication, put the login component here */}
            <NewButton noAnimation buttonVariant="ghost" actionOrLink="#">Pricing</NewButton>
            <NewButton noAnimation buttonVariant="ghost" actionOrLink="#">How it works</NewButton>
            <NewButton style={{ fontFamily: merriweather.style.fontFamily }} buttonVariant="black" actionOrLink="/learn">Learn</NewButton>
          </div>

        </div>
      </nav>
      {children}
      <footer style={{ backgroundColor: colours.accent, }} className="h-48 px-16">
        <Button asChild variant="ghost">
          <DunnoyetLogo colour="white" />
        </Button>
      </footer>
    </div>
  );
}
