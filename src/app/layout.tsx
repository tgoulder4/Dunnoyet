import "./globals.css";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "GreenGlasses",
  description: "Serious in depth learning.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const helperName = "testName";
  const userName = "userName";
  return (
    <html lang="en">
      <body className="bg-[var(--background)] flex flex-col">
        <header className="bg-[hsl(var(--primary))] h-14 flex items-center justify-between p-3 px-16">
          <div
            id="logoAndHelperName"
            className="flex items-center gap-4 h-full"
          >
            <Button
              variant="ghost"
              className="h-full  hover:bg-[rgb(0_0_0_/_25%)]"
            >
              <img
                src="./logo_light.png "
                className="h-full object-scale-down"
                alt=""
              />
            </Button>
            <div className="w-[2px] h-full bg-[rgb(0_0_0_/_25%)]"></div>
            <Button
              variant="ghost"
              className="primary text-xl font-black  text-white"
            >
              {helperName}
            </Button>
          </div>
          <div id="userSide" className="flex gap-2 items-center">
            {/* clerk avatar goes here  */}
            <Button
              variant="ghost"
              className="block h-min hover:bg-[rgb(0_0_0_/_25%)]"
            >
              <img
                src="./history_light.png"
                className="h-[30px] w-[30px]"
                alt=""
              />
            </Button>
            <Button
              variant="ghost"
              className=" bg-[rgba(0,0,0,0.09)] text-xl flex gap-2 h-full text-white"
            >
              <img
                src="./profilePicture.png"
                className="h-[30px] w-[30px]"
                alt=""
              />
              {userName}
            </Button>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
