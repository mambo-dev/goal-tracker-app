import { useState } from "react";
import { z } from "zod";

export default function useForm<T>(
  initialValues: T,
  zodSchema: any,
  onSubmit: any
) {
  const [values, setValues] = useState(initialValues);
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    try {
      const validValues = zodSchema.parse(initialValues);

      onSubmit(validValues);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }

  return {
    values,
    isLoading,
    handleChange,
    handleSubmit,
  };
}
