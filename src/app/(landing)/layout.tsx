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
      <head>
        <title>Dunnoyet - Seriously in-depth learning</title>
      </head>
      <body className={` bg-white flex flex-col`} style={{ fontFamily: ruda.style.fontFamily, fontSize: sizing.globalFontSize }}>
        <nav
          className={`shadow px-[100px] bg-white flex items-center justify-between p-3 sticky top-0 z-50`}>
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
            <NewButton noAnimation buttonVariant="ghost" actionOrLink="#">Pricing</NewButton>
            <NewButton noAnimation buttonVariant="ghost" actionOrLink="#">How it works</NewButton>
            <NewButton style={{ fontFamily: merriweather.style.fontFamily }} buttonVariant="black" actionOrLink="/learn">Learn</NewButton>
          </div>
        </nav>
        {children}
        <footer style={{ backgroundColor: colours.accent, }} className="h-48 px-16">
          <Button asChild variant="ghost">
            <DunnoyetLogo colour="white" />
          </Button>
        </footer>
      </body>
    </html>
  );
}
