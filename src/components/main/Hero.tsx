"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import HeroImage from "../../../public/assets/heroImage.jpg";
import Image from "next/image";

const Hero = () => {
  return (
    <section className='py-12 md:py-20 w-full bg-white relative'>
      {/* Teal Glow Background */}
      <div
        className='absolute inset-0 z-0'
        style={{
          backgroundImage: `
        radial-gradient(125% 125% at 50% 10%, #ffffff 40%, #14b8a6 100%)
      `,
          backgroundSize: "100% 100%",
        }}
      />
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
          {/* Text Content */}
          <div className='flex flex-col items-center md:items-start text-center md:text-left z-10'>
            <h1
              className={cn(
                "text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#00564A] to-[#00A892] bg-clip-text text-transparent mb-4"
              )}>
              Learn Smarter with Datapollex LMS
            </h1>
            <p className='text-lg text-gray-600 mb-6 max-w-md'>
              Discover a world of knowledge with our cutting-edge learning
              platform. Enroll in courses designed to empower your future.
            </p>
            <div className='flex flex-col sm:flex-row gap-4'>
              <Button
                asChild
                className={cn(
                  "bg-gradient-to-r from-[#3DB6A6] to-[#2D7F74] text-white hover:from-[#2D7F74] hover:to-[#3DB6A6] rounded-full px-6 py-3 text-sm font-medium"
                )}>
                <Link href='/courses'>Explore Courses</Link>
              </Button>
              <Button
                asChild
                variant='outline'
                className={cn(
                  "border-[#3DB6A6] text-[#3DB6A6] hover:bg-[#3DB6A6] hover:text-white rounded-full px-6 py-3 text-sm font-medium"
                )}>
                <Link href='/register'>Get Started</Link>
              </Button>
            </div>
          </div>

          {/* Image Placeholder */}
          <div className='hidden md:block'>
            <div className='relative w-full h-[400px] rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center'>
              <Image alt='hero image' src={HeroImage} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
