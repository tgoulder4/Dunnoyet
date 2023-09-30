import "./../globals.css";
import type { Metadata } from "next";
import Navbar from "../../components/ui/navbar/navbar";

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
              content: {
                logoPath: "/logo_light.png",
                alt: "dunnoyet",
                variant: "ghost",
                url: "/",
              },
              rightDivider: true,
            },
            {
              content: {
                url: "/",
                text: {
                  text: helperName,
                  color: "primary-header",
                },
                alt: "Helper",
                variant: "link",
              },
            },
          ]}
          middle={[]}
          userSide={[
            {
              content: {
                logoPath: "./pfp.png",
                alt: "Profile Picture",
                variant: "ghost",
                url: "/",
              },
            },
          ]}
          alignment="between"
        />
        {children}
      </body>
    </html>
  );
}
