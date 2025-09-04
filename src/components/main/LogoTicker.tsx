"use client";
import acmeLogo from "../../../public/assets/logo-acme.png";
import quantumLogo from "../../../public/assets/logo-quantum.png";
import echoLogo from "../../../public/assets/logo-echo.png";
import celestialLogo from "../../../public/assets/logo-celestial.png";
import pulseLogo from "../../../public/assets/logo-pulse.png";
import apexLogo from "../../../public/assets/logo-apex.png";
import Image from "next/image";
import { motion } from "motion/react";

const images = [
  { id: 1, src: acmeLogo, alt: "Acme Logo" },
  { id: 2, src: quantumLogo, alt: "Quantum Logo" },
  { id: 3, src: echoLogo, alt: "Echo Logo" },
  { id: 4, src: celestialLogo, alt: "Celestial Logo" },
  { id: 5, src: pulseLogo, alt: "Pulse Logo" },
  { id: 6, src: apexLogo, alt: "Apex Logo" },
  { id: 7, src: acmeLogo, alt: "Acme Logo" },
  { id: 8, src: quantumLogo, alt: "Quantum Logo" },
  { id: 9, src: echoLogo, alt: "Echo Logo" },
  { id: 10, src: celestialLogo, alt: "Celestial Logo" },
  { id: 11, src: pulseLogo, alt: "Pulse Logo" },
  { id: 12, src: apexLogo, alt: "Apex Logo" },
];
export const LogoTicker = () => {
  return (
    <div className='py-8 md:py-12 lg:py-24 bg-white'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black,transparent)]'>
          <motion.div
            className='flex gap-14 flex-none pr-14'
            animate={{
              translateX: "-50%",
              transition: {
                duration: 20,
                repeat: Infinity,
                ease: "linear",
                repeatType: "loop",
              },
            }}>
            {images.map(({ src, alt, id }) => (
              <Image
                key={id}
                src={src}
                alt={alt}
                className='flex-none h-8 w-auto'
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
