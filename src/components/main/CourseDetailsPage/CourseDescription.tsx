import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  thumbnail?: { public_id: string; url: string };
  modules: any[];
}

interface CourseDescriptionProps {
  course: Course;
}

const CourseDescription = ({ course }: CourseDescriptionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-2xl'>Course Description</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='prose max-w-none'>
          <p className='text-gray-700 leading-relaxed mb-4'>
            {course.description} This course takes you from beginner to advanced
            JavaScript concepts, covering variables, functions, asynchronous
            programming, and more. You'll build real-world projects to solidify
            your skills.
          </p>
          <p className='text-gray-700 leading-relaxed mb-4'>
            By the end, you'll be ready to create dynamic web applications and
            pursue a career in web development.
          </p>
          <Button variant='link' className='p-0 text-[#3DB6A6]'>
            Show More ↓
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseDescription;
