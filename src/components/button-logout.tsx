"use client";

import authApiRequest from "@/apiRequests/auth";
import { useAppContext } from "@/app/app-provider";
import { Button } from "@/components/ui/button";
import { handleErrorApi } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "@chakra-ui/react"; // Import useToast from Chakra UI
import { FaSignOutAlt } from "react-icons/fa";

export default function ButtonLogout({
  isCollapsed,
  isMobile,
}: {
  isCollapsed: boolean;
  isMobile: boolean;
}) {
  const { setUser } = useAppContext();
  const router = useRouter();
  const toast = useToast(); // Initialize useToast from Chakra UI
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await authApiRequest.logoutFromNextClientToNextServer();
      toast({
        title: "Logout Successful",
        description: "You have been logged out.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      router.push("/login");
    } catch (error) {
      handleErrorApi({ error });
      authApiRequest.logoutFromNextClientToNextServer(true).then(() => {
        router.push(`/login?redirectFrom=${pathname}`);
      });
    } finally {
      setUser(null);
      router.refresh();
      localStorage.removeItem("sessionToken");
      localStorage.removeItem("sessionTokenExpiresAt");
    }
  };

  return (
    <Button
      onClick={handleLogout}
      className="flex items-center justify-start px-3 py-2 rounded-md shadow-none bg-transparent text-gray-400 hover:text-white hover:bg-gray-700 w-full "
    >
      <div className="flex items-center">
        <FaSignOutAlt className="w-7 h-7 transition-all duration-300 ease-in-out mr-2" />
        <span
          className={`${
            isCollapsed && !isMobile ? "hidden group-hover:inline" : ""
          } text-base font-medium text-left`}
        >
          Logout
        </span>
      </div>
    </Button>
  );
}
