import "./../globals.css";
import type { Metadata } from "next";
import { Button } from "../../components/ui/button";
import { merriweather, ruda } from "../fonts";
import Link from "next/link";

export const metadata: Metadata = {
  title: "dunnoyet.",
  description: "Serious in depth learning.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={` bg-white flex flex-col`}>
        <header
          className={`drop-shadow-md bg-white h-14 flex items-center justify-between p-3 px-16 sticky top-0 z-50`}
        >
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
          <div id="middle" className="flex items-center gap-4 h-full">
            <Button
              asChild
              variant="link"
              className="text-complementary font-bold"
            >
              <Link href="/" className={`${ruda.className}`}>
                Pricing
              </Link>
            </Button>
            <div className="w-[2px] h-full bg-[rgba(0,0,0,0.1)]"></div>
            <Button
              asChild
              variant="link"
              className="text-complementary font-bold"
            >
              <Link href="/">How It Works</Link>
            </Button>
            <div className="w-[2px] h-full bg-[rgba(0,0,0,0.1)]"></div>
            <Button
              asChild
              variant="link"
              className="text-complementary font-bold"
            >
              <Link href="/">Success Stories</Link>
            </Button>
          </div>
          <div id="userSide" className="flex gap-2 h-full items-center">
            {/* after learning about authentication, put the login component here */}
            <Button
              asChild
              variant="primary"
              className={`${merriweather.className} font-bold text-white`}
            >
              <Link href="/learn">Try a Question Free</Link>
            </Button>
            <Button
              asChild
              variant="link"
              className={`${merriweather.className} font-bold text-complementary`}
            >
              <Link href="/learn">Login</Link>
            </Button>
          </div>
        </header>

        {children}
        <footer className="bg-complementary h-48 px-16">
          <Button icon="logo_light.png" variant="ghost" />
        </footer>
      </body>
    </html>
  );
}
