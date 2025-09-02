import baseApi from "@/redux/baseApi";
import { tagTypes } from "@/redux/tag-types";
import { storeToken, getStoredToken, clearToken } from "@/utils/tokenStorage";

type RegisterCredentials = {
  email: string;
  password: string;
  name?: string;
};

type LoginCredentials = {
  email: string;
  password: string;
};

type ChangePasswordCredentials = {
  oldPassword: string;
  newPassword: string;
};

type UserInfo = {
  success: boolean;
  data: {
    user?: {
      _id: string;
      name: string;
      email: string;
      role: string;
      profilePic: {
        public_id: string;
        url: string;
      };
      courses: Array<{
        courseId: string;
        completedLectures: string[];
        progress: number;
        _id: string;
      }>;
      createdAt: string;
      updatedAt: string;
      __v: number;
    };
    accessToken?: string;
  };
  meta: Record<string, any>;
};

type LogoutResponse = {
  success: boolean;
  message: string;
};

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation<UserInfo, RegisterCredentials>({
      query: (credentials) => ({
        url: "/users/register",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: UserInfo) => {
        if (response.data.accessToken) {
          storeToken(response.data.accessToken);
        }
        return response;
      },
      invalidatesTags: [tagTypes.profile],
    }),
    loginUser: builder.mutation<UserInfo, LoginCredentials>({
      query: (credentials) => ({
        url: "/users/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: UserInfo) => {
        if (response.data.accessToken) {
          storeToken(response.data.accessToken);
        }
        return response;
      },
      invalidatesTags: [tagTypes.profile],
    }),
    refreshToken: builder.mutation<UserInfo, void>({
      query: () => ({
        url: "/users/refresh-token",
        method: "POST",
      }),
      transformResponse: (response: UserInfo) => {
        if (response.data.accessToken) {
          storeToken(response.data.accessToken);
        }
        return response;
      },
      invalidatesTags: [tagTypes.profile],
    }),
    changePassword: builder.mutation<UserInfo, ChangePasswordCredentials>({
      query: (credentials) => ({
        url: "/users/change-password",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: [tagTypes.profile],
    }),
    getProfile: builder.query<UserInfo, void>({
      query: () => ({
        url: "/users/profile",
      }),
      providesTags: [tagTypes.profile],
      transformErrorResponse: (response: any) => {
        console.error("getProfile error:", response);
        return response;
      },
    }),
    logoutUser: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: "/users/logout",
        method: "POST",
        headers: {
          authorization: `Bearer ${getStoredToken()}`,
        },
      }),
      transformResponse: (response: LogoutResponse) => {
        clearToken();
        return response;
      },
      invalidatesTags: [tagTypes.profile],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useRefreshTokenMutation,
  useChangePasswordMutation,
  useGetProfileQuery,
  useLogoutUserMutation,
} = authApi;
