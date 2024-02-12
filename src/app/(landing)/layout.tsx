import "./../globals.css";
import type { Metadata } from "next";
import { Button } from "../../components/Navbar/button";
import { merriweather, ruda } from "@/app/fonts";
import Link from "next/link";
import { DunnoyetLogo, colours, sizing, spacing } from "../../lib/constants";
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
    <html lang="en">
      <body className={` bg-white flex flex-col`} style={{ fontFamily: ruda.style.fontFamily, fontSize: sizing.globalFontSize }}>
        <nav style={{ paddingRight: spacing.padding.normalY, paddingLeft: spacing.padding.normalY }}
          className={` bg-white h-14 flex items-center justify-between p-3 sticky top-0 z-50`}>
          <div id="brandSide" className={`flex items-center gap-4 h-full`}>
            <Link href="/" className="flex items-center gap-2">
              <Button
                variant="link"
                icon="/glasses_green.png"
                className="p-0"
                tooltip="false"
              />
              <h2
                className={`select-none ${merriweather.className} text-complementary`}
              >
                dunnoyet.
              </h2>
            </Link>
            <div className="flex">
              <div className="badge"></div>
            </div>
          </div>
          <div id="userSide" className="flex gap-2 h-full items-center">
            {/* after learning about authentication, put the login component here */}
            <Button
              asChild
              variant="link"
              className="text-complementary font-bold"
            >
              <Link className={`${ruda.className} text-sm font-bold`} style={{ font: ruda.className }} href="/learn/new">Pricing</Link>
            </Button>
            <Button
              asChild
              variant="link"
              className="text-complementary font-bold"
            >
              <Link className={`${ruda.className} text-sm font-bold`} href="/learn/new">How it works</Link>
            </Button>
            <Button
              asChild
              variant="link"
              className={`${merriweather.className} font-bold text-complementary`}
            >
              <Button asChild style={{ backgroundColor: colours.dark.backgroundDark }}>
                <Link style={{ color: colours.dark.text, font: merriweather.className }} href="/learn">Learn</Link>
              </Button>
            </Button>
          </div>
        </nav>
        {children}
        <footer className="bg-complementary h-48 px-16">
          <Button asChild variant="ghost">
            <DunnoyetLogo colour="white" />
          </Button>
        </footer>
      </body>
    </html>
  );
}
