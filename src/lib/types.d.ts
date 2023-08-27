export type ServerResponse<T> = {
  error?: ZodIssues[] | HandleError[];
  data?: T;
  okay: boolean;
};

type HandleError = {
  message: string;
};

export type AuthorizedUser = {
  user?: {
    user_id: number;
    username: string;
  };
  error?: string;
};

export type DecodedToken = {
  id: number;
  iat: number;
  exp: number;
};
