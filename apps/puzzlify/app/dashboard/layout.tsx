// components/Layout.tsx
import React from "react";
import Logout from "@/components/Logout";
import Link from "next/link";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-800 text-white flex flex-col p-4">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">My App</h1>
        </div>
        <nav className="flex-1">
          <ul>
            <li className="mb-4">
              <Link href="dashboard">Dashboard</Link>
            </li>
          </ul>
        </nav>
        <Logout />
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-8 overflow-y-auto">{children}</main>
    </div>
  );
};

export default Layout;
