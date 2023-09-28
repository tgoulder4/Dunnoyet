import { useState } from "react";
import { Button } from "../ui/button";
function MoreOptionsInterrogativeButton() {
    const [moreOptionsIsOpen, setMoreOptionsIsOpen] = useState(false);
    return ( 
        <>
        {moreOptionsIsOpen?(<div className="flex flex-col gap-2">
                {additionalTerms.map((additionalTerm) => (
                <Button
                  variant="outline"
                  className={`w-full text-xl ${merriweather.className}`}
                  onClick={() => handleTermSelect(additionalTerm)}
                >
                  {additionalTerm.term}
                </Button>
                ))}
                </>):<></>
}

export default MoreOptionsInterrogativeButton;