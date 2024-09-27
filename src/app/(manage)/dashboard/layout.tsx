"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/ui/side-nav";
import { FaBars, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setIsOpen(!mobile);
      setIsCollapsed(false); // Reset collapse state on resize
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
      <Sidebar
        isOpen={isOpen}
        isCollapsed={isCollapsed}
        toggleCollapse={toggleSidebar}
      />
      
      <div className="flex-grow overflow-y-auto p-1 lg:p-4 bg-gray-100 dark:bg-gray-900 relative">
        <button
          className="absolute top-2 left-6 z-20 bg-gray-800 text-white p-2 rounded-md "
          onClick={toggleSidebar}
        >
          {isMobile ? (
            isOpen ? (
              <FaTimes />
            ) : (
              <FaBars />
            )
          ) : isCollapsed ? (
            <FaChevronRight />
          ) : (
            <FaChevronLeft />
          )}
        </button>
        {children}
      </div>
    </div>
  );
}
