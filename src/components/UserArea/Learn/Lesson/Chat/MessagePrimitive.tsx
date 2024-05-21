import NewButton from '@/components/ui/NewButton'
import { messagesSchema } from '@/lib/validation/primitives'
import { roleType } from '@/lib/validation/transfer/transferSchemas'
import React from 'react'
import { z } from 'zod'

function MessagePrimitive({ message, focused, lastMessageInLesson, username }: { message: z.infer<typeof messagesSchema>, focused: boolean, lastMessageInLesson: boolean, username?: string }) {
    const {
        role, content, eliResponseType
    } = message;
    return (
        <div className={`w-full border-b-[rgba(0,0,0,0.05)] border-b px-24 pt-[0.938rem] pb-[1.25rem] items-center flex flex-row gap-4 ${eliResponseType == "WhatComesToMind" ? "bg-[#461167] text-white" : ""}`}>
            <div className="grid place-items-center w-12 aspect-square rounded-full border border-[rgba(0,0,0,0.1)]">
                {
                    role == "user" ? <h2>{username ? username[0] : "U"}</h2> :
                        <svg width="29" height="28" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="1" y="0.5" width="27" height="27" rx="13.5" stroke="black" strokeOpacity="0.1" />
                            <path d="M13.1248 16.3334C13.0653 16.1027 12.945 15.8922 12.7765 15.7237C12.6081 15.5552 12.3975 15.4349 12.1668 15.3754L8.07679 14.3208C8.00701 14.3009 7.9456 14.2589 7.90186 14.201C7.85813 14.1432 7.83447 14.0726 7.83447 14.0001C7.83447 13.9275 7.85813 13.857 7.90186 13.7991C7.9456 13.7413 8.00701 13.6992 8.07679 13.6794L12.1668 12.6241C12.3974 12.5646 12.6079 12.4445 12.7764 12.2761C12.9449 12.1078 13.0652 11.8973 13.1248 11.6668L14.1795 7.57675C14.1991 7.5067 14.241 7.44498 14.299 7.40101C14.357 7.35705 14.4277 7.33325 14.5005 7.33325C14.5732 7.33325 14.644 7.35705 14.7019 7.40101C14.7599 7.44498 14.8019 7.5067 14.8215 7.57675L15.8755 11.6668C15.935 11.8975 16.0552 12.108 16.2237 12.2765C16.3922 12.445 16.6027 12.5652 16.8335 12.6248L20.9235 13.6788C20.9938 13.6982 21.0558 13.7401 21.1 13.7981C21.1442 13.8562 21.1682 13.9271 21.1682 14.0001C21.1682 14.073 21.1442 14.144 21.1 14.202C21.0558 14.2601 20.9938 14.302 20.9235 14.3214L16.8335 15.3754C16.6027 15.4349 16.3922 15.5552 16.2237 15.7237C16.0552 15.8922 15.935 16.1027 15.8755 16.3334L14.8208 20.4234C14.8012 20.4935 14.7592 20.5552 14.7012 20.5992C14.6433 20.6431 14.5725 20.6669 14.4998 20.6669C14.427 20.6669 14.3563 20.6431 14.2983 20.5992C14.2404 20.5552 14.1984 20.4935 14.1788 20.4234L13.1248 16.3334Z" fill="#438BCE" />
                            <path d="M19.8335 8V10.6667" stroke="#438BCE" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M21.1667 9.33325H18.5" stroke="#438BCE" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M9.1665 17.3333V18.6666" stroke="#438BCE" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M9.83333 18H8.5" stroke="#438BCE" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                }
            </div>
            <div className="flex flex-col gap-5">

                <div className="flex flex-col gap-1">
                    <h2 className='font-normal opacity-70'>
                        {
                            role == "user" ? "You" : "Eli" + (eliResponseType == "WhatComesToMind" ? " - LEARNING WHAT YOU KNOW" : "")
                        }
                    </h2>
                    <h2 className={`${focused ? 'font-bold' : ''}`}>{content}</h2>
                </div>
                {role == "eli" && focused &&
                    <NewButton type="button" buttonVariant='black' className='px-[1.4rem] py-[0.9rem] w-max font-bold'>{
                        eliResponseType == "General" ? lastMessageInLesson ? "Finish lesson 🏁 (Enter)" : "I understand! (Enter)" : "SystemCTA"
                    }
                    </NewButton>
                }
            </div>
        </div>
    )
}

export default MessagePrimitive