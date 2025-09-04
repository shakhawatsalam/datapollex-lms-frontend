import { IGenericResponse } from "@/interface/common";
import { ICourse, ILecture, IModule } from "@/interface/course";
import { IUserResponse } from "@/interface/user";
import baseApi from "@/redux/baseApi";
import { tagTypes } from "@/redux/tag-types";


interface CreateCourseInput {
  title: string;
  description: string;
  price: number;
  thumbnail: { public_id: string; url: string };
  modules: Array<{
    title: string;
    moduleNumber: number;
    lectures: Array<{
      title: string;
      videoUrl: string;
      pdfNotes: Array<{ public_id: string; url: string }>;
    }>;
  }>;
}

interface UpdateCourseInput {
  title?: string;
  description?: string;
  price?: number;
  thumbnail?: { public_id: string; url: string };
  modules?: Array<{
    title?: string;
    moduleNumber?: number;
    lectures?: Array<{
      title?: string;
      videoUrl?: string;
      pdfNotes?: Array<{ public_id: string; url: string }>;
    }>;
  }>;
}

interface AddModuleInput {
  title: string;
  moduleNumber: number;
  lectures?: Array<{
    title: string;
    videoUrl: string;
    pdfNotes: Array<{ public_id: string; url: string }>;
  }>;
}

interface UpdateModuleInput {
  title?: string;
  moduleNumber?: number;
}

interface AddLectureInput {
  title: string;
  videoUrl: string;
  pdfNotes: Array<{ public_id: string; url: string }>;
}

interface UpdateLectureInput {
  title?: string;
  videoUrl?: string;
  pdfNotes?: Array<{ public_id: string; url: string }>;
}

interface LectureFilter {
  courseId?: string;
  moduleId?: string;
  search?: string;
}

const courseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCourse: builder.mutation<
      IGenericResponse<ICourse>,
      CreateCourseInput
    >({
      query: (data) => ({
        url: "/courses",
        method: "POST",
        body: data,
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
      { id: string; data: UpdateCourseInput }
    >({
      query: ({ id, data }) => ({
        url: `/courses/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [tagTypes.course],
    }),
    deleteCourse: builder.mutation<IGenericResponse<null>, string>({
      query: (id) => ({
        url: `/courses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.course, tagTypes.profile],
    }),
    addModule: builder.mutation<
      IGenericResponse<IModule>,
      { courseId: string; data: AddModuleInput }
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
      { courseId: string; moduleId: string; data: UpdateModuleInput }
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
      invalidatesTags: [tagTypes.course, tagTypes.profile],
    }),
    addLecture: builder.mutation<
      IGenericResponse<ILecture>,
      { courseId: string; moduleId: string; data: AddLectureInput }
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
        data: UpdateLectureInput;
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
      invalidatesTags: [tagTypes.course, tagTypes.profile],
    }),
    getLectures: builder.query<IGenericResponse<ILecture[]>, LectureFilter>({
      query: (filter) => ({
        url: "/lectures",
        method: "GET",
        params: filter,
      }),
      providesTags: [tagTypes.course],
    }),
    enrollInCourse: builder.mutation<IGenericResponse<IUserResponse>, string>({
      query: (courseId) => ({
        url: `/courses/${courseId}/enroll`,
        method: "POST",
      }),
      invalidatesTags: [tagTypes.profile],
    }),
    markLectureComplete: builder.mutation<
      IGenericResponse<IUserResponse>,
      { courseId: string; moduleId: string; lectureId: string }
    >({
      query: ({ courseId, moduleId, lectureId }) => ({
        url: `/courses/${courseId}/modules/${moduleId}/lectures/${lectureId}/complete`,
        method: "POST",
      }),
      invalidatesTags: [tagTypes.profile],
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
