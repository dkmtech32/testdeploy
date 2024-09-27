import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  Avatar,
  Flex,
  Grid,
} from '@chakra-ui/react';
import { TrainingUserList } from '@/schemaValidations/training.schema';

interface PlayerListModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: TrainingUserList;
  trainingName: string;
}

export const PlayerListModal: React.FC<PlayerListModalProps> = ({ isOpen, onClose, players, trainingName }) => {
  const groupedPlayers = players.reduce((acc, player) => {
    const status = player.status_request || 'Unknown';
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(player);
    return acc;
  }, {} as Record<string, typeof players>);

  const imagePrefix = process.env.NEXT_PUBLIC_API_ENDPOINT;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent className="bg-white dark:bg-gray-800">
        <ModalHeader className="bg-blue-600 text-white dark:bg-blue-800 rounded-t-md">
          {trainingName} - Players
        </ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody className="py-6">
          <Grid templateColumns="1fr 1fr" gap={6}>
            <PlayerList
              title="Accepted"
              players={groupedPlayers['1'] || []}
              imagePrefix={imagePrefix}
            />
            <PlayerList
              title="Pending"
              players={groupedPlayers['0'] || []}
              imagePrefix={imagePrefix}
            />
          </Grid>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

interface PlayerListProps {
  title: string;
  players: TrainingUserList;
  imagePrefix: string | undefined;
}

const PlayerList: React.FC<PlayerListProps> = ({ title, players, imagePrefix }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-300">
        {title}
      </h2>
      <VStack spacing={4} align="stretch">
        {players.map((player) => (
          <div key={player.id} className="p-3 border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600">
            <Flex justifyContent="space-between" alignItems="center">
              <Flex alignItems="center">
                <Avatar 
                  src={player.users.profile_photo_path ? `${imagePrefix}${player.users.profile_photo_path}` : '/images/default-avatar.png'} 
                  name={player.users.name} 
                  size="md" 
                  className="mr-3"
                />
                <div>
                  <p className="font-bold text-lg text-gray-800 dark:text-white">{player.users.name}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    player.status_request === '1' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                  }`}>
                    {player.status_request === '1' ? 'Accepted' : 'Pending'}
                  </span>
                </div>
              </Flex>
              <div className="text-right">
                {player.acconpanion !== null && (
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-semibold">Accompanion:</span> {player.acconpanion ? player.acconpanion : 'No'}
                  </p>
                )}
                {player.note && (
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-semibold">Note:</span> {player.note}
                  </p>
                )}
              </div>
            </Flex>
          </div>
        ))}
      </VStack>
    </div>
  );
};