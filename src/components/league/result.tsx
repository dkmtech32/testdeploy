import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import TournamentResults from '../ui/result';

interface LeagueResultProps {
  leagueId?: number;
}

const groupScheduleData = {
  "Round 1": [
    {
      match: 1,
      time: '10:00 AM',
      date: '2024-09-15',
      player1Team1: { name: 'Player A1', profile_photo_path: '/images/default-avatar.png' },
      player2Team1: { name: 'Player A2', profile_photo_path: '/images/logo-pkb.png' },
      player1Team2: { name: 'Player B1', profile_photo_path: '/images/default-avatar.png' },
      player2Team2: { name: 'Player B2', profile_photo_path: '/images/logo-pkb.png' },
      set_1_team_1: 21,
      set_1_team_2: 15,
      set_2_team_1: 18,
      set_2_team_2: 21,
      set_3_team_1: 15,
      set_3_team_2: 21,
      result_team_1: 1,
      result_team_2: 2,
      winner: 2
    },
    {
      match: 2,
      time: '11:00 AM',
      date: '2024-09-15',
      player1Team1: { name: 'Player C1', profile_photo_path: '/images/default-avatar.png' },
      player1Team2: { name: 'Player D1', profile_photo_path: '/images/default-avatar.png' },
      set_1_team_1: 21,
      set_1_team_2: 19,
      result_team_1: 2,
      result_team_2: 0,
      winner: 1
    }
  ],
  "Round 2": [
    {
      match: 3,
      time: '12:00 PM',
      date: '2024-09-15',
      player1Team1: { name: 'Player E1', profile_photo_path: '/images/default-avatar.png' },
      player1Team2: { name: 'Player F1', profile_photo_path: '/images/default-avatar.png' },
      set_1_team_1: 21,
      set_1_team_2: 15,
      result_team_1: 2,
      result_team_2: 0,
      winner: 1
    }
  ]
};

const LeagueResult: React.FC<LeagueResultProps> = ({ leagueId }) => {
  return (
    <Box>
      <Text>League Results (ID: {leagueId})</Text>
      {/* Add result display logic here */}
      <TournamentResults groupSchedule={groupScheduleData} />
    </Box>
  );
};

export default LeagueResult;