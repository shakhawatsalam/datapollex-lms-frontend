import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Requirements = () => {
  return (
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
  );
};

export default Requirements;
