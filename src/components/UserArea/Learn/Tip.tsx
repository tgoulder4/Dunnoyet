import React from 'react'

function Tip() {
    //generate a random number between 1 and 3
    const random = Math.floor(Math.random() * 3) + 1;
    return (
        <div>Tip</div>
    )
}

export default Tip