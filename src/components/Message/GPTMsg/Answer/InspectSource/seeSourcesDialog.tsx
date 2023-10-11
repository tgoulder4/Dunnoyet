import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { merriweather, ruda } from "@/app/fonts";
import Source from "./Source";
function SeeSourcesDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <ShieldCheck className="bg-text-complementary_lighter" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-8 bg-white">
        <DialogHeader>
          <DialogTitle
            className={`${merriweather.className} text-2xl text-center`}
          >
            Inspect Source
          </DialogTitle>
          <DialogDescription
            className={`${ruda.className} px-20 text-sm text-complementary_lighter text-center`}
          >
            See the sources of the information mentioned in this message below.
          </DialogDescription>
        </DialogHeader>
        <Source />
        <DialogFooter>
          <Button type="submit">Okay!</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SeeSourcesDialog;
