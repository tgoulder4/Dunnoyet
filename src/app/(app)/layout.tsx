import "../globals.css";
import type { Metadata } from "next";
import Navbar from "../../components/Navbar/navbar";
import { Plus } from "lucide-react";
import { Toaster } from "sonner";
export const metadata: Metadata = {
  title: "Learn - dunnoyet",
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
      <body className={` flex flex-col`}>
        <Navbar
          brandSide={[
            {
              content: {
                logoPath: "/logo_light.png",
                alt: "dunnoyet",
                variant: "link",
                url: "/",
              },
              rightDivider: true,
            },
            {
              content: {
                url: "/home",
                text: {
                  text: helperName,
                  color: "primary-header",
                },
                alt: "Helper",
                variant: "link",
                tooltip: "My Helper",
              },
            },
          ]}
          middle={[]}
          userSide={[
            {
              content: {
                alt: "New Question",
                variant: "default",
                url: "/learn/new",
                padding: "p-2",
                jsx: <Plus className="h-full" color="#FFFFFF" />,
                tooltip: "New Question",
              },
            },
          ]}
          alignment="between"
        />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
