import { ProjectTitle } from "./ProjectTitle";
import HeaderActions from "./HeaderActions.web";
import { FaCode } from "react-icons/fa6";

function Header() {
  return (
    <header className="min-h-12 flex items-center px-4 h-12 bg-white dark:bg-[#18181a] border-b border-gray-200 dark:border-[#333333]">
      <div className="flex-1">
        <ProjectTitle />
      </div>
      
      {/* Logo and Title */}
      <div className="flex items-center">
        <div className="w-6 h-6 opacity-90 bg-gradient-to-br from-purple-500 to-purple-600 dark:from-blue-500 dark:to-purple-500 rounded-lg flex items-center justify-center">
          <FaCode className="text-[12px] text-white" />
        </div>
        <h1 className="ml-2 opacity-90 text-[18px] font-bold bg-gradient-to-r from-purple-500 to-purple-600 dark:from-blue-500 dark:to-purple-500 bg-clip-text text-transparent">
          We Dev
        </h1>
      </div>
      
      <div className="flex-1 flex justify-end">
        <HeaderActions />
      </div>
    </header>
  );
}

export default Header;