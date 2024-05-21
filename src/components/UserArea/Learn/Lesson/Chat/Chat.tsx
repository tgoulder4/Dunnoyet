import React, { useState } from 'react'
import MessagePrimitive from './MessagePrimitive'
import { z } from 'zod'
import { messagesSchema } from '@/lib/validation/primitives'
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { colours, sizing, spacing } from '@/lib/constants';

function Chat({ messages, subject, targetQContent }: { messages: z.infer<typeof messagesSchema>[], subject?: string, targetQContent?: string }) {
    const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const text = textAreaRef.current?.value;
        if (!text) return;
        //send the message
        setLoading(false);
    }

    return (
        <div className='flex flex-col gap-3 font-bold justify-between h-full' style={{ paddingBottom: 2 * spacing.gaps.largest }}>
            <section className='titleAndReplies flex flex-col gap-3'>

                <div className="outlineArea grid place-items-center pt-1 h-16 w-full px-12 bg-[#F4F4F4]">
                    <h1 className='w-full font-extrabold'>{subject ? subject : targetQContent}
                    </h1>
                </div>
                <div className="mainChat">
                    {
                        messages.map((message, index) => {
                            return <MessagePrimitive key={message.content + index} focused={index == messages.length} lastMessageInLesson={false} message={message} />
                        })
                    }
                </div>
            </section>
            <div className="replyArea px-8">
                <form onSubmit={handleSubmit} className=" animate-in slide-in-from-bottom-4 relative w-full flex flex-row gap-2">
                    <Textarea onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                        }
                    }} ref={textAreaRef} disabled={loading} className={`${loading ? '' : ''} p-[15px] px-[20px] h-14 text-base overflow-hidden rounded-xl resize-none text`} placeholder="Reply to Eli..." />
                    <Button type='submit' disabled={loading} className='absolute h-fit bottom-[0.5rem] right-2 p-2 grid place-items-center rounded-xl' style={{ backgroundColor: colours.black }}>
                        <Send size={24} color='white'></Send>
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default Chat