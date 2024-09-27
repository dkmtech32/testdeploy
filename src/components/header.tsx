"use client";

import { useAppContext } from "@/app/app-provider";
import ButtonLogout from "@/components/button-logout";
import { ModeToggle } from "@/components/mode-toggle";
import logo from "../../public/images/logo-pkb.png";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

export default function Header() {
  const { user } = useAppContext();
  const avatar = user?.avatar
    ? process.env.NEXT_PUBLIC_API_ENDPOINT + user.avatar
    : "/images/no-image.png";

  return (
    <nav className="bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <Image
                width={100} // Increased from 50 to 100
                height={100} // Increased from 50 to 100
                src={logo}
                alt="PKB Badminton"
                className="h-16 w-16" // Increased from h-8 w-8 to h-16 w-16
              />
            </Link>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-6">
                <Link
                  href="/leagues"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-3 rounded-md text-lg font-medium" // Changed text-sm to text-lg, increased px and py
                >
                  League
                </Link>
                <Link
                  href="/group"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-3 rounded-md text-lg font-medium" // Changed text-sm to text-lg, increased px and py
                >
                  Group
                </Link>
                <Link
                  href="/ranking"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-3 rounded-md text-lg font-medium" // Changed text-sm to text-lg, increased px and py
                >
                  Ranking
                </Link>
                <Link
                  href="/match"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-3 rounded-md text-lg font-medium" // Changed text-sm to text-lg, increased px and py
                >
                  Match Center
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {user?.role === "admin" && (
                <Link
                  href="/dashboard"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-3 rounded-md text-lg font-medium"
                >
                  Dashboard
                </Link>
              )}

              {user ? (
                <div className="ml-3 relative group">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="default"
                        className="bg-gray-800 hover:bg-gray-700 p-1 w-[3rem] h-[3rem] rounded-full"
                      >
                        <Image
                          src={avatar}
                          width={100}
                          height={100}
                          alt="avatar"
                          className=" w-[3rem] rotate-0 scale-100 transition-all rounded-full"
                        />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Link href={`/me`}>{user?.name}&apos;s profile</Link>
                      </DropdownMenuItem>
                      {/* <DropdownMenuItem>{user?.email}</DropdownMenuItem> */}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <ButtonLogout isCollapsed={false} isMobile={false} />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
              )}
              <ModeToggle />
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            {/* Mobile menu button */}
            <button
              type="button"
              className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className="hidden h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className="md:hidden" id="mobile-menu">
        <div className="px-4 pt-4 pb-3 space-y-2 sm:px-4">
          <Link
            href="/league"
            className="text-gray-300 hover:bg-gray-700 hover:text-white block px-4 py-3 rounded-md text-lg font-medium"
          >
            League
          </Link>
          <Link
            href="/group"
            className="text-gray-300 hover:bg-gray-700 hover:text-white block px-4 py-3 rounded-md text-lg font-medium"
          >
            Group
          </Link>
          <Link
            href="/ranking"
            className="text-gray-300 hover:bg-gray-700 hover:text-white block px-4 py-3 rounded-md text-lg font-medium"
          >
            Ranking
          </Link>
          <Link
            href="/match"
            className="text-gray-300 hover:bg-gray-700 hover:text-white block px-4 py-3 rounded-md text-lg font-medium"
          >
            Match Center
          </Link>
        </div>

        <div className="pt-4 pb-3 border-t border-gray-700">
          {user ? (
            <div className="flex items-center px-5">
              <div className="ml-3">
                <div className="text-base font-medium leading-none text-white">
                  {user.name}
                </div>
                <div className="text-sm font-medium leading-none text-gray-400">
                  {user.email}
                </div>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Login
            </Link>
          )}
          <div className="mt-3 px-2 space-y-1">
            <Link
              href="/profile"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
            >
              Profile
            </Link>
            <ButtonLogout isCollapsed={false} isMobile={true} />
            <Link
              href="/admin"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
            >
              {user?.role}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
