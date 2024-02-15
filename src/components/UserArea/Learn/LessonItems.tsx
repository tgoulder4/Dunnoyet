import React, { useContext, useEffect, useState } from 'react'
import NextAuth from 'next-auth/react'
import getServerSession, { Session } from 'next-auth';
import { authConfig } from '@/auth.config';
import { auth } from '@/auth';
import { getLessons } from '@/actions';
import { spacing } from '@/lib/constants';
import LessonItem from './LessonItem';
import { ILesson } from '@/lib/validation/enforceTypes';
import { useSession } from 'next-auth/react';

export default function LessonItems() {
    const userID = useSession().data?.user?.id;
    if (userID == undefined) throw new Error("No user ID found");
    console.log("userID: ", userID);
    const [items, setItems] = useState(null as ILesson[] | null);
    useEffect(() => {
        async function main() {
            const items = await getLessons(userID);
            console.log("items from db: ", items);
            setItems(items);
        }
        main()
    }, [])
    return (
        JSON.stringify(userID)
        // <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3" style={{ gap: spacing.gaps.groupedElement }}>
        //     {
        //         items.map((item) => {
        //             return <LessonItem imageURL="https://cdn.discordapp.com/attachments/917525824956158012/1206262827254546452/image.png?ex=65db5ecd&is=65c8e9cd&hm=0b56bf7134387e07d78439435543eb0c57f5844c665c3d6db46c2bbdf22726e1&" key={item.id} lessonID={item.id} subject={item.subject} currentKnowledgeSummary={item.currentKnowledgeSummary} />
        //         })
        //     }
        // </div>
    );
}