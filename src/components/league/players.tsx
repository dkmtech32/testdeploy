import React, { useState, useEffect, useRef } from 'react';
import { Box, Text, VStack, HStack, Button, Avatar, Wrap, WrapItem } from '@chakra-ui/react';

interface LeaguePlayerListProps {
  leagueId?: number;
}

interface Player {
  id: number;
  name: string;
  avatarUrl?: string;
}

const LeaguePlayerList: React.FC<LeaguePlayerListProps> = ({ leagueId }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const [highlightedLetter, setHighlightedLetter] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Fetch players from API based on leagueId
    // For now, we'll use dummy data
    const dummyPlayers = [
      { id: 1, name: 'Alice Smith', avatarUrl: 'https://example.com/alice.jpg' },
      { id: 2, name: 'Bob Johnson', avatarUrl: 'https://example.com/bob.jpg' },
      { id: 3, name: 'Charlie Brown', avatarUrl: 'https://example.com/charlie.jpg' },
      { id: 4, name: 'Diana Green', avatarUrl: 'https://example.com/diana.jpg' },
      { id: 5, name: 'Ethan White', avatarUrl: 'https://example.com/ethan.jpg' },
      { id: 6, name: 'Fiona Black', avatarUrl: 'https://example.com/fiona.jpg' },
      { id: 7, name: 'George Blue', avatarUrl: 'https://example.com/george.jpg' },
      { id: 8, name: 'Hannah Red', avatarUrl: 'https://example.com/hannah.jpg' },
      { id: 9, name: 'Ian Yellow', avatarUrl: 'https://example.com/ian.jpg' },
      { id: 10, name: 'Jasmine Purple', avatarUrl: 'https://example.com/jasmine.jpg' },
      { id: 11, name: 'Kyle Orange', avatarUrl: 'https://example.com/kyle.jpg' },
      { id: 12, name: 'Lily Pink', avatarUrl: 'https://example.com/lily.jpg' }, 
      { id: 13, name: 'Mason Gray', avatarUrl: 'https://example.com/mason.jpg' }, 
      { id: 14, name: 'Nora Silver', avatarUrl: 'https://example.com/nora.jpg' }, 
      { id: 15, name: 'Oscar Gold', avatarUrl: 'https://example.com/oscar.jpg' }, 
      { id: 16, name: 'Penelope Ruby', avatarUrl: 'https://example.com/penelope.jpg' }, 
      { id: 17, name: 'Quinn Emerald', avatarUrl: 'https://example.com/quinn.jpg' }, 
      { id: 18, name: 'Riley Sapphire', avatarUrl: 'https://example.com/riley.jpg' }, 
      { id: 19, name: 'Samantha Topaz', avatarUrl: 'https://example.com/samantha.jpg' }, 
      { id: 20, name: 'Tate Turquoise', avatarUrl: 'https://example.com/tate.jpg' }, 
      { id: 21, name: 'Uma Indigo', avatarUrl: 'https://example.com/uma.jpg' }, 
      { id: 22, name: 'Vincent Violet', avatarUrl: 'https://example.com/vincent.jpg' }, 
      { id: 23, name: 'Wren Blue', avatarUrl: 'https://example.com/wren.jpg' }, 
      { id: 24, name: 'Xander Crimson', avatarUrl: 'https://example.com/xander.jpg' }, 
      { id: 25, name: 'Yara Coral', avatarUrl: 'https://example.com/yara.jpg' }, 
      { id: 26, name: 'Zane Diamond', avatarUrl: 'https://example.com/zane.jpg' }, 
      { id: 27, name: 'Ava White', avatarUrl: 'https://example.com/ava.jpg' }, 
      { id: 28, name: 'Ben Black', avatarUrl: 'https://example.com/ben.jpg' }, 
      { id: 29, name: 'Cora Ruby', avatarUrl: 'https://example.com/cora.jpg' }, 
      { id: 30, name: 'Dylan Emerald', avatarUrl: 'https://example.com/dylan.jpg' }, 
      { id: 31, name: 'Ella Ruby', avatarUrl: 'https://example.com/ella.jpg' }, 
      { id: 32, name: 'Finn Emerald', avatarUrl: 'https://example.com/finn.jpg' }, 
      { id: 33, name: 'Gia Sapphire', avatarUrl: 'https://example.com/gia.jpg' }, 
      { id: 34, name: 'Hank Topaz', avatarUrl: 'https://example.com/hank.jpg' }, 
      { id: 35, name: 'Ivy Turquoise', avatarUrl: 'https://example.com/ivy.jpg' }, 
      { id: 36, name: 'Jack Indigo', avatarUrl: 'https://example.com/jack.jpg' }, 
      { id: 37, name: 'Kai Violet', avatarUrl: 'https://example.com/kai.jpg' }, 
      { id: 38, name: 'Luna White', avatarUrl: 'https://example.com/luna.jpg' }, 
      { id: 39, name: 'Milo Black', avatarUrl: 'https://example.com/milo.jpg' },   
      { id: 40, name: 'Nora Ruby', avatarUrl: 'https://example.com/nora.jpg' }, 
      { id: 41, name: 'Owen Emerald', avatarUrl: 'https://example.com/owen.jpg' }, 
      { id: 42, name: 'Paisley Topaz', avatarUrl: 'https://example.com/paisley.jpg' }, 
      { id: 43, name: 'Quinn Turquoise', avatarUrl: 'https://example.com/quinn.jpg' }, 
      { id: 44, name: 'Riley Indigo', avatarUrl: 'https://example.com/riley.jpg' }, 
      { id: 45, name: 'Samantha Violet', avatarUrl: 'https://example.com/samantha.jpg' }, 
      { id: 46, name: 'Tate Sapphire', avatarUrl: 'https://example.com/tate.jpg' }, 
      { id: 47, name: 'Uma Topaz', avatarUrl: 'https://example.com/uma.jpg' }, 
      { id: 48, name: 'Vincent Turquoise', avatarUrl: 'https://example.com/vincent.jpg' },   
      { id: 49, name: 'Wren Indigo', avatarUrl: 'https://example.com/wren.jpg' }, 
      { id: 50, name: 'Xander Violet', avatarUrl: 'https://example.com/xander.jpg' }, 
      { id: 51, name: 'Yara Sapphire', avatarUrl: 'https://example.com/yara.jpg' }, 
      { id: 52, name: 'Zane Turquoise', avatarUrl: 'https://example.com/zane.jpg' }, 
      { id: 53, name: 'Ava Indigo', avatarUrl: 'https://example.com/ava.jpg' }, 
      { id: 54, name: 'Ben Violet', avatarUrl: 'https://example.com/ben.jpg' }, 
      { id: 55, name: 'Cora Ruby', avatarUrl: 'https://example.com/cora.jpg' }, 
      { id: 56, name: 'Dylan Emerald', avatarUrl: 'https://example.com/dylan.jpg' }, 
      { id: 57, name: 'Ella Ruby', avatarUrl: 'https://example.com/ella.jpg' }, 
      
      // ... add more players
    ];
    setPlayers(dummyPlayers);
  }, [leagueId]);

  const groupedPlayers = players.reduce((acc, player) => {
    const firstChar = player.name[0].toUpperCase();
    if (!acc[firstChar]) acc[firstChar] = [];
    acc[firstChar].push(player);
    return acc;
  }, {} as Record<string, Player[]>);

  const scrollToLetter = (letter: string) => {
    const element = document.getElementById(`letter-${letter}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setHighlightedLetter(letter);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        setHighlightedLetter(null);
      }, 2000); // Remove highlight after 2 seconds
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>League Player List (ID: {leagueId})</Text>
      
      <HStack spacing={2} overflowX="auto" pb={2} mb={4}>
        {alphabet.map((letter) => (
          <Button key={letter} size="sm" onClick={() => scrollToLetter(letter)}>
            {letter}
          </Button>
        ))}
      </HStack>

      {/* <VStack align="stretch" spacing={4} maxHeight="600px" overflowY="auto"> */}
        {alphabet.map((letter) => {
          const playersForLetter = groupedPlayers[letter] || [];
          if (playersForLetter.length === 0) return null;

          return (
            <Box
              key={letter}
              id={`letter-${letter}`}
              p={4}
              m={4}
              bg={highlightedLetter === letter ? "yellow.200" : "gray.200"}
              borderRadius="md"
              boxShadow="md"
              transition="background-color 0.3s ease-in-out"
            >
              <Text fontSize="xl" fontWeight="bold" mb={2}>{letter}</Text>
              <Wrap spacing={4}>
                {playersForLetter.map((player) => (
                  <WrapItem key={player.id}>
                    <HStack pl={4} mb={2}>
                      <Avatar size="sm" name={player.name} src={player.avatarUrl} />
                      <Text fontSize="sm" fontWeight="bold">{player.name}</Text>
                    </HStack>
                  </WrapItem>
                ))}
              </Wrap>
            </Box>
          );
        })}
      {/* </VStack> */}
    </Box>
  );
};

export default LeaguePlayerList;