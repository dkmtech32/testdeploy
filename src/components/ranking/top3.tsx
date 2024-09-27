"use client";

import Image from "next/image";
import React, { useState } from "react";

interface User {
  id: number;
  name: string;
  profile_photo_path: string;
}

interface Ranking {
  id: number;
  users: User;
  points: number;
  updated_at: string;
}
function TopPlayers() {
  const [listRankings, setListRankings] = useState<Ranking[]>([
    {
      id: 1,
      users: {
        id: 1,
        name: "User 1",
        profile_photo_path: "/images/no-image.png",
      },
      points: 100,
      updated_at: "2022-01-01",
    },
    {
      id: 2,
      users: {
        id: 2,
        name: "User 2",
        profile_photo_path: "/images/no-image.png",
      },
      points: 90,
      updated_at: "2022-01-01",
    },
    {
      id: 3,
      users: {
        id: 3,
        name: "User 3",
        profile_photo_path: "/images/no-image.png",
      },
      points: 80,
      updated_at: "2022-01-01",
    },
  ]);
  return (
    <>
      {listRankings.length > 0 && (
        <div className="mb-12 bg-gradient-to-r from-yellow-400 to-yellow-600 dark:from-yellow-600 dark:to-yellow-800 rounded-lg p-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden mr-6 border-4 border-white dark:border-gray-800">
              <Image
                src={
                  listRankings[0].users.profile_photo_path ||
                  "/images/no-image.png"
                }
                width={100}
                height={100}
                alt={listRankings[0].users.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-3xl font-bold text-white mb-2">
                {listRankings[0].users.name}
              </p>
              <div className="flex items-center space-x-4">
                <div>
                  <span className="text-yellow-100 font-medium">Ranking</span>
                  <span className="ml-2 text-2xl font-bold text-white">1</span>
                </div>
                <div>
                  <span className="text-yellow-100 font-medium">Points</span>
                  <span className="ml-2 text-2xl font-bold text-white">
                    {listRankings[0].points}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {listRankings.slice(1).map((rank, index) => (
          <div
            key={rank.id}
            className="flex items-center bg-white dark:bg-gray-700 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="w-20 h-20 rounded-full overflow-hidden mr-4">
              <Image
                src={rank.users.profile_photo_path || "/images/no-image.png"}
                width={100}
                height={100}
                alt={rank.users.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-800 dark:text-white">
                {rank.users.name}
              </p>
              <div className="flex items-center space-x-4">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    Ranking
                  </span>
                  <span className="ml-2 text-gray-800 dark:text-white">
                    {index + 2}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    Points
                  </span>
                  <span className="ml-2 text-gray-800 dark:text-white">
                    {rank.points}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default TopPlayers;
