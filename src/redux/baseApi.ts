import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import { getStoredToken, storeToken, clearToken } from "@/utils/tokenStorage";
import { initializeAuth, logout } from "@/redux/features/auth/authSlice";
import { tagTypesList } from "./tag-types";

// Create a mutex to prevent multiple simultaneous refresh attempts
const mutex = new Mutex();

// Base query with default configuration
const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1`,
  credentials: "include", // Include cookies for refresh token
  prepareHeaders: (headers) => {
    const token = getStoredToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Custom base query with re-authentication logic
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Wait until the mutex is available without locking it
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  // Check for 401 Unauthorized error
  if (result.error && result.error.status === 401) {
    console.log(
      "baseQueryWithReauth: 401 error detected, attempting token refresh"
    );

    // Prevent multiple simultaneous refresh attempts
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        console.log("baseQueryWithReauth: Calling refresh token endpoint");
        // Call the refresh token endpoint
        const refreshResult = await baseQuery(
          {
            url: "/users/refresh-token",
            method: "POST",
            credentials: "include", // Ensure refresh token cookie is sent
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          // Extract new access token from response
          const newAccessToken = (refreshResult.data as any).data.accessToken;
          if (newAccessToken) {
            console.log(
              "baseQueryWithReauth: New access token received:",
              newAccessToken
            );
            // Store the new access token
            storeToken(newAccessToken);
            // Update Redux state with the new token
            api.dispatch(initializeAuth({ accessToken: newAccessToken }));
            // Retry the original request with the new token
            console.log("baseQueryWithReauth: Retrying original request");
            result = await baseQuery(args, api, extraOptions);
          } else {
            console.error(
              "baseQueryWithReauth: No access token in refresh response"
            );
            // If no access token is returned, log out
            api.dispatch(logout());
            clearToken();
          }
        } else {
          console.error(
            "baseQueryWithReauth: Refresh token request failed:",
            refreshResult.error
          );
          // If refresh token request fails, log out
          api.dispatch(logout());
          clearToken();
        }
      } catch (error) {
        console.error(
          "baseQueryWithReauth: Error during token refresh:",
          error
        );
        // Handle unexpected errors during refresh
        api.dispatch(logout());
        clearToken();
      } finally {
        release();
      }
    } else {
      // If another refresh is in progress, wait for it to complete
      console.log(
        "baseQueryWithReauth: Waiting for another refresh to complete"
      );
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

// Create base API with the custom base query
const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: tagTypesList,
});

export default baseApi;
