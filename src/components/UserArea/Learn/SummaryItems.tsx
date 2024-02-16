import React, { useEffect, useState } from 'react'
import SummaryItem from './SummaryItem'
import { getUser } from '@/actions'
import { useSession } from 'next-auth/react'
var equal = require('deep-equal');
type Stat = {
    number: number,
    desc: string,
}
function SummaryItems() {
    const [stats, setStats] = useState([] as Stat[]);
    const { id, tutorName } = useSession().data?.user!!;
    useEffect(() => {
        async function main() {
            console.log("SummaryItems calling getUser with id: ", id)
            await getUser(id, { lessons: true, knowledgePointsUnderstood: true }).then((user) => {
                if (user) {
                    setStats([{
                        number: user.lessons.length,
                        desc: "Lessons Completed"
                    },
                    {
                        number: user.knowledgePointsUnderstood.length,
                        desc: tutorName ? "New concepts learnt with " + tutorName : "New concepts Learned"
                    }]);
                } else {
                    throw new Error("getUser is erronous - existing userID passed to it but it didn't return a user")
                }
            }).catch((error) => {
                console.error("Catch: Error while fetching user: ", error);
            });
        }
        main()
    }, []);
    return (
        <>
            {
                equal(stats, {}) ? <SummaryItem loading={true} /> :
                    stats.map((stat: Stat) => {
                        return <SummaryItem key={Math.floor(Math.random() * 1000)} number={stat.number} desc={stat.desc} />
                    })
            }
        </>
    )
}

export default SummaryItems