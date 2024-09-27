import React from "react";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/images/logo-pkb.png";
import HomeLeague from "./home-leagues";
import TopPlayers from "../ranking/top3";

interface League {
  slug: string;
  name: string;
  start_date: string;
  end_date: string;
  money: number;
  images: string;
}

interface Rank {
  id: number;
  points: number;
  users: {
    name: string;
    profile_photo_path: string;
  } | null;
}

export default async function HomePage() {
  const listRank = [
    {
      id: 1,
      points: 1000,
      users: {
        name: "User 1",
        profile_photo_path: "/images/logo-pkb.png",
      },
    },
    {
      id: 2,
      points: 2000,
      users: {
        name: "User 2",
        profile_photo_path: "/images/logo-pkb.png",
      },
    },
  ];

  return (
    <div className="w-full bg-white dark:bg-gray-900">
      <section className="relative h-[500px]">
        <Image
          className="w-full h-full object-cover"
          src="/images/banner-homepage.jpg"
          alt="Banner"
          fill
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center">
            Welcome to Our Tournament Platform
          </h1>
        </div>
      </section>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-primary dark:text-primary-light">
              Next Tournament
            </h2>
            <Link
              href={`/leagues`}
              className="text-primary dark:text-primary-light hover:text-primary-dark dark:hover:text-primary-light transition duration-300"
            >
              All Tournaments
            </Link>
          </div>
          <HomeLeague />
        </section>
        <section className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-primary dark:text-primary-light">
              World Tour Leaders
            </h2>
            <Link
              href={`${process.env.NEXT_PUBLIC_BASE_URL}/ranking`}
              className="text-primary dark:text-primary-light hover:text-primary-dark dark:hover:text-primary-light transition duration-300"
            >
              Full Rankings
            </Link>
          </div>
            <TopPlayers />
        </section>
      </div>
    </div>
  );
}
