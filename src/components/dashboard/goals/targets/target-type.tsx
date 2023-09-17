import { Target } from "@prisma/client";
import React from "react";

type Props = {
  target: Target;
};

export default function TargetType({ target }: Props) {
  switch (target) {
    case "curency":
      return <CurrencyTarget />;
    case "done_not_done":
      return <DoneNotDoneTarget />;
    case "milestone":
      return <Milestone />;
    case "number":
      return <NumericTarget />;

    default:
      return null;
  }
}

function NumericTarget() {
  return <div>numeric</div>;
}

function CurrencyTarget() {
  return <div>currency</div>;
}

function DoneNotDoneTarget() {
  return <div>done not done</div>;
}

function Milestone() {
  return <div>milestone</div>;
}
