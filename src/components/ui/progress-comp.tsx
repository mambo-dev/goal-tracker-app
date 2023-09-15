"use client";

import * as React from "react";
import { Progress } from "./progress";

export function ProgressComponent({ progress }: { progress: number }) {
  return <Progress value={progress} className="w-full" />;
}
