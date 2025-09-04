import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Play } from "lucide-react";

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

interface CourseDetailsContentProps {
  course: Course;
  expandedModule: string | null;
  toggleModule: (moduleId: string) => void;
}

const CourseDetailsContent = ({
  course,
  expandedModule,
  toggleModule,
}: CourseDetailsContentProps) => {
  const totalLectures = course.modules.reduce(
    (acc, mod) => acc + mod.lectures.length,
    0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-2xl'>Course Content</CardTitle>
        <p className='text-gray-600'>
          {course.modules.length} sections • {totalLectures} lectures • ~10h
          total length
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
                        <span className='text-sm text-gray-500'>Video</span>
                      )}
                      {lecture.pdfNotes && lecture.pdfNotes.length > 0 && (
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
  );
};

export default CourseDetailsContent;
