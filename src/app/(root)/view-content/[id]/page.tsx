"use client";
import {
  useGetCourseByIdQuery,
  useMarkLectureCompleteMutation,
} from "@/redux/features/course/courseApi";
import { useAppSelector } from "@/redux/hook";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { CheckCircle, Play, Lock, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

// Function to extract YouTube video ID from URL
const getYouTubeVideoId = (url: string) => {
  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const CourseContent = () => {
  const { id } = useParams();
  const router = useRouter();
  const user = useAppSelector(selectCurrentUser);
  const {
    data: courseData,
    isLoading,
    error,
  } = useGetCourseByIdQuery(id as string);
  const [markLectureComplete] = useMarkLectureCompleteMutation();
  const [selectedLecture, setSelectedLecture] = useState<{
    moduleId: string;
    lectureId: string;
    videoUrl: string;
    title: string;
  } | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  // Check if user is enrolled
  const isEnrolled = user?.courses?.some((c) => c.courseId === id);
  const userCourse = user?.courses?.find((c) => c.courseId === id);
  const completedLectures = userCourse?.completedLectures || [];

  // Redirect if not enrolled
  if (!isEnrolled) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <Card className='max-w-md p-6 text-center'>
          <CardTitle className='text-xl font-semibold text-red-600 mb-4'>
            Access Denied
          </CardTitle>
          <p className='text-gray-600 mb-6'>
            You are not enrolled in this course.
          </p>
          <Button
            asChild
            className='bg-gradient-to-r from-[#3DB6A6] to-[#2D7F74] text-white hover:from-[#2D7F74] hover:to-[#3DB6A6] rounded-full'>
            <Link href={`/courses/${id}`}>Enroll Now</Link>
          </Button>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center text-gray-600'>
        Loading...
      </div>
    );
  }

  if (error || !courseData?.data) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center text-red-600'>
        Error loading course
      </div>
    );
  }

  const course = courseData.data;
  const totalLectures = course.modules.reduce(
    (acc, mod) => acc + mod.lectures.length,
    0
  );
  const progress = userCourse
    ? Math.min((completedLectures.length / totalLectures) * 100, 100)
    : 0;

  // Select the first unlocked lecture by default
  if (!selectedLecture) {
    const firstUnlocked = course.modules
      .flatMap((module) =>
        module.lectures.map((lecture) => ({
          moduleId: module._id,
          lectureId: lecture._id,
          videoUrl: lecture.videoUrl,
          title: lecture.title,
        }))
      )
      .find(
        (l, index) =>
          index === 0 ||
          completedLectures.includes(
            course.modules.flatMap((m) => m.lectures)[index - 1]?._id
          )
      );
    if (firstUnlocked) {
      setSelectedLecture(firstUnlocked);
    }
  }

  const handleMarkComplete = async (
    courseId: string,
    moduleId: string,
    lectureId: string
  ) => {
    try {
      await markLectureComplete({ courseId, moduleId, lectureId }).unwrap();
      // Auto-select next lecture if available
      const allLectures = course.modules.flatMap((m) =>
        m.lectures.map((l) => ({
          moduleId: m._id,
          lectureId: l._id,
          videoUrl: l.videoUrl,
          title: l.title,
        }))
      );
      const currentIndex = allLectures.findIndex(
        (l) => l.lectureId === lectureId
      );
      const nextLecture = allLectures[currentIndex + 1];
      if (nextLecture) {
        setSelectedLecture(nextLecture);
      }
    } catch (err) {
      console.error("Failed to mark lecture as complete:", err);
    }
  };

  const isLectureUnlocked = (lectureId: string, index: number) => {
    if (index === 0) return true;
    const previousLectureId = course.modules.flatMap((m) => m.lectures)[
      index - 1
    ]?._id;
    return completedLectures.includes(previousLectureId);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Breadcrumb Navigation */}
      <div className='bg-white border-b'>
        <div className='max-w-7xl mx-auto px-4 py-3'>
          <nav className='flex items-center space-x-2 text-sm text-gray-500'>
            <Link href='/'>Home</Link>
            <ChevronRight className='w-4 h-4' />
            <Link href='/courses'>Courses</Link>
            <ChevronRight className='w-4 h-4' />
            <Link href={`/courses/${course._id}`}>{course.title}</Link>
            <ChevronRight className='w-4 h-4' />
            <span className='text-gray-900'>Content</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 py-8'>
        <div className='flex flex-col-reverse lg:flex-row-reverse gap-5'>
          {/* Sidebar: Module List */}
          <div className='lg:flex-1'>
            <Card className='sticky top-4'>
              <CardHeader>
                <CardTitle className='text-xl bg-gradient-to-r from-[#00564A] to-[#00A892] bg-clip-text text-transparent'>
                  Course Content
                </CardTitle>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-gray-600'>
                    {totalLectures} lectures
                  </span>
                  <span className='text-sm font-semibold text-[#3DB6A6]'>
                    {progress.toFixed(0)}% complete
                  </span>
                </div>
                <Progress value={progress} className='h-2 mt-2' />
              </CardHeader>
              <CardContent>
                <Accordion
                  type='single'
                  collapsible
                  value={expandedModule || undefined}
                  onValueChange={setExpandedModule}
                  className='w-full'>
                  {course.modules.map((module) => (
                    <AccordionItem key={module._id} value={module._id}>
                      <AccordionTrigger className='text-base font-medium text-gray-800'>
                        Module {module.moduleNumber}: {module.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className='space-y-2'>
                          {module.lectures.map((lecture, index) => {
                            const isUnlocked = isLectureUnlocked(
                              lecture._id,
                              course.modules
                                .flatMap((m) => m.lectures)
                                .findIndex((l) => l._id === lecture._id)
                            );
                            return (
                              <button
                                key={lecture._id}
                                onClick={() =>
                                  isUnlocked &&
                                  setSelectedLecture({
                                    moduleId: module._id,
                                    lectureId: lecture._id,
                                    videoUrl: lecture.videoUrl,
                                    title: lecture.title,
                                  })
                                }
                                disabled={!isUnlocked}
                                className={cn(
                                  "flex items-center gap-3 p-2 w-full text-left hover:bg-gray-50 rounded",
                                  !isUnlocked &&
                                    "opacity-50 cursor-not-allowed",
                                  selectedLecture?.lectureId === lecture._id &&
                                    "bg-[#3DB6A6]/10"
                                )}>
                                {completedLectures.includes(lecture._id) ? (
                                  <CheckCircle className='w-4 h-4 text-[#3DB6A6]' />
                                ) : isUnlocked ? (
                                  <Play className='w-4 h-4 text-[#3DB6A6]' />
                                ) : (
                                  <Lock className='w-4 h-4 text-gray-400' />
                                )}
                                <span className='flex-grow text-sm'>
                                  {lecture.title}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Main Content: YouTube Video Player and Lecture Details */}
          <div className='lg:w-[70%]'>
            <Card>
              <CardContent className='p-6'>
                {selectedLecture ? (
                  <>
                    <h2 className='text-2xl font-semibold bg-gradient-to-r from-[#00564A] to-[#00A892] bg-clip-text text-transparent mb-4'>
                      {selectedLecture.title}
                    </h2>
                    <div className='relative w-full aspect-video mb-6'>
                      {getYouTubeVideoId(selectedLecture.videoUrl) ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                            selectedLecture.videoUrl
                          )}`}
                          title={selectedLecture.title}
                          className='w-full h-full rounded-lg'
                          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                          allowFullScreen
                        />
                      ) : (
                        <div className='w-full h-full bg-gray-200 flex items-center justify-center rounded-lg'>
                          <span className='text-gray-500'>
                            Invalid YouTube URL
                          </span>
                        </div>
                      )}
                    </div>
                    <div className='flex justify-between items-center'>
                      <Button
                        disabled={completedLectures.includes(
                          selectedLecture.lectureId
                        )}
                        onClick={() =>
                          handleMarkComplete(
                            id as string,
                            selectedLecture.moduleId,
                            selectedLecture.lectureId
                          )
                        }
                        className={cn(
                          "bg-gradient-to-r from-[#3DB6A6] to-[#2D7F74] text-white hover:from-[#2D7F74] hover:to-[#3DB6A6] rounded-full",
                          completedLectures.includes(
                            selectedLecture.lectureId
                          ) && "opacity-50 cursor-not-allowed"
                        )}>
                        {completedLectures.includes(
                          selectedLecture.lectureId
                        ) ? (
                          <>
                            <CheckCircle className='w-4 h-4 mr-2' />
                            Completed
                          </>
                        ) : (
                          <>
                            <CheckCircle className='w-4 h-4 mr-2' />
                            Mark as Complete
                          </>
                        )}
                      </Button>
                      <Button
                        variant='outline'
                        className='border-[#3DB6A6] text-[#3DB6A6] hover:bg-[#3DB6A6] hover:text-white rounded-full'
                        onClick={() => {
                          const allLectures = course.modules.flatMap((m) =>
                            m.lectures.map((l) => ({
                              moduleId: m._id,
                              lectureId: l._id,
                              videoUrl: l.videoUrl,
                              title: l.title,
                            }))
                          );
                          const currentIndex = allLectures.findIndex(
                            (l) => l.lectureId === selectedLecture.lectureId
                          );
                          const nextLecture = allLectures[currentIndex + 1];
                          if (
                            nextLecture &&
                            isLectureUnlocked(
                              nextLecture.lectureId,
                              currentIndex + 1
                            )
                          ) {
                            setSelectedLecture(nextLecture);
                          }
                        }}
                        disabled={
                          !course.modules.flatMap((m) => m.lectures)[
                            course.modules
                              .flatMap((m) => m.lectures)
                              .findIndex(
                                (l) => l._id === selectedLecture.lectureId
                              ) + 1
                          ]
                        }>
                        Next Lecture
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className='text-center text-gray-600'>
                    Select a lecture to start learning
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContent;
