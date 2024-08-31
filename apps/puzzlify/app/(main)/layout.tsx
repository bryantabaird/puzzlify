import NavBar from "./_components/NavBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full h-full">
      <div className="drawer">
        <input id="left-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          <NavBar />
          {children}
        </div>
        <div className="drawer-side">
          <label
            htmlFor="left-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 min-h-full w-80 p-4">
            {/* Sidebar content here */}
            <li>
              <a>Sidebar Item 1</a>
            </li>
            <li>
              <a>Sidebar Item 2</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
