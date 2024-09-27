"use client";
import leagueApiRequest from "@/apiRequests/league";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/images/logo-pkb.png";
import { format } from "date-fns";
import { useEffect, useState } from "react";

type League = {
  name: string;
  slug: string;
  start_date: string;
  end_date: string;
  money: number;
  images: string;
};

export default function HomeLeague() {
  const imagePrefix = process.env.NEXT_PUBLIC_API_ENDPOINT;

  const [leagueList, setLeagueList] = useState<League[]>(() => [
    // {
    //   name: "League 1",
    //   slug: "league-1",
    //   start_date: "2022-01-01",
    //   end_date: "2022-01-01",
    //   money: 1000,
    //   images: "/images/logo-pkb.png",
    // },
    // {
    //   name: "League 2",
    //   slug: "league-2",
    //   start_date: "2022-01-01",
    //   end_date: "2022-01-01",
    //   money: 2000,
    //   images: "/images/logo-pkb.png",
    // },
  ]);

  useEffect(() => {
    (async () => {
      try {
        if (!leagueApiRequest) {
          throw new Error("leagueApiRequest is null or undefined");
        }
        const result = await leagueApiRequest.getHomeList();
        if (!result) {
          throw new Error(
            "Result from leagueApiRequest.getList() is null or undefined"
          );
        }
        console.log(result);
        setLeagueList(result.payload.data);
      } catch (error) {
        console.error(
          "An error occurred while fetching the league list:",
          error
        );
      }
    })();
  }, []);

  return (
    <section className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {leagueList.length > 0 ? (
          leagueList.map((league) => (
            <div
              key={league.slug}
              className="bg-secondary text-primary dark:text-primary-light rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
            >
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                  <Link key={league.slug} href={`/leagues/${league.slug}`}>
                    <Image
                      src={league.images ? imagePrefix + league.images : logo}
                      alt={league.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="transition-transform duration-300 hover:scale-105 object-cover"
                    />
                  </Link>
                </div>
                <div className="w-full md:w-1/2 p-6 flex flex-col justify-between bg-gradient-to-br from-secondary to-secondary-dark">
                  <div>
                    <Link
                      href={`/leagues/${league.slug}`}
                      className="block group"
                    >
                      <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                        {league.name}
                      </h2>
                      <p className="text-sm text-gray-400 mb-1">
                        <span className="font-semibold">Start Date:</span>{" "}
                        {format(new Date(league.start_date), "dd MMM yyyy")}
                      </p>
                      <p className="text-sm text-gray-400">
                        <span className="font-semibold">End Date:</span>{" "}
                        {format(new Date(league.end_date), "dd MMM yyyy")}
                      </p>
                    </Link>
                  </div>
                  <div className="mt-4 text-lg font-bold text-primary">
                    PRIZE MONEY
                    <span className="block text-2xl mt-1">
                      {league.money?.toLocaleString() || 0} VND
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-secondary rounded-xl">
            <h2 className="text-destructive text-xl font-semibold">
              Leagues have not been updated yet!
            </h2>
          </div>
        )}
      </div>
    </section>
  );
}
