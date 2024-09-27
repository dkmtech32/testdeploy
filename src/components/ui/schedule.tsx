import Image from 'next/image';
import React from 'react';

// Define TypeScript interfaces for data structures
interface Match {
  player1Team1?: Player;
  player2Team1?: Player;
  player1Team2?: Player;
  player2Team2?: Player;
  date?: string;
  time?: string;
}

interface Player {
  name: string;
  avatar?: string; // Add this line
}

interface GroupRound {
  [key: string]: Match[];
}

interface ScheduleProps {
  groupRound: GroupRound;
  leagueInfor: string;
}

const Schedule: React.FC<ScheduleProps> = ({ groupRound, leagueInfor }) => {
  // Helper function to determine CSS class for advancing
  const getAdvancingClass = (result: number) =>
    result === 2 ? 'font-bold text-green-600' : '';

  // Check if the league is 'doubles'
  const isDoubles = leagueInfor.includes('doubles');

  return (
    <div className="w-full bg-gray-100 p-4 rounded-lg shadow-lg">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="space-y-6">
            {Object.keys(groupRound).map((key, index) => {
              const round = groupRound[key];
              return (
                <div key={key} className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">{`Round ${index + 1}`}</h3>
                  <div className="space-y-4">
                    {round.map((match, matchIndex) => (
                      <div key={matchIndex} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="flex items-center p-4">
                          {/* Date and Time (Left) */}
                          <div className="text-xs text-gray-500 w-20 text-left mr-4">
                            {/* <div>{match.date}</div> */}
                            <div>{match.time}</div>
                          </div>

                          {/* Centered teams container */}
                          <div className="flex-grow flex justify-center items-center">
                            {/* Team 1 (Home) */}
                            <div className="flex flex-col items-end mr-4">
                              {match.player1Team1 && (
                                <div className="flex items-center mb-2">
                                  <span className="mr-2 font-medium">{match.player1Team1.name}</span>
                                  <Image src={match.player1Team1.avatar || '/images/default-avatar.png'} width={32} height={32} alt={match.player1Team1.name} className="w-8 h-8 rounded-full object-cover" />
                                </div>
                              )}
                              {isDoubles && match.player2Team1 && (
                                <div className="flex items-center">
                                  <span className="mr-2 font-medium">{match.player2Team1.name}</span>
                                  <Image src={match.player2Team1.avatar || '/images/default-avatar.png'} width={32} height={32} alt={match.player2Team1.name} className="w-8 h-8 rounded-full object-cover" />
                                </div>
                              )}
                            </div>

                            {/* "vs" text */}
                            <div className="text-sm font-semibold text-gray-500 mx-4">vs</div>

                            {/* Team 2 (Away) */}
                            <div className="flex flex-col items-start ml-4">
                              {match.player1Team2 && (
                                <div className="flex items-center mb-2">
                                  <Image src={match.player1Team2.avatar || '/images/default-avatar.png'} width={32} height={32} alt={match.player1Team2.name} className="w-8 h-8 rounded-full object-cover mr-2" />
                                  <span className="font-medium">{match.player1Team2.name}</span>
                                </div>
                              )}
                              {isDoubles && match.player2Team2 && (
                                <div className="flex items-center">
                                  <Image src={match.player2Team2.avatar || '/images/default-avatar.png'} width={32} height={32} alt={match.player2Team2.name} className="w-8 h-8 rounded-full object-cover mr-2" />
                                  <span className="font-medium">{match.player2Team2.name}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 w-20 text-right mr-4">
                            <div>{match.date ? new Date(match.date).toLocaleDateString('en-GB') : ''}</div>
                            {/* <div>{match.time}</div> */}
                          </div>
                          {/* Match Status or Score */}
                          {/* <div className="text-sm font-semibold text-gray-700 w-20 text-left ml-4">
                            {match.status || 'Upcoming'}
                          </div> */}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
