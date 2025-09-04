
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
// import NotFoundImage from "../../../public/assets/not-found-image.png"; // Replace with your 404 image

const NotFound = () => {
  return (
    <section className="min-h-screen bg-white relative flex items-center justify-center py-12 md:py-20">
      {/* Teal Glow Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(125% 125% at 50% 10%, #ffffff 40%, #14b8a6 100%)
          `,
          backgroundSize: "100% 100%",
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h1
              className={cn(
                "text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#00564A] to-[#00A892] bg-clip-text text-transparent mb-4"
              )}
            >
              404 - Page Not Found
            </h1>
            <p className="text-lg text-gray-600 mb-6 max-w-md">
              Oops! It looks like the page you're looking for doesn't exist or has been moved. Let's get you back on track.
            </p>
            <Button
              asChild
              className={cn(
                "bg-gradient-to-r from-[#3DB6A6] to-[#2D7F74] text-white hover:from-[#2D7F74] hover:to-[#3DB6A6] rounded-full px-6 py-3 text-sm font-medium"
              )}
            >
              <Link href="/">Return to Homepage</Link>
            </Button>
          </div>

          
        </div>
      </div>
    </section>
  );
};

export default NotFound;