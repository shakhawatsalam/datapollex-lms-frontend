"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  initializeAuth,
  setCredentials,
} from "@/redux/features/auth/authSlice";
import { useGetProfileQuery } from "@/redux/features/auth/authApi";
import { getStoredToken } from "@/utils/tokenStorage";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const dispatch = useDispatch();

  // Get token from localStorage on mount
  const storedToken = getStoredToken();

  // Only fetch profile if we have a token
  const {
    data: profileData,
    isLoading,
    isError,
  } = useGetProfileQuery(undefined, {
    skip: !storedToken, // Skip if no token
  });

  useEffect(() => {
    if (!storedToken) {
      // No token found, user is not authenticated
      dispatch(initializeAuth({ accessToken: null }));
      return;
    }

    if (profileData?.success && profileData.data.user) {
      // We have both token and user data
      dispatch(
        setCredentials({
          user: profileData.data.user,
          accessToken: storedToken,
        })
      );
    } else if (isError) {
      // Token exists but profile fetch failed (token might be invalid)
      dispatch(initializeAuth({ accessToken: null }));
      // Optionally clear the invalid token
      localStorage.removeItem("accessToken");
    } else if (!isLoading && storedToken) {
      // We have token but no profile data yet
      dispatch(initializeAuth({ accessToken: storedToken }));
    }
  }, [dispatch, storedToken, profileData, isError, isLoading]);

  return <>{children}</>;
};
