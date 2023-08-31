"use client";
import React from "react";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "./dialog";

type Props = {
  button: React.JSX.Element;
  title: string;
  description?: string;
  contentClassName: string;
  children: React.ReactNode;
};

export default function Modal({
  button,
  title,
  description,
  contentClassName,
  children,
}: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>{button}</DialogTrigger>
      <DialogContent className={contentClassName}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description} </DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
