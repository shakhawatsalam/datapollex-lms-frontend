import { IGenericResponse } from "@/interface/common";
import { ICourse, ILecture, IModule } from "@/interface/course";
import { IUserResponse } from "@/interface/user";
import baseApi from "@/redux/baseApi";
import { tagTypes } from "@/redux/tag-types";


const courseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCourse: builder.mutation<IGenericResponse<ICourse>, FormData>({
      query: (formData) => ({
        url: "/courses",
        method: "POST",
        body: formData,
        contentType: "multipart/form-data",
      }),
      invalidatesTags: [tagTypes.course],
    }),

    getAllCourses: builder.query<IGenericResponse<ICourse[]>, void>({
      query: () => ({
        url: "/courses",
        method: "GET",
      }),
      providesTags: [tagTypes.course],
    }),

    getCourseById: builder.query<IGenericResponse<ICourse>, string>({
      query: (id) => ({
        url: `/courses/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.course],
    }),

    updateCourse: builder.mutation<
      IGenericResponse<ICourse>,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/courses/${id}`,
        method: "PATCH",
        body: data,
        contentType: "multipart/form-data",
      }),
      invalidatesTags: [tagTypes.course],
    }),

    deleteCourse: builder.mutation<IGenericResponse<null>, string>({
      query: (id) => ({
        url: `/courses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.course],
    }),

    addModule: builder.mutation<
      IGenericResponse<IModule>,
      { courseId: string; data: Partial<IModule> }
    >({
      query: ({ courseId, data }) => ({
        url: `/courses/${courseId}/modules`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.course],
    }),

    updateModule: builder.mutation<
      IGenericResponse<IModule>,
      { courseId: string; moduleId: string; data: Partial<IModule> }
    >({
      query: ({ courseId, moduleId, data }) => ({
        url: `/courses/${courseId}/modules/${moduleId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [tagTypes.course],
    }),

    deleteModule: builder.mutation<
      IGenericResponse<null>,
      { courseId: string; moduleId: string }
    >({
      query: ({ courseId, moduleId }) => ({
        url: `/courses/${courseId}/modules/${moduleId}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.course],
    }),

    addLecture: builder.mutation<
      IGenericResponse<ILecture>,
      { courseId: string; moduleId: string; data: Partial<ILecture> }
    >({
      query: ({ courseId, moduleId, data }) => ({
        url: `/courses/${courseId}/modules/${moduleId}/lectures`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.course],
    }),

    updateLecture: builder.mutation<
      IGenericResponse<ILecture>,
      {
        courseId: string;
        moduleId: string;
        lectureId: string;
        data: Partial<ILecture>;
      }
    >({
      query: ({ courseId, moduleId, lectureId, data }) => ({
        url: `/courses/${courseId}/modules/${moduleId}/lectures/${lectureId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [tagTypes.course],
    }),

    deleteLecture: builder.mutation<
      IGenericResponse<null>,
      { courseId: string; moduleId: string; lectureId: string }
    >({
      query: ({ courseId, moduleId, lectureId }) => ({
        url: `/courses/${courseId}/modules/${moduleId}/lectures/${lectureId}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.course],
    }),

    getLectures: builder.query<
      IGenericResponse<ILecture[]>,
      { courseId?: string; moduleId?: string; search?: string }
    >({
      query: (params) => ({
        url: "/courses/lectures",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.course],
    }),

    enrollInCourse: builder.mutation<IGenericResponse<IUserResponse>, string>({
      query: (id) => ({
        url: `/courses/${id}/enroll`,
        method: "POST",
      }),
      invalidatesTags: [tagTypes.user, tagTypes.course],
    }),

    markLectureComplete: builder.mutation<
      IGenericResponse<IUserResponse>,
      { courseId: string; moduleId: string; lectureId: string }
    >({
      query: ({ courseId, moduleId, lectureId }) => ({
        url: `/courses/${courseId}/modules/${moduleId}/lectures/${lectureId}/complete`,
        method: "POST",
      }),
      invalidatesTags: [tagTypes.user, tagTypes.course],
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useGetAllCoursesQuery,
  useGetCourseByIdQuery,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useAddModuleMutation,
  useUpdateModuleMutation,
  useDeleteModuleMutation,
  useAddLectureMutation,
  useUpdateLectureMutation,
  useDeleteLectureMutation,
  useGetLecturesQuery,
  useEnrollInCourseMutation,
  useMarkLectureCompleteMutation,
} = courseApi;
