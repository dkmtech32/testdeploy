"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Tooltip,
  useToast,
  Input,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";
import Image from "next/image";
import groupApiRequest from "@/apiRequests/group";
import CardSelect from "@/components/ui/card-select";
import { CreateGroupBodyType } from "@/schemaValidations/group.schema";

interface FormData {
  name: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  members: number;
  location: string;
  note: string;
}

interface FormErrors {
  name?: string;
  description?: string;
  location?: string;
  status?: string;
  date?: string;
  start_time?: string;
  end_time?: string;
  members?: string;
}

const EditGroupTraining: React.FC<{ id: number }> = ({ id }) => {
  const searchParams = useSearchParams();
  const groupId = searchParams.get("group_id");
  const router = useRouter();
  const toast = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    date: "",
    start_time: "",
    end_time: "",
    members: 4,
    location: "",
    note: "",
  });

  const [groupMaxMember, setGroupMaxMember] = useState<number>(0);

  const [errors, setErrors] = useState<FormErrors>({});
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const fetchGroupMaxMember = async () => {
      if (groupId) {
        const response = await groupApiRequest.getDetailId(parseInt(groupId));
        if (response.status === 200 && response.payload.data) {
          setGroupMaxMember(response.payload.data.number_of_members);
        }
      }
    };
    fetchGroupMaxMember();
  }, [groupId]);

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await groupApiRequest.getDetailIdGroupTraining(id);
        if (response.status === 200 && response.payload.data) {
          const data = response.payload.data;
          setFormData({
            name: data.name,
            description: data.description,
            location: data.location,
            members: data.members,
            note: data.note,
            date: data.date,
            start_time: data.start_time,
            end_time: data.end_time,
          });
        } else {
          throw new Error("Failed to fetch group data");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load group data. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchGroupData();
  }, [id, toast]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
      isValid = false;
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required.";
      isValid = false;
    }

    if (formData.members <= 0) {
      newErrors.members = "Number of members must be greater than 0.";
      isValid = false;
    }
    if (!formData.date) {
      newErrors.date = "Date is required.";
      isValid = false;
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.date = "Date cannot be in the past.";
        isValid = false;
      }
    }

    if (!formData.start_time) {
      newErrors.start_time = "Start time is required.";
      isValid = false;
    }

    if (!formData.end_time) {
      newErrors.end_time = "End time is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSliderChange = (value: number) => {
    setFormData({ ...formData, members: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("members", formData.members.toString());
      formDataToSend.append("note", formData.note);
      formDataToSend.append("date", formData.date);
      formDataToSend.append("start_time", formData.start_time);
      formDataToSend.append("end_time", formData.end_time);

      const response = await groupApiRequest.updateGroupTraining(
        id,
        formDataToSend
      );
      if (response.status === 201) {
        toast({
          title: "Group Updated",
          description: "The group has been updated successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        router.push("/dashboard/training");
      } else {
        toast({
          title: "Error Updating Group",
          description: JSON.stringify(response.payload.message),
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error updating group:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating the group.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <div className="mx-auto mt-4 px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="bg-gray-100 dark:bg-gray-700 px-4 py-5 sm:px-6">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              Edit Group Training
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
                  Training Name
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
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white ${
                    errors.description
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                />
                {errors.description && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    {errors.description}
                  </p>
                )}
              </div>
            </div>

            {/* Training Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Training Details
              </h2>
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white ${
                    errors.date
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                />
                {errors.date && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    {errors.date}
                  </p>
                )}
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
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
                <div className="flex-1">
                  <label
                    htmlFor="end_time"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    End Time
                  </label>
                  <input
                    type="time"
                    id="end_time"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white ${
                      errors.end_time
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                  {errors.end_time && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                      {errors.end_time}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label
                  htmlFor="members"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Number of Members (Max {groupMaxMember}): {formData.members}
                </label>
                <Box position="relative" width="100%" pb="8">
                  <Slider
                    id="members"
                    min={1}
                    max={groupMaxMember}
                    step={1}
                    value={formData.members}
                    onChange={handleSliderChange}
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
                      label={`${formData.members} members`}
                    >
                      <SliderThumb />
                    </Tooltip>
                  </Slider>
                </Box>
                {errors.members && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    {errors.members}
                  </p>
                )}
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
              <div>
                <label
                  htmlFor="note"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Note
                </label>
                <textarea
                  id="note"
                  name="note"
                  rows={3}
                  value={formData.note}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-md"
              >
                Edit Group Training
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditGroupTraining;
