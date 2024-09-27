"use client";
import { useState, useEffect } from "react";
// import axios from 'axios';
import Link from "next/link";
import leagueApiRequest from "@/apiRequests/league";
import { LeagueListResType } from "@/schemaValidations/league.schema";
import Image from "next/image";

export default function LeagueHomeList() {
  const imagePrefix = process.env.NEXT_PUBLIC_API_ENDPOINT;
  const [leagueList, setLeagueList] = useState<LeagueListResType["data"]>(() => [
    
  ]);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    (async () => {
      try {
        if (!leagueApiRequest) {
          throw new Error("leagueApiRequest is null or undefined");
        }
        const result = await leagueApiRequest.getList();
        if (!result) {
          throw new Error(
            "Result from leagueApiRequest.getList() is null or undefined"
          );
        }
        setLeagueList(result.payload.data);
      } catch (error) {
        console.error(
          "An error occurred while fetching the league list:",
          error
        );
      }
    })();
  }, []);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const filteredLeagues = leagueList.filter((league) => {
    const currentDate = new Date();
    const startDate = new Date(league.start_date);
    const endDate = new Date(league.end_date);

    switch (activeTab) {
      case 'completed':
        return endDate < currentDate;
      case 'next':
        return startDate > currentDate;
      default:
        return true;
    }
  });

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 sm:mb-0">
          League Calendar
        </h2>
        <Link
          href="/leagues/create"
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 dark:bg-green-600 dark:hover:bg-green-700"
        >
          Create League
        </Link>
      </div>
      <div className="mb-8">
        <ul className="flex flex-wrap justify-center sm:justify-start space-x-2 sm:space-x-4">
          {["all", "completed", "next"].map((tab) => (
            <li key={tab}>
              <button
                className={`${
                  activeTab === tab
                    ? "bg-indigo-600 text-white dark:bg-indigo-500"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                } font-medium py-2 px-6 rounded-full transition duration-300 ease-in-out`}
                onClick={() => handleTabClick(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredLeagues.map((league) => (
          <Link key={league.slug} href={`/leagues/${league.slug}`}>
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 h-[450px] flex flex-col">
              <div className="h-64 relative overflow-hidden">
                <Image
                  src={`${league.images ? imagePrefix + league.images : '/images/logo-pkb.png'}`}
                  alt={league.name}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  fill
                  priority
                  style={{ objectFit: "cover" }}
                  className="transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 line-clamp-2">
                    {league.name}
                  </h2>
                  <div className="flex flex-col space-y-2">
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">Dates:</span>{" "}
                      {new Date(league.start_date).toLocaleDateString()} -{" "}
                      {new Date(league.end_date).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">Prize Money:</span>{" "}
                      <span className="text-green-600 dark:text-green-400 font-bold">
                        ${league.money.toLocaleString()}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
        {filteredLeagues.length === 0 && (
          <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-16 text-xl">
            No leagues available for the selected filter.
          </div>
        )}
      </div>
    </div>
  );
}
