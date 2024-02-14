'use server'
import { IDetail, ITip } from "@/lib/types";
import { PrismaClient } from "@prisma/client";
import { ReactNode, createContext, useState } from "react";


const prisma = new PrismaClient();
async function getGeneralDetails() {
    const tips: ITip[] | null = await prisma.uIDetail.findFirst({
        select: {
            tips: {
                select: {
                    id: true,
                    title: true,
                    content: true,
                    link: true,
                    uiDetailId: true,
                }
            }
        }
    }).then(result => result?.tips || null)
    return tips;
}
export const UIDetailsContext = createContext({
    tips: [{}],
})

export const UIDetailsProvider = ({ children }: { children: ReactNode }) => {
    const [details, setDetails] = useState<IDetail>({
        id: "",
        tips: [{
            title: "",
            content: "",
            link: "",
        }]
    });
    const getDetailsProm = getGeneralDetails();
    Promise.all([getDetailsProm]).then(
        values => {
            const val = values[0];
            if (!val) throw new Error("Couldn't retrieve the UI details.")
            setDetails({ tips: val })
        }
    )
    return (
        <UIDetailsContext.Provider value={details}>
            {children}
        </UIDetailsContext.Provider>
    )
}