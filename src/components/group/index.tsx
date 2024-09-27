"use client";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight, faBars } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import GroupCard from "./group-card";
import Slider from "react-slick";
import styles from "./slick-arrow.module.css";
import groupApiRequest from "@/apiRequests/group";
import { GroupType } from "@/schemaValidations/group.schema";

const CustomPrevArrow = (props: any) => {
  const { className, onClick } = props;
  return (
    <div className={`${className} ${styles.arrowLeft}`} onClick={onClick} />
  );
};

const CustomNextArrow = (props: any) => {
  const { className, onClick } = props;
  return (
    <div className={`${className} ${styles.arrowRight}`} onClick={onClick} />
  );
};

const GroupList: React.FC = () => {
  const [listGroup, setListGroup] = useState<GroupType[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await groupApiRequest.getLocation();
        setLocations(
          response.payload.data.map((group: GroupType) => group.location)
        );
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        if (selectedLocation) {
          const response = await groupApiRequest.getActiveGroupByLocation(
            selectedLocation
          );
          setListGroup(response.payload.data);
        } else {
          const response = await groupApiRequest.getActiveFeatureGroup();
          setListGroup(response.payload.data);
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };
    fetchGroups();
  }, [selectedLocation]);

  const groupedByLocation =
    listGroup && listGroup.length > 0
      ? listGroup.reduce((acc, group) => {
          if (group && group.location) {
            if (!acc[group.location]) {
              acc[group.location] = [];
            }
            acc[group.location].push(group);
          }
          return acc;
        }, {} as Record<string, GroupType[]>)
      : {};

  const sliderSettings = {
    dots: true,
    infinite: true,
    adaptiveHeight: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  
  const handleMyGroup = async () => {
    try {
        const response = await groupApiRequest.getMyGroup();
        setListGroup(response.payload.data);
        console.log(response.payload.data);
        setSidebarVisible(false); // Hide sidebar when My Group is clicked
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className={`container mx-auto flex flex-col lg:flex-row ${sidebarVisible ? 'p-4' : 'pl-0 pr-4 pt-4 pb-4'}  bg-gray-50 dark:bg-gray-900`}>
      {/* Sidebar */}
      <div 
        className={`
          w-full lg:w-64 flex-shrink-0 bg-white  dark:bg-gray-800 max-h-fit  lg:static lg:overflow-y-visible rounded-lg mb-4 lg:mb-0 shadow-md
          transition-all duration-500 ease-in-out
          ${sidebarVisible ? 'opacity-100  p-4' : 'opacity-0 max-h-0 lg:w-0 overflow-hidden pl-0 pr-4 pt-4 pb-4'}
        `}
      >
        <h3 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white border-b pb-2">
          Locations
        </h3>
        <div className="max-h-[calc(100vh-620px)] overflow-y-auto">
          <ul className="flex flex-wrap lg:flex-col gap-2">
            <li
              className={`cursor-pointer p-3 rounded-md flex-grow lg:flex-grow-0 text-center lg:text-left transition-colors duration-200 ${
                !selectedLocation
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
              }`}
              onClick={() => setSelectedLocation(null)}
            >
              Featured Locations
            </li>
            {locations.map((location) => (
              <li
                key={location}
                className={`cursor-pointer p-3 rounded-md flex-grow lg:flex-grow-0 text-center lg:text-left transition-colors duration-200 ${
                  selectedLocation === location
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                }`}
                onClick={() => setSelectedLocation(location)}
              >
                {location}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main content */}
      <div className={`w-full transition-transform duration-300 ease-in-out
        ${sidebarVisible ? 'lg:flex-1 lg:ml-4' : 'lg:w-full'}
      `}>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className={`mr-4 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white
                  transition-opacity duration-300 ease-in-out
                  ${sidebarVisible ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}
                `}
                aria-label={sidebarVisible ? "Hide sidebar" : "Show sidebar"}
              >
                <FontAwesomeIcon icon={faBars} size="lg" />
              </button>
              <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">
                Groups
              </h2>
            </div>
            <div className="flex space-x-4">
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
              onClick={handleMyGroup}>
                My Group
              </button>
              <Link
                href="/group/create"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
              >
                Create Group
              </Link>
            </div>
          </div>

          {Object.entries(groupedByLocation).map(([location, groups]) => (
            <div key={location} className="mb-12">
              <div className="flex items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mr-3">
                  {location}
                </h3>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full">
                  {groups.length} {groups.length === 1 ? "group" : "groups"}
                </span>
              </div>
              {groups.length === 1 ? (
                <div className="w-full max-w-md mx-auto">
                  <GroupCard {...groups[0]} />
                </div>
              ) : (
                <div className="group-slider w-full xl:max-w-5xl lg:max-w-2xl mx-auto h-full">
                  <Slider {...sliderSettings}>
                    {groups.map((group) => (
                      <div key={group.id} className="px-2">
                        <GroupCard {...group} />
                      </div>
                    ))}
                  </Slider>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default GroupList;
