"use client";

import { cn } from "@/lib/utils";
import { useGetAllCoursesQuery } from "@/redux/features/course/courseApi";
import CourseCard from "./CourseCard";

const OurCourses = () => {
  const { data, isLoading } = useGetAllCoursesQuery();

  return (
    <section className='py-12 md:py-20 w-full bg-white relative'>
      {/* Teal Glow Background
      <div
        className='absolute inset-0 z-0'
        style={{
          backgroundImage: `
            radial-gradient(125% 125% at 50% 10%, #ffffff 40%, #14b8a6 100%)
          `,
          backgroundSize: "100% 100%",
        }}
      /> */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        <h2
          className={cn(
            "text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#00564A] to-[#00A892] bg-clip-text text-transparent mb-8 text-center"
          )}>
          Our Courses
        </h2>
        {isLoading ? (
          <div className='text-center text-gray-600'>Loading courses...</div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {data?.data?.map((course: any) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default OurCourses;
