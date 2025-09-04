import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Video } from "lucide-react";

interface CourseFeaturesProps {
  totalLectures: number;
}

const CourseFeatures = ({ totalLectures }: CourseFeaturesProps) => {
  return (
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
  );
};

export default CourseFeatures;
