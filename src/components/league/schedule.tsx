import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import Schedule from '../ui/schedule';

interface LeagueScheduleProps {
  leagueId?: number;
}
const groupRoundData = {
  round1: [
    {
      player1Team1: { name: 'Team A1', avatar: '/images/default-avatar.png' },
      player2Team1: { name: 'Team C1', avatar: '/images/default-avatar.png' },
      player1Team2: { name: 'Team B1', avatar: '/images/default-avatar.png' },
      player2Team2: { name: 'Team D1', avatar: '/images/default-avatar.png' },
      date: '2024-05-01',
      time: '10:00 AM',
    },
    {
      player1Team1: { name: 'Team A2', avatar: '/images/default-avatar.png' },
      player2Team1: { name: 'Team C2', avatar: '/images/default-avatar.png' },
      player1Team2: { name: 'Team B2', avatar: '/images/default-avatar.png' },
      player2Team2: { name: 'Team D2', avatar: '/images/default-avatar.png' },
      date: '2024-05-01',
      time: '10:00 AM',
    },
  ],
  round2: [
    {
      player1Team1: { name: 'Winner A1' },
      player1Team2: { name: 'Winner B1' },
      
    },
  ],
};
const leagueInfor = 'doubles';

const LeagueSchedule: React.FC<LeagueScheduleProps> = ({ leagueId }) => {
  return (
    <Box>
      <Text>League Schedule (ID: {leagueId})</Text>
      <Schedule groupRound={groupRoundData} leagueInfor={leagueInfor} />
    </Box>
  );
};

export default LeagueSchedule;