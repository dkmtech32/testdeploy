"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  LeagueListResType,
  LeagueResType,
} from "@/schemaValidations/league.schema";
import leagueApiRequest from "@/apiRequests/league";
import { useDisclosure, useToast } from "@chakra-ui/react";
import DynamicPagination from "@/components/ui/dynamic-pagination";
import { FaExclamationTriangle } from "react-icons/fa";

const LeagueList: React.FC = () => {
  const router = useRouter();
  const toast = useToast();
  const [leagues, setleagues] = useState<LeagueListResType["data"]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    (async () => {
      try {
        if (!leagueApiRequest) {
          throw new Error("leagueApiRequest is null or undefined");
        }
        const result = await leagueApiRequest.getDashboardList();
        if (!result) {
          throw new Error(
            "Result from leagueApiRequest.getList() is null or undefined"
          );
        }
        const imagePrefix = process.env.NEXT_PUBLIC_API_ENDPOINT;

        result.payload.data.forEach((league) => {
          league.images ? (league.images = imagePrefix + league.images) : null;
        });

        setleagues(result.payload.data);
        // Fetch player numbers for each league
        const playerNumberResult =
          await leagueApiRequest.getLeaguesPlayerNumber();
        if (
          playerNumberResult &&
          playerNumberResult.payload &&
          playerNumberResult.payload.data
        ) {
          setleagues((prevLeagues) =>
            prevLeagues.map((league) => ({
              ...league,
              player_number:
                playerNumberResult.payload.data[league.id]?.player_count || 0,
            }))
          );

        }
      } catch (error) {
        console.error(
          "An error occurred while fetching the league list:",
          error
        );
      }
    })();
  }, []);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("created_at"); // Default sort by created_at
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc"); // Default sort order descending

  const handleItemsPerPageChange = useCallback((newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when items per page changes
  }, []);

  // Calculate filtered and sorted leagues based on search and sort
  const filteredleagues = leagues.filter((league) =>
    league.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedleagues = [...filteredleagues].sort((a: any, b: any) => {
    if (a[sortBy] < b[sortBy]) return sortOrder === "asc" ? -1 : 1;
    if (a[sortBy] > b[sortBy]) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Paginate sorted and filtered data
  const indexOfLastleague = currentPage * itemsPerPage;
  const indexOfFirstleague = indexOfLastleague - itemsPerPage;
  const currentleagues = sortedleagues.slice(
    indexOfFirstleague,
    indexOfLastleague
  );

  const totalPages = Math.ceil(sortedleagues.length / itemsPerPage);

  const handleCreateleagueTraining = (id: number) => {
    router.push(`/dashboard/league/${id}/training/create`);
  };

  const handleEditleague = (slug: string) => {
    router.push(`/dashboard/league/${slug}/edit`);
  };
  const handleViewPlayers = (slug: string) => {
    router.push(`/dashboard/league/${slug}/player`);
  };

  const handleDeleteLeague = async (id: number) => {
    setDeleteId(id);
    onOpen();
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        const result = await leagueApiRequest.delete(deleteId);
        if (result.status === 200) {
          setleagues(leagues.filter((league) => league.id !== deleteId));
          toast({
            title: "League Deleted",
            description: "The league has been deleted successfully.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error("Error deleting league:", error);
        toast({
          title: "Error",
          description: "An error occurred while deleting the league.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
    onClose();
  };

  // Uncomment and implement if needed
  // const handleActiveleague = async (id: number, active: boolean) => {
  //   try {
  //     await axios.patch(`/api/league/${id}`, { active: !active });
  //     setleagues(
  //       leagues.map((league) =>
  //         league.id === id ? { ...league, active: !league.active } : league
  //       )
  //     );
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleSortChange = (sortBy: string) => {
    setSortBy(sortBy);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc"); // Toggle sort order
  };

  const handleToggleleague = async (id: number) => {
    try {
      const result = await leagueApiRequest.activeLeague(id);
      if (!result) {
        throw new Error("Error toggling league");
      }

      setleagues(
        leagues.map((league) =>
          league?.id === id ? { ...league, status: league?.status ? 0 : 1 } : league
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const formatMoney = (value: number) => {
    return value.toLocaleString("vi-VN");
  };
  return (
    <div className="lg:ml-20 lg:mr-auto xl:mx-auto px-2 sm:px-4 py-4 dark:bg-gray-900">
      <DynamicPagination
        onItemsPerPageChange={handleItemsPerPageChange}
        headerHeight={120}
        rowHeight={115}
        footerHeight={90}
      />
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-white">
          League Management
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
              <option value="start_date">Sort by Start Date</option>
              <option value="money">Sort by Prize Money</option>
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

        {/* League Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                {[
                  "Name",
                  "Start Date",
                  "End Date",
                  "Image",
                  "Location",
                  "Prize Money",
                  "Players",
                  "Format",
                  "Type",
                  "Status",
                  "Action",
                ].map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() =>
                      handleSortChange(header.toLowerCase().replace(/ /g, "_"))
                    }
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
              {currentleagues.map((league) => (
                <tr
                  key={league.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150"
                >
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white max-w-40 overflow-hidden overflow-ellipsis">
                      {league.name}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {league.start_date}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {league.end_date}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Image
                      className="h-16 w-16 rounded-lg object-cover"
                      src={league.images || "/images/logo-pkb.png"}
                      width={80}
                      height={80}
                      alt={`${league.name} image`}
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-700 dark:text-gray-300 max-w-xs overflow-hidden overflow-ellipsis">
                      {league.location}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {league.money ? formatMoney(league.money) : "0"}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {league.player_number || 0} /{" "}
                      {league.number_of_athletes || 0} players
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {league.format_of_league === "league-single-limination"
                        ? "Single Elimination"
                        : league.format_of_league === "league-round"
                        ? "Round Robin"
                        : "Unknown"}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {(() => {
                        switch (league.type_of_league) {
                          case "male-singles":
                            return "M Single";
                          case "male-doubles":
                            return "M Double";
                          case "female-singles":
                            return "F Single";
                          case "female-doubles":
                            return "F Double";
                          case "mixed-doubles":
                            return "Mixed";
                          default:
                            return "Unknown";
                        }
                      })()}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleToggleleague(league.id)}
                      className={`font-bold py-1 px-2 text-xs rounded transition duration-300 
                          ${
                            league.status
                              ? "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
                              : "bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200"
                          }`}
                    >
                      {league.status ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleViewPlayers(league.slug)}
                        className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-1 px-2 text-xs rounded transition duration-300"
                      >
                        Players
                      </button>
                      <button
                        onClick={() => handleEditleague(league.slug)}
                        className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-bold py-1 px-2 text-xs rounded transition duration-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteLeague(league.id)}
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
        <p className="mb-4 text-gray-700 dark:text-gray-300">Are you sure you want to delete this league?</p>
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          <p className="font-semibold mb-2">Deleting this league will:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Permanently remove all data associated with this league</li>
            <li>Remove all players and teams from this league</li>
            <li>Delete all matches and results associated with this league</li>
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

export default LeagueList;
