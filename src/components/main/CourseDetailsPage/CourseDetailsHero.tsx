import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Lecture {
  _id: string;
  title: string;
  videoUrl?: string;
  pdfNotes?: { public_id: string; url: string }[];
}

interface Module {
  _id: string;
  moduleNumber: number;
  title: string;
  lectures: Lecture[];
}

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  thumbnail?: { public_id: string; url: string };
  modules: Module[];
}

interface CourseDetailsHeroProps {
  course: Course;
  isEnrolled: boolean;
  handleEnroll: (courseId: string) => void;
}

const renderStars = (rating: number, size = "w-4 h-4") => {
  return (
    <div className='flex items-center'>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            size,
            star <= Math.floor(rating)
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
          )}
        />
      ))}
    </div>
  );
};

const CourseDetailsHero = ({
  course,
  isEnrolled,
  handleEnroll,
}: CourseDetailsHeroProps) => {
  return (
    <div className='bg-gradient-to-r from-[#00564A] to-[#00A892] text-white'>
      <div className='max-w-7xl mx-auto px-4 py-12'>
        <div className='flex lg:flex-row flex-col justify-between gap-8'>
          <div className='lg:w-[60%] xl:w-[70%]'>
            <h1 className='text-4xl font-bold mb-4'>{course.title}</h1>
            <p className='text-xl mb-6 text-teal-100'>{course.description}</p>
            <div className='flex items-center gap-4 mb-6'>
              <div className='flex items-center gap-2'>
                <span className='text-yellow-400 font-bold text-lg'>4.8</span>
                {renderStars(4.8)}
                <span className='text-teal-100'>(158,123 ratings)</span>
              </div>
              <div className='flex items-center gap-2'>
                <Users className='w-5 h-5' />
                <span>158,123 Students</span>
              </div>
            </div>
            <Button
              size='lg'
              onClick={() => handleEnroll(course._id)}
              className='bg-white text-[#3DB6A6] hover:bg-gray-100 font-semibold px-8 py-3 rounded-full'
              disabled={isEnrolled}>
              {isEnrolled ? "Already Enrolled" : "Enroll Now"}
            </Button>
          </div>
          <div className='flex-1'>
            <Card className='sticky top-4 rounded-xl p-0'>
              <div className='relative'>
                {course.thumbnail?.url ? (
                  <div className='overflow-hidden'>
                    <Image
                      src={course.thumbnail.url}
                      alt={course.title}
                      width={600}
                      height={400}
                      className='w-full h-48 object-cover rounded-t-lg'
                    />
                  </div>
                ) : (
                  <div className='w-full h-48 bg-gray-200 flex items-center justify-center rounded-t-lg'>
                    <span className='text-gray-500'>No Image</span>
                  </div>
                )}
              </div>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between mb-4'>
                  <div>
                    <span className='text-3xl font-bold text-[#3DB6A6]'>
                      ${course.price.toFixed(2)}
                    </span>
                  </div>
                  <div className='bg-red-500 text-white text-xs font-medium px-2.5 py-0.5 rounded'>
                    50% OFF
                  </div>
                </div>
                <div className='space-y-3 mb-6'>
                  <Button
                    className='w-full bg-gradient-to-r from-[#3DB6A6] to-[#2D7F74] hover:from-[#2D7F74] hover:to-[#3DB6A6] rounded-full'
                    size='lg'>
                    Add to Cart
                  </Button>
                  <Button
                    onClick={() => handleEnroll(course._id)}
                    variant='outline'
                    className='w-full border-[#3DB6A6] text-[#3DB6A6] hover:bg-[#3DB6A6] hover:text-white rounded-full'
                    size='lg'
                    disabled={isEnrolled}>
                    {isEnrolled ? "Already Enrolled" : "Enroll Now"}
                  </Button>
                </div>
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Price</span>
                    <span className='font-semibold'>
                      ${course.price.toFixed(2)}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Instructor</span>
                    <span className='font-semibold'>Dr. Jane Smith</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Lectures</span>
                    <span className='font-semibold'>
                      {course.modules.reduce(
                        (acc, mod) => acc + mod.lectures.length,
                        0
                      )}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Duration</span>
                    <span className='font-semibold'>~10 hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsHero;
