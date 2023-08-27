export function getJwtSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error("jwt secret is not defined");
  }
  return process.env.JWT_SECRET;
}
