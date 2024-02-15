"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Settings from "../ui/Settings/Settings";
import NewButton from "../ui/NewButton";
import Image from "next/image";
import { merriweather, ruda } from "@/app/fonts";
import { sizing } from "@/lib/constants";
import { useSession } from "next-auth/react";

type Props = {};

const UserAuthButton = (props: Props) => {
  const [dialogContent, setDialogContent] = useState({});
  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* <NewButton className="h-full relative aspect-square" buttonVariant="ghost" style={{}} actionOrLink={() => { }}> */}
        <button className="h-full relative aspect-square">
          <Image
            alt='Profile'
            src='/pfp.png'
            fill
            className="rounded-full"
            style={{ borderColor: "#000", borderWidth: 2 }}
          />
        </button>
        {/* </NewButton> */}
      </DialogTrigger>
      <DialogContent style={{ fontFamily: ruda.style.fontFamily, fontSize: sizing.globalFontSize }} className=" flex flex-col divide-y-[1px] divide-gray-300">
        <DialogHeader>
          <DialogTitle className="font-normal">Settings</DialogTitle>
        </DialogHeader>
        <Settings />
      </DialogContent>
    </Dialog>
  );
};

export default UserAuthButton;
