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

type Props = {};

const UserAuthButton = (props: Props) => {
  const [dialogContent, setDialogContent] = useState({});
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <img src="/pfp.png" alt="Profile Picture" className="h-full" />
        </Button>
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
