"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import leagueApiRequest from "@/apiRequests/league";
import Image from "next/image";
import { useToast } from "@chakra-ui/react";

interface ActivateData {
  ids: number[];
  status: "active";
  league_id: string;
}

interface DeactivateData {
  ids: number[];
  status: "inactive";
  league_id: string;
}

type playerResData = {
  id: number;
  league_id: number;
  created_at: string;
  status: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
    profile_photo_path: string;
    role: string;
    phone: string | null;
    address: string | null;
    age: string | null;
    sex: string | null;
  };
};

const LeaguePlayer: React.FC<{ slug: string }> = ({ slug }) => {
  const imagePrefix = process.env.NEXT_PUBLIC_API_ENDPOINT;

  const router = useRouter();
  const toast = useToast();
  const [activateForm, setActivateForm] = useState<ActivateData>({
    ids: [],
    status: "active",
    league_id: "",
  });
  const [deactivateForm, setDeactivateForm] = useState<DeactivateData>({
    ids: [],
    status: "inactive",
    league_id: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const [league, setLeague] = useState<any>(null);
  const [playerList, setPlayerList] = useState<playerResData[]>([]);
  const [allChecked, setAllChecked] = useState(false);

  useEffect(() => {
    if (league) {
      (async () => {
        try {
          const result = await leagueApiRequest.getLeaguePlayer(slug);
          if (result && result.payload && result.payload.data) {
            const players = result.payload.data;
            if (players.length) {
              const updatedPlayers = players.map((player) => {
                if (player.user && player.user.profile_photo_path) {
                  player.user.profile_photo_path =
                    imagePrefix + player.user.profile_photo_path;
                }
                return player;
              });
              setPlayerList(updatedPlayers);

              // Update activate and deactivate forms based on current player status
              const activeIds = updatedPlayers
                .filter((p) => p.status === "active")
                .map((p) => p.id);
              const inactiveIds = updatedPlayers
                .filter((p) => p.status === "inactive")
                .map((p) => p.id);

              setActivateForm({
                ids: activeIds,
                status: "active",
                league_id: league.id.toString(),
              });
              setDeactivateForm({
                ids: inactiveIds,
                status: "inactive",
                league_id: league.id.toString(),
              });
            }
          }
        } catch (error) {
          console.error(
            "An error occurred while fetching the player list:",
            error
          );
        }
      })();
    }
  }, [slug, league, imagePrefix]);

  useEffect(() => {
    (async () => {
      try {
        const result = await leagueApiRequest.getDetailSlug(slug);
        if (result && result.payload && result.payload.data) {
          const leagueData = result.payload.data;
          if (leagueData.images) {
            leagueData.images = imagePrefix + leagueData.images;
          }
          setLeague(leagueData);
        }
      } catch (error) {
        console.error(
          "An error occurred while fetching the league details:",
          error
        );
      }
    })();
  }, [slug, imagePrefix]);

  const [sortBy, setSortBy] = useState<string>("name"); // Default sort by name

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // Default sort order ascending

  const handleSortChange = (sortBy: string) => {
    setSortBy(sortBy);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc"); // Toggle sort order
  };

  const handleToggleAll = () => {
    const allPlayerIds = playerList.map((player) => player.id);
    if (allChecked) {
      setActivateForm((prev) => ({ ...prev, ids: [] }));
      setDeactivateForm((prev) => ({ ...prev, ids: allPlayerIds }));
    } else {
      setActivateForm((prev) => ({ ...prev, ids: allPlayerIds }));
      setDeactivateForm((prev) => ({ ...prev, ids: [] }));
    }
    setAllChecked(!allChecked);
  };

  const handleCheckboxChange = (playerId: number, currentStatus: string) => {
    if (currentStatus === "active") {
      setActivateForm((prevData) => ({
        ...prevData,
        ids: prevData.ids.filter((id) => id !== playerId),
      }));
      setDeactivateForm((prevData) => ({
        ...prevData,
        ids: [...prevData.ids, playerId],
      }));
    } else {
      setDeactivateForm((prevData) => ({
        ...prevData,
        ids: prevData.ids.filter((id) => id !== playerId),
      }));
      setActivateForm((prevData) => ({
        ...prevData,
        ids: [...prevData.ids, playerId],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let activateResult, deactivateResult;
      let activatedCount = 0;
      let deactivatedCount = 0;

      if (activateForm.ids.length > 0) {
        activateResult = await leagueApiRequest.activeUser(activateForm);
        activatedCount = activateForm.ids.length;
        console.log("activateResult", activateResult);
      }

      if (deactivateForm.ids.length > 0) {
        deactivateResult = await leagueApiRequest.activeUser(deactivateForm);
        deactivatedCount = deactivateForm.ids.length;
      }

      if (
        (activateForm.ids.length === 0 || activateResult) &&
        (deactivateForm.ids.length === 0 || deactivateResult)
      ) {
        // Refresh the player list after successful update
        const refreshedResult = await leagueApiRequest.getLeaguePlayer(slug);
        if (
          refreshedResult &&
          refreshedResult.payload &&
          refreshedResult.payload.data
        ) {
          const updatedPlayers = refreshedResult.payload.data;
          const updatedPlayersWithImage = updatedPlayers.map(
            (player: playerResData) => {
              if (player.user && player.user.profile_photo_path) {
                player.user.profile_photo_path =
                  imagePrefix + player.user.profile_photo_path;
              }
              return player;
            }
          );
          setPlayerList(updatedPlayers);

          setPlayerList(updatedPlayers);

          // Update activate and deactivate forms based on refreshed player status
          const activeIds = updatedPlayers
            .filter((p) => p.status === "active")
            .map((p) => p.id);
          const inactiveIds = updatedPlayers
            .filter((p) => p.status === "inactive")
            .map((p) => p.id);

          setActivateForm({
            ids: activeIds,
            status: "active",
            league_id: league.id.toString(),
          });
          setDeactivateForm({
            ids: inactiveIds,
            status: "inactive",
            league_id: league.id.toString(),
          });
        }
      }

      if (activateResult?.payload.success) {
        toast({
          title: "Players Updated",
          description: `Successfully updated ${
            activatedCount + deactivatedCount
          } player(s). 
                      Activated: ${activatedCount}, Deactivated: ${deactivatedCount}`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      } else if (activateResult && !activateResult?.payload.success) {
        toast({
          title: "Update Failed",
          description:
            activateResult?.payload.message ||
            "Failed to update player statuses. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      } else if (deactivateResult && deactivateResult.payload.success) {
        toast({
          title: "Players Updated",
          description: `Successfully updated ${
            activatedCount + deactivatedCount
          } player(s). 
                      Activated: ${activatedCount}, Deactivated: ${deactivatedCount}`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      } else {
        toast({
          title: "Update Failed",
          description:
            activateResult?.payload.message ||
            "Failed to update player statuses. Please try again.",
          status: "error",
          duration: 5000,

          isClosable: true,
          position: "top-right",
        });
      }
    } catch (error: any) {
      console.error("An error occurred while updating player statuses:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update player statuses. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const result = await leagueApiRequest.deleteUser(id);

      if (result) {
        setPlayerList((prevData) =>
          prevData.filter((player) => player.id !== id)
        );
      }
    } catch (error: any) {
      console.error("An error occurred while deleting users:", error);
    }
  };

  return (
    <div className="mx-auto mt-8 px-4 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-100 dark:bg-gray-700 px-6 py-4">
          <h5 className="text-xl font-semibold text-gray-900 dark:text-white">
            League Details
          </h5>
        </div>
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:space-x-8">
            <div className="lg:w-1/3 flex justify-center items-center mb-6 lg:mb-0">
              <Image
                src={league?.images || "/images/logo-pkb.png"}
                alt={league?.name || "League Image"}
                width={300}
                height={300}
                className="w-auto h-56 object-cover rounded-lg shadow-sm"
              />
            </div>
            <div className="lg:w-2/3 lg:pl-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {league?.name}
              </h2>
              <p className="mb-2 text-gray-700 dark:text-gray-300">
                <span className="font-semibold">League name: </span>
                {league?.name}
              </p>
              <p className="mb-2 text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Start date: </span>
                {league?.start_date}
              </p>
              <p className="mb-2 text-gray-700 dark:text-gray-300 ">
                <span className="font-semibold">End date: </span>
                {league?.end_date}
              </p>
              <p className="text-lg font-extrabold text-green-600 dark:text-green-400 mt-4">
                <span className="text-xl">🏆 Prize money: </span>
                {league?.money ? league?.money?.toLocaleString() : 0} VND
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-100 dark:bg-gray-700 px-6 py-4">
          <h5 className="text-xl font-semibold text-gray-900 dark:text-white">
            Players
          </h5>
        </div>
        <div className="p-6">
          <form id="formAccountSettings" onSubmit={handleSubmit}>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      No.
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      <div className="flex items-center">
                        <input
                          id="toggle-all"
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                          checked={allChecked}
                          onChange={handleToggleAll}
                        />
                        <label htmlFor="toggle-all" className="ml-2">
                          Active
                        </label>
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Avatar
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSortChange("name")}
                    >
                      Name{" "}
                      {sortBy === "name"
                        ? sortOrder === "asc"
                          ? "↑"
                          : "↓"
                        : ""}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSortChange("gender")}
                    >
                      Gender{" "}
                      {sortBy === "gender"
                        ? sortOrder === "asc"
                          ? "↑"
                          : "↓"
                        : ""}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSortChange("address")}
                    >
                      Address{" "}
                      {sortBy === "address"
                        ? sortOrder === "asc"
                          ? "↑"
                          : "↓"
                        : ""}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {playerList.map((player, index) => {
                    if (!player || !player.user) {
                      return null;
                    }

                    const isActive = activateForm.ids.includes(player.id);

                    return (
                      <tr
                        key={player.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            id={`checkbox-${player.id}`}
                            title={player.user.name}
                            type="checkbox"
                            name="id"
                            checked={isActive}
                            onChange={() =>
                              handleCheckboxChange(
                                player.id,
                                isActive ? "active" : "inactive"
                              )
                            }
                            className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Image
                            src={
                              player.user.profile_photo_path ||
                              "/images/default-avatar.png"
                            }
                            alt={`Avatar of ${player.user.name}`}
                            width={80}
                            height={80}
                            className="rounded-full"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                          {player.user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {player.user.sex}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {player.user.address}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            type="button"
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                            onClick={() => handleDelete(player.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-8 flex space-x-4">
              <button
                type="submit"
                className={`bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeaguePlayer;
