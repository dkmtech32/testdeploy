"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import groupApiRequest from "@/apiRequests/group";
import Image from "next/image";
import { useToast } from "@chakra-ui/react";
import { GroupResType } from "@/schemaValidations/group.schema";

interface ActivateData {
  ids: number[];
  status_request: "true";
  group_id: string;
}

interface DeactivateData {
  ids: number[];
  status_request: "false";
  group_id: string;
}
type groupUserResData = {
  id: number;
  group_id: number;
  created_at: string;
  status_request: string;
  updated_at: string;
  users: {
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

const GroupMember: React.FC<{ id: number }> = ({ id }) => {
  const imagePrefix = process.env.NEXT_PUBLIC_API_ENDPOINT || '';
  const router = useRouter();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [activateForm, setActivateForm] = useState<ActivateData>({
    ids: [],
    status_request: "true",
    group_id: "",
  });
  const [deactivateForm, setDeactivateForm] = useState<DeactivateData>({
    ids: [],
    status_request: "false",
    group_id: "",
  });

  const [group, setGroup] = useState<GroupResType["data"]>();
  const [memberList, setMemberList] = useState<groupUserResData[]>([]);
  const [allChecked, setAllChecked] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const result = await groupApiRequest.getGroupMembers(id);
        if (result?.payload?.data) {
          const members = result.payload.data;
          if (Array.isArray(members) && members.length > 0) {
            const updatedMembers = members.map((member) => {
              if (member && member.users && member.users.profile_photo_path) {
                member.users.profile_photo_path = imagePrefix + member.users.profile_photo_path;
              }
              return member;
            });
            setMemberList(updatedMembers);
            // console.log("updatedMembers", updatedMembers);

            // Update activate and deactivate forms
            const activeIds = updatedMembers
              .filter((p) => p && p.status_request === "true" && p.id)
              .map((p) => p.id);
            const inactiveIds = updatedMembers
              .filter((p) => p && p.status_request === "false" && p.id)
              .map((p) => p.id);

            setActivateForm({
              ids: activeIds,
              status_request: "true",
              group_id: id.toString(),
            });
            console.log("group_id", id);
            setDeactivateForm({
              ids: inactiveIds,
              status_request: "false",
              group_id: id.toString(),
            });
          } else {
            console.log("No members found or invalid data structure");
            setMemberList([]);
          }
        } else {
          console.log("Invalid response structure");
          setMemberList([]);
        }
      } catch (error) {
        console.error("An error occurred while fetching the member list:", error);
        setMemberList([]);
      }
    })();
  }, [id, group, imagePrefix]);

  useEffect(() => {
    (async () => {
      try {
        const result = await groupApiRequest.getDetailId(id);
        if (result && result.payload && result.payload.data) {
          const groupData = result.payload.data;
          if (groupData.image) {
            groupData.image = imagePrefix + groupData.image;
          }

          setGroup(groupData);
        }
      } catch (error) {
        console.error(
          "An error occurred while fetching the group details:",
          error
        );
      }
    })();
  }, [id, imagePrefix]);

  const [sortBy, setSortBy] = useState<string>("name"); // Default sort by name
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // Default sort order ascending

  const handleSortChange = (sortBy: string) => {
    setSortBy(sortBy);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc"); // Toggle sort order
  };

  const handleToggleAll = () => {
    const allMemberIds = memberList.map((member) => member.id);
    if (allChecked) {
      setActivateForm((prev) => ({ ...prev, ids: [] }));

      setDeactivateForm((prev) => ({ ...prev, ids: allMemberIds }));
    } else {
      setActivateForm((prev) => ({ ...prev, ids: allMemberIds }));

      setDeactivateForm((prev) => ({ ...prev, ids: [] }));
    }
    setAllChecked(!allChecked);
  };

  const handleCheckboxChange = (memberId: number, currentStatus: string) => {
    if (currentStatus === "true") {
      setActivateForm((prevData) => ({
        ...prevData,
        ids: prevData.ids.filter((id) => id !== memberId),
      }));
      setDeactivateForm((prevData) => ({
        ...prevData,
        ids: [...prevData.ids, memberId],
      }));
    } else {
      setDeactivateForm((prevData) => ({
        ...prevData,
        ids: prevData.ids.filter((id) => id !== memberId),
      }));
      setActivateForm((prevData) => ({
        ...prevData,
        ids: [...prevData.ids, memberId],
      }));
    }
    setAllChecked(!allChecked);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let activateResult, deactivateResult;
      let activatedCount = 0;
      let deactivatedCount = 0;

      if (activateForm.ids.length > 0) {
        activateResult = await groupApiRequest.activeUser(activateForm);
        activatedCount = activateForm.ids.length;
      }

      if (deactivateForm.ids.length > 0) {
        deactivateResult = await groupApiRequest.activeUser(deactivateForm);
        deactivatedCount = deactivateForm.ids.length;
      }

      if (
        (activateForm.ids.length === 0 || activateResult) &&
        (deactivateForm.ids.length === 0 || deactivateResult)
      ) {
        // Refresh the member list after successful update
        const refreshedResult = await groupApiRequest.getGroupMembers(id);
        if (
          refreshedResult &&
          refreshedResult.payload &&
          refreshedResult.payload.data
        ) {
          const updatedMembers = refreshedResult.payload.data;
          if (Array.isArray(updatedMembers) && updatedMembers.length > 0) {
            const updatedMembersWithImage = updatedMembers.map((member) => {
              if (member && member.users && member.users.profile_photo_path) {
                member.users.profile_photo_path = imagePrefix + member.users.profile_photo_path;
              }
              return member;
            });
            setMemberList(updatedMembersWithImage);
          } 
          console.log("updatedMembers", updatedMembers);


          // Update activate and deactivate forms based on refreshed member status
          const activeIds = updatedMembers
            .filter((p) => p.status_request === "true")
            .map((p) => p.id);
          const inactiveIds = updatedMembers
            .filter((p) => p.status_request === "false")
            .map((p) => p.id);

          setActivateForm((prev) => ({ ...prev, ids: activeIds }));
          setDeactivateForm((prev) => ({ ...prev, ids: inactiveIds }));
        }
      }
      if (activateResult?.payload.success) {
        toast({
          title: "Members Updated",
          description: `Successfully updated ${
            activatedCount + deactivatedCount
          } member(s). 
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
            "Failed to update member statuses. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      } else if (deactivateResult && deactivateResult.payload.success) {
        toast({
          title: "Members Updated",
          description: `Successfully updated ${
            activatedCount + deactivatedCount
          } member(s). 
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
            "Failed to update member statuses. Please try again.",
          status: "error",
          duration: 5000,

          isClosable: true,
          position: "top-right",
        });
      }
    } catch (error: any) {
      console.error("An error occurred while updating member statuses:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update member statuses. Please try again.",
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
      const result = await groupApiRequest.deleteUser(id);
      if (result) {
        setMemberList((prevData) =>
          prevData.filter((member) => member.id !== id)
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
            Group Details
          </h5>
        </div>
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:space-x-8">
            <div className="lg:w-1/3 flex justify-center items-center mb-6 lg:mb-0">
              <Image
                src={group?.image || "/images/logo-pkb.png"}
                alt={group?.name || "Group Image"}
                width={300}
                height={300}
                className="w-auto h-56 object-cover rounded-lg shadow-sm"
              />
            </div>
            <div className="lg:w-2/3 lg:pl-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {group?.name}
              </h2>
              <p className="mb-2 text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Group name: </span>
                {group?.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-100 dark:bg-gray-700 px-6 py-4">
          <h5 className="text-xl font-semibold text-gray-900 dark:text-white">
            Members
          </h5>
        </div>
        <div className="p-6">
          <form id="formAccountSettings" onSubmit={handleSubmit}>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                {/* Table header */}
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
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Phone
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
                  {memberList.map((member, index) => {
                    if (!member || !member.users) {
                      return null;
                    }

                    const isActive = activateForm.ids.includes(member.id);

                    return (
                      <tr
                        key={member.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        {/* Table row content */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            id={`checkbox-${member.id}`}
                            title={member.users.name || ''}
                            type="checkbox"
                            name="id"
                            checked={isActive}
                            onChange={() =>
                              handleCheckboxChange(
                                member.id,
                                member.status_request
                              )
                            }
                            className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Image
                            src={
                              member.users.profile_photo_path ||
                              "/images/default-avatar.png"
                            }
                            alt={member.users.name || "User"}

                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {member.users.name || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {member.users.email || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {member.users.phone || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleDelete(member.id)}
                            className="text-red-600 hover:text-red-800"
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

export default GroupMember;
