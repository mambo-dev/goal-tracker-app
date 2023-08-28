export function getJwtSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error("jwt secret is not defined");
  }
  return process.env.JWT_SECRET;
}

export function getIdFromParams(paramName: string, urlString: string): number {
  const { searchParams } = new URL(urlString);
  const id = searchParams.get(paramName);

  if (!id || isNaN(Number(id))) {
    throw new Error("invalid id value sent");
  }

  return Number(id);
}
