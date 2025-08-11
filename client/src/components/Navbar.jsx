"use client";

import Link from "next/link";
import { useState, useContext } from "react";
import { navbarItems } from "@/constants";
import { useMotionValueEvent, useScroll, motion } from "framer-motion";
import TextHover from "./animation/TextHover";
import SimpleButton from "./SimpleButton";
import { PaymentDocs } from "@/components/PaymentDocs";
import { Web3Context } from "../context/Provider";
import { useRouter } from "next/navigation";
  
export default function Navbar() {
    const [hidden, setHidden] = useState(false);
    const { scrollY } = useScroll();
    const { isConnected, connect, account } = useContext(Web3Context);
    const router = useRouter();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious();
        if (previous && latest > previous) {
            setHidden(true);
        } else {
            setHidden(false);
        }
    });

    const handleConnect = async () => {
        try {
            await connect();
        } catch (error) {
            console.error('Failed to connect wallet:', error);
        }
    };

    const handleProfileClick = () => {
        router.push('/create-profile');
    };

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
                        <PaymentDocs />
                    </div>
                    <div className="w-[25%] flex justify-end gap-2">
                        {!isConnected ? (
                            <button 
                                onClick={handleConnect}
                                className="bg-[#7A78FF] text-white px-3 py-1 rounded-md flex items-center gap-1 hover:bg-[#6563d4] transition-colors text-sm"
                            >
                                Connect Wallet
                            </button>
                        ) : (
                            <>
                                <div className="bg-black/50 backdrop-blur-sm px-3 py-1 rounded-md border border-gray-700 text-sm">
                                    {account?.slice(0, 6)}...{account?.slice(-4)}
                                </div>
                                <button 
                                    onClick={handleProfileClick}
                                    className="bg-[#7A78FF] text-white px-3 py-1 rounded-md flex items-center gap-1 hover:bg-[#6563d4] transition-colors text-sm"
                                >
                                    My Profile
                                </button>
                            </>
                        )}
                    </div>
                </motion.nav>
            </div>
        </>
    );
}
