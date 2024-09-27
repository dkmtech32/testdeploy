"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Checkbox,
  FormControl,
  FormLabel,
  Text,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Container,
  VStack,
  HStack,
  Wrap,
  WrapItem,
  Image,
  SimpleGrid,
  Flex,
} from "@chakra-ui/react";
import leagueApiRequest from "@/apiRequests/league";
import { LeagueResType } from "@/schemaValidations/league.schema";
import dynamic from 'next/dynamic';
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTrophy,
  FaUsers,
  FaVolleyballBall,
  FaInfoCircle,
} from "react-icons/fa";

const DynamicLeagueBracket = dynamic(() => import('./bracket'), { ssr: false });
const DynamicLeagueResult = dynamic(() => import('./result'), { ssr: false });
const DynamicLeagueSchedule = dynamic(() => import('./schedule'), { ssr: false });
const DynamicLeaguePlayerList = dynamic(() => import('./players'), { ssr: false });

export default function LeagueDetail({ slug }: { slug: string }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const [isJoined, setIsJoined] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const [league, setLeague] = useState<LeagueResType["data"]>();

  const imagePrefix = process.env.NEXT_PUBLIC_API_ENDPOINT;
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const response = await leagueApiRequest.getHomeLeagueDetail(slug);
        if (response.status === 200) {
          const data = await response;
          setLeague(data.payload.data);
          setIsJoined(data.payload.data.is_joined);
          setIsApplied(data.payload.data.is_applied);
          setUserCount(data.payload.data.user_leagues.filter(user => user.status === 'active').length);
          setIsFull(data.payload.data.is_full);
        } else {
          throw new Error("Failed to fetch league data");

        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [slug]);

  const handleRegister = async () => {
    if (!confirmChecked) {
      toast({
        title: "Confirmation Required",
        description: "Please confirm the registration by checking the box.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await leagueApiRequest.registerUser({
        league_id: league?.id,
      });
      if (response.status === 200) {
        toast({
          title: "Registration Successful",
          description: "You have been registered into the league.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setIsApplied(true);
      } else {
        throw new Error("Registration failed");

      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Container maxW="container.xl" p={{ base: 2, md: 4 }}>
      <VStack spacing={{ base: 4, md: 6 }} align="stretch">
        <Box bg="white" borderRadius="lg" shadow="lg" p={{ base: 3, md: 6 }}>
          <Flex
            direction={{ base: "column", md: "row" }}
            gap={{ base: 4, md: 6 }}
          >
            <Box
              borderRadius="md"
              overflow="hidden"
              w={{ base: "100%", md: "50%" }}
              maxW={{ md: "350px", lg: "450px", xl: "500px" }}
              h={{ base: "200px", md: "auto" }}
            >
              <Image
                src={
                  league?.images
                    ? imagePrefix + league.images
                    : "/images/logo-pkb.png"
                }
                alt={league?.name}
                objectFit="cover"
                w="100%"
                h="100%"
              />
            </Box>
            <VStack align="stretch" spacing={{ base: 3, md: 4 }} flex="1">
              <Text
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="bold"
                color="blue.600"
              >
                {league?.name}
              </Text>
              <SimpleGrid
                columns={{ base: 1, sm: 2 }}
                spacing={{ base: 2, md: 3 }}
              >
                <InfoItem
                  label="Start Date"
                  value={formatDate(league?.start_date)}
                  icon={<FaCalendarAlt />}
                />
                <InfoItem
                  label="End Date"
                  value={formatDate(league?.end_date)}
                  icon={<FaCalendarAlt />}
                />
                <InfoItem
                  label="Location"
                  value={league?.location || "-"}
                  icon={<FaMapMarkerAlt />}
                />
                <InfoItem
                  label="Format"
                  value={formatLeagueFormat(league?.format_of_league)}
                  icon={<FaVolleyballBall />}
                />
                <InfoItem
                  label="Type"
                  value={formatLeagueType(league?.type_of_league)}
                  icon={<FaInfoCircle />}
                />
                <InfoItem
                  label="Prize"
                  value={formatPrize(league?.money)}
                  icon={<FaTrophy />}
                />
                <InfoItem
                  label="Number of Athletes"
                  value={
                    league?.number_of_athletes
                      ? `${userCount} / ${league?.number_of_athletes}`
                      : "-"
                  }
                  icon={<FaUsers />}
                />
              </SimpleGrid>
              <Button
                colorScheme="blue"
                onClick={!isJoined && !isApplied && !isFull ? onOpen : undefined}
                isDisabled={isJoined || isApplied || isFull}
                size={{ base: "md", md: "lg" }}
                w="full"
                mt={{ base: 2, md: 4 }}
              >
                {isFull ? "Full" :
                 isJoined ? "Registered" :
                 isApplied ? "Applied" : "Register"}
              </Button>
            </VStack>
          </Flex>



        </Box>

        <Tabs variant="enclosed" isLazy>
          <TabList overflowX="auto" overflowY="hidden" whiteSpace="nowrap">
            <Tab>Bracket</Tab>
            <Tab>Result</Tab>
            <Tab>Schedule</Tab>
            <Tab>Player List</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <DynamicLeagueBracket leagueId={league?.id} />
            </TabPanel>
            <TabPanel>
              <DynamicLeagueResult leagueId={league?.id} />
            </TabPanel>
            <TabPanel>
              <DynamicLeagueSchedule leagueId={league?.id} />
            </TabPanel>
            <TabPanel>
              <DynamicLeaguePlayerList leagueId={league?.id} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Registration</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to register for the league?</Text>
            <Text>
              <strong>League Name:</strong> {league?.name}
            </Text>
            <Text>
              <strong>Start Date:</strong> {formatDate(league?.start_date)}
            </Text>
            <Text>
              <strong>End Date:</strong> {formatDate(league?.end_date)}
            </Text>
            <Text>
              <strong>Location:</strong> {league?.location}
            </Text>
            <FormControl mt={4}>
              <FormLabel>
                I confirm the above information and want to register.
              </FormLabel>
              <Checkbox
                isChecked={confirmChecked}
                onChange={(e) => setConfirmChecked(e.target.checked)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleRegister}
              isLoading={loading}
              disabled={!confirmChecked}
            >
              Confirm
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}

// Helper functions for formatting
const formatDate = (date?: string) =>
  date ? new Date(date).toLocaleDateString("en-GB") : "-";
const formatLeagueFormat = (format?: string) => {
  switch (format) {
    case "league-single-limination":
      return "Single Elimination";
    case "league-round":
      return "Round Robin";
    default:
      return "Unknown";
  }
};
const formatLeagueType = (type?: string) => {
  switch (type) {
    case "male-singles":
      return "Male Singles";
    case "male-doubles":
      return "Male Doubles";
    case "female-singles":
      return "Female Singles";
    case "female-doubles":
      return "Female Doubles";
    case "mixed-doubles":
      return "Mixed Doubles";
    default:
      return "Unknown";
  }
};
const formatPrize = (money?: number) =>
  money ? `${money.toLocaleString()} VND` : "-";

const InfoItem = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactElement;
}) => (
  <HStack spacing={3} p={{ base: 2, md: 3 }} bg="gray.50" borderRadius="md">
    <Box color="blue.500">{React.cloneElement(icon, { size: 18 })}</Box>
    <Box>
      <Text
        fontWeight="bold"
        color="gray.600"
        fontSize={{ base: "xs", md: "sm" }}
      >
        {label}
      </Text>
      <Text fontSize={{ base: "sm", md: "md" }} color="gray.800">
        {value}
      </Text>
    </Box>
  </HStack>
);
