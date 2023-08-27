export type ServerResponse<T> = {
  error?: ZodIssues[] | HandleError[];
  data?: T;
  okay: boolean;
};

type HandleError = {
  message: string;
};
