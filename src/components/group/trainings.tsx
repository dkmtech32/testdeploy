"use client";
import React, { useState, useEffect } from 'react';
import { Input, Select, Box, Flex, Heading, VStack, Text, Container, InputGroup, InputLeftElement, Button } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import groupApiRequest from '@/apiRequests/group';
import TrainingCard from '../training/traning-card';
import { GroupTrainingListResType } from '@/schemaValidations/group.schema';

const TrainingList: React.FC<{ id: number }> = ({ id }) => {
  const [trainings, setTrainings] = useState<GroupTrainingListResType['data']>([]);
  const [filteredTrainings, setFilteredTrainings] = useState<GroupTrainingListResType['data']>([]);
  const [searchTerm, setSearchTerm] = useState('');
  // Removed: const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [isShowingAllTrainings, setIsShowingAllTrainings] = useState(false);

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const response = await groupApiRequest.getListUpcomingGroupTrainingByGroup(id);
        setTrainings(response.payload.data);
        setFilteredTrainings(response.payload.data);
      } catch (error) {
        console.error('Failed to fetch trainings:', error);
      }
    };

    fetchTrainings();
  }, [id]);

  const handleShowAllTrainings = async () => {
    try {
      const response = await groupApiRequest.getListGroupTrainingByGroup(id);
      setTrainings(response.payload.data);
      setFilteredTrainings(response.payload.data);
      setIsShowingAllTrainings(true);
    } catch (error) {
      console.error('Failed to fetch all trainings:', error);
    }
  };

  useEffect(() => {
    let result = trainings;

    // Apply search filter
    if (searchTerm) {
      result = result.filter(training =>
        training.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        training.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Removed: Status filter

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'memberCount') {
        return b.members - a.members;
      }
      return 0;
    });

    setFilteredTrainings(result);
  }, [searchTerm, sortBy, trainings]);

  return (
    <Container maxW="container.xl" py={8} className="dark:bg-gray-900">
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="2xl" className="text-blue-600 dark:text-blue-400 text-center">
          Trainings
        </Heading>
        <Flex direction={["column", "row"]} gap={4} mb={8}>
          <InputGroup flex={2}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon className="text-gray-300 dark:text-gray-500" />
            </InputLeftElement>
            <Input
              placeholder="Search trainings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 focus:border-blue-400 dark:focus:border-blue-400 focus:shadow-outline-blue dark:focus:shadow-outline-blue"
            />
          </InputGroup>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            flex={2}
            className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 focus:border-blue-400 dark:focus:border-blue-400 focus:shadow-outline-blue dark:focus:shadow-outline-blue w-full md:w-auto"
          >
            <option value="name">Sort by Name</option>
            <option value="memberCount">Sort by Member Count</option>
          </Select>
        </Flex>
        {filteredTrainings.length > 0 ? (
          <>
            <Flex flexWrap="wrap" gap={6} justifyContent="center">
              {filteredTrainings.map(training => (
                <Box key={training.id} width={["100%", "calc(50% - 12px)", "calc(33.33% - 16px)", "calc(25% - 18px)"]}>
                  <TrainingCard {...training} />
                </Box>
              ))}
            </Flex>
            {!isShowingAllTrainings && (
              <Box textAlign="center" mt={6}>
                <Button
                  onClick={handleShowAllTrainings}
                  colorScheme="blue"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  Show All Trainings
                </Button>
              </Box>
            )}
          </>
        ) : (
          <Box textAlign="center" py={10}>
            <Text fontSize="xl" className="text-gray-500 dark:text-gray-400">No trainings found</Text>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default TrainingList;
