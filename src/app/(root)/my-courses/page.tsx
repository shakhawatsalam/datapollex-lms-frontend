"use client";
import { useGetCourseByIdQuery } from "@/redux/features/course/courseApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useAppSelector } from "@/redux/hook";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";

// Mock user data as fallback
const fallbackUserData = {
  user: {
    courses: [
      {
        courseId: "68b5d4750ce4ed2713d55498",
        completedLectures: [],
        progress: 0,
        _id: "68b5d6340ce4ed2713d554c3",
      },
    ],
  },
};

const MyCourses = () => {
  const user = useAppSelector(selectCurrentUser);
  // Use fallback data if user is not available during SSR or initial render
  const coursesToDisplay = user?.courses?.length
    ? user.courses
    : fallbackUserData.user.courses;

  // Fetch course details for each enrolled course
  const courseQueries = coursesToDisplay.map((enrolledCourse) =>
    useGetCourseByIdQuery(enrolledCourse.courseId, {
      skip: !enrolledCourse.courseId,
    })
  );

  // Combine course data with progress
  const courses = courseQueries.map((query, index) => ({
    ...query.data?.data,
    progress: coursesToDisplay[index].progress,
    isLoading: query.isLoading,
    error: query.error,
  }));

  return (
    <div className='min-h-screen bg-gray-50 py-12 md:py-20'>
      {/* Header */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <h1
          className={cn(
            "text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#00564A] to-[#00A892] bg-clip-text text-transparent mb-8 text-center"
          )}>
          My Courses
        </h1>

        {/* Course Grid */}
        {courses.length === 0 ? (
          <div className='text-center text-gray-600'>
            No courses enrolled yet.
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {courses.map((course) => (
              <Card
                key={
                  course._id || coursesToDisplay[courses.indexOf(course)]._id
                }
                className='bg-white shadow-lg hover:shadow-xl transition-shadow'>
                <CardHeader>
                  <div className='relative w-full h-48'>
                    {course.isLoading ? (
                      <div className='w-full h-full bg-gray-200 flex items-center justify-center rounded-t-lg'>
                        <span className='text-gray-500'>Loading...</span>
                      </div>
                    ) : course.error || !course.thumbnail?.url ? (
                      <div className='w-full h-full bg-gray-200 flex items-center justify-center rounded-t-lg'>
                        <span className='text-gray-500'>No Image</span>
                      </div>
                    ) : (
                      <Image
                        src={course.thumbnail.url}
                        alt={course.title || "Course"}
                        fill
                        className='object-cover rounded-t-lg'
                        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                      />
                    )}
                  </div>
                </CardHeader>
                <CardContent className='p-6'>
                  {course.isLoading ? (
                    <p className='text-center text-gray-600'>
                      Loading course...
                    </p>
                  ) : course.error ? (
                    <p className='text-center text-red-600'>
                      Error loading course
                    </p>
                  ) : (
                    <>
                      <CardTitle
                        className={cn(
                          "text-xl font-semibold bg-gradient-to-r from-[#00564A] to-[#00A892] bg-clip-text text-transparent mb-2"
                        )}>
                        {course.title || "Course Title"}
                      </CardTitle>
                      <p className='text-gray-600 text-sm mb-4 line-clamp-2'>
                        {course.description || "No description available"}
                      </p>
                      <div className='mb-4'>
                        <div className='flex justify-between items-center mb-2'>
                          <span className='text-sm text-gray-600'>
                            Progress
                          </span>
                          <span className='text-sm font-semibold text-[#3DB6A6]'>
                            {course.progress.toFixed(0)}%
                          </span>
                        </div>
                        <Progress value={course.progress} className='h-2' />
                      </div>
                      <Button
                        asChild
                        className={cn(
                          "w-full bg-gradient-to-r from-[#3DB6A6] to-[#2D7F74] text-white hover:from-[#2D7F74] hover:to-[#3DB6A6] rounded-full px-4 py-2 text-sm font-medium"
                        )}>
                        <Link href={`/view-content/${course._id}`}>
                          Continue Course
                        </Link>
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
