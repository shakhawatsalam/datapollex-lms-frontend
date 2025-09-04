"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { ICourse } from "@/interface/course";

interface CourseCardProps {
  course: ICourse;
}

const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <div className='bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105'>
      {/* Course Thumbnail */}
      <div className='relative w-full h-48'>
        {course.thumbnail?.url ? (
          <Image
            src={course.thumbnail.url}
            alt={course.title}
            fill
            className='object-cover'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
        ) : (
          <div className='w-full h-full bg-gray-200 flex items-center justify-center'>
            <span className='text-gray-500'>No Image</span>
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className='p-6'>
        <h3
          className={cn(
            "text-xl font-semibold bg-gradient-to-r from-[#00564A] to-[#00A892] bg-clip-text text-transparent mb-2"
          )}>
          {course.title}
        </h3>
        <p className='text-gray-600 text-sm mb-4 line-clamp-3'>
          {course.description}
        </p>
        <div className='flex justify-between items-center'>
          <span className='text-lg font-medium text-[#3DB6A6]'>
            ${course.price.toFixed(2)}
          </span>
          <Button
            asChild
            className={cn(
              "bg-gradient-to-r from-[#3DB6A6] to-[#2D7F74] text-white hover:from-[#2D7F74] hover:to-[#3DB6A6] rounded-full px-4 py-2 text-sm font-medium"
            )}>
            <Link href={`/courses/${course._id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
