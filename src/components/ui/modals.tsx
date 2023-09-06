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
  defaultOpen?: boolean;
};

export default function Modal({
  button,
  title,
  description,
  contentClassName,
  children,
  defaultOpen,
}: Props) {
  return (
    <Dialog defaultOpen={defaultOpen}>
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
