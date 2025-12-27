import React from "react";

function NavBar() {
  return (
    <div className="navbar bg-green-600 shadow-sm text-white px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center">
      <div className="navbar-center w-full sm:w-auto text-center mb-2 sm:mb-0">
        <span className="text-xl font-bold block sm:inline">
          OSHIMILI NORTH LOCAL GOVERNMENT STREET NAMING
        </span>
      </div>

      <div className="navbar-end w-full sm:w-auto flex justify-center sm:justify-end">
        {/* Search bar removed */}
      </div>
    </div>
  );
}

export default NavBar;



