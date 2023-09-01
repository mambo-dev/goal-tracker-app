import { z } from "zod";
import { toast } from "../ui/toast";
import { HandleError } from "@/lib/types";

export default function useError() {
  function handleError(error: any) {
    if (error instanceof z.ZodError) {
      error.issues
        .map((error) => {
          return {
            message: error.message,
          };
        })
        .forEach((error) => {
          toast({
            message: error.message,
            title: "required fields",
            type: "error",
            duration: 5000,
          });
        });
      return;
    }

    if (Array.isArray(JSON.parse(error.message))) {
      const errors = JSON.parse(error.message) as HandleError[];
      errors.forEach((error) => {
        toast({
          message: error.message,
          title: "Oops could not complete your request",
          type: "error",
          duration: 5000,
        });
      });
      return;
    }

    toast({
      message:
        "Oops sorry something unexpected on our side happened! Please try again later.",
      title: "We messed up",
      type: "error",
      duration: 5000,
    });
    return;
  }

  return {
    handleError,
  };
}
