"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { handleErrorApi } from "@/lib/utils";
import { useEffect, useState, useCallback } from "react";
import {
  AccountResType,
  UpdateMeBody,
} from "@/schemaValidations/account.schema";
import accountApiRequest from "@/apiRequests/account";
import Image from "next/image";
import { z } from "zod";
import Cropper, { Area } from 'react-easy-crop';
import { createCropFunction } from "@/lib/utils";
import {
  Box,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Tooltip,
  useToast,
} from "@chakra-ui/react";

type Profile = AccountResType["data"];

const ProfileForm = () => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>({} as Profile);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [cropFunction, setCropFunction] = useState<((crop: Area) => Promise<File>) | null>(null);

  const formSchema = UpdateMeBody.extend({
    avatar: z.instanceof(File).optional(),
    dateOfBirth: z.string().optional(),
    gender: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    name: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: profile.name,
      phone: profile.phone,
      address: profile.address,
      gender: profile.sex,
    },
  });

  useEffect(() => {
    const getProfile = async () => {
      try {
        const result = await accountApiRequest.me();
        setProfile(result.payload.data);

        // Set avatar preview after profile is fetched
        setAvatarPreview(
          result.payload.data.avatar
            ? process.env.NEXT_PUBLIC_API_ENDPOINT + result.payload.data.avatar
            : "/images/no-image.png"
        );

        // Update form with the fetched profile data
        const formData = {
          name: result.payload.data.name,
          address: result.payload.data.address,
          phone: result.payload.data.phone,
          avatar: result.payload.data.avatar
            ? new File([result.payload.data.avatar], "avatar")
            : undefined,
          gender: result.payload.data.sex,
        };

        form.reset(formData);
      } catch (error) {
        handleErrorApi({ error });
      }
    };
    getProfile();
  }, []);

  useEffect(() => {
    if (avatarFile) {
      const objectUrl = URL.createObjectURL(avatarFile);
      setCropFunction(() => createCropFunction(objectUrl));
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [avatarFile]);

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = useCallback(async () => {
    if (cropFunction && croppedAreaPixels) {
      const croppedFile = await cropFunction(croppedAreaPixels);
      const renamedCroppedImage = new File([croppedFile], avatarFile?.name || "cropped_avatar.jpg", { type: croppedFile.type });
      setAvatarFile(renamedCroppedImage);
      setAvatarPreview(URL.createObjectURL(renamedCroppedImage));
      setIsCropping(false);
    }
  }, [cropFunction, croppedAreaPixels, avatarFile]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (loading) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name || "");
      formData.append("phone", values.phone || "");
      formData.append("dateOfBirth", values.dateOfBirth || "");
      formData.append("gender", values.gender || "");
      formData.append("address", values.address || "");
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const result = await accountApiRequest.updateMe(formData);
      toast({
        title: "Profile updated successfully",
        description: "Your profile has been updated.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      router.refresh();
    } catch (error: any) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-6xl flex-shrink-0 w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-2xl drop-shadow-md p-6"
        noValidate
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="space-y-4 col-span-1">
            <FormField
              control={form.control}
              name="avatar"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <div className="flex flex-col justify-center items-center">
                    {avatarPreview && (
                      <div className="relative block">
                        <Image
                          src={avatarPreview}
                          alt="Avatar preview"
                          width={144}
                          height={144}
                          className="mb-2 mx-auto w-36 h-36 object-cover rounded-full cursor-pointer border-4 border-solid border-primary-500 dark:border-primary-300"
                          onClick={() => {
                            const fileInput = document.createElement("input");
                            fileInput.type = "file";
                            fileInput.accept = "image/*";
                            fileInput.onchange = (event: Event) => {
                              const target = event.target as HTMLInputElement;
                              if (target.files) {
                                handleImageUpload({ target: { files: target.files } } as React.ChangeEvent<HTMLInputElement>);
                              }
                            };
                            fileInput.click();
                          }}
                        />
                        <div className="relative bottom-0 right-0 bg-primary-500 dark:bg-primary-300 text-slate-800 dark:text-white px-2 py-2 rounded-full text-base font-bold">
                          {profile.email}
                        </div>
                      </div>
                    )}
                    <button
                      type="button"
                      className=" text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline focus:outline-none"
                      onClick={() => {
                        // Handle forgot password action
                      }}
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4 col-span-3">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium dark:text-gray-200">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your name"
                        type="text"
                        {...field}
                        className="w-full h-[44px] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-300 focus:border-primary-500 dark:bg-gray-900 dark:text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium dark:text-gray-200">
                      Phone
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your phone number"
                        type="tel"
                        {...field}
                        className="w-full h-[44px] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-300 focus:border-primary-500 dark:bg-gray-900 dark:text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium dark:text-gray-200">
                      Date of Birth
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your date of birth"
                        type="date"
                        {...field}
                        className="w-full h-[44px] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-300 focus:border-primary-500 dark:bg-gray-900 dark:text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium dark:text-gray-200">
                      Gender
                    </FormLabel>
                    <FormControl>
                      <select
                        title="Gender"
                        onChange={field.onChange}
                        value={profile.sex}
                        className="w-full h-[44px] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-300 focus:border-primary-500 dark:bg-gray-900 dark:text-white"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium dark:text-gray-200">
                      Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your address"
                        type="text"
                        {...field}
                        className="w-full h-[44px] border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-300 focus:border-primary-500 dark:bg-gray-900 dark:text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button
              type="submit"
              className="!mt-4  bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/70 rounded-md px-4 py-2 font-medium"
            >
              Update Profile
            </Button>

            {/* <div className="flex justify-center">
              <Button
                type="submit"
                className="!mt-4 bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/70 rounded-md px-4 py-2 font-medium"
              >
                Update Profile
              </Button>
            </div> */}
          </div>
        </div>
      </form>

      {/* Image Cropping Modal */}
      {isCropping && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 !mt-0">
          <div className="bg-white p-4 rounded-lg w-full max-w-2xl">
            <div className="relative h-96">
              <Cropper
                image={avatarPreview || ""}
                crop={crop}
                zoom={zoom}
                cropShape="round"
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
    </Form>
  );
};

export default ProfileForm;
