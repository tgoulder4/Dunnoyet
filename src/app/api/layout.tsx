import "../globals.css";
import { DunnoyetLogo, colours, sizing, spacing } from '@/lib/constants'
import React from 'react'
import NewButton from '@/components/ui/NewButton'
import { ruda } from '@/app/fonts'
import MainAreaNavbar from "@/components/Navbar/MainAreaNavbar";

function layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-[100vh]">
            <div className="flex flex-col h-full" style={{ fontFamily: ruda.style.fontFamily, fontSize: sizing.globalFontSize }}>
                <MainAreaNavbar style="authOrAdmin" />
                <div className="flex items-center justify-center h-full w-full">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default layout