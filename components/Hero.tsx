"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import CustomButton from "./CustomButton";
import { useLanguage } from "@/context/LanguageContext";

const Hero = () => {
  const { t, isAr } = useLanguage();
  const router = useRouter();

  const handleNavigateToCars = () => {
    router.push("/cars");
  };

  return (
    <div className="hero">
      <div className="flex-1 pt-36 padding-x">
        <h1 className="hero__title">
          {t.hero.title}
        </h1>
        <p className="hero__subtitle">
          {t.hero.subtitle}
        </p>

        <CustomButton
          title={t.hero.bookNow}
          containerStyles="bg-primary-blue text-white rounded-full mt-10 shadow-md hover:bg-blue-700 transition"
          handleClick={handleNavigateToCars}
          btnType="button"
        />
      </div>
      <div className="hero__image-container">
        <div className="hero__image">
          {/* Hero car image: original in English, horizontally flipped in Arabic */}
          <Image
            src="/hero.png"
            alt={t.hero.heroAlt}
            fill
            priority
            className={`object-contain transition-transform duration-500 ease-out ${
              isAr ? "-scale-x-100" : "scale-x-100"
            }`}
          />
        </div>
        <div className="hero__image-overlay" />
      </div>
    </div>
  );
};

export default Hero;
