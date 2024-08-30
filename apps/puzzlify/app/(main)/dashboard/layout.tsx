// components/Layout.tsx
import React from "react";
import Logout from "@/components/Logout";
import Link from "next/link";
import LeftSidebar from "./_components/LeftSidebar";
import NavBar from "../_components/NavBar";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-1">
      <LeftSidebar />
      {children}
    </div>
  );
};

export default Layout;
