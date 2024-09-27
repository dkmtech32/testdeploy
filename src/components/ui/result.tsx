import Image from "next/image";
import React from "react";

// Define interfaces for data structures
interface Schedule {
  match: number;
  time: string;
  date: string;
  player1Team1?: Player;
  player2Team1?: Player;
  player1Team2?: Player;
  player2Team2?: Player;
  set_1_team_1?: number;
  set_1_team_2?: number;
  set_2_team_1?: number;
  set_2_team_2?: number;
  set_3_team_1?: number;
  set_3_team_2?: number;
  result_team_1?: number;
  result_team_2?: number;
  winner?: number;
}

interface Player {
  name: string;
  profile_photo_path: string;
}

interface Props {
  groupSchedule: {
    [round: string]: Schedule[];
  };
}

const TournamentResults: React.FC<Props> = ({ groupSchedule }) => {
  const liveScore = (id: number) => {
    document.getElementById(`livescore-top${id}`)?.classList.remove("hidden");
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {Object.entries(groupSchedule).map(([round, schedules], roundIndex) => (
        <div key={roundIndex} className="mb-12">
          <h2 className="font-bold text-3xl mb-8 text-gray-800 border-b-2 border-gray-200 pb-4">
            {round}
          </h2>
          <ul className="space-y-8">
            {schedules.map((schedule, index) => (
              <li
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div
                  className="cursor-pointer"
                  id={`${index}`}
                  onClick={() => liveScore(index)}
                >
                  <div className="flex justify-between items-center mb-6">
                    <div className="text-gray-700 font-semibold">
                      <span className="text-indigo-600 mr-2 font-bold">
                        #{schedule.match}
                      </span>
                      {schedule.time}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {new Date(schedule.date).toLocaleDateString("en-GB", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    {/* Team 1 */}
                    <div
                      className={`flex items-center space-x-4 ${
                        schedule.winner === 1
                          ? "text-green-600"
                          : "text-gray-700"
                      }`}
                    >
                      <div className="flex flex-col space-y-2 relative">
                        <Image
                          src={
                            schedule.player1Team1?.profile_photo_path ||
                            "/images/no-image.png"
                          }
                          width={48}
                          height={48}
                          alt="Team 1 Player 1"
                          className={`rounded-full shadow-md border-2 ${schedule.winner === 1 ? 'border-green-500' : 'border-gray-200'} ${schedule.player2Team1 ? 'w-10 h-10' : 'w-12 h-12'}`}
                        />
                        {schedule.player2Team1 && (
                          <Image
                            src={
                              schedule.player2Team1?.profile_photo_path ||
                              "/images/no-image.png"
                            }
                            width={48}
                            height={48}
                            alt="Team 1 Player 2"
                            className={`w-10 h-10 rounded-full shadow-md border-2 ${schedule.winner === 1 ? 'border-green-500' : 'border-gray-200'}`}
                          />
                        )}
                        {schedule.winner === 1 && (
                          <div className="absolute -top-1 -left-1 bg-green-500 rounded-full p-1 shadow-lg">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-white"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <p className="font-semibold">
                          {schedule.player1Team1?.name}
                        </p>
                        {schedule.player2Team1 && (
                          <p className="font-semibold">
                            {schedule.player2Team1?.name}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-2xl font-bold text-gray-400">vs</div>

                    {/* Team 2 */}
                    <div
                      className={`flex items-center space-x-4 ${
                        schedule.winner === 2
                          ? "text-green-600"
                          : "text-gray-700"
                      }`}
                    >
                      <div className="flex flex-col space-y-2 relative">
                        <Image
                          src={
                            schedule.player1Team2?.profile_photo_path ||
                            "/images/no-image.png"
                          }
                          width={48}
                          height={48}
                          alt="Team 2 Player 1"
                          className={`rounded-full shadow-md border-2 ${schedule.winner === 2 ? 'border-green-500' : 'border-gray-200'} ${schedule.player2Team2 ? 'w-10 h-10' : 'w-12 h-12'}`}
                        />
                        {schedule.player2Team2 && (
                          <Image
                            src={
                              schedule.player2Team2?.profile_photo_path ||
                              "/images/no-image.png"
                            }
                            width={48}
                            height={48}
                            alt="Team 2 Player 2"
                            className={`w-10 h-10 rounded-full shadow-md border-2 ${schedule.winner === 2 ? 'border-green-500' : 'border-gray-200'}`}
                          />
                        )}
                        {schedule.winner === 2 && (
                          <div className="absolute -top-1 -left-1 bg-green-500 rounded-full p-1 shadow-lg">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-white"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <p className="font-semibold">
                          {schedule.player1Team2?.name}
                        </p>
                        {schedule.player2Team2 && (
                          <p className="font-semibold">
                            {schedule.player2Team2?.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 bg-gray-100 p-4 rounded-lg">
                    <div className="text-sm text-gray-700 flex justify-center space-x-6">
                      <div className="font-semibold">
                        {schedule.set_1_team_1} - {schedule.set_1_team_2}
                      </div>
                      {schedule.set_2_team_1 && schedule.set_2_team_2 && (
                        <div className="font-semibold">
                          {schedule.set_2_team_1} - {schedule.set_2_team_2}
                        </div>
                      )}
                      {schedule.set_3_team_1 && schedule.set_3_team_2 && (
                        <div className="font-semibold">
                          {schedule.set_3_team_1} - {schedule.set_3_team_2}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Live score details */}
                <section
                  id={`livescore-top${index}`}
                  className="hidden mt-6 bg-indigo-900 text-white rounded-lg p-6"
                >
                  <div className="flex justify-between items-center bg-indigo-800 p-4 rounded-lg">
                    {/* Team 1 */}
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col items-center">
                        <Image
                          src={
                            schedule.player1Team1?.profile_photo_path ||
                            "/images/no-image.png"
                          }
                          width={48}
                          height={48}
                          alt="Team 1 Player 1"
                          className="w-12 h-12 rounded-full shadow-md border-2 border-indigo-300"
                        />
                        <p className="mt-1 text-sm font-medium">{schedule.player1Team1?.name}</p>
                      </div>
                      {schedule.player2Team1 && (
                        <div className="flex flex-col items-center">
                          <Image
                            src={
                              schedule.player2Team1?.profile_photo_path ||
                              "/images/no-image.png"
                            }
                            width={48}
                            height={48}
                            alt="Team 1 Player 2"
                            className="w-12 h-12 rounded-full shadow-md border-2 border-indigo-300"
                          />
                          <p className="mt-1 text-sm font-medium">{schedule.player2Team1?.name}</p>
                        </div>
                      )}
                    </div>

                    <div className="text-2xl font-bold text-indigo-300">VS</div>

                    {/* Team 2 */}
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col items-center">
                        <Image
                          src={
                            schedule.player1Team2?.profile_photo_path ||
                            "/images/no-image.png"
                          }
                          width={48}
                          height={48}
                          alt="Team 2 Player 1"
                          className="w-12 h-12 rounded-full shadow-md border-2 border-indigo-300"
                        />
                        <p className="mt-1 text-sm font-medium">{schedule.player1Team2?.name}</p>
                      </div>
                      {schedule.player2Team2 && (
                        <div className="flex flex-col items-center">
                          <Image
                            src={
                              schedule.player2Team2?.profile_photo_path ||
                              "/images/no-image.png"
                            }
                            width={48}
                            height={48}
                            alt="Team 2 Player 2"
                            className="w-12 h-12 rounded-full shadow-md border-2 border-indigo-300"
                          />
                          <p className="mt-1 text-sm font-medium">{schedule.player2Team2?.name}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Game details */}
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <p>{schedule.set_1_team_1}</p>
                      <p className="mx-2">Game 1</p>
                      <p>{schedule.set_1_team_2}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p>{schedule.set_2_team_1}</p>
                      <p className="mx-2">Game 2</p>
                      <p>{schedule.set_2_team_2}</p>
                    </div>
                    {schedule.set_3_team_1 && (
                      <div className="flex justify-between items-center">
                        <p>{schedule.set_3_team_1}</p>
                        <p className="mx-2">Game 3</p>
                        <p>{schedule.set_3_team_2}</p>
                      </div>
                    )}
                  </div>

                  {/* Final results */}
                  <div className="flex justify-between items-center mt-4 font-bold">
                    <p>{schedule.result_team_1}</p>
                    <p className="mx-2">Final Result</p>
                    <p>{schedule.result_team_2}</p>
                  </div>
                </section>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default TournamentResults;
