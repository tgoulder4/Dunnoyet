import "../globals.css";
import type { Metadata } from "next";
import { merriweather, ruda } from "../fonts";
import { DunnoyetLogo, changeColour, colours, sizing } from "@/lib/constants";
import DisplacingButton from "@/components/ui/displacingButton";
import { spacing } from "../../lib/constants";
import UserAuthButton from "@/components/Navbar/UserAuthButton";
import NewButton from "@/components/ui/NewButton";
import AuthProvider from "@/components/auth/context/CustomSessionProvider";
import { SessionProvider } from "next-auth/react";
import CustomSessionProvider from "@/components/auth/context/CustomSessionProvider";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CustomSessionProvider>
      <div className={` flex flex-col`} style={{ fontFamily: ruda.style.fontFamily, fontSize: sizing.globalFontSize }}>
        <nav style={{ backgroundColor: colours.primary, paddingLeft: spacing.gaps.separateElement, paddingRight: spacing.gaps.separateElement }} className="flex flex-row justify-between items-center h-[70px] sticky top-0 z-50">
          <div className="leftSide flex items-center h-full" style={{ columnGap: spacing.gaps.groupedElement }}>
            <NewButton buttonVariant="ghost" actionOrLink="/"> {DunnoyetLogo({ colour: 'white', withText: false })}</NewButton>
            <div className="flex-1 w-[1px] h-full" style={{ backgroundColor: changeColour(colours.primary).darken(8).toString() }}></div>
            <div className="flex" style={{ paddingLeft: spacing.padding.normalX, columnGap: spacing.gaps.separateElement }}>

              <NewButton className="transition-none hover:scale-100" textColour="white" style={{ padding: 0 }} buttonVariant="ghost" actionOrLink="/learn">Home</NewButton>
              <NewButton className="transition-none hover:scale-100" textColour="white" style={{ padding: 0 }} buttonVariant="ghost" actionOrLink="/mind">Mind</NewButton>
            </div>
          </div>
          <div className="rightSide py-[14px] flex h-full" style={{ columnGap: spacing.gaps.separateElement }}>
            <NewButton style={{ padding: 0 }} buttonVariant="ghost" actionOrLink=""><svg width="26" height="27" viewBox="0 0 26 27" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.1944 20.7222V20.9722H14.4444H24.5556C24.9019 20.9722 25.1803 21.0866 25.4079 21.3143C25.6356 21.5419 25.75 21.8204 25.75 22.1667C25.75 22.513 25.6356 22.7914 25.4079 23.0191C25.1803 23.2467 24.9019 23.3611 24.5556 23.3611H14.4444H14.1944V23.6111V25.0556C14.1944 25.4019 14.08 25.6803 13.8524 25.9079C13.6247 26.1356 13.3463 26.25 13 26.25C12.6537 26.25 12.3753 26.1356 12.1476 25.9079C11.92 25.6803 11.8056 25.4019 11.8056 25.0556V19.2778C11.8056 18.9315 11.92 18.653 12.1476 18.4254C12.3753 18.1977 12.6537 18.0833 13 18.0833C13.3463 18.0833 13.6247 18.1977 13.8524 18.4254C14.08 18.653 14.1944 18.9315 14.1944 19.2778V20.7222ZM6.02778 14.9444V14.6944H5.77778H1.44444C1.09814 14.6944 0.819708 14.58 0.592054 14.3524C0.364401 14.1247 0.25 13.8463 0.25 13.5C0.25 13.1537 0.364401 12.8753 0.592054 12.6476C0.819708 12.42 1.09814 12.3056 1.44444 12.3056H5.77778H6.02778V12.0556V10.6111C6.02778 10.2648 6.14218 9.98638 6.36983 9.75872C6.59749 9.53107 6.87592 9.41667 7.22222 9.41667C7.56852 9.41667 7.84696 9.53107 8.07461 9.75872C8.30227 9.98638 8.41667 10.2648 8.41667 10.6111V16.3889C8.41667 16.7352 8.30227 17.0136 8.07461 17.2413C7.84696 17.4689 7.56852 17.5833 7.22222 17.5833C6.87592 17.5833 6.59749 17.4689 6.36983 17.2413C6.14218 17.0136 6.02778 16.7352 6.02778 16.3889V14.9444ZM19.9722 3.38889V3.63889H20.2222H24.5556C24.9019 3.63889 25.1803 3.75329 25.4079 3.98094C25.6356 4.2086 25.75 4.48703 25.75 4.83333C25.75 5.17963 25.6356 5.45807 25.4079 5.68572C25.1803 5.91338 24.9019 6.02778 24.5556 6.02778H20.2222H19.9722V6.27778V7.72222C19.9722 8.06852 19.8578 8.34696 19.6302 8.57461C19.4025 8.80227 19.1241 8.91667 18.7778 8.91667C18.4315 8.91667 18.153 8.80227 17.9254 8.57461C17.6977 8.34696 17.5833 8.06852 17.5833 7.72222V1.94444C17.5833 1.59814 17.6977 1.31971 17.9254 1.09205C18.153 0.864401 18.4315 0.75 18.7778 0.75C19.1241 0.75 19.4025 0.864401 19.6302 1.09205C19.8578 1.31971 19.9722 1.59814 19.9722 1.94444V3.38889ZM1.44444 23.3611C1.09814 23.3611 0.819708 23.2467 0.592054 23.0191C0.364401 22.7914 0.25 22.513 0.25 22.1667C0.25 21.8204 0.364401 21.5419 0.592054 21.3143C0.819708 21.0866 1.09814 20.9722 1.44444 20.9722H7.22222C7.56852 20.9722 7.84696 21.0866 8.07461 21.3143C8.30227 21.5419 8.41667 21.8204 8.41667 22.1667C8.41667 22.513 8.30227 22.7914 8.07461 23.0191C7.84696 23.2467 7.56852 23.3611 7.22222 23.3611H1.44444ZM13 14.6944C12.6537 14.6944 12.3753 14.58 12.1476 14.3524C11.92 14.1247 11.8056 13.8463 11.8056 13.5C11.8056 13.1537 11.92 12.8753 12.1476 12.6476C12.3753 12.42 12.6537 12.3056 13 12.3056H24.5556C24.9019 12.3056 25.1803 12.42 25.4079 12.6476C25.6356 12.8753 25.75 13.1537 25.75 13.5C25.75 13.8463 25.6356 14.1247 25.4079 14.3524C25.1803 14.58 24.9019 14.6944 24.5556 14.6944H13ZM1.44444 6.02778C1.09814 6.02778 0.819708 5.91338 0.592054 5.68572C0.364401 5.45807 0.25 5.17963 0.25 4.83333C0.25 4.48703 0.364401 4.2086 0.592054 3.98094C0.819708 3.75329 1.09814 3.63889 1.44444 3.63889H13C13.3463 3.63889 13.6247 3.75329 13.8524 3.98094C14.08 4.2086 14.1944 4.48703 14.1944 4.83333C14.1944 5.17963 14.08 5.45807 13.8524 5.68572C13.6247 5.91338 13.3463 6.02778 13 6.02778H1.44444Z" fill="white" stroke="#FFF" strokeWidth="0.5" />
            </svg>
            </NewButton>
            <NewButton className="flex flex-row items-center" style={{ display: "flex", flexDirection: "row", rowGap: 16 }} buttonVariant="white" actionOrLink="/learn/new"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.94407 6.92174L6.83669 3.86087V0H9.16331V3.86087L9.02013 6.92174L11.6689 6.74783H16V9.00869H11.6689L9.02013 8.90435L9.16331 11.8957V16H6.83669V11.8957L6.94407 8.90435L3.86577 9.00869H0V6.74783H3.86577L6.94407 6.92174Z" fill="#323232" />
            </svg> <h2>New Question</h2>
            </NewButton>
            <UserAuthButton />
          </div>
        </nav>
        {children}
      </div>
    </CustomSessionProvider>
  );
}
