import { Type } from "@prisma/client";
import { addDays, addMonths, addWeeks, addYears } from "date-fns";

export function assignTimeline(goalType: Type) {
  switch (goalType) {
    case "daily":
      return addDays(new Date(), 1);

    case "monthly":
      return addMonths(new Date(), 1);

    case "weekly":
      return addWeeks(new Date(), 1);

    case "yearly":
      return addYears(new Date(), 1);

    default:
      throw new Error("no type was provided");
  }
}
