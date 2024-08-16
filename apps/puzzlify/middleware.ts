import { MiddlewareConfig } from "next/server";

export { auth as middleware } from "@/auth";

export const config: MiddlewareConfig = {
  matcher: ["/((?!register|api|_next/static|_next/image|favicon.ico).*)"],
};
