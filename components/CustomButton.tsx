"use client";

import { CustomButtonProps } from "@/types";
import Image from "next/image";

const CustomButton = ({ title, containerStyles, handleClick, btnType, textStyles, rightIcon}: CustomButtonProps) => {
  return (
    <button
        disabled={false}
        type={btnType || "button"}
        className={`custom-btn ${containerStyles}`}
        onClick={handleClick}
    >
        <span className={`flex-1 ${textStyles}`}>
            {title}
        </span>
        {rightIcon && (
            <div className="relative w-6 h-6 shrink-0">
                <Image src={rightIcon} alt="icon" fill className="object-contain rtl:rotate-180 transition-transform" />
            </div>
        )}
    </button>
  );
};

export default CustomButton;