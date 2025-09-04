"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useAppSelector } from "@/redux/hook";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import {
  useEnrollInCourseMutation,
  useGetCourseByIdQuery,
} from "@/redux/features/course/courseApi";
import CourseDetailsHero from "@/components/main/CourseDetailsPage/CourseDetailsHero";
import WhatYoullLearn from "@/components/main/CourseDetailsPage/WhatYoullLearn";
import Requirements from "@/components/main/CourseDetailsPage/Requirements";
import CourseDescription from "@/components/main/CourseDetailsPage/CourseDescription";
import Instructor from "@/components/main/CourseDetailsPage/Instructor";
import Reviews from "@/components/main/CourseDetailsPage/Reviews";
import CourseFeatures from "@/components/main/CourseDetailsPage/CourseFeatures";
import RelatedCourses from "@/components/main/CourseDetailsPage/RelatedCourses";
import CourseDetailsContent from "@/components/main/CourseDetailsPage/CourseDetailsContent";

// Define types
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

  const toggleModule = (moduleId: string) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

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

  // Static data for instructor, reviews, and related courses
  const instructorData = {
    name: "Dr. Jane Smith",
    title: "JavaScript Expert & Instructor",
    bio: "Dr. Jane Smith has over 15 years of experience in web development and teaching JavaScript. She leads the Web Dev Academy, mentoring thousands of students worldwide.",
    avatar: "/assets/avatar-5.png",
    students: "1,500,000 students",
    courses: "5 courses",
    reviews: "250,000 reviews",
    rating: 4.8,
  };

  const reviewsData = [
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

  const relatedCoursesData = [
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

  return (
    <div className='min-h-screen bg-gray-50'>
      <CourseDetailsHero
        course={course}
        isEnrolled={isEnrolled}
        handleEnroll={handleEnroll}
      />
      <div className='max-w-7xl mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2 space-y-8'>
            <WhatYoullLearn />
            <CourseDetailsContent
              course={course}
              expandedModule={expandedModule}
              toggleModule={toggleModule}
            />
            <Requirements />
            <CourseDescription course={course} />
            <Instructor instructor={instructorData} />
            <Reviews reviews={reviewsData} ratingBreakdown={ratingBreakdown} />
          </div>
          <div className='space-y-6'>
            <CourseFeatures totalLectures={totalLectures} />
            <RelatedCourses relatedCourses={relatedCoursesData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
