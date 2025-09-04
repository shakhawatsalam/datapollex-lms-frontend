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
      console.log("AuthProvider: Setting credentials:", profileData.data);
      dispatch(
        setCredentials({
          user: profileData.data, // Use profileData.data directly
          accessToken: token,
        })
      );
    } else if (!isLoading && !isFetching && token) {
      console.warn("AuthProvider: No valid profile data:", profileData);
    }

    dispatch(setLoading(false));
  }, [dispatch, token, profileData, isError, isLoading, isFetching, error]);

  return <>{children}</>;
};
