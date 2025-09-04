"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  initializeAuth,
  setCredentials,
  setLoading,
} from "@/redux/features/auth/authSlice";
import { useGetProfileQuery } from "@/redux/features/auth/authApi";
import { getStoredToken } from "@/utils/tokenStorage";

// Define the User interface to match the API response
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  profilePic: {
    public_id: string;
    url: string;
  };
  courses: {
    courseId: string;
    completedLectures: string[];
    progress: number;
    _id: string;
  }[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const dispatch = useDispatch();
  const [token, setToken] = useState<string | null>(null);

  // Get token on client-side mount
  useEffect(() => {
    const storedToken = getStoredToken();
    console.log("AuthProvider: Retrieved token:", storedToken);
    setToken(storedToken);
    dispatch(initializeAuth({ accessToken: storedToken }));
  }, [dispatch]);

  // Fetch profile if we have a token
  const {
    data: profileData,
    isLoading,
    isError,
    error,
    isFetching,
  } = useGetProfileQuery(undefined, {
    skip: !token,
    refetchOnMountOrArgChange: true, // Force refetch on mount
  });

  // Type guard to validate profileData.data as User
  const isValidUser = (data: any): data is User => {
    return (
      data &&
      typeof data._id === "string" &&
      typeof data.name === "string" &&
      typeof data.email === "string" &&
      typeof data.role === "string" &&
      data.profilePic &&
      typeof data.profilePic.public_id === "string" &&
      typeof data.profilePic.url === "string" &&
      Array.isArray(data.courses) &&
      data.courses.every(
        (course: any) =>
          typeof course.courseId === "string" &&
          Array.isArray(course.completedLectures) &&
          typeof course.progress === "number" &&
          typeof course._id === "string"
      ) &&
      typeof data.createdAt === "string" &&
      typeof data.updatedAt === "string" &&
      typeof data.__v === "number"
    );
  };

  useEffect(() => {
    console.log("AuthProvider: Profile query state:", {
      isLoading,
      isFetching,
      isError,
      error,
      profileData,
    });

    if (isLoading || isFetching) {
      dispatch(setLoading(true));
      return;
    }

    if (isError) {
      console.error("AuthProvider: Failed to fetch user profile:", error);
      dispatch(initializeAuth({ accessToken: null }));
      localStorage.removeItem("accessToken");
      setToken(null);
      dispatch(setLoading(false));
      return;
    }

    if (profileData?.success && profileData.data && token) {
      if (isValidUser(profileData.data)) {
        console.log("AuthProvider: Setting credentials:", profileData.data);
        dispatch(
          setCredentials({
            user: profileData.data, // Type-safe: validated as User
            accessToken: token,
          })
        );
      } else {
        console.error(
          "AuthProvider: Invalid user profile data:",
          profileData.data
        );
        dispatch(initializeAuth({ accessToken: null }));
        localStorage.removeItem("accessToken");
        setToken(null);
      }
    } else if (!isLoading && !isFetching && token) {
      console.warn("AuthProvider: No valid profile data:", profileData);
    }

    dispatch(setLoading(false));
  }, [dispatch, token, profileData, isError, isLoading, isFetching, error]);

  return <>{children}</>;
};
