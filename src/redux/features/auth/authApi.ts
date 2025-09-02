import baseApi from "@/redux/baseApi";
import { getStoredToken } from "@/utils/tokenStorage";

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

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation<UserInfo, RegisterCredentials>({
      query: (credentials) => ({
        url: "/users/register",
        method: "POST",
        body: credentials,
      }),
    }),
    loginUser: builder.mutation<UserInfo, LoginCredentials>({
      query: (credentials) => ({
        url: "/users/login",
        method: "POST",
        body: credentials,
      }),
    }),
    refreshToken: builder.mutation<UserInfo, void>({
      query: () => ({
        url: "/users/refresh-token",
        method: "POST",
      }),
    }),
    changePassword: builder.mutation<UserInfo, ChangePasswordCredentials>({
      query: (credentials) => ({
        url: "/users/change-password",
        method: "POST",
        body: credentials,
      }),
    }),
    getProfile: builder.query<UserInfo, void>({
      query: () => ({
        url: "/users/profile",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useRefreshTokenMutation,
  useChangePasswordMutation,
  useGetProfileQuery,
} = authApi;
