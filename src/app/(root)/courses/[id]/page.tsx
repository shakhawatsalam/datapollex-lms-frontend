"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Star, Play, Users, Award, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  useEnrollInCourseMutation,
  useGetCourseByIdQuery,
} from "@/redux/features/course/courseApi";
import { useAppSelector } from "@/redux/hook";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";

// Define types for course data
interface Lecture {
  _id: string;
  title: string;
  videoUrl?: string;
  pdfNotes?: { public_id: string; url: string }[]; // Updated to match API structure
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
  thumbnail?: { public_id: string; url: string }; // Updated to match API structure
  modules: Module[];
}

interface EnrolledCourse {
  courseId: string;
  completedLectures: string[];
  progress: number;
  _id: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  courses: EnrolledCourse[];
  profilePic: { public_id: string; url: string };
  createdAt: string;
  updatedAt: string;
}

interface EnrollResponse {
  success: boolean;
  data: User;
  message: string;
  meta: Record<string, any>;
}

const CourseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading, error } = useGetCourseByIdQuery(id, { skip: !id });
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const user = useAppSelector(selectCurrentUser) as User | null;
  const [enrollInCourse] = useEnrollInCourseMutation();

  const isEnrolled =
    user?.courses?.some((course) => course.courseId === id) || false;

  // Static data for instructor, reviews, and related courses
  const instructor = {
    name: "Dr. Jane Smith",
    title: "JavaScript Expert & Instructor",
    bio: "Dr. Jane Smith has over 15 years of experience in web development and teaching JavaScript. She leads the Web Dev Academy, mentoring thousands of students worldwide.",
    avatar: "/assets/avatar-5.png",
    students: "1,500,000 students",
    courses: "5 courses",
    reviews: "250,000 reviews",
    rating: 4.8,
  };

  const reviews = [
    {
      id: 1,
      user: "Emily Carter",
      avatar: "/assets/avatar-2.png",
      rating: 5,
      comment:
        "This course was a game-changer! The explanations are clear, and the examples are practical.",
      date: "2025-07-10",
      helpful: 120,
      verified: true,
    },
    {
      id: 2,
      user: "Michael Lee",
      avatar: "/assets/avatar-1.png",
      rating: 4.5,
      comment:
        "Great content, though I wish there were more advanced topics covered.",
      date: "2025-08-01",
      helpful: 85,
      verified: true,
    },
  ];

  const relatedCourses = [
    {
      id: "rel1",
      title: "Advanced JavaScript: Design Patterns",
      instructor: "Dr. Jane Smith",
      rating: 4.9,
      students: "3,214",
      price: 59.99,
      originalPrice: 149.99,
      image: "/assets/React-Design-Patterns.webp",
      badge: "Best Seller",
    },
    {
      id: "rel2",
      title: "React and TypeScript Masterclass",
      instructor: "Dr. Jane Smith",
      rating: 4.7,
      students: "2,109",
      price: 69.99,
      originalPrice: 179.99,
      image: "/assets/React ts-1.png",
      badge: "New",
    },
  ];

  const ratingBreakdown = [
    { stars: 5, percentage: 80, count: 126498 },
    { stars: 4, percentage: 15, count: 23718 },
    { stars: 3, percentage: 3, count: 4743 },
    { stars: 2, percentage: 1, count: 1581 },
    { stars: 1, percentage: 1, count: 1581 },
  ];

  const toggleModule = (moduleId: string) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

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

  if (isLoading)
    return <div className='text-center py-20 text-gray-600'>Loading...</div>;
  if (error || !data?.data)
    return (
      <div className='text-center py-20 text-red-600'>Error loading course</div>
    );

  const course: Course = data.data;
  const totalLectures = course.modules.reduce(
    (acc, mod) => acc + mod.lectures.length,
    0
  );

  // Course Enrollment
  const handleEnroll = async (courseId: string) => {
    try {
      const enrollResponse = (await enrollInCourse(
        courseId
      ).unwrap()) as EnrollResponse;
      if (enrollResponse.success) {
        router.push("/my-courses");
      } else {
        console.error("Enrollment failed:", enrollResponse.message);
      }
    } catch (error) {
      console.error("Enrollment failed:", error);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Hero Section */}
      <div className='bg-gradient-to-r from-[#00564A] to-[#00A892] text-white'>
        <div className='max-w-7xl mx-auto px-4 py-12'>
          <div className='flex lg:flex-row flex-col justify-between gap-8'>
            {/* Course Info */}
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
                onClick={() => handleEnroll(id)}
                className='bg-white text-[#3DB6A6] hover:bg-gray-100 font-semibold px-8 py-3 rounded-full'
                disabled={isEnrolled}>
                {isEnrolled ? "Already Enrolled" : "Enroll Now"}
              </Button>
            </div>
            {/* Course Preview Card */}
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
                    <Badge variant='destructive' className='bg-red-500'>
                      50% OFF
                    </Badge>
                  </div>
                  <div className='space-y-3 mb-6'>
                    <Button
                      className='w-full bg-gradient-to-r from-[#3DB6A6] to-[#2D7F74] hover:from-[#2D7F74] hover:to-[#3DB6A6] rounded-full'
                      size='lg'>
                      Add to Cart
                    </Button>
                    <Button
                      onClick={() => handleEnroll(id)}
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
                      <span className='font-semibold'>{instructor.name}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Lectures</span>
                      <span className='font-semibold'>{totalLectures}</span>
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

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2 space-y-8'>
            {/* What You'll Learn */}
            <Card>
              <CardHeader>
                <CardTitle className='text-2xl'>What You'll Learn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {[
                    "Master JavaScript fundamentals",
                    "Build interactive web applications",
                    "Understand asynchronous programming",
                    "Create real-world projects",
                  ].map((item, index) => (
                    <div key={index} className='flex items-start gap-3'>
                      <div className='w-2 h-2 bg-[#3DB6A6] rounded-full mt-2 flex-shrink-0'></div>
                      <span className='text-gray-700'>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Course Content */}
            <Card>
              <CardHeader>
                <CardTitle className='text-2xl'>Course Content</CardTitle>
                <p className='text-gray-600'>
                  {course.modules.length} sections • {totalLectures} lectures •
                  ~10h total length
                </p>
              </CardHeader>
              <CardContent>
                <Accordion type='single' collapsible className='w-full'>
                  {course.modules.map((module) => (
                    <AccordionItem key={module._id} value={module._id}>
                      <AccordionTrigger
                        onClick={() => toggleModule(module._id)}
                        className='text-lg font-medium text-gray-800'>
                        Module {module.moduleNumber}: {module.title} (
                        {module.lectures.length} lectures)
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className='space-y-2'>
                          {module.lectures.map((lecture) => (
                            <div
                              key={lecture._id}
                              className='flex items-center gap-3 p-2 hover:bg-gray-50'>
                              <Play className='w-4 h-4 text-[#3DB6A6]' />
                              <span className='flex-grow'>{lecture.title}</span>
                              {lecture.videoUrl && (
                                <span className='text-sm text-gray-500'>
                                  Video
                                </span>
                              )}
                              {lecture.pdfNotes &&
                                lecture.pdfNotes.length > 0 && (
                                  <span className='text-sm text-gray-500'>
                                    {lecture.pdfNotes.length} PDF
                                  </span>
                                )}
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className='text-2xl'>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className='space-y-2'>
                  {[
                    "No prior JavaScript experience needed",
                    "A computer with internet access",
                    "Basic understanding of HTML and CSS",
                  ].map((req, index) => (
                    <li key={index} className='flex items-start gap-3'>
                      <div className='w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0'></div>
                      <span className='text-gray-700'>{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Course Description */}
            <Card>
              <CardHeader>
                <CardTitle className='text-2xl'>Course Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='prose max-w-none'>
                  <p className='text-gray-700 leading-relaxed mb-4'>
                    {course.description} This course takes you from beginner to
                    advanced JavaScript concepts, covering variables, functions,
                    asynchronous programming, and more. You'll build real-world
                    projects to solidify your skills.
                  </p>
                  <p className='text-gray-700 leading-relaxed mb-4'>
                    By the end, you'll be ready to create dynamic web
                    applications and pursue a career in web development.
                  </p>
                  <Button variant='link' className='p-0 text-[#3DB6A6]'>
                    Show More ↓
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Instructor */}
            <Card>
              <CardHeader>
                <CardTitle className='text-2xl'>Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex items-start gap-6'>
                  <Image
                    src={instructor.avatar}
                    alt={instructor.name}
                    width={96}
                    height={96}
                    className='w-24 h-24 rounded-full object-cover'
                  />
                  <div className='flex-grow'>
                    <h3 className='text-xl font-semibold text-[#3DB6A6] mb-1'>
                      {instructor.name}
                    </h3>
                    <p className='text-gray-600 mb-3'>{instructor.title}</p>
                    <div className='grid grid-cols-2 gap-4 mb-4 text-sm'>
                      <div className='flex items-center gap-2'>
                        <Star className='w-4 h-4 text-yellow-400' />
                        <span>{instructor.rating} Instructor Rating</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Award className='w-4 h-4 text-gray-400' />
                        <span>{instructor.reviews}</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Users className='w-4 h-4 text-gray-400' />
                        <span>{instructor.students}</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Play className='w-4 h-4 text-gray-400' />
                        <span>{instructor.courses}</span>
                      </div>
                    </div>
                    <p className='text-gray-700 leading-relaxed'>
                      {instructor.bio}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card>
              <CardHeader>
                <CardTitle className='text-2xl'>Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex items-start gap-8 mb-8'>
                  <div className='text-center'>
                    <div className='text-5xl font-bold text-[#3DB6A6] mb-2'>
                      4.8
                    </div>
                    {renderStars(4.8, "w-6 h-6")}
                    <div className='text-sm text-gray-600 mt-1'>
                      Course Rating
                    </div>
                  </div>
                  <div className='flex-grow'>
                    {ratingBreakdown.map((item) => (
                      <div
                        key={item.stars}
                        className='flex items-center gap-3 mb-2'>
                        <div className='flex items-center gap-1 w-20'>
                          {renderStars(item.stars)}
                        </div>
                        <div className='flex-grow bg-gray-200 rounded-full h-2'>
                          <div
                            className='bg-yellow-400 h-2 rounded-full'
                            style={{ width: `${item.percentage}%` }}></div>
                        </div>
                        <span className='text-sm text-gray-600 w-8'>
                          {item.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className='space-y-6'>
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className='border-b pb-6 last:border-b-0'>
                      <div className='flex items-start gap-4'>
                        <Image
                          src={review.avatar}
                          alt={review.user}
                          width={48}
                          height={48}
                          className='w-12 h-12 rounded-full object-cover'
                        />
                        <div className='flex-grow'>
                          <div className='flex items-center gap-3 mb-2'>
                            <h4 className='font-semibold'>{review.user}</h4>
                            {review.verified && (
                              <Badge variant='secondary' className='text-xs'>
                                Verified
                              </Badge>
                            )}
                          </div>
                          {renderStars(review.rating)}
                          <p className='text-gray-700 mt-2 leading-relaxed'>
                            {review.comment}
                          </p>
                          <div className='flex items-center gap-4 mt-3 text-sm text-gray-500'>
                            <span>{review.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Course Features */}
            <Card>
              <CardHeader>
                <CardTitle>This Course Includes:</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {[
                    "10 hours of video content",
                    `${totalLectures} lectures`,
                    "Downloadable PDF notes",
                    "Full lifetime access",
                    "Certificate of completion",
                  ].map((feature, index) => (
                    <div key={index} className='flex items-center gap-3'>
                      <Video className='w-4 h-4 text-[#3DB6A6] flex-shrink-0' />
                      <span className='text-sm'>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Related Courses */}
            <Card>
              <CardHeader>
                <CardTitle>Related Courses</CardTitle>
                <Button variant='link' className='p-0 ml-auto text-[#3DB6A6]'>
                  <Link href='/courses'>View All Courses</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {relatedCourses.map((relatedCourse) => (
                    <div
                      key={relatedCourse.id}
                      className='border rounded-lg p-4 hover:shadow-md transition-shadow'>
                      <div className='relative mb-3'>
                        <Image
                          src={relatedCourse.image}
                          alt={relatedCourse.title}
                          width={300}
                          height={200}
                          className='w-full h-32 object-cover rounded'
                        />
                        {relatedCourse.badge && (
                          <Badge
                            className={`absolute top-2 left-2 text-xs ${
                              relatedCourse.badge === "Best Seller"
                                ? "bg-orange-500"
                                : "bg-green-500"
                            }`}>
                            {relatedCourse.badge}
                          </Badge>
                        )}
                      </div>
                      <h4 className='font-semibold text-sm mb-2 line-clamp-2'>
                        {relatedCourse.title}
                      </h4>
                      <p className='text-xs text-gray-600 mb-2'>
                        By {relatedCourse.instructor}
                      </p>
                      <div className='flex items-center gap-2 mb-2'>
                        {renderStars(relatedCourse.rating)}
                        <span className='text-xs text-gray-600'>
                          ({relatedCourse.students})
                        </span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <div>
                          <span className='font-bold text-[#3DB6A6]'>
                            ${relatedCourse.price.toFixed(2)}
                          </span>
                          <span className='text-xs text-gray-500 line-through ml-1'>
                            ${relatedCourse.originalPrice.toFixed(2)}
                          </span>
                        </div>
                        <Button size='sm' variant='outline' className='text-xs'>
                          <Link href={`/courses/${relatedCourse.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
