import React from 'react'
type chatProps = {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}
function Chat({
    isOpen,
    setIsOpen
}: chatProps) {

    return (<>
        <div className='bottom-0 right-0 z-10 w-full max-w-[500px] fixed rounded-[10px]'>ChatAreaHeader</div>
        {
            isOpen ? "ChatArea" : ""
        }
    </>
    )
}

export default Chat