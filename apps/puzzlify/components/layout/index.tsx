import React from "react";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <div className="flex h-screen w-full border-collapse overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden pt-16 bg-secondary/10 p-6">
          {children}
        </main>
      </div>
    </>
  );
};
