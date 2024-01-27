import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import Sources from "@/components/ui/Sources";
import { merriweather } from "@/app/fonts";
import { Button } from "./button";
import {
  ISource,
  getSources,
  getSourceFromDatabaseWhereSourceIdIs,
} from "@/app/(api)/Actions/actions";
type Props = {
  uploadClicked?: boolean;
  setUploadClicked: Function;
  setNewQuestionIsVisible: Function;
};

const MySources = (props: Props) => {
  const [uploadClicked, setUploadClicked] = useState(props.uploadClicked);
  const userID = "1F2B3C4D5E6F7G8H9I0J";
  const sources: ISource[] = getSources(userID);
  return (
    <>
      <div className="flex justify-between" id="title">
        <h2 className={`font-black text-[1.5rem] ${merriweather.className}`}>
          My Sources
        </h2>
        <Button
          tooltip="Add a source"
          variant="grey"
          onClick={() => props.setUploadClicked(!uploadClicked)}
        >
          {uploadClicked ? (
            <>
              <Minus className="h-6 w-6" />
            </>
          ) : (
            <Plus className="h-6 w-6 stroke-2 " />
          )}
        </Button>
      </div>

      <div id="primaryInteractionArea" className="flex flex-col gap-4">
        <Sources
          sources={sources}
          setNewQuestionIsVisible={props.setNewQuestionIsVisible}
        />
      </div>
    </>
  );
};

export default MySources;
