import Hero from "@/components/main/Hero";
import { LogoTicker } from "@/components/main/LogoTicker";
import Newsletter from "@/components/main/Newsletter";
import OurCourses from "@/components/main/OurCourses";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <Hero />
      <LogoTicker />
      <OurCourses />
      <Newsletter />
    </>
  );
}
