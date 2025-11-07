import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";
import { useState } from "react";
import { PropTypes } from "prop-types";

const DefaultLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 text-black transition-colors duration-300 dark:bg-slate-900 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 transition-colors duration-300 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;

DefaultLayout.propTypes = {
  children: PropTypes.node,
};
