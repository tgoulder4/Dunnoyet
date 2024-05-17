import Link from 'next/link'
import React from 'react'
function SwitcherButton(props: { text: string }) {
    const { text } = props
    return (
        <button className="px-3 switcherButton transition-all">
            <Link
                href="#"
                className="font-bold text-muted-foreground transition-colors hover:text-foreground"
            >
                {text}
            </Link>
        </button>
    )
}

export default SwitcherButton