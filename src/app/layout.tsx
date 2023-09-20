import "./globals.css";
import type { Metadata } from "next";
import Navbar from "../components/ui/navbar/navbar";
import { Merriweather, Montserrat } from "next/font/google";
export const merriweather = Merriweather({
  weight: ["400", "700", "900"],
  style: "normal",
  subsets: ["latin"],
  display: "swap",
});
export const montserrat = Montserrat({
  style: "normal",
  subsets: ["latin"],
  display: "swap",
});
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
