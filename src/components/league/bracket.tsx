import React, { useRef, useState, useEffect } from "react";
import { Box, Text } from "@chakra-ui/react";
import RoundRobinBracket from "./round-robin";
import { SingleEliminationBracket, DoubleEliminationBracket, Match, MATCH_STATES, SVGViewer } from '@g-loot/react-tournament-brackets';
import Bracket from "../ui/schedule";

interface LeagueBracketProps {
  leagueId?: number;
}

const matches = [
  {
    id: 19753,
    nextMatchId: null,
    tournamentRoundText: '3',
    startTime: '01/05/2024',
    state: 'SCHEDULED',
    participants: [],
  },
  {
    id: 19754,
    nextMatchId: 19753,
    tournamentRoundText: '2',
    startTime: '01/05/2024',
    state: 'SCHEDULED',
    participants: [
      {
        id: '14754a1a-932c-4992-8dec-f7f94a339960',
        resultText: null,
        isWinner: false,
        status: null,
        name: 'CoKe BoYz',
        picture: 'teamlogos/client_team_default_logo',
      },
    ],
  },
  {
    id: 19755,
    nextMatchId: 19754,
    tournamentRoundText: '1',
    startTime: '01/05/2024',
    state: 'SCORE_DONE',
    participants: [
      {
        id: '14754a1a-932c-4992-8dec-f7f94a339960',
        resultText: 'Won',
        isWinner: true,
        status: 'PLAYED',
        name: 'CoKe BoYz',
        picture: 'teamlogos/client_team_default_logo',
      },
      {
        id: 'd16315d4-7f2d-427b-ae75-63a1ae82c0a8',
        resultText: 'Lost',
        isWinner: false,
        status: 'PLAYED',
        name: 'Aids Team',
        picture: 'teamlogos/client_team_default_logo',
      },
    ],
  },
  {
    id: 19756,
    nextMatchId: 19754,
    tournamentRoundText: '1',
    startTime: '01/05/2024',
    state: 'RUNNING',
    participants: [
      {
        id: 'd8b9f00a-0ffa-4527-8316-da701894768e',
        resultText: null,
        isWinner: false,
        status: null,
        name: 'Art of kill',
        picture: 'teamlogos/client_team_default_logo',
      },
    ],
  },
  {
    id: 19757,
    nextMatchId: 19753,
    tournamentRoundText: '2',
    startTime: '01/05/2024',
    state: 'SCHEDULED',
    participants: [],
  },
  {
    id: 19758,
    nextMatchId: 19757,
    tournamentRoundText: '1',
    startTime: '01/05/2024',
    state: 'SCHEDULED',
    participants: [
      {
        id: '9397971f-4b2f-44eb-a094-722eb286c59b',
        resultText: null,
        isWinner: false,
        status: null,
        name: 'Crazy Pepes',
        picture: 'teamlogos/client_team_default_logo',
      },
    ],
  },
  {
    id: 19759,
    nextMatchId: 19757,
    tournamentRoundText: '1',
    startTime: '01/05/2024',
    state: 'SCHEDULED',
    participants: [
      {
        id: '42fecd89-dc83-4821-80d3-718acb50a30c',
        resultText: null,
        isWinner: false,
        status: null,
        name: 'BLUEJAYS',
        picture: 'teamlogos/client_team_default_logo',
      },
      {
        id: 'df01fe2c-18db-4190-9f9e-aa63364128fe',
        resultText: null,
        isWinner: false,
        status: null,
        name: 'Bosphorus',
        picture: 'teamlogos/r7zn4gr8eajivapvjyzd',
      },
    ],
  },
];



const LeagueBracket: React.FC<LeagueBracketProps> = ({ leagueId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 500 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  return (
    <Box ref={containerRef} height="80vh">
      <Text>League Bracket (ID: {leagueId})</Text>
      {/* Add bracket visualization logic here */}
      {/* <RoundRobinBracket teams={teams} matches={matches} /> */}

      <SingleEliminationBracket
        matches={matches}
        matchComponent={Match}
        svgWrapper={({ children, ...props }: any) => (
          <SVGViewer width={dimensions.width} height={dimensions.height} {...props}>
            {children}
          </SVGViewer>
        )}
      />
    </Box>
  );
};

export default LeagueBracket;
