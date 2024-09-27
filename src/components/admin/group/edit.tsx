"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import Image from "next/image";
import groupApiRequest from "@/apiRequests/group";
import CardSelect from "@/components/ui/card-select";
import { CreateGroupBodyType } from "@/schemaValidations/group.schema";
import Cropper, { Area } from "react-easy-crop";
import { createCropFunction } from "@/lib/utils";

interface FormData {
  name: string;
  description: string;
  location: string;
  number_of_members: number;
  note: string;
  status: string;
  active: boolean;
  image: File | null;
}

interface FormErrors {
  name?: string;
  description?: string;
  location?: string;
  number_of_members?: string;
  status?: string;
}

const EditGroup: React.FC<{ id: number }> = ({ id }) => {
  const router = useRouter();
  const toast = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    location: "",
    number_of_members: 4,
    note: "",
    status: "public",
    active: false,
    image: null,
  });

  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showTooltip, setShowTooltip] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [croppedImage, setCroppedImage] = useState<File | null>(null);
  const [cropFunction, setCropFunction] = useState<
    ((crop: Area) => Promise<File>) | null
  >(null);

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await groupApiRequest.getDetailId(id);
        if (response.status === 200 && response.payload.data) {
          const data = response.payload.data;
          setFormData({
            name: data.name,
            description: data.description,
            location: data.location,
            number_of_members: data.number_of_members,
            note: data.note,
            status: data.status,
            active: data.active,
            image: null,
          });
          if (data.image) {
            setExistingImage(process.env.NEXT_PUBLIC_API_ENDPOINT + data.image);
          }
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

  useEffect(() => {
    if (formData.image) {
      const objectUrl = URL.createObjectURL(formData.image);
      setCropFunction(() => createCropFunction(objectUrl));
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [formData.image]);

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleCrop = useCallback(async () => {
    if (cropFunction && croppedAreaPixels) {
      const croppedFile = await cropFunction(croppedAreaPixels);
      const renamedCroppedImage = new File(
        [croppedFile],
        formData.image?.name || "cropped_image.jpg",
        { type: croppedFile.type }
      );
      setCroppedImage(renamedCroppedImage);
      setIsCropping(false);
    }
  }, [cropFunction, croppedAreaPixels, formData.image]);

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

    if (formData.number_of_members <= 0) {
      newErrors.number_of_members = "Number of members must be greater than 0.";
      isValid = false;
    }

    if (!formData.status) {
      newErrors.status = "Status is required.";
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setFormData({ ...formData, image: file });
      setIsCropping(true);
    }
  };

  const handleSliderChange = (value: number) => {
    setFormData({ ...formData, number_of_members: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("location", formData.location);
      formDataToSend.append(
        "number_of_members",
        formData.number_of_members.toString()
      );
      formDataToSend.append("note", formData.note);
      formDataToSend.append("status", formData.status);

      if (croppedImage) {
        formDataToSend.append("image", croppedImage);
      }

      const response = await groupApiRequest.update(id, formDataToSend);
      if (response.status === 201) {
        toast({
          title: "Group Updated",
          description: "The group has been updated successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        router.push("/dashboard/group");
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

  const statusOptions = [
    {
      value: "public",
      label: "Public",
      icon: "/svg/public.svg",
      width: 48,
      height: 48,
    },
    {
      value: "private",
      label: "Private",
      icon: "/svg/private.svg",
      width: 48,
      height: 48,
    },
  ];

  return (
    <div className="mx-auto mt-4 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="bg-gray-100 dark:bg-gray-700 px-4 py-5 sm:px-6">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              Update Group
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
        <div className="px-4 py-5 sm:p-6 dark:text-gray-200">
          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Group Image */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Group Image
              </h2>
              <div className="flex justify-center">
                <div className="w-full max-w-full">
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 transition-all duration-300 ease-in-out hover:border-indigo-500 dark:hover:border-indigo-400">
                    {existingImage || croppedImage || formData.image ? (
                      <div className="relative w-full flex justify-center">
                        <div className="relative">
                          <Image
                            id="showImage"
                            src={
                              existingImage ||
                              (croppedImage
                                ? URL.createObjectURL(croppedImage)
                                : '/images/default-group-image.jpg') ||
                              (formData.image
                                ? URL.createObjectURL(formData.image)
                                : '/images/default-group-image.jpg')
                            }
                            alt="Group image"
                            width={croppedAreaPixels?.width || 1920}
                            height={croppedAreaPixels?.height || 1080}
                            className="w-auto h-80 object-cover rounded-lg"
                          />
                          <button
                            title="Remove image"
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, image: null });
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
                            htmlFor="image"
                            className="relative cursor-pointer bg-indigo-500 hover:bg-indigo-600 text-white rounded-md font-medium py-2 px-4 transition duration-300 ease-in-out focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                          >
                            <span>Upload an image</span>
                            <input
                              id="image"
                              name="image"
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
                  Group Name
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
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Group Status
                </label>
                <CardSelect
                  options={statusOptions}
                  value={formData.status}
                  onChange={(value) =>
                    handleInputChange({
                      target: { name: "status", value },
                    } as React.ChangeEvent<HTMLSelectElement>)
                  }
                  name="status"
                />
                {errors.status && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    {errors.status}
                  </p>
                )}
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Additional Details
              </h2>
              <div>
                <label
                  htmlFor="number_of_members"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Number of Members: {formData.number_of_members}{" "}
                </label>
                <Box position="relative" width="100%" pb="8">
                  <Slider
                    id="number_of_members"
                    min={1}
                    max={100}
                    step={1}
                    value={formData.number_of_members}
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
                      label={`${formData.number_of_members} members`}
                    >
                      <SliderThumb />
                    </Tooltip>
                  </Slider>
                </Box>
                {errors.number_of_members && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    {errors.number_of_members}
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
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-md dark:bg-indigo-600 dark:hover:bg-indigo-700"
              >
                Update Group
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Image Cropping Modal */}
      {isCropping && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 !mt-0">
          <div className="bg-white p-4 rounded-lg w-full max-w-2xl">
            <div className="relative h-96">
              <Cropper
                image={
                  formData.image ? URL.createObjectURL(formData.image) : ""
                }
                crop={crop}
                zoom={zoom}
                aspect={2.7}
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

export default EditGroup;
