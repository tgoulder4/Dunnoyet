import "./globals.css";
import type { Metadata } from "next";
import Navbar from "../components/ui/navbar/navbar";

export const metadata: Metadata = {
  title: "GreenGlasses",
  description: "Serious in depth learning.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const helperName = "Helper";
  return (
    <html lang="en">
      <body className={` bg-background flex flex-col`}>
        <Navbar
          brandSide={[
            {
              url: "/",
              logoPath: "/logo_light.png",
              divider: true,
            },
            {
              url: "/",
              text: helperName,
            },
          ]}
          middle={[]}
          userSide={[
            {
              url: "/",
              logoPath: "./pfp.png",
            },
          ]}
          alignment="between"
        />
        {children}
      </body>
    </html>
  );
}
