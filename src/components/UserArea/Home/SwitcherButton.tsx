import { spacing } from '@/lib/constants';
import Link from 'next/link'
import React, { Dispatch, SetStateAction } from 'react'
function SwitcherButton(props: { text: string, setMode: Dispatch<SetStateAction<number>>, mode: number }) {
    const { text, setMode, mode } = props;
    const thisMode = text == 'New Question' ? 0 : 1 as number;
    return (
        <button style={{ height: 2 * spacing.gaps.separateElement - 10 }} className="flex flex-col items-center justify-between relative px-3 switcherButton transition-all" onClick={() => setMode(thisMode)}>
            <Link
                href="#"
                className="font-bold text-muted-foreground transition-colors hover:text-foreground"
            >
                {text}
            </Link>
            {
                mode == thisMode && <div className=" h-2 w-full bg-primary"></div>
            }
        </button>
    )
}

export default SwitcherButton