import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const WhatYoullLearn = () => {
  return (
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
  );
};

export default WhatYoullLearn;
