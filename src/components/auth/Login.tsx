"use client";

import { motion } from "framer-motion";
import { Loader, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useLoginUserMutation } from "@/redux/features/auth/authApi";
import { storeToken } from "@/utils/tokenStorage";
import { useRouter } from "next/navigation";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Type guard to check if error is FetchBaseQueryError
const isFetchBaseQueryError = (
  error: unknown
): error is FetchBaseQueryError => {
  return (error as FetchBaseQueryError).status !== undefined;
};

// Type guard to check if data contains a message
const hasErrorMessage = (data: unknown): data is { message: string } => {
  return (
    data !== null &&
    typeof data === "object" &&
    "message" in data &&
    typeof (data as any).message === "string"
  );
};

const Login = () => {
  const [loginUser, { isLoading, isError, error: logInError }] =
    useLoginUserMutation();
  const router = useRouter();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const logInResponse = await loginUser(data).unwrap();
      if (logInResponse.success && logInResponse.data.accessToken) {
        storeToken(logInResponse.data.accessToken);
        router.push("/"); 
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // Extract error message safely
  let errorMessage: string | null = null;
  if (isError && isFetchBaseQueryError(logInError)) {
    if (hasErrorMessage(logInError.data)) {
      errorMessage = logInError.data.message;
    } else {
      errorMessage = "An unexpected error occurred";
    }
  } else if (isError) {
    errorMessage = "An unexpected error occurred";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='max-w-md w-full bg-white bg-opacity-90 backdrop-filter backdrop-blur-xl rounded-2xl shadow-sm overflow-hidden'>
      <div className='p-8'>
        <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#3DB6A6] to-[#2D7F74] text-transparent bg-clip-text'>
          Welcome Back
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className='relative'>
                      <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
                      <Input
                        type='email'
                        placeholder='Email Address'
                        className='pl-10 bg-gray-100 text-gray-800 placeholder-gray-400 border-none focus:ring-2 focus:ring-[#3DB6A6]'
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className='text-red-500' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className='relative'>
                      <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
                      <Input
                        type='password'
                        placeholder='Password'
                        className='pl-10 bg-gray-100 text-gray-800 placeholder-gray-400 border-none focus:ring-2 focus:ring-[#3DB6A6]'
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className='text-red-500' />
                </FormItem>
              )}
            />
            <div className='flex justify-end'>
              {/* <Link
                href="/forgot-password"
                className="text-sm text-[#3DB6A6] hover:underline"
              >
                Forgot password?
              </Link> */}
            </div>
            {errorMessage && (
              <p className='text-red-500 font-semibold'>{errorMessage}</p>
            )}
            <motion.button
              className='w-full py-3 px-4 bg-gradient-to-r from-[#3DB6A6] to-[#2D7F74] text-white font-bold rounded-lg shadow-lg hover:from-[#2D7F74] hover:to-[#3DB6A6] focus:outline-none focus:ring-2 focus:ring-[#3DB6A6] focus:ring-offset-2 focus:ring-offset-white transition duration-200'
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type='submit'
              disabled={isLoading}>
              {isLoading ? (
                <Loader className='w-6 h-6 animate-spin mx-auto' />
              ) : (
                "Login"
              )}
            </motion.button>
          </form>
        </Form>
      </div>
      <div className='px-8 py-4 bg-gray-50 bg-opacity-50 flex justify-center'>
        <p className='text-sm text-gray-600'>
          Don&apos;t have an account?{" "}
          <Link href='/register' className='text-[#3DB6A6] hover:underline'>
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Login;
