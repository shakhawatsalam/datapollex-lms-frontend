import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Review {
  id: number;
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  verified: boolean;
}

interface RatingBreakdown {
  stars: number;
  percentage: number;
  count: number;
}

interface ReviewsProps {
  reviews: Review[];
  ratingBreakdown: RatingBreakdown[];
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

const Reviews = ({ reviews, ratingBreakdown }: ReviewsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-2xl'>Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex items-start gap-8 mb-8'>
          <div className='text-center'>
            <div className='text-5xl font-bold text-[#3DB6A6] mb-2'>4.8</div>
            {renderStars(4.8, "w-6 h-6")}
            <div className='text-sm text-gray-600 mt-1'>Course Rating</div>
          </div>
          <div className='flex-grow'>
            {ratingBreakdown.map((item) => (
              <div key={item.stars} className='flex items-center gap-3 mb-2'>
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
            <div key={review.id} className='border-b pb-6 last:border-b-0'>
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
  );
};

export default Reviews;
