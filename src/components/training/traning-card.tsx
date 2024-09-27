import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ProgressBar from "../ui/progress-bar";
import { useToast, useDisclosure, Box, Text, Flex, Badge, Button } from "@chakra-ui/react";
import groupApiRequest from "@/apiRequests/group";
import { TrainingConfirmationModal } from "../ui/training-confirmation";
import { Training, TrainingUserList } from "@/schemaValidations/training.schema";
import { PlayerListModal } from "./traning-detail-modal";

const TrainingCard: React.FC<Training> = ({
  id,
  name,
  location,
  note,
  description,
  member_count,
  start_time,
  end_time,
  date,
  number_of_courts,
  payment,
  members,
  is_joined,
  is_applied,

}) => {
  const router = useRouter();
  const toast = useToast();
  const [memberCount, setMemberCount] = useState(member_count);
  const [isJoined, setIsJoined] = useState(is_joined);
  const [isApplied, setIsApplied] = useState(is_applied);
  const [isFull, setIsFull] = useState(memberCount >= members);
  const [players, setPlayers] = useState<TrainingUserList>([]);

  const imagePrefix = process.env.NEXT_PUBLIC_API_ENDPOINT;
  const progressPercentage = useMemo(
    () => (memberCount / members) * 100,
    [memberCount, members]
  );

  const { isOpen: isConfirmationOpen, onOpen: onConfirmationOpen, onClose: onConfirmationClose } = useDisclosure();
  const { isOpen: isPlayerListOpen, onOpen: onPlayerListOpen, onClose: onPlayerListClose } = useDisclosure();

  const handleDetailTraining = async () => {
    try {
      const response = await groupApiRequest.getListPlayerGroupTraining(id);
      if (response.payload.success) {
        setPlayers(response.payload.data);
        onPlayerListOpen();
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch training details.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error fetching training details:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleJoinTraining = () => {
    onConfirmationOpen();
  };

  const confirmJoinTraining = async (companionNumber: number, note: string) => {
    onConfirmationClose();
    try {
      const response = await groupApiRequest.joinGroupTraining({
        group_training_id: id.toString(),
        acconpanion: companionNumber,
        note: note
      });
      if (response.payload.success) {
        if (payment === "0" || payment === null) {
          setIsJoined(true);
          setMemberCount(memberCount + 1 + companionNumber);
          setIsFull(memberCount + 1 + companionNumber >= members);
          toast({
            title: "Joined training successfully",
            description: `You have joined the training with ${companionNumber} companion(s).`,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        } else if (payment === "1") {
          setIsApplied(true);
          toast({
            title: "Request sent",
            description:
              "You have sent a request to join the training. Please pay for the training to confirm your participation.",
            status: "warning",
            duration: 5000,
            isClosable: true,
          });
        }
      }
      else if (response.payload.success === false) {
        toast({
          title: "Error",
          description: response.payload.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
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
    <Box
      className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 transition-all duration-300 hover:translate-y-[-5px] hover:shadow-lg h-full flex flex-col justify-between"
    >
      <Box>
        <Flex alignItems="center" mb={4}>
          <Text
            className="text-xl font-bold text-blue-600 dark:text-blue-400 cursor-pointer hover:text-blue-400 dark:hover:text-blue-300 truncate"
            onClick={handleDetailTraining}
          >
            {name || "Unnamed Training"}
          </Text>
        </Flex>
        <Text className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2">
          {description || "No description available"}
        </Text>
        <Flex flexWrap="wrap" gap={2} mb={4}>
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">{location || "Location not specified"}</Badge>
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">{date || "Date not specified"}</Badge>
          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">{`${start_time || "?"} - ${end_time || "?"}`}</Badge>
        </Flex>
        <Text className="text-sm text-gray-600 dark:text-gray-300 mb-1">
          Courts: {number_of_courts || "Not specified"}
        </Text>
        <Text className="text-sm italic font-medium text-gray-700 dark:text-gray-200 mb-2">
          Note: {note || "No notes"}
        </Text>
        <Text className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Payment: {payment === "1" ? "Required" : "Later"}
        </Text>
      </Box>
      <Box>
        <ProgressBar percentage={progressPercentage} />
        <Flex justifyContent="space-between" alignItems="center" mt={2}>
          <Text className="text-sm text-gray-600 dark:text-gray-300">
            {memberCount} Applied <Text as="span" className="text-gray-400 dark:text-gray-500">of {members || "unknown"}</Text>
          </Text>
          {!isJoined && !isFull && !isApplied && (
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700 text-sm px-4 py-2 rounded"
              onClick={handleJoinTraining}
            >
              Join training
            </Button>
          )}
          {isFull && !isJoined && (
            <Button
              className="bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-300 text-sm px-4 py-2 rounded cursor-not-allowed"
              disabled
            >
              Full members
            </Button>
          )}
          {isJoined && (
            <Button
              className="bg-green-500 text-white dark:bg-green-600 text-sm px-4 py-2 rounded cursor-not-allowed"
              onClick={handleDetailTraining}
              disabled
            >
              Joined
            </Button>
          )}
          {isApplied && (
            <Button
              className="bg-yellow-500 text-white dark:bg-yellow-600 text-sm px-4 py-2 rounded cursor-not-allowed"
              onClick={handleDetailTraining}
              disabled
            >
              Applied
            </Button>
          )}
        </Flex>
      </Box>
      <TrainingConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={onConfirmationClose}
        onConfirm={confirmJoinTraining}
        title="Join Training"
        message={`Are you sure you want to join the training "${name}"?`}
      />
      <PlayerListModal
        isOpen={isPlayerListOpen}
        onClose={onPlayerListClose}
        players={players}
        trainingName={name}
      />
    </Box>
  );
};

export default TrainingCard;
