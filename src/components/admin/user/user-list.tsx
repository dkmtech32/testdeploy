"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UserListType } from "@/schemaValidations/account.schema";
import accountApiRequest from "@/apiRequests/account";
import DynamicPagination from "@/components/ui/dynamic-pagination";
import { FaExclamationTriangle } from "react-icons/fa";
import { useDisclosure, useToast } from "@chakra-ui/react";

const UserList: React.FC = () => {
  const router = useRouter();
  const toast = useToast();
  const [users, setUsers] = useState<UserListType["users"]>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    (async () => {
      try {
        if (!accountApiRequest) {
          throw new Error("accountApiRequest is null or undefined");
        }
        const result = await accountApiRequest.getUserList();
        if (!result) {
          throw new Error(
            "Result from userApiRequest.getDashboardList() is null or undefined"
          );
        }
        const imagePrefix = process.env.NEXT_PUBLIC_API_ENDPOINT;

        result.payload.users.forEach((user) => {
          user.avatar ? (user.avatar = imagePrefix + user.avatar) : null;
        });

        setUsers(result.payload.users);
      } catch (error) {
        console.error("An error occurred while fetching the user list:", error);
      }
    })();
  }, []);

  const handleItemsPerPageChange = useCallback((newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  }, []);

  const filteredUsers =
    users?.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) ?? [];

  const sortedUsers = [...filteredUsers].sort((a: any, b: any) => {
    if (sortBy === "createdAt" || sortBy === "updatedAt") {
      return sortOrder === "asc"
        ? new Date(a[sortBy]).getTime() - new Date(b[sortBy]).getTime()
        : new Date(b[sortBy]).getTime() - new Date(a[sortBy]).getTime();
    }
    if (a[sortBy] < b[sortBy]) return sortOrder === "asc" ? -1 : 1;
    if (a[sortBy] > b[sortBy]) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

  const handleEditUser = (id: number) => {
    router.push(`/dashboard/user/${id}/edit`);
  };

  const handleDeleteUser = (id: number) => {
    setDeleteId(id);
    onOpen();
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        await accountApiRequest.deleteUser(deleteId);
        setUsers(users?.filter((user) => user.id !== deleteId));
        toast({
          title: "User Deleted",
          description: "The user has been deleted successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "An error occurred while deleting the user.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
    onClose();
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="mx-auto px-4 py-4 dark:bg-gray-900">
      <DynamicPagination
        onItemsPerPageChange={handleItemsPerPageChange}
        headerHeight={160}
        rowHeight={90}
        footerHeight={90}
      />
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h4 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
          User Management
        </h4>
        <h4 className=" text-red-800 text-2xl font-bold mb-6">
          (these feature not yet available)
        </h4>
        <div className="flex flex-wrap items-center justify-between mb-4">
          <div className="w-full md:w-1/2 mb-2 md:mb-0">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-3 py-1 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="w-full md:w-auto flex space-x-2">
            <select
              title="Sort by"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-3 py-1 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="name">Sort by Name</option>
              <option value="created_at">Sort by Creation Date</option>
              <option value="updated_at">Sort by Last Update</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {[
                  "Name",
                  "Email",
                  "Profile Picture",
                  "Role",
                  "Status",
                  "Created At",
                  "Updated At",
                  "Action",
                ].map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() =>
                      header !== "Profile Picture" &&
                      header !== "Action" &&
                      handleSortChange(header.toLowerCase().replace(" ", ""))
                    }
                  >
                    {header}{" "}
                    {sortBy === header.toLowerCase().replace(" ", "")
                      ? sortOrder === "asc"
                        ? "↑"
                        : "↓"
                      : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {currentUsers.map((user) => (
                <tr
                  key={user.email}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-4 py-4 max-w-52 whitespace-normal text-sm text-gray-900 dark:text-gray-200">
                    {user.name}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {user.email}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Image
                      className="max-w-28 rounded-full"
                      src={user.avatar || "/images/no-image.png"}
                      width={50}
                      height={50}
                      alt="avatar"
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {user.role}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {user.status ? "Active" : "Inactive"}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {formatDate(user.updatedAt)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      type="button"
                      className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2 mb-2 transition duration-300 ease-in-out"
                      onClick={() => handleEditUser(user.id)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2 mb-2 transition duration-300 ease-in-out"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-4">
          <nav>
            <ul className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <li key={`page-${index + 1}`}>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-lg border ${
                      currentPage === index + 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600"
                    }`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      <ConfirmDialog
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={confirmDelete}
        cancelRef={cancelRef}
      />
    </div>
  );
};

const ConfirmDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  cancelRef: React.RefObject<HTMLButtonElement>;
}> = ({ isOpen, onClose, onConfirm, cancelRef }) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 z-10 max-w-md border-2 border-red-500">
        <div className="flex items-center mb-4">
          <FaExclamationTriangle className="h-6 w-6 text-red-500 mr-2" />
          <h3 className="text-lg font-medium text-red-500 dark:text-red-400">
            Confirm User Deletion
          </h3>
        </div>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Are you sure you want to delete this user?
        </p>
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          <p className="font-semibold mb-2">Deleting this user will:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Permanently remove all data associated with this user</li>
            <li>Remove the user from all groups and leagues</li>
            <li>Delete all activities and records associated with this user</li>
            <li className="text-red-500 dark:text-red-400 font-semibold">
              This action cannot be undone
            </li>
          </ul>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            ref={cancelRef}
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500 flex items-center"
          >
            <FaExclamationTriangle className="h-4 w-4 mr-1" />
            Delete User
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserList;
