"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import groupApiRequest from "@/apiRequests/group";
import { GroupType } from "@/schemaValidations/group.schema";
import { useToast } from "@chakra-ui/react";
import DynamicPagination from "@/components/ui/dynamic-pagination";

import { FaExclamationTriangle } from "react-icons/fa";
import { useDisclosure } from "@chakra-ui/react";

const GroupList: React.FC = () => {
  const toast = useToast();
  const router = useRouter();
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const result = await groupApiRequest.getList();
        if (!result) {
          throw new Error(
            "Result from groupApiRequest.getList() is null or undefined"
          );
        }
        const imagePrefix = process.env.NEXT_PUBLIC_API_ENDPOINT;

        result.payload.data.forEach((group) => {
          group.image ? (group.image = imagePrefix + group.image) : null;
        });

        setGroups(result.payload.data);
      } catch (error) {
        console.error(
          "An error occurred while fetching the group list:",
          error
        );
      }
    })();
  }, []);

  const handleItemsPerPageChange = useCallback((newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when items per page changes
  }, []);

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedGroups = [...filteredGroups].sort((a: any, b: any) => {
    if (a[sortBy] < b[sortBy]) return sortOrder === "asc" ? -1 : 1;
    if (a[sortBy] > b[sortBy]) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const indexOfLastGroup = currentPage * itemsPerPage;
  const indexOfFirstGroup = indexOfLastGroup - itemsPerPage;
  const currentGroups = sortedGroups.slice(indexOfFirstGroup, indexOfLastGroup);

  const totalPages = Math.ceil(sortedGroups.length / itemsPerPage);

  const handleCreateGroupTraining = (id: number, max_member: number) => {
    router.push(
      `/dashboard/group/${id}/training/create?max_member=${max_member}`
    );
  };

  const handleEditGroup = (id: number) => {
    router.push(`/dashboard/group/${id}/edit`);
  };

  const handleDeleteGroup = async (id: number) => {
    setDeleteId(id);
    onOpen();
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        const result = await groupApiRequest.delete(deleteId);
        if (result.status === 200) {
          setGroups(groups.filter((group) => group.id !== deleteId));
          toast({
            title: "Group Deleted",
            description: "The group has been deleted successfully.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error("Error deleting group:", error);
        toast({
          title: "Error",
          description: "An error occurred while deleting the group.",
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

  const handleViewMembers = (id: number) => {
    router.push(`/dashboard/group/${id}/member`);
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);

    setCurrentPage(1);
  };

  const handleSortChange = (sortBy: string) => {
    setSortBy(sortBy);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleToggleGroup = async (id: number) => {
    try {
      const result = await groupApiRequest.activeGroup(id);
      if (!result) {
        throw new Error("Error toggling group");
      }

      setGroups(
        groups.map((group) =>
          group?.id === id ? { ...group, active: !group?.active } : group
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="lg:ml-20 lg:mr-auto xl:mx-auto mt-4  lg:px-8 px-2 sm:px-4 py-4 dark:bg-gray-900">
      <DynamicPagination
        onItemsPerPageChange={handleItemsPerPageChange}
        headerHeight={120}
        rowHeight={105}
        footerHeight={90}
      />
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-white">
          Group Management
        </h1>

        {/* Search and Sort Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 space-y-2 sm:space-y-0">
          <div className="w-full sm:w-1/2 mb-2 sm:mb-0">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="w-full sm:w-auto flex space-x-2">
            <select
              title="Sort by"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="name">Sort by Name</option>
              <option value="created_at">Sort by Creation Date</option>
              <option value="updated_at">Sort by Last Update</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
            </button>
          </div>
        </div>

        {/* Group Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer w-48 overflow-hidden overflow-ellipsis"
                  onClick={() => handleSortChange("name")}
                >
                  {"Name"}{" "}
                  {sortBy === "name" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                >
                  {"Image"}
                </th>
                {/* <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange("description")}
                >
                  {"Description"}{" "}
                  {sortBy === "description"
                    ? sortOrder === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </th> */}
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange("number_member")}
                >
                  {"Members"}{" "}
                  {sortBy === "number_member"
                    ? sortOrder === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange("location")}
                >
                  {"Location"}{" "}
                  {sortBy === "location"
                    ? sortOrder === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange("status")}
                >
                  {"Status"}{" "}
                  {sortBy === "status" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange("active")}
                >
                  {"Active"}{" "}
                  {sortBy === "active" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                >
                  {"Action"}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {currentGroups.map((group) => (
                <tr
                  key={group.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150"
                >
                  <td className="px-4 py-4 whitespace-nowrap w-48">
                    <div className="text-sm font-medium text-gray-900 dark:text-white w-48 overflow-hidden overflow-ellipsis">
                      {group.name}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Image
                      className="h-16 w-16 rounded-lg object-cover"
                      src={group.image || "/images/logo-pkb.png"}
                      width={80}
                      height={80}
                      alt={`${group.name} image`}
                    />
                  </td>
                  {/* <td className="px-4 py-4">
                    <div className="text-sm text-gray-700 dark:text-gray-300 max-w-xs overflow-hidden overflow-ellipsis">
                      {group.description}
                    </div>
                  </td> */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {group.number_of_members} members
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-700 dark:text-gray-300 max-w-xs overflow-hidden overflow-ellipsis">
                      {group.location}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {group.status}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleToggleGroup(group.id)}
                      className={`font-bold py-1 px-2 text-xs rounded transition duration-300 
                          ${
                            group.active
                              ? "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
                              : "bg-gray-300 hover:bg-gray-400 dark:bg-gray-400 dark:hover:bg-gray-600 text-gray-800"
                          }`}
                    >
                      {group.active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() =>
                          handleCreateGroupTraining(
                            group.id,
                            group.number_of_members
                          )
                        }
                        className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-1 px-2 text-xs rounded transition duration-300"
                      >
                        Create Training
                      </button>
                      {group.status === "private" ? (
                        <button
                          onClick={() => handleViewMembers(group.id)}
                          className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-bold py-1 px-2 text-xs rounded transition duration-300"
                        >
                          Member
                        </button>
                      ) : null}
                      <button
                        onClick={() => handleEditGroup(group.id)}
                        className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-bold py-1 px-2 text-xs rounded transition duration-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteGroup(group.id)}
                        className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white font-bold py-1 px-2 text-xs rounded transition duration-300"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4">
          <nav className="flex justify-center">
            <ul className="flex flex-wrap justify-center space-x-1">
              {Array.from({ length: totalPages }, (_, index) => (
                <li key={index + 1} className="mb-2">
                  <button
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-3 py-1 text-xs rounded-lg ${
                      currentPage === index + 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Add ConfirmDialog component */}
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
            Confirm Deletion
          </h3>
        </div>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Are you sure you want to delete this group?
        </p>
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          <p className="font-semibold mb-2">Deleting this group will:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Permanently remove all data associated with this group</li>
            <li>Remove all members from this group</li>
            <li>Delete all training sessions associated with this group</li>
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
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupList;
