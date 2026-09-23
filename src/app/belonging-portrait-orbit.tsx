"use client";

import Image, { type StaticImageData } from "next/image";
import { motion, useReducedMotion } from "motion/react";

import portrait00 from "../../design-assets/figma/belonging-orbit/portrait-00.png";
import portrait01 from "../../design-assets/figma/belonging-orbit/portrait-01.png";
import portrait02 from "../../design-assets/figma/belonging-orbit/portrait-02.png";
import portrait03 from "../../design-assets/figma/belonging-orbit/portrait-03.png";
import portrait04 from "../../design-assets/figma/belonging-orbit/portrait-04.png";
import portrait05 from "../../design-assets/figma/belonging-orbit/portrait-05.png";
import portrait06 from "../../design-assets/figma/belonging-orbit/portrait-06.png";
import portrait07 from "../../design-assets/figma/belonging-orbit/portrait-07.png";
import portrait08 from "../../design-assets/figma/belonging-orbit/portrait-08.png";
import portrait09 from "../../design-assets/figma/belonging-orbit/portrait-09.png";
import portrait10 from "../../design-assets/figma/belonging-orbit/portrait-10.png";
import portrait11 from "../../design-assets/figma/belonging-orbit/portrait-11.png";
import portrait12 from "../../design-assets/figma/belonging-orbit/portrait-12.png";
import portrait13 from "../../design-assets/figma/belonging-orbit/portrait-13.png";
import portrait14 from "../../design-assets/figma/belonging-orbit/portrait-14.png";
import portrait15 from "../../design-assets/figma/belonging-orbit/portrait-15.png";
import portrait16 from "../../design-assets/figma/belonging-orbit/portrait-16.png";
import portrait17 from "../../design-assets/figma/belonging-orbit/portrait-17.png";
import portrait18 from "../../design-assets/figma/belonging-orbit/portrait-18.png";
import portrait19 from "../../design-assets/figma/belonging-orbit/portrait-19.png";
import portrait20 from "../../design-assets/figma/belonging-orbit/portrait-20.png";
import portrait21 from "../../design-assets/figma/belonging-orbit/portrait-21.png";
import portrait22 from "../../design-assets/figma/belonging-orbit/portrait-22.png";
import portrait23 from "../../design-assets/figma/belonging-orbit/portrait-23.png";
import portrait24 from "../../design-assets/figma/belonging-orbit/portrait-24.png";
import portrait25 from "../../design-assets/figma/belonging-orbit/portrait-25.png";

type Portrait = {
  image: StaticImageData;
  width: number;
  height: number;
  left: string;
  top: string;
  rotate?: number;
  centered?: boolean;
};

const PORTRAITS: Portrait[] = [
  {
    image: portrait00,
    width: 223.961,
    height: 240.791,
    left: "-17.58%",
    top: "79.23%",
  },
  {
    image: portrait01,
    width: 248.558,
    height: 255.031,
    left: "-5.44%",
    top: "80.43%",
  },
  {
    image: portrait02,
    width: 225.504,
    height: 242.318,
    left: "14.562%",
    top: "88.355%",
    rotate: 142.04,
    centered: true,
  },
  {
    image: portrait03,
    width: 279.628,
    height: 257.62,
    left: "18.65%",
    top: "79.47%",
  },
  {
    image: portrait04,
    width: 260.209,
    height: 261.504,
    left: "33.76%",
    top: "76.58%",
  },
  {
    image: portrait05,
    width: 270.665,
    height: 252.233,
    left: "58.605%",
    top: "80.445%",
    rotate: -135,
    centered: true,
  },
  {
    image: portrait06,
    width: 288.69,
    height: 279.628,
    left: "64.02%",
    top: "65.97%",
  },
  {
    image: portrait07,
    width: 260.209,
    height: 247.263,
    left: "79.13%",
    top: "61.15%",
  },
  {
    image: portrait08,
    width: 259.928,
    height: 234.963,
    left: "102.26%",
    top: "61.67%",
    rotate: -126.04,
    centered: true,
  },
  {
    image: portrait09,
    width: 262.119,
    height: 273.352,
    left: "111.95%",
    top: "55.728%",
    rotate: -60,
    centered: true,
  },
  {
    image: portrait10,
    width: 240.791,
    height: 247.263,
    left: "111.49%",
    top: "37.2%",
  },
  {
    image: portrait11,
    width: 231.729,
    height: 258.915,
    left: "116.62%",
    top: "25.39%",
  },
  {
    image: portrait12,
    width: 260.209,
    height: 223.961,
    left: "116.885%",
    top: "24.347%",
    rotate: 45,
    centered: true,
  },
  {
    image: portrait13,
    width: 254.248,
    height: 225.387,
    left: "103.095%",
    top: "20.51%",
    rotate: 165,
    centered: true,
  },
  {
    image: portrait14,
    width: 242.085,
    height: 231.729,
    left: "80.65%",
    top: "12.69%",
  },
  {
    image: portrait15,
    width: 222.667,
    height: 213.605,
    left: "67.62%",
    top: "12.05%",
  },
  {
    image: portrait16,
    width: 244.674,
    height: 227.845,
    left: "54.49%",
    top: "11.78%",
  },
  {
    image: portrait17,
    width: 231.729,
    height: 238.201,
    left: "42.97%",
    top: "12.84%",
  },
  {
    image: portrait18,
    width: 266.682,
    height: 238.201,
    left: "29.09%",
    top: "16.65%",
  },
  {
    image: portrait19,
    width: 245.886,
    height: 252.357,
    left: "26.435%",
    top: "28.378%",
    rotate: 4.85,
    centered: true,
  },
  {
    image: portrait20,
    width: 240.791,
    height: 269.271,
    left: "6.43%",
    top: "23.77%",
  },
  {
    image: portrait21,
    width: 273.496,
    height: 213.699,
    left: "3.66%",
    top: "37.67%",
    rotate: -90,
    centered: true,
  },
  {
    image: portrait22,
    width: 228.679,
    height: 240.287,
    left: "-4.92%",
    top: "45.237%",
    rotate: -30,
    centered: true,
  },
  {
    image: portrait23,
    width: 253.736,
    height: 251.147,
    left: "-22.08%",
    top: "45.74%",
  },
  {
    image: portrait24,
    width: 280.922,
    height: 223.961,
    left: "-28.66%",
    top: "57.16%",
  },
  {
    image: portrait25,
    width: 253.18,
    height: 298.014,
    left: "-19.58%",
    top: "76.276%",
    rotate: -34.86,
    centered: true,
  },
];

export function BelongingPortraitOrbit() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      animate={
        reduceMotion ? undefined : { x: [0, 8, 0, -8, 0], y: [0, -5, 0, 5, 0] }
      }
      transition={{ duration: 20, ease: "linear", repeat: Infinity }}
    >
      {PORTRAITS.map((portrait, index) => (
        <Image
          key={index}
          src={portrait.image}
          alt=""
          sizes={`${Math.ceil(portrait.width)}px`}
          className="absolute max-w-none"
          style={{
            width: portrait.width,
            height: portrait.height,
            left: portrait.left,
            top: portrait.top,
            transform: `${portrait.centered ? "translate(-50%, -50%) " : ""}rotate(${portrait.rotate ?? 0}deg)`,
          }}
        />
      ))}
    </motion.div>
  );
}
