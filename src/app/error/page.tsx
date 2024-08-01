
'use client'
import MainAreaNavbar from '@/components/Navbar/MainAreaNavbar'
import { spacing } from '@/lib/constants'
import React from 'react'
import { ruda } from '../fonts'
// import { useSearchParams } from 'react-router-dom'

function ErrorPage() {
    // const [searchParams, setSearchParams] = useSearchParams();
    // const errorId = searchParams.get('errorId') || 'Unknown';
    const errorId = 'unknown'
    return (
        <div className='flex flex-col h-[100vh]' style={{ fontFamily: ruda.style.fontFamily }}>
            <MainAreaNavbar style='normal' />
            <div className="grid place-items-center h-2/3">
                <div style={{ rowGap: spacing.gaps.separateElement }} className="flex flex-col items-center">
                    <svg width="49" height="49" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M38.7918 28.5833C41.8339 25.6025 44.9168 22.0296 44.9168 17.3542C44.9168 14.376 43.7338 11.5198 41.6279 9.41395C39.522 7.30807 36.6658 6.125 33.6877 6.125C30.0943 6.125 27.5627 7.14583 24.5002 10.2083C21.4377 7.14583 18.906 6.125 15.3127 6.125C12.3345 6.125 9.47832 7.30807 7.37244 9.41395C5.26657 11.5198 4.0835 14.376 4.0835 17.3542C4.0835 22.05 7.146 25.6229 10.2085 28.5833L24.5002 42.875L38.7918 28.5833Z" stroke="#2C4858" strokeWidth="5" strokeLinecap="round" stroke-linejoin="round" />
                        <path d="M24.4998 26.5418L22.4582 24.5002L26.5415 20.4168L20.4165 14.2918L24.4998 10.2085" stroke="#2C4858" strokeWidth="5" strokeLinecap="round" stroke-linejoin="round" />
                    </svg>
                    <div className="flex flex-col items-center gap-3">
                        <h1 className='font-bold'>It&apos;s not you, it&apos;s us.</h1>
                        <h2>Something went wrong on our end. Please contact us if this persists.</h2>
                        <h2 className='text-gray-400'>Error ID: {errorId}</h2>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ErrorPage