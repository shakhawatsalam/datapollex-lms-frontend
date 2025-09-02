"use client";

import { motion } from "framer-motion";
import { Loader, Lock, Mail, User } from "lucide-react";
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
import { useRegisterUserMutation } from "@/redux/features/auth/authApi";
import { useRouter } from "next/navigation";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

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

const Register = () => {
  const router = useRouter();
  const [registerUser, { isLoading, isError, error: registerError }] =
    useRegisterUserMutation();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const registerResponse = await registerUser(data).unwrap();
      if (registerResponse.success) {
        router.push("/login");
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  // Extract error message safely
  let errorMessage: string | null = null;
  if (isError && isFetchBaseQueryError(registerError)) {
    if (hasErrorMessage(registerError.data)) {
      errorMessage = registerError.data.message;
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
      className='max-w-md w-full bg-white bg-opacity-90 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>
      <div className='p-8'>
        <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#3DB6A6] to-[#2D7F74] text-transparent bg-clip-text'>
          Create Your Account
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className='relative'>
                      <User className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
                      <Input
                        type='text'
                        placeholder='Full Name'
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
                "Register"
              )}
            </motion.button>
          </form>
        </Form>
      </div>
      <div className='px-8 py-4 bg-gray-50 bg-opacity-50 flex justify-center'>
        <p className='text-sm text-gray-600'>
          Already have an account?{" "}
          <Link href='/login' className='text-[#3DB6A6] hover:underline'>
            Log in
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Register;
