import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Star, Award, Users, Play } from "lucide-react";

interface InstructorProps {
  instructor: {
    name: string;
    title: string;
    bio: string;
    avatar: string;
    students: string;
    courses: string;
    reviews: string;
    rating: number;
  };
}

const Instructor = ({ instructor }: InstructorProps) => {
  return (
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
            <p className='text-gray-700 leading-relaxed'>{instructor.bio}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Instructor;
