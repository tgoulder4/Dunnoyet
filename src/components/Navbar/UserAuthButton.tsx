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
import Image from "next/legacy/image";

type Props = {};

const UserAuthButton = (props: Props) => {
  const [dialogContent, setDialogContent] = useState({});
  return (
    <Dialog>
      <DialogTrigger asChild>
        <NewButton buttonVariant="ghost" style={{ padding: 0 }} actionOrLink={() => { }}>
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <Image
              alt='Profile'
              src='/pfp.png'
              layout='fill'
              className="rounded-full"
              style={{ borderColor: "#000", borderWidth: 2 }}
              objectFit='contain'
            />
          </div>
        </NewButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] flex flex-col divide-y-[1px] divide-gray-300">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <Settings />
      </DialogContent>
    </Dialog>
  );
};

export default UserAuthButton;
