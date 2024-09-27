import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import groupApiRequest from "@/apiRequests/group";
import { GroupType } from "@/schemaValidations/group.schema";
import ProgressBar from "../ui/progress-bar";
import {
  useToast,
  useDisclosure,
  Box,
  Flex,
  Text,
  Badge,
  Button,
  VStack,
  HStack,
  Avatar,
} from "@chakra-ui/react";
import { ConfirmationModal } from "../ui/confirmation";

const GroupCard: React.FC<GroupType> = ({
  id,
  name,
  image,
  number_of_members,
  location,
  note,
  description,
  member_count,
  is_joined,
  status,
  is_applied,
}) => {
  const router = useRouter();
  const toast = useToast();
  const [isJoined, setIsJoined] = useState(is_joined);
  const [isApplied, setIsApplied] = useState(is_applied);
  const [memberCount, setMemberCount] = useState(member_count);

  const imagePrefix = process.env.NEXT_PUBLIC_API_ENDPOINT;
  const [isFull, setIsFull] = useState(member_count >= number_of_members);
  const progressPercentage = useMemo(
    () => (memberCount / number_of_members) * 100,
    [memberCount, number_of_members]
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDetailGroup = () => router.push(`/group/${id}`);

  const handleJoinGroup = async () => {
    onOpen(); // Open the confirmation modal
  };

  const confirmJoinGroup = async () => {
    onClose(); // Close the confirmation modal
    try {
      const response = await groupApiRequest.joinGroup({ group_id: id });
      if (response.status === 200) {
        if (status === "public") {
          setIsJoined(true);
          setMemberCount(memberCount + 1);
          setIsFull(memberCount + 1 === number_of_members);
          toast({
            title: "Joined group successfully",
            description: "You have joined the group.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        } else if (status === "private") {
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

  return (
    <Box className="bg-white dark:bg-slate-700 shadow-md rounded-lg p-6 transition-all duration-300 hover:translate-y-[-5px] hover:shadow-lg h-[350px] flex flex-col justify-between">
      <VStack spacing={4} align="stretch" flex="1" overflow="hidden">
        <Flex alignItems="center" cursor="pointer" onClick={handleDetailGroup}>
          <Avatar
            src={
              image
                ? `${imagePrefix}${image}`
                : "/images/default-group-avatar.png"
            }
            name={name || "Group"}
            size="lg"
            mr={4}
          />
          <VStack align="start" spacing={1}>
            <Text className="text-xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-400 dark:hover:text-blue-300 truncate">
              {name || "Unnamed Group"}
            </Text>
            <HStack spacing={2}>
              <Badge colorScheme={status === "public" ? "green" : "gray"}>
                {status === "public" ? "Public" : "Private"}
              </Badge>
              <Badge colorScheme="blue">
                {location || "Location not specified"}
              </Badge>
            </HStack>
          </VStack>
        </Flex>
        <Text className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
          {description || "No description available"}
        </Text>
        <Text className="text-sm italic font-medium text-gray-700 dark:text-gray-300 line-clamp-2">
          Note: {note || "No notes"}
        </Text>
      </VStack>
      <Box mt={4}>
        <ProgressBar percentage={progressPercentage} />
        <Flex justifyContent="space-between" alignItems="center" mt={2}>
          <Text className="text-sm text-gray-600 dark:text-gray-400">
            {memberCount} Applied{" "}
            <Text as="span" className="text-gray-400 dark:text-gray-500">
              of {number_of_members || "unknown"}
            </Text>
          </Text>
          {!isJoined && !isFull && !isApplied && (
            <Button
              colorScheme="blue"
              size="sm"
              onClick={handleJoinGroup}
              className="dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Join group
            </Button>
          )}
          {isFull && !isJoined && (
            <Button colorScheme="gray" size="sm" isDisabled>
              Full members
            </Button>
          )}
          {isJoined && (
            <Button
              colorScheme="green"
              size="sm"
              onClick={handleDetailGroup}
              isDisabled
            >
              Joined
            </Button>
          )}
          {isApplied && (
            <Button
              colorScheme="yellow"
              size="sm"
              onClick={handleDetailGroup}
              isDisabled
            >
              Applied
            </Button>
          )}
        </Flex>
      </Box>
      <ConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={confirmJoinGroup}
        title={status === "public" ? "Join Group" : "Request to join group"}
        message={
          status === "public"
            ? `Are you sure you want to join the group "${name}"?`
            : `Are you sure you want to send a request to join the group "${name}"?
              You will be notified if the group owner approves your request.`
        }
      />
    </Box>
  );
};

export default React.memo(GroupCard);
