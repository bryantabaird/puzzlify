import bcryptjs from "bcryptjs";

export default async function hashInput(input: string) {
  return await bcryptjs.hash(input, 10);
}
