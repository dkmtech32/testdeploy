import React from 'react';
import Link from 'next/link';
import { IconType } from 'react-icons';
import { usePathname } from 'next/navigation';

interface SidebarMenuItemProps {
  href: string;
  icon: IconType;
  text: string;
  isActive: boolean;
  isCollapsed: boolean;
  isHovered: boolean;
  iconClassName?: string;
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  href,
  icon: Icon,
  text,
  isCollapsed,
  isHovered,
  isActive,
  iconClassName,
}) => {
  const pathname = usePathname();
    
  
  return (
    <Link
      href={href}
      className={`flex items-center p-2 rounded-lg transition ${
        isActive
          ? "bg-gray-600 text-white"
          : "hover:bg-gray-600 text-gray-400"
      }`}
    >
      <div className="flex items-center">
        <Icon className={`${iconClassName} mr-3 text-xs transition-all duration-300 ease-in-out`} />
        <span
          className={`transition-all duration-300 ease-in-out inline-block whitespace-nowrap overflow-hidden ${
            isCollapsed && !isHovered
              ? "w-0 opacity-0"
              : "w-auto opacity-100"
          }`}
        >
          {text}
        </span>
      </div>
    </Link>
  );
};

export default SidebarMenuItem;