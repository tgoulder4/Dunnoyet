import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { merriweather, ruda } from "@/app/fonts";
function SeeSourcesDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <ShieldCheck className="bg-text-complementary_lighter" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-8">
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
        <div className="grid gap-4 py-4 h-96"></div>
        <DialogFooter>
          <Button type="submit">Okay!</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SeeSourcesDialog;
