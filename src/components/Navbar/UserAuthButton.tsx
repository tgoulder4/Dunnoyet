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
import { colours, sizing } from "@/lib/constants";
import { useSession } from "next-auth/react";

type Props = {};

const UserAuthButton = (props: Props) => {
  // const user = useSession().data?.user!!;
  // const imageURL = user.image;
  //IN PLACE WHILE AUTH IS NOT WORKING
  const imageURL = "";
  const user = { name: "John Doe" };
  return (
    <NewButton noAnimation style={{ padding: 0 }} className="hidden md:flex  relative aspect-square w-[50px]" buttonVariant="ghost" actionOrLink='/settings'>{
      !imageURL ? <div style={{ backgroundColor: colours.accent }} className="border-4 border-solid border-[#131313] h-full aspect-square rounded-full grid place-items-center text-black">{user?.name ? user.name[0] : null}</div> :
        <img
          alt='Profile'
          src={imageURL}
          className="border-4 border-solid border-[#131313] rounded-full object-scale-down  h-full aspect-square "
        />
    }
    </NewButton>
  );
};

export default UserAuthButton;
