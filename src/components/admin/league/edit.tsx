"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import leagueApiRequest from "@/apiRequests/league";
import { CreateLeagueBodyType } from "@/schemaValidations/league.schema";
import { useToast } from "@chakra-ui/react";
import CardSelect from "@/components/ui/card-select";
import Cropper, { Area } from "react-easy-crop";
import { createCropFunction } from "@/lib/utils";
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tooltip,
  Box,
  Input,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";

const EditLeague: React.FC<{ slug: string }> = ({ slug }) => {
  const router = useRouter();
  const toast = useToast();
  const [leagueId, setLeagueId] = useState<any>();
  const [formData, setFormData] = useState<CreateLeagueBodyType>({
    name: "",
    start_date: "",
    end_date: "",
    end_date_register: "",
    format_of_league: "league-single-limination",
    type_of_league: "male-singles",
    start_time: "",
    money: 0,
    location: "",
    number_of_athletes: 0,
    images: null,
  });

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [croppedImage, setCroppedImage] = useState<File | null>(null);
  const [cropFunction, setCropFunction] = useState<
    ((crop: Area) => Promise<File>) | null
  >(null);

  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateLeagueBodyType, string>>
  >({});

  const [showTooltip, setShowTooltip] = useState(false);
  const playerOptions = [4, 8, 16, 32];

  useEffect(() => {
    if (formData.images) {
      const objectUrl = URL.createObjectURL(formData.images);
      setCropFunction(() => createCropFunction(objectUrl));
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [formData.images]);

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleCrop = useCallback(async () => {
    if (cropFunction && croppedAreaPixels) {
      const croppedFile = await cropFunction(croppedAreaPixels);
      const ratio = croppedAreaPixels.width / croppedAreaPixels.height;
      const roundedRatio = Math.round(ratio * 100) / 100;

      const originalName = formData.images?.name ?? "image.jpg";
      const extension = originalName.split(".").pop();
      const nameWithoutExtension = originalName
        .split(".")
        .slice(0, -1)
        .join(".");
      const newFileName = `${nameWithoutExtension}_${roundedRatio}x1.${extension}`;

      const renamedCroppedImage = new File([croppedFile], newFileName, {
        type: croppedFile.type,
      });

      setCroppedImage(renamedCroppedImage);
      setIsCropping(false);
    }
  }, [cropFunction, croppedAreaPixels, formData.images]);

  // Modify the handleImageChange function
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, images: file });
      setIsCropping(true);
    }
  };

  const handleSliderChange = (value: number) => {
    const closestOption = playerOptions.reduce((prev, curr) =>
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    );
    setFormData({ ...formData, number_of_athletes: closestOption });
    setErrors({
      ...errors,
      number_of_athletes: validateField("number_of_athletes", closestOption),
    });
  };

  const formatMoney = (value: number) => {
    return value.toLocaleString("vi-VN");
  };

  const handleMoneyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const numberValue = parseInt(value, 10) || 0;
    setFormData({ ...formData, money: numberValue });
    setErrors({
      ...errors,
      money: validateField("money", numberValue),
    });
  };

  useEffect(() => {
    const fetchLeagueData = async () => {
      try {
        const response = await leagueApiRequest.getDetailSlug(slug);
        if (response.status === 200 && response.payload.data) {
          const data = response.payload.data;
          setFormData({
            name: data.name,
            start_date: data.start_date,
            end_date: data.end_date,
            end_date_register: data.end_date_register || "",
            format_of_league:
              data.format_of_league || "league-single-limination",
            type_of_league: data.type_of_league || "male-singles",
            start_time: data.start_time,
            money: data.money,
            location: data.location,
            number_of_athletes: data.number_of_athletes,
            images: null,
          });
          setLeagueId(data.id);
          if (data.images) {
            setExistingImage(
              process.env.NEXT_PUBLIC_API_ENDPOINT + data.images
            );
          }
        } else {
          throw new Error("Failed to fetch league data");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load league data. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchLeagueData();
  }, [slug, toast]);

  const validateField = (
    name: keyof CreateLeagueBodyType,
    value: any
  ): string => {
    const today = new Date().setHours(0, 0, 0, 0);
    switch (name) {
      case "name":
        return value ? "" : "Name is required and must be unique.";
      case "start_date":
        return value
          ? new Date(value).setHours(0, 0, 0, 0) >= today
            ? ""
            : "Start date must be today or later."
          : "Start date is required.";
      case "end_date":
        return value && new Date(value) >= new Date(formData.start_date)
          ? ""
          : "End date must be after or equal to the start date.";
      case "format_of_league":
        return value ? "" : "Format of league is required.";
      case "number_of_athletes":
        return value > 0
          ? ""
          : "Number of athletes is required and must be greater than 0.";
      case "type_of_league":
        return value ? "" : "Type of league is required.";
      case "start_time":
        return value ? "" : "Start time is required.";
      case "money":
        return Number(value) >= 0 ? "" : "Money must be a positive number.";
      case "images":
        return value && value.size > 2048 * 1024
          ? "Image size must not exceed 2MB."
          : "";
      default:
        return "";
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({
      ...errors,
      [name]: validateField(name as keyof CreateLeagueBodyType, value),
    });
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof CreateLeagueBodyType, string>> = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const error = validateField(
        key as keyof CreateLeagueBodyType,
        formData[key as keyof CreateLeagueBodyType]
      );
      if (error) {
        newErrors[key as keyof CreateLeagueBodyType] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("start_date", formData.start_date);
      formDataToSend.append("end_date", formData.end_date);
      formDataToSend.append("end_date_register", formData.end_date_register);
      formDataToSend.append("format_of_league", formData.format_of_league);
      formDataToSend.append("type_of_league", formData.type_of_league);
      formDataToSend.append("start_time", formData.start_time);
      formDataToSend.append("money", formData.money.toString());
      formDataToSend.append("location", formData.location);
      formDataToSend.append(
        "number_of_athletes",
        formData.number_of_athletes.toString()
      );

      if (croppedImage) {
        formDataToSend.append("images", croppedImage);
      } else if (formData.images) {
        formDataToSend.append("images", formData.images);
      }

      const response = await leagueApiRequest.update(leagueId, formDataToSend);
      if (response.status === 201) {
        toast({
          title: "League Updated",
          description: "The league has been updated successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        router.push("/dashboard/league");
      } else {
        toast({
          title: "Error Updating League",
          description: JSON.stringify(response.payload.data),
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error Updating League",
        description: "An unexpected error occurred. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const formatOptions = [
    {
      value: "league-single-limination",
      label: "Single Elimination",
      icon: "/svg/single-elimination.svg",
      width: 48,
      height: 48,
    },
    {
      value: "league-round",
      label: "Round Robin",
      icon: "/svg/round-robin.svg",
      width: 48,
      height: 48,
    },
  ];

  const typeOptions = [
    {
      value: "male-singles",
      label: "Male Singles",
      icon: "/svg/male-single.svg",
      width: 48,
      height: 48,
    },
    {
      value: "female-singles",
      label: "Female Singles",
      icon: "/svg/female-single.svg",
      width: 48,
      height: 48,
    },
    {
      value: "male-doubles",
      label: "Male Doubles",
      icon: "/svg/male-double.svg",
      width: 48,
      height: 48,
    },
    {
      value: "female-doubles",
      label: "Female Doubles",
      icon: "/svg/female-double.svg",
      width: 48,
      height: 48,
    },
    {
      value: "mixed",
      label: "Mixed Doubles",
      icon: "/svg/mixed-double.svg",
      width: 48,
      height: 48,
    },
  ];

  return (
    <div className="lg:ml-20 lg:mr-auto  mt-4 px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="bg-gray-100 dark:bg-gray-700 px-4 py-5 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <h1 className="text-lg font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">
              Edit League
            </h1>
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
              onClick={() => router.back()}
            >
              Back
            </button>
          </div>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* League Image */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                League Image
              </h2>
              <div className="flex justify-center">
                <div className="w-full max-w-md">
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 transition-all duration-300 ease-in-out hover:border-indigo-500 dark:hover:border-indigo-400">
                    {existingImage || croppedImage || formData.images ? (
                      <div className="relative">
                        <Image
                          src={
                            existingImage ||
                            (croppedImage
                              ? URL.createObjectURL(croppedImage)
                              : formData.images
                              ? URL.createObjectURL(formData.images)
                              : "/images/logo-pkb.png")
                          }
                          alt="League image"
                          width={200}
                          height={200}
                          className="object-cover rounded-lg"
                        />
                        <button
                          title="Remove image"
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, images: null });
                            setExistingImage(null);
                            setCroppedImage(null);
                          }}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 m-1"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <>
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                          <label
                            htmlFor="images"
                            className="relative cursor-pointer bg-indigo-500 hover:bg-indigo-600 text-white rounded-md font-medium py-2 px-4 transition duration-300 ease-in-out focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                          >
                            <span>Upload an image</span>
                            <input
                              id="images"
                              name="images"
                              type="file"
                              className="sr-only"
                              onChange={handleImageChange}
                            />
                          </label>
                          <p className="pl-1 pt-2">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG, GIF up to 2MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Basic Information
              </h2>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  League Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white ${
                    errors.name
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    {errors.name}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="format_of_league"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Format of League
                  </label>
                  <CardSelect
                    options={formatOptions}
                    value={formData.format_of_league}
                    onChange={(value) =>
                      handleInputChange({
                        target: { name: "format_of_league", value },
                      } as React.ChangeEvent<HTMLSelectElement>)
                    }
                    name="format_of_league"
                  />
                </div>
                <div>
                  <label
                    htmlFor="type_of_league"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Type of League
                  </label>
                  <CardSelect
                    options={typeOptions}
                    value={formData.type_of_league}
                    onChange={(value) =>
                      handleInputChange({
                        target: { name: "type_of_league", value },
                      } as React.ChangeEvent<HTMLSelectElement>)
                    }
                    name="type_of_league"
                  />
                </div>
              </div>
            </div>

            {/* Dates and Times */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Dates and Times
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="start_date"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white ${
                      errors.start_date
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                  {errors.start_date && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                      {errors.start_date}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="end_date"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    id="end_date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white ${
                      errors.end_date
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                  {errors.end_date && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                      {errors.end_date}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="end_date_register"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Registration End Date
                  </label>
                  <input
                    type="date"
                    id="end_date_register"
                    name="end_date_register"
                    value={formData.end_date_register}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white ${
                      errors.end_date_register
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                  {errors.end_date_register && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                      {errors.end_date_register}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="start_time"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Start Time
                  </label>
                  <input
                    type="time"
                    id="start_time"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white ${
                      errors.start_time
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                  {errors.start_time && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                      {errors.start_time}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Additional Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="number_of_athletes"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Number of Players
                  </label>
                  <Box position="relative" width="100%" pb="8">
                    <Slider
                      id="number_of_athletes"
                      min={0}
                      max={3}
                      step={1}
                      value={playerOptions.indexOf(formData.number_of_athletes)}
                      onChange={(value) =>
                        handleSliderChange(playerOptions[value])
                      }
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                    >
                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <Tooltip
                        hasArrow
                        bg="blue.500"
                        color="white"
                        placement="top"
                        isOpen={showTooltip}
                        label={`${formData.number_of_athletes} players`}
                      >
                        <SliderThumb />
                      </Tooltip>
                    </Slider>
                    <div className="flex justify-between mt-2 absolute w-full bottom-0">
                      {playerOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleSliderChange(option)}
                          className={`px-2 py-1 text-xs sm:text-sm rounded ${
                            formData.number_of_athletes === option
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </Box>
                  {errors.number_of_athletes && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                      {errors.number_of_athletes}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="money"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Prize Money
                  </label>
                  <InputGroup>
                    <InputLeftAddon className="text-right mt-1">
                      VND
                    </InputLeftAddon>
                    <Input
                      type="text"
                      id="money"
                      name="money"
                      value={formatMoney(formData.money ?? 0)}
                      onChange={handleMoneyChange}
                      className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white ${
                        errors.money
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    />
                  </InputGroup>
                  {errors.money && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                      {errors.money}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white ${
                    errors.location
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                />
                {errors.location && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    {errors.location}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-md w-full sm:w-auto"
              >
                Update League
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Add the Image Cropping Modal */}
      {isCropping && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 !mt-0">
          <div className="bg-white p-4 rounded-lg w-full max-w-2xl">
            <div className="relative h-96">
              <Cropper
                image={
                  formData.images ? URL.createObjectURL(formData.images) : ""
                }
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="mt-4">
              <Slider
                aria-label="zoom"
                value={zoom}
                min={1}
                max={3}
                step={0.05}
                onChange={(value) => setZoom(value)}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setIsCropping(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCrop}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Crop Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditLeague;
