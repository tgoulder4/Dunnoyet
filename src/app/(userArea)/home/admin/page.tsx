'use client'
import React, { useEffect, useState } from 'react'
import MainAreaNavbar from '@/components/Navbar/MainAreaNavbar';
import { auth } from '@/auth';
import { hc } from 'hono/client'

function AdminPage() {
    const [sess, setSess] = useState(null as any);

    useEffect(() => {
        async function main() {
            const sess = await auth();
            if (!sess || !sess.user || sess.user.role !== 'ADMIN') {
                return;
            }
            else {
                setSess(sess)
            }
        }
        main()
    }, [])
    return (<>
        <MainAreaNavbar style='authOrAdmin' />
        {
            sess &&
            <div>
                <div className="flex justify-between">
                    <button className='p-4 bg-black text-white' onClick={async () => {
                        const res = await
                            fetch('/api/admin/drop/all', {
                                method: 'POST',
                            });
                        //i want to use hono client.admin.$post here instead of fetch
                        console.log("res: ", res)
                    }}>Drop lessons, lessonStates, metadata, knowledgePoints, messages etc.</button>
                </div>
            </div>
        }
    </>
    )
}

export default AdminPage