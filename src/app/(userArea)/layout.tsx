import "../globals.css";
import CustomSessionProvider from "@/components/auth/context/CustomSessionProvider";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (<>
    <title>Dunnoyet</title>
    <CustomSessionProvider>
      {children}
    </CustomSessionProvider>
  </>
  );
}
