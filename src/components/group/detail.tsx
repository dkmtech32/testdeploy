"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
// import axios from 'axios';
import { format } from "date-fns";
import Image from "next/image";
import groupApiRequest from "@/apiRequests/group";
import { GroupHomeResType, GroupType } from "@/schemaValidations/group.schema";
import { useDisclosure, useToast } from "@chakra-ui/react";
import { ConfirmationModal } from "../ui/confirmation";
import Link from "next/link";

interface GroupTrainingDetail {
  name: string;
  description: string;
  location: string;
  activity_time: string;
  note: string;
  number_of_members: number;
  listMembers: { name: string }[];
}

const DetailGroup: React.FC<{ id: number }> = ({ id }) => {
  const imagePrefix = process.env.NEXT_PUBLIC_API_ENDPOINT;

  const [groupTrainingDetail, setGroupTrainingDetail] =
    useState<GroupTrainingDetail | null>({
      name: "group 1",
      description: "description 1",
      activity_time: "activity time 1",
      location: "location 1",
      note: "note 1",
      number_of_members: 1,
      listMembers: [{ name: "user 1" }],
    });

  const [groupData, setGroupData] = useState<GroupType | null>();
  const [isJoined, setIsJoined] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [memberCount, setMemberCount] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleJoinGroup = async () => {
    onOpen(); // Open the confirmation modal
  };
  useEffect(() => {
    const fetchGroupDetail = async () => {
      try {
        const res = await groupApiRequest.getDetailGroup(id);
        if (res.payload?.data) {
          setGroupData({
            ...res.payload.data,
            member_count: res.payload.data.members?.length ?? 0,
            is_applied: res.payload.data.is_applied ?? false,
          });
          setIsJoined(res.payload.data.is_joined || false);
          setIsFull(
            res.payload.data.members?.length ===
              res.payload.data.number_of_members
          );
          setIsApplied(res.payload.data.is_applied || false);
        } else {
          console.error("Unexpected API response structure:", res);
        }
      } catch (error) {
        console.error("Error fetching group detail:", error);
      }
    };
    fetchGroupDetail();
  }, [id]);

  const confirmJoinGroup = async () => {
    onClose(); // Close the confirmation modal
    try {
      const response = await groupApiRequest.joinGroup({ group_id: id });
      if (response.status === 200) {
        if (groupData?.status === "public") {
          setIsJoined(true);
          toast({
            title: "Joined group successfully",
            description: "You have joined the group.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        } else if (groupData?.status === "private") {
          setIsApplied(true);
          toast({
            title: "Request sent",
            description:
              "You have sent a request to join the group. Please wait for the group owner to approve your request.",
            status: "warning",
            duration: 5000,
            isClosable: true,
          });
        }

        setMemberCount(memberCount + 1);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const [messageText, setMessageText] = useState("");

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 dark:bg-gray-800">
      {groupData && (
        <div className="bg-white dark:bg-gray-700 shadow-lg rounded-lg overflow-hidden mb-8 transition-shadow duration-300 hover:shadow-xl">
          <div className="relative h-96 w-full">
            <Image
              src={
                groupData.image
                  ? `${imagePrefix}${groupData.image}`
                  : "/images/logo-pkb.png"
              }
              alt="Group Cover"
              fill
              priority
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-4 left-6 flex items-center space-x-3">
              <h2 className="text-3xl font-bold text-white drop-shadow-lg">
                {groupData.name}
              </h2>
              <div
                className={`bg-opacity-80 ${groupData.status === "public" ? "bg-green-500" : "bg-gray-500"} text-white px-3 py-1 rounded-full text-sm font-semibold`}
              >
                {groupData.status === "public" ? "Public" : "Private"}
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {/* Group details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem label="Description" value={groupData.description} isNote />
              <InfoItem
                label="Activity time"
                value={groupData.training?.[0]?.date ?? "N/A"}
              />
              <InfoItem label="Location" value={groupData.location} />
              <InfoItem label="Note" value={groupData.note} isNote={true} />
            </div>

            {/* Progress bar */}
            <div className="mt-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Members
                </span>
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  {groupData.member_count} / {groupData.number_of_members}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                  style={{
                    width: `${
                      (groupData.member_count / groupData.number_of_members) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-4 mt-6">
              {isJoined && (
                <Link href={`/group/${id}/training`}>
                  <button className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-4 transition duration-300">
                    {"Training"}
                  </button>
                </Link>
              )}
              <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300">
                {"Ranking"}
              </button>

              {!isJoined && !isFull && !isApplied && (
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 ml-auto rounded transition duration-300"
                  onClick={handleJoinGroup}
                >
                  Join group
                </button>
              )}
              {isFull && !isJoined && (
                <button
                  className="bg-gray-400 dark:bg-gray-600 text-white font-medium py-2 px-4 rounded ml-auto transition duration-300 cursor-not-allowed"
                  disabled
                >
                  Full members
                </button>
              )}
              {isApplied && (
                <button className="bg-gray-400 dark:bg-gray-600 text-white font-medium py-2 px-4 rounded ml-auto transition duration-300 cursor-not-allowed">
                  Applied
                </button>
              )}
              {isJoined && (
                <button
                  className="bg-green-500 dark:bg-green-600 text-white font-medium py-2 px-4 rounded ml-auto transition duration-300 cursor-not-allowed"
                  disabled
                >
                  Joined
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Live chat section */}
      <div className="bg-white dark:bg-gray-700 shadow-lg rounded-lg p-6 mt-8 transition-shadow duration-300 hover:shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          Live chat
        </h2>
        <div className="flex mt-4">
          <textarea
            className="flex-1 border rounded-l-lg p-2 bg-white dark:bg-gray-600 text-gray-800 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            placeholder="Type your message"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
          <button
            title="Send"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <i className="fa fa-paper-plane"></i>
          </button>
        </div>
      </div>

      {/* List members section */}
      <div className="bg-white dark:bg-gray-700 shadow-lg rounded-lg p-6 mt-8 transition-shadow duration-300 hover:shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          List members
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {groupData?.members?.map((member, index) => (
            <div key={index} className="flex flex-col items-center">
              <Image
                src={
                  member.profile_photo_path
                    ? `${imagePrefix}${member.profile_photo_path}`
                    : "/images/default-avatar.png"
                }
                alt={`Avatar of ${member.name}`}
                width={60}
                height={60}
                className="w-15 h-15 rounded-full mb-2 border-2 border-blue-500"
              />
              <span className="text-sm text-gray-800 dark:text-white text-center">
                {member.name}
              </span>
            </div>
          ))}
        </div>
      </div>
      {groupData?.status === "public" && (
        <ConfirmationModal
          isOpen={isOpen}
          onClose={onClose}
          onConfirm={confirmJoinGroup}
          title="Join Group"
          message={`Are you sure you want to join the group "${groupData?.name}"?`}
        />
      )}
      {groupData?.status === "private" && (
        <ConfirmationModal
          isOpen={isOpen}
          onClose={onClose}
          onConfirm={confirmJoinGroup}
          title="Request to join group"
          message={`Are you sure you want to send a request to join the group "${groupData?.name}"?
        You will be notified if the group owner approves your request.`}
        />
      )}
    </div>
  );
};

const InfoItem: React.FC<{
  label: string;
  value: string;
  isNote?: boolean;
  className?: string;
}> = ({ label, value, isNote, className }) => (
  <div className={`${isNote ? "col-span-full" : ""} ${className}`}>
    <span className="font-bold text-gray-700 dark:text-gray-300">
      {label}:{" "}
    </span>
    <span
      className={`text-gray-600 dark:text-gray-400 ${isNote ? "italic" : ""}`}
    >
      {value}
    </span>
  </div>
);

export default DetailGroup;
