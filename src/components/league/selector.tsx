"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import leagueApiRequest from "@/apiRequests/league";
import { LeagueListResType } from "@/schemaValidations/league.schema";

interface LeagueSelectorProps {
  currentSlug: string;
}

export default function LeagueSelector({ currentSlug }: LeagueSelectorProps) {
  const [leagueList, setLeagueList] = useState<LeagueListResType["data"]>([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const result = await leagueApiRequest.getList();
        if (result) {
          setLeagueList(result.payload.data);
        }
      } catch (error) {
        console.error("Error fetching league list:", error);
      }
    })();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSlug = event.target.value;
    if (selectedSlug !== currentSlug) {
      router.push(`/leagues/${selectedSlug}`);
    }
  };

  return (
    <div className="relative">
      <select
        title="Select League"
        aria-label="Select League"
        className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500 shadow-sm transition duration-150 ease-in-out w-full text-sm hover:border-blue-400"
        onChange={handleChange}
        value=""
      >
        <option value="" disabled>Other leagues</option>
        {leagueList.map(league => (
          <option key={league.slug} value={league.slug} className="text-gray-700 text-sm font-medium truncate">
            {league.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
}