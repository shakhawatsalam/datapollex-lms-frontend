import { getStoredToken } from "@/utils/tokenStorage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// create base api
const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1`,
    credentials: "include", 
    prepareHeaders: (headers) => {
      const token = getStoredToken();

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: () => ({}),
});

export default baseApi;
