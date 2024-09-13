import { BookOpenCheck, LayoutDashboard } from "lucide-react";
import { type NavItem } from "@/types";

export const NavItems: NavItem[] = [
  {
    title: "Adventures",
    icon: LayoutDashboard,
    href: "/adventure",
    color: "text-sky-500",
  },
  {
    title: "Example",
    icon: BookOpenCheck,
    href: "/example",
    color: "text-orange-500",
    isChidren: true,
    children: [
      {
        title: "Example-01",
        icon: BookOpenCheck,
        color: "text-red-500",
        href: "/adventure/adventure-id-1",
      },
      {
        title: "Example-02",
        icon: BookOpenCheck,
        color: "text-red-500",
        href: "/example/example-02",
      },
      {
        title: "Example-03",
        icon: BookOpenCheck,
        color: "text-red-500",
        href: "/example/example-03",
      },
    ],
  },
] as const;
