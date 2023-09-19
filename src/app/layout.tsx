import "./globals.css";
import type { Metadata } from "next";
import Navbar from "../components/navbar";
import { Merriweather, Montserrat } from "next/font/google";
export const merriweather = Merriweather({
  weight: "700",
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
  const helperName = "testName";
  const userName = "userName";
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
              text: userName,
            },
          ]}
          alignment="between"
        />
        {children}
      </body>
    </html>
  );
}
