import React from "react";
import LeftSidebar from "./_components/LeftSidebar";

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
