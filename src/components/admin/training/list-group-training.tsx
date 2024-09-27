"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast, useDisclosure } from "@chakra-ui/react";
import DynamicPagination from "@/components/ui/dynamic-pagination";
import groupApiRequest from "@/apiRequests/group";
import { GroupTrainingListResType } from "@/schemaValidations/group.schema";
import { FaExclamationTriangle } from "react-icons/fa";
// import groupTrainingApiRequest from "@/apiRequests/groupTraining";

const ListGroupTraining: React.FC = () => {
  const toast = useToast();
  const router = useRouter();
  const [listGroupTraining, setListGroupTraining] = useState<
    GroupTrainingListResType["data"]
  >([]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Fetch data from API when implemented
    (async () => {
      try {
        const result = await groupApiRequest.getListGroupTraining();
        if (result?.payload?.data) {
          setListGroupTraining(result.payload.data);
        }
      } catch (error) {
        console.error(
          "An error occurred while fetching the group training list:",
          error
        );
      }
    })();
  }, []);

  const handleItemsPerPageChange = useCallback((newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  }, []);

  const filteredGroupTrainings = listGroupTraining.filter((groupTraining) =>
    groupTraining?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedGroupTrainings = [...filteredGroupTrainings].sort(
    (a: any, b: any) => {
      if (a?.[sortBy] < b?.[sortBy]) return sortOrder === "asc" ? -1 : 1;
      if (a?.[sortBy] > b?.[sortBy]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    }
  );

  const indexOfLastGroupTraining = currentPage * itemsPerPage;
  const indexOfFirstGroupTraining = indexOfLastGroupTraining - itemsPerPage;
  const currentGroupTrainings = sortedGroupTrainings.slice(
    indexOfFirstGroupTraining,
    indexOfLastGroupTraining
  );

  const totalPages = Math.ceil(sortedGroupTrainings.length / itemsPerPage);

  const handleEdit = (id: number, group_id: number) => {
    router.push(`/dashboard/training/${id}/edit?group_id=${group_id}`);
  };

  const handleMemberList = (id: number) => {
    router.push(`/dashboard/training/${id}/member`);
  };

  const handleCheckin = (id: number) => {
    router.push(`/dashboard/training/${id}/checkin`);
  };

  const handleDelete = async (id: number) => {
    setDeleteId(id);
    onOpen();
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        const result = await groupApiRequest.deleteGroupTraining(deleteId);
        if (result.status === 200) {
          setListGroupTraining(listGroupTraining.filter((item) => item.id !== deleteId));
          toast({
            title: "Group Training Deleted",
            description: "The group training has been deleted successfully.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error("Error deleting group training:", error);
        toast({
          title: "Error",
          description: "An error occurred while deleting the group training.",
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

  return (
    <div className="lg:ml-20 lg:mr-auto xl:mx-auto mt-4 lg:px-8 px-2 sm:px-4 py-4 dark:bg-gray-900">
      <DynamicPagination
        onItemsPerPageChange={handleItemsPerPageChange}
        headerHeight={160}
        rowHeight={80}
        footerHeight={90}
      />
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-white">
          Group Training Management
        </h1>

        {/* <Link
          href="/dashboard/group/training/create"
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-6 transition duration-300 ease-in-out"
        >
          Create Group Training
        </Link> */}

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
              <option value="date">Sort by Date</option>
              <option value="location">Sort by Location</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
            </button>
          </div>
        </div>

        {/* Group Training Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                {[
                  "Name",
                  "Description",
                  "Date",
                  "Activity time",
                  "Members",
                  "Location",
                  "Note",
                  "Action",
                ].map((header) => (
                  <th
                    key={header}
                    onClick={() =>
                      handleSortChange(header.toLowerCase().replace(/ /g, "_"))
                    }
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  >
                    {header}{" "}
                    {sortBy === header.toLowerCase().replace(/ /g, "_")
                      ? sortOrder === "asc"
                        ? "↑"
                        : "↓"
                      : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {currentGroupTrainings.map((groupTraining) => (
                <tr
                  key={groupTraining?.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150"
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white w-20 overflow-hidden overflow-ellipsis">
                      {groupTraining?.name}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-700 dark:text-gray-300 w-40 overflow-hidden overflow-ellipsis">
                      {groupTraining?.description}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {groupTraining?.date
                        ? new Date(groupTraining.date).toLocaleDateString()
                        : ""}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {groupTraining?.start_time && groupTraining?.end_time
                        ? `${new Date(
                            `1970-01-01T${groupTraining.start_time}Z`
                          ).toLocaleTimeString()} - 
                        ${new Date(
                          `1970-01-01T${groupTraining.end_time}Z`
                        ).toLocaleTimeString()}`
                        : ""}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700 dark:text-gray-300 w-10 overflow-clip overflow-ellipsis">
                      {groupTraining?.members}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-700 dark:text-gray-300 w-20 overflow-hidden overflow-ellipsis">
                      {groupTraining?.location}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-700 dark:text-gray-300 w-20 overflow-hidden overflow-ellipsis">
                      {groupTraining?.note}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() =>
                          groupTraining?.id && handleMemberList(groupTraining.id)
                        }
                        className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-1 px-2 text-xs rounded transition duration-300"
                      >
                        Members
                      </button>
                      <button 
                        onClick={() =>
                          groupTraining?.id && handleCheckin(groupTraining.id)
                        }
                        className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-bold py-1 px-2 text-xs rounded transition duration-300"
                      >
                        Checkin
                      </button>
                      <button
                        onClick={() =>
                          groupTraining?.id && handleEdit(groupTraining.id, groupTraining.group_id)
                        }
                        className="bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white font-bold py-1 px-2 text-xs rounded transition duration-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          groupTraining?.id && handleDelete(groupTraining.id)
                        }
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
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? '' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 z-10 max-w-md border-2 border-red-500">
        <div className="flex items-center mb-4">
          <FaExclamationTriangle className="h-6 w-6 text-red-500 mr-2" />
          <h3 className="text-lg font-medium text-red-500 dark:text-red-400">Confirm Deletion</h3>
        </div>
        <p className="mb-4 text-gray-700 dark:text-gray-300">Are you sure you want to delete this group training?</p>
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          <p className="font-semibold mb-2">Deleting this training will:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Permanently remove all data associated with this training session</li>
            <li>Remove this training from all participants&apos; schedules</li>
            <li>Cancel any notifications or reminders set for this training</li>
            <li className="text-red-500 dark:text-red-400 font-semibold">This action cannot be undone</li>
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

export default ListGroupTraining;
