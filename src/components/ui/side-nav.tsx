"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaBars,
  FaTimes,
  FaUser,
  FaTrophy,
  FaCalendarAlt,
  FaUsers,
  FaBox,
  FaUserCircle,
  FaPlus,
  FaList,
  FaCalendarCheck,
  FaCalendarDay,
  FaPlusCircle,
  FaListUl,
  FaChalkboardTeacher,
  FaRunning,
} from "react-icons/fa";
import ButtonLogout from "../button-logout";
import { useAppContext } from "@/app/app-provider";
import { ModeToggle } from "../mode-toggle";
import Image from "next/image";
import { usePathname } from "next/navigation";
import SidebarMenuItem from "./sidebar-menu-item";

const Sidebar: React.FC<{
  isOpen: boolean;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}> = ({ isOpen, isCollapsed, toggleCollapse }) => {
  const { user } = useAppContext();
  const userAvatar = user?.avatar
    ? process.env.NEXT_PUBLIC_API_ENDPOINT + user.avatar
    : "/images/no-image.png";
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<any>({});
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const toggleSubmenu = (menuName: any) => {
    setOpenMenus((prevState: { [x: string]: any }) => ({
      ...prevState,
      [menuName]: !prevState[menuName],
    }));
  };

  const isSubmenuOpen = (menuName: string) => openMenus[menuName];

  const isActive = (path: string): boolean => {
    return pathname.endsWith(path);
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div
        className={`${
          isCollapsed ? (isHovered ? "w-64" : "w-24") : isOpen ? "w-64" : "w-0"
        } transition-all duration-300 ease-in-out`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <aside
          className={`${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed top-0 left-0 z-10 ${
            isCollapsed && !isHovered ? "w-24" : "w-64"
          } bg-gray-900 text-white h-screen overflow-y-auto transition-all duration-300 ease-in-out`}
        >
          <div className="p-2 border-b border-gray-700 flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo-pkb.png"
                alt="Logo"
                width={100}
                height={100}
                className={`w-14 h-14 `}
              />
              <span
                className={`ml-2 text-lg tracking-wide ${
                  isCollapsed && !isHovered ? "hidden" : ""
                }`}
              >
                pickleballvietnam.io
              </span>
            </Link>
          </div>

          <div className="pt-4 pb-3 border-t border-gray-700">
            {user ? (
              <>
                <div className="flex items-center px-5">
                  <Image
                    src={userAvatar || "/images/logo-pkb.png"}
                    alt="Logo"
                    width={56}
                    height={56}
                    className="w-12 h-12 rounded-full "
                  />
                  <div
                    className={`ml-3 ${
                      isCollapsed && !isHovered ? "hidden" : ""
                    }`}
                  >
                    <div
                      className={`text-2xl font-medium leading-none ${
                        isCollapsed && !isHovered ? "hidden" : ""
                      }`}
                    >
                      {user.name}
                    </div>
                    <div
                      className={`text-sm font-medium leading-none text-gray-400 ${
                        isCollapsed && !isHovered ? "hidden" : ""
                      }`}
                    >
                      {user.title}
                    </div>
                  </div>
                  <div
                    className={`ml-auto ${
                      isCollapsed && !isHovered ? "hidden" : ""
                    }`}
                  >
                    <ModeToggle />
                  </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  <Link
                    href="/me"
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    <div className="flex items-center">
                      <FaUserCircle
                        className={`w-6 h-6 transition-all duration-300 ease-in-out mr-2 `}
                      />
                      <span
                        className={`transition-all duration-300 ease-in-out inline-block whitespace-nowrap overflow-hidden ${
                          isCollapsed && !isHovered
                            ? "w-0 opacity-0"
                            : "w-auto opacity-100"
                        }`}
                      >
                        Profile
                      </span>
                    </div>
                  </Link>
                  <ButtonLogout
                    isCollapsed={isCollapsed && !isHovered}
                    isMobile={isMobile}
                  />
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Login
              </Link>
            )}
          </div>

          <div className="p-4">
            <nav>
              <ul className="space-y-2">
                {/* Admin User Management */}
                {user?.role === "admin" && (
                  <li>
                    <SidebarMenuItem
                      href="/dashboard/user"
                      icon={FaUser}
                      text="User"
                      isActive={isActive("/dashboard/user")}
                      isCollapsed={isCollapsed}
                      isHovered={isHovered}
                      iconClassName="w-6 h-6"
                    />
                  </li>
                )}

                {/* League */}
                <li>
                  <button
                    aria-expanded={isSubmenuOpen("league") || false}
                    className={`flex items-center justify-between w-full p-2 rounded-lg transition ${
                      isActive("/dashboard/league")
                        ? "bg-gray-700 text-white"
                        : "hover:bg-gray-700 text-gray-400"
                    }`}
                    onClick={() => toggleSubmenu("league")}
                  >
                    <div className="flex items-center">
                      <FaTrophy className="w-6 h-6" />
                      <span
                        className={`ml-3 ${
                          isCollapsed && !isHovered ? "hidden" : ""
                        }`}
                      >
                        League
                      </span>
                    </div>
                    <i
                      className={`fas fa-chevron-${
                        isSubmenuOpen("league") ? "up" : "down"
                      } `}
                    ></i>
                  </button>
                  <ul
                    className={`ml-4 mt-2 space-y-1 ${
                      isSubmenuOpen("league") ? "block" : "hidden"
                    }`}
                  >
                    <li>
                      <SidebarMenuItem
                        href="/dashboard/league"
                        icon={FaList}
                        text="List League"
                        isActive={isActive("/dashboard/league")}
                        isCollapsed={isCollapsed}
                        isHovered={isHovered}
                        iconClassName="w-4 h-4"
                      />
                    </li>
                    <li>
                      <SidebarMenuItem
                        href="/dashboard/league/create"
                        icon={FaPlus}
                        text="Create League"
                        isActive={isActive("/dashboard/league/create")}
                        isCollapsed={isCollapsed}
                        isHovered={isHovered}
                        iconClassName="w-4 h-4"
                      />
                    </li>
                  </ul>
                </li>

                {/* Schedule */}
                <li>
                  <button
                    aria-expanded={isSubmenuOpen("schedule")}
                    className={`flex items-center justify-between w-full p-2 rounded-lg transition ${
                      isActive("/dashboard/schedule")
                        ? "bg-gray-700 text-white"
                        : "hover:bg-gray-700 text-gray-400"
                    }`}
                    onClick={() => toggleSubmenu("schedule")}
                  >
                    <div className="flex items-center">
                      <FaCalendarAlt className="w-6 h-6" />
                      <span
                        className={`ml-3 ${
                          isCollapsed && !isHovered ? "hidden" : ""
                        }`}
                      >
                        Schedule
                      </span>
                    </div>
                    <i
                      className={`fas fa-chevron-${
                        isSubmenuOpen("schedule") ? "up" : "down"
                      } ${
                        isCollapsed && !isHovered ? "hidden" : "inline-block"
                      }`}
                    ></i>
                  </button>
                  <ul
                    className={`ml-4 mt-2 space-y-1 ${
                      isSubmenuOpen("schedule") ? "block" : "hidden"
                    }`}
                  >
                    <li>
                      <SidebarMenuItem
                        href="/dashboard/schedule"
                        icon={FaCalendarDay}
                        text="List Schedule"
                        isActive={isActive("/dashboard/schedule")}
                        isCollapsed={isCollapsed}
                        isHovered={isHovered}
                        iconClassName="w-4 h-4"
                      />
                    </li>
                    <li>
                      <SidebarMenuItem
                        href="/dashboard/schedule/result"
                        icon={FaCalendarCheck}
                        text="Result"
                        isActive={isActive("/dashboard/schedule/result")}
                        isCollapsed={isCollapsed}
                        isHovered={isHovered}
                        iconClassName="w-4 h-4"
                      />
                    </li>
                    <li>
                      <SidebarMenuItem
                        href="/dashboard/schedule/result"
                        icon={FaCalendarCheck}
                        text="Result"
                        isActive={isActive("/dashboard/schedule/result")}
                        isCollapsed={isCollapsed}
                        isHovered={isHovered}
                        iconClassName="w-4 h-4"
                      />
                    </li>
                  </ul>
                </li>

                {/* Group */}
                <li>
                  <button
                    aria-expanded={isSubmenuOpen("group")}
                    className={`flex items-center justify-between w-full p-2 rounded-lg transition ${
                      isActive("/dashboard/group")
                        ? "bg-gray-700 text-white"
                        : "hover:bg-gray-700 text-gray-400"
                    }`}
                    onClick={() => toggleSubmenu("group")}
                  >
                    <div className="flex items-center">
                      <FaUsers className="w-6 h-6" />
                      <span
                        className={`ml-3 ${
                          isCollapsed && !isHovered ? "hidden" : ""
                        }`}
                      >
                        Group
                      </span>
                    </div>
                    <i
                      className={`fas fa-chevron-${
                        isSubmenuOpen("group") ? "up" : "down"
                      } ${
                        isCollapsed && !isHovered ? "hidden" : "inline-block"
                      }`}
                    ></i>
                  </button>
                  <ul
                    className={`ml-4 mt-2 space-y-1 ${
                      isSubmenuOpen("group") ? "block" : "hidden"
                    }`}
                  >
                    <li>
                      <SidebarMenuItem
                        href="/dashboard/group/create"
                        icon={FaPlus}
                        text="Create Group"
                        isActive={isActive("/dashboard/group/create")}
                        isCollapsed={isCollapsed}
                        isHovered={isHovered}
                        iconClassName="w-4 h-4"
                      />
                    </li>
                    <li>
                      <SidebarMenuItem
                        href="/dashboard/group"
                        icon={FaListUl}
                        text="List Group"
                        isActive={isActive("/dashboard/group")}
                        isCollapsed={isCollapsed}
                        isHovered={isHovered}
                        iconClassName="w-4 h-4"
                      />
                    </li>

                    {/* <li>
                      <SidebarMenuItem
                        href="/dashboard/group/training"
                        icon={FaChalkboardTeacher}
                        text="List Group Training"
                        isActive={isActive("/dashboard/group/training")}
                        isCollapsed={isCollapsed}
                        isHovered={isHovered}
                        iconClassName="w-4 h-4"
                      />
                    </li> */}
                  </ul>
                </li>

                {/* Training */}
                <li>
                  <button
                    aria-expanded={isSubmenuOpen("training")}
                    className={`flex items-center justify-between w-full p-2 rounded-lg transition ${
                      isActive("/dashboard/training")
                        ? "bg-gray-700 text-white"
                        : "hover:bg-gray-700 text-gray-400"
                    }`}
                    onClick={() => toggleSubmenu("training")}
                  >
                    <div className="flex items-center">
                      <FaRunning className="w-6 h-6" />
                      <span
                        className={`ml-3 ${
                          isCollapsed && !isHovered ? "hidden" : ""
                        }`}
                      >
                        Training
                      </span>
                    </div>
                    <i
                      className={`fas fa-chevron-${
                        isSubmenuOpen("training") ? "up" : "down"
                      } ${
                        isCollapsed && !isHovered ? "hidden" : "inline-block"
                      }`}
                    ></i>
                  </button>
                  <ul
                    className={`ml-4 mt-2 space-y-1 ${
                      isSubmenuOpen("training") ? "block" : "hidden"
                    }`}
                  >
                    {/* <li>
                      <SidebarMenuItem
                        href="/dashboard/training/create"
                        icon={FaPlus}
                        text="Create Training"
                        isActive={isActive("/dashboard/group/create")}
                        isCollapsed={isCollapsed}
                        isHovered={isHovered}
                        iconClassName="w-4 h-4"
                      />
                    </li> */}
                    <li>
                      <SidebarMenuItem
                        href="/dashboard/training"
                        icon={FaListUl}
                        text="List Training"
                        isActive={isActive("/dashboard/training")}
                        isCollapsed={isCollapsed}
                        isHovered={isHovered}
                        iconClassName="w-4 h-4"
                      />
                    </li>

                    {/* <li>
                      <SidebarMenuItem
                        href="/dashboard/group/training"
                        icon={FaChalkboardTeacher}
                        text="List Group Training"
                        isActive={isActive("/dashboard/group/training")}
                        isCollapsed={isCollapsed}
                        isHovered={isHovered}
                        iconClassName="w-4 h-4"
                      />
                    </li> */}
                  </ul>
                </li>

                {/* Admin Product Management */}
                {user?.role === "admin" && (
                  <li>
                    <button
                      aria-expanded={isSubmenuOpen("product")}
                      className={`flex items-center justify-between w-full p-2 rounded-lg transition ${
                        isActive("/dashboard/product")
                          ? "bg-gray-700 text-white"
                          : "hover:bg-gray-700 text-gray-400"
                      }`}
                      onClick={() => toggleSubmenu("product")}
                    >
                      <div className="flex items-center">
                        <FaBox className="w-6 h-6" />
                        <span
                          className={`ml-3 ${
                            isCollapsed && !isHovered ? "hidden" : ""
                          }`}
                        >
                          Product
                        </span>
                      </div>
                      <i
                        className={`fas fa-chevron-${
                          isSubmenuOpen("product") ? "up" : "down"
                        } ${
                          isCollapsed && !isHovered ? "hidden" : "inline-block"
                        }`}
                      ></i>
                    </button>
                    <ul
                      className={`ml-4 mt-2 space-y-1 ${
                        isSubmenuOpen("product") ? "block" : "hidden"
                      }`}
                    >
                      <li>
                        <SidebarMenuItem
                          href="/product/create"
                          icon={FaPlus}
                          text="Create Product"
                          isActive={isActive("/dashboard/product/create")}
                          isCollapsed={isCollapsed}
                          isHovered={isHovered}
                          iconClassName="w-4 h-4"
                        />
                      </li>
                      <li>
                        <SidebarMenuItem
                          href="/dashboard/product"
                          icon={FaList}
                          text="List Product"
                          isActive={isActive("/dashboard/product")}
                          isCollapsed={isCollapsed}
                          isHovered={isHovered}
                          iconClassName="w-4 h-4"
                        />
                      </li>
                    </ul>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </aside>
      </div>
      {/* {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-0 transition-opacity duration-300 ease-in-out"
          onClick={() => setIsOpen(false)}
        ></div>
      )} */}
    </>
  );
};

export default Sidebar;
