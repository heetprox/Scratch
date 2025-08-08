"use client";

import Link from "next/link";
import { useState } from "react";
import { navbarItems } from "@/constants";
import { useMotionValueEvent, useScroll, motion } from "framer-motion";
import TextHover from "./animation/TextHover";
import SimpleButton from "./SimpleButton";
  
export default function Navbar() {
    const [hidden, setHidden] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious();
        if (previous && latest > previous) {
            setHidden(true);
        } else {
            setHidden(false);
        }
    });

    return (
        <>
            <div className="absolute top-0 left-0 text-white f1 overflow-hidden flex w-full h-fit justify-center"
            style={{
                paddingTop: "clamp(0.75em,  5vh, 200rem)",
                paddingLeft: 0,
                paddingRight: 0
            }}
            >
                <motion.nav
                    className="bg-[#1a1a1a] rounded-lg  z-50 w-[40%] flex items-center justify-between sm:hidden xm:hidden md:hidden lg:flex"
                    style={{
                        padding: "clamp(0.5em, 0.25vw, 200rem)"
                    }}
                    
                    animate={hidden ? "hidden" : "vissible"}>
                    <div className="w-[15%]  sus text-sm ">
                        <Link href={"/"} className="text-[#ffd500] ">
                           Scratch
                        </Link>
                    </div>
                    <div className="flex gap-x-[20px] justify-center w-[60%]">
                        {navbarItems.map((item) => (
                            <Link
                                key={item.id}
                                className={`w-fit text-sm sus capitalize flex flex-col  hover`}
                                href={item.href}>
                                <TextHover
                                    titile1={item.title}
                                    titile2={item.title}
                                />
                            </Link>
                        ))}
                    </div>
                    <div className="w-[25%]   flex justify-end">
                        <SimpleButton title="Login" href="/auth/signin" />
                        <div className="w-2"></div>
                        <SimpleButton title="Get Started" href="/auth/signin" />
                    </div>
                </motion.nav>
            </div>
        </>
    );
}
