import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface RelatedCourse {
  id: string;
  title: string;
  instructor: string;
  rating: number;
  students: string;
  price: number;
  originalPrice: number;
  image: string;
  badge: string;
}

interface RelatedCoursesProps {
  relatedCourses: RelatedCourse[];
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

const RelatedCourses = ({ relatedCourses }: RelatedCoursesProps) => {
  return (
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
  );
};

export default RelatedCourses;
