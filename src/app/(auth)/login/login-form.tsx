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
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";
import { useToast } from "@chakra-ui/react"; // Adjusted import to Chakra UI's useToast
import authApiRequest from "@/apiRequests/auth";
import { useRouter } from "next/navigation";
import { handleErrorApi } from "@/lib/utils";
import { useState } from "react";
import { useAppContext } from "@/app/app-provider";

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const { setUser, setSessionToken } = useAppContext();
  const toast = useToast(); // Chakra UI's toast initialization
  const router = useRouter();
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: LoginBodyType) {
    if (loading) return;
    setLoading(true);
    try {
      const result = await authApiRequest.login(values);
      await authApiRequest.auth({
        sessionToken: result.payload.data.access_token,
        expiresAt: result.payload.data.expires_at,
        role: result.payload.data.account.role,
      });
      toast({
        description: "Login successful",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setUser(result.payload.data.account);
      setSessionToken(result.payload.data.access_token);
      router.push("/");
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
    <div className="max-w-xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-lg ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-row items-center justify-between lg:justify-between mb-4">
            <p className="mb-0 me-4 text-lg">Sign in with</p>

            <div className="flex space-x-2">
              <button
                title="Google"
                type="button"
                className="flex justify-center items-center h-9 w-9 rounded-full bg-primary fill-white p-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                  className="h-4 w-4"
                >
                  <path d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z" />
                </svg>
              </button>

              <button
                type="button"
                title="Facebook"
                className="flex justify-center items-center h-9 w-9 rounded-full bg-primary fill-white p-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="h-4 w-4"
                >
                  <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                </svg>
              </button>

              <button
                type="button"
                title="Apple"
                className="flex justify-center items-center h-9 w-9 rounded-full bg-primary fill-white p-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  className="h-4 w-4"
                >
                  <path d="M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="my-4 flex items-center justify-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300 dark:before:border-neutral-500 dark:after:border-neutral-500">
            <p className="mx-4 mb-0 text-center font-semibold dark:text-white">
              Or
            </p>
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="relative mb-6">
                <FormLabel htmlFor={field.name}>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    className="peer block w-full rounded bg-transparent px-3 py-[0.32rem]"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="relative mb-6">
                <FormLabel htmlFor={field.name}>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your password"
                    className="peer block w-full rounded bg-transparent px-3 py-[0.32rem]"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mb-6 flex items-center justify-between">
            <div className="form-group form-check">
              <input
                type="checkbox"
                id="remember-me"
                className="form-check-input h-4 w-4 rounded-sm border border-neutral-300 bg-white align-top transition checked:border-primary checked:bg-primary"
              />
              <label
                className="form-check-label pl-2 text-neutral-800"
                htmlFor="remember-me"
              >
                Remember me
              </label>
            </div>
            <a href="#!" className="text-primary hover:text-primary-accent-400">
              Forgot password?
            </a>
          </div>

          <div className="flex justify-center">
            <Button
              disabled={loading}
              type="submit"
              className="bg-primary px-7 py-2.5 text-sm font-medium text-white"
            >
              {loading ? "Loading..." : "Login"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
