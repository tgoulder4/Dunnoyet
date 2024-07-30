import { Textarea } from '@/components/ui/textarea'
import { colours, lessonPaddingBottom, spacing } from '@/lib/constants'
import { client } from '@/lib/db/hono';
import React, { useRef } from 'react'

function Notes({ placeholderMode }: { placeholderMode?: boolean }) {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    async function saveNotes() {
        await client.api.notes[':lessonID'].$patch({ param: { lessonID: "" } });
    }
    return (
        <div style={{ paddingBottom: lessonPaddingBottom }} className='h-full'>
            {placeholderMode ?
                <div className='flex flex-col gap-3 h-full'>
                    <div style={{ backgroundColor: colours.border }} className='w-1/3 h-8 animate animate-pulse rounded-lg' />
                    <div style={{ backgroundColor: colours.border }} className="w-full h-full animate animate-pulse rounded-lg"></div>
                </div> :
                <div className='flex flex-col gap-3 h-full'>
                    <h2 className='font-bold'>Notes</h2>
                    <Textarea ref={textAreaRef} onChange={e => {
                        //wait 2s, if there's no change, save
                        // setTimeout(() => {
                        //     if (textAreaRef.current?.value == e.target.value) {
                        //         console.log("Saving notes")
                        //         saveNotes();
                        //     }
                        // }, 2000);
                    }
                    } placeholder="Write your notes here" className='h-full p-[15px] text-base overflow-hidden rounded-xl resize-none text' />
                </div>
            }
        </div>
    )
}

export default Notes