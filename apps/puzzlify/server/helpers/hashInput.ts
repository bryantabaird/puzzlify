import bcryptjs from "bcryptjs";

export default async function hashInput(input: string) {
  return await bcryptjs.hash(input, 10);
}

export async function compareInput(input: string, hash: string) {
  return await bcryptjs.compare(input, hash);
}
