import Image from 'next/image'
import React, { useContext } from 'react'
import Text from './Text'
import { MoveRight, Wallet, UserPlus, ExternalLink, BowArrow, HatGlasses, PackagePlus } from 'lucide-react'
import LightRays from './LightRays'
import { Web3Context } from '../context/Provider'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const Home = () => {
  const { isConnected, connect, account } = useContext(Web3Context);
  const router = useRouter();

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleCreateProfile = () => {
    router.push('/create-profile');
  };

  const handleDemoPayment = () => {
    router.push('/profile/demo');
  };

  return (
    <div className='bg-[#F58300] w-full h-full'>
      <div className="w-full h-full flex flex-col justify-between items-center">
        <div className="h-[10vh]"></div>
        <div className="flex flex-col gap-5">
          <div className="relative">

            <h1
              style={{
                fontSize: "clamp(3rem, 6vw, 100rem)",
                lineHeight: "clamp(3rem, 7vw, 10rem)",
              }}
              className='pro  z-50 relative text-[#F7ED35] text-center uppercase'>Every Tap Tells A
            </h1>
            <h1
              style={{
                fontSize: "clamp(3rem, 6vw, 100rem)",
                lineHeight: "clamp(3rem, 7vw, 10rem)",
              }}
              className='pro absolute inset-0  translate-1.5 md:translate-2  text-[#000000] text-center z-10 uppercase'>Every Tap Tells A
            </h1>
          </div>

          <div className="relative ">

            <h1
              style={{
                fontSize: "clamp(8rem, 20vw, 100rem)",
                lineHeight: "clamp(6rem, 19vw, 100rem)",
              }}
              className='pro  z-50 relative text-[#F7ED35] text-center uppercase'>Story
            </h1>
            <h1
              style={{
                fontSize: "clamp(8rem, 20vw, 100rem)",
                lineHeight: "clamp(1rem, 12vw, 100rem)",
              }}
              className='pro absolute inset-0 translate-2  text-[#000000] text-center z-10 uppercase'>Story
            </h1>
          </div>
        </div>
        <div className="flex md:flex-row flex-col gap-5 translate-y-2">
          {!isConnected ? (
            <div className="relative">
              <button
                onClick={handleConnect}
                className="bg-[#000000] text-[#fff] px-6  rounded-3xl cursor-pointer leading-16 text-md flex  ber items-center gap-2 relative z-50 uppercase transition-colors"
              >
                <div className="">
                  Connect Wallet
                </div>
                <BowArrow />

              </button>
              <button
                onClick={handleConnect}
                className="bg-[#ffffff] absolute inset-0 text-[#fff] px-6  rounded-full leading-16 z-30 text-md flex  ber items-center
              translate-3 gap-2 uppercase transition-colors"
              >
                Connect Wallet
              </button>
            </div>
          ) : (
            <>
              <Link href="/create-profile" className="relative">
                <button
                  onClick={handleCreateProfile}
                  className="bg-[#000000] text-[#fff] px-6  rounded-3xl cursor-pointer leading-16 text-md flex  ber items-center gap-2 relative z-50 uppercase transition-colors"
                >
                  <div className="">
                    start building
                  </div>
                  <PackagePlus />

                </button>
                <button
                  onClick={handleCreateProfile}
                  className="bg-[#ffffff] absolute inset-0 text-[#fff] px-6  rounded-full leading-16 z-30 text-md flex  ber items-center
              translate-3 gap-2 uppercase transition-colors"
                >
                  start building
                </button>
              </Link>
              <Link href="/profile/demo" className="relative flex justify-center">

                <button
                  onClick={handleConnect}
                  className="bg-[#000000] text-[#fff] px-6  rounded-3xl cursor-pointer leading-16 text-md flex  ber items-center gap-2 relative z-50 uppercase transition-colors"
                >
                  <div className="">
                    See demo
                  </div>
                  <HatGlasses />

                </button>
                <button
                  onClick={handleDemoPayment}
                  className="bg-[#ffffff] absolute inset-0 text-[#fff] px-6 w-fit rounded-full leading-16 z-30 text-md select-none overflow-hidden flex  ber items-center
              translate-3 gap-2 uppercase transition-colors"
                >
                  see demo ccc

                </button>

              </Link>
            </>
          )}
        </div>

        <div className="  w-full h-full items-end grid grid-cols-5 gap-3 "
          style={{
            padding: "0 clamp(1rem, 2vw, 40rem)",
          }}
        >




        </div>


      </div>

      {isConnected && (
        <div className="absolute top-4 right-4 bg-black/90 backdrop-blur-sm px-4  py-2 rounded-lg border border-gray-700">
          <p className="text-white text-md">
            {account?.slice(0, 6)}...{account?.slice(-4)}
          </p>
        </div>
      )}
    </div>
  )
}

export default Home
