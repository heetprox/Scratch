import Image from 'next/image'
import React, { useContext } from 'react'
import Text from './Text'
import { MoveRight, Wallet, UserPlus, ExternalLink } from 'lucide-react'
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
    <div className='bg-[#F58300] w-full h-[100vh]'>
      {/* <LightRays
    raysOrigin="top-center"
    raysColor="#8D50F9"
    raysSpeed={1.5}
    lightSpread={0.8}
    rayLength={1.2}
    followMouse={true}
    mouseInfluence={0.1}
    noiseAmount={0.1}
    distortion={0.05}
    className="custom-rays"
  /> */}
      <div className="w-full h-full flex flex-col justify-between items-center">
        <div className="h-[10vh]"></div>
        <div className="flex flex-col gap-10">
          <div className="relative">

            <h1
              style={{
                fontSize: "clamp(1rem, 6vw, 100rem)",
                lineHeight: "clamp(1rem, 7vw, 10rem)",
              }}
              className='pro  z-50 relative text-[#F7ED35] text-center uppercase'>Every Tap Tells
            </h1>
            <h1
              style={{
                fontSize: "clamp(1rem, 6vw, 100rem)",
                lineHeight: "clamp(1rem, 7vw, 10rem)",
              }}
              className='pro absolute inset-0 ml-3 mt-3  text-[#000000] text-center z-10 uppercase'>Every Tap Tells
            </h1>
          </div>

          <div className="relative">

            <h1
              style={{
                fontSize: "clamp(1rem, 20vw, 100rem)",
                lineHeight: "clamp(1rem, 16vw, 100rem)",
              }}
              className='pro  z-50 relative text-[#F7ED35] text-center uppercase'>Story
            </h1>
            <h1
              style={{
                fontSize: "clamp(1rem, 20vw, 100rem)",
                lineHeight: "clamp(1rem, 10vw, 100rem)",
              }}
              className='pro absolute inset-0 ml-2 mt-2  text-[#000000] text-center z-10 uppercase'>Story
            </h1>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-16 flex flex-col md:flex-row gap-4 z-10">
          {!isConnected ? (
            <button
              onClick={handleConnect}
              className="bg-[#7A78FF] text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-[#6563d4] transition-colors"
            >
              <Wallet size={20} />
              Connect Wallet
            </button>
          ) : (
            <>
              <button
                onClick={handleCreateProfile}
                className="bg-[#7A78FF] text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-[#6563d4] transition-colors"
              >
                <UserPlus size={20} />
                Create Profile
              </button>
              <button
                onClick={handleDemoPayment}
                className="bg-[#00A652] text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-[#008a44] transition-colors"
              >
                <ExternalLink size={20} />
                Try Demo Payment
              </button>
            </>
          )}
        </div>

        <div className="  w-full h-full items-end grid grid-cols-5 gap-3 "
          style={{
            padding: "0 clamp(1rem, 2vw, 40rem)",
          }}
        >

          <div className="flex flex-col justify-center items-center z-[999] relative bg-[#7A78FF] aspect-square w-full h-auto  rounded-full"
            style={{
            }}
          >
            <div className="h-auto aspect-square rounded-full bg-black p-1 w-[65%]"
            >

            </div>
          </div>


          <div className="flex flex-col justify-center items-center z-[999] relative bg-[#00A652] aspect-square w-full h-auto  rounded-4xl"
            style={{
            }}
          >
            <div className="h-[70%]"
            >
              <Image
                src="/shapes/2.svg"
                width={400}
                height={400}
                alt='bg'
                className='select-none w-fit h-full '
              />
            </div>
          </div>

          <div className="flex flex-col justify-center items-center z-[999] relative bg-[#FF6D38] aspect-square w-full h-auto  rounded-4xl"
            style={{
              clipPath: "polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%)"
            }}
          >
            <div className="h-[60%] bg-black p-1 w-[60%]"
              style={{
                clipPath: "polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%)"
              }}
            >

            </div>
          </div>

          <div className="flex flex-col justify-center items-center z-[999] relative bg-[#FFC412] aspect-square w-full h-auto  rounded-4xl"
            style={{
            }}
          >
            <div className="h-[70%]"
            >
              <Image
                src="/shapes/3.svg"
                width={400}
                height={400}
                alt='bg'
                className='select-none w-fit h-full '
              />
            </div>
          </div>

          <div className="flex flex-col justify-center items-center z-[999] relative bg-[#478BFF] aspect-square w-full h-auto  rounded-full"
            style={{
            }}
          >
            <div className="h-[70%]"
            >
              <Image
                src="/shapes/5.svg"
                width={400}
                height={400}
                alt='bg'
                className='select-none w-fit h-full '
              />
            </div>
          </div>
        </div>
        {/* <Text
          delay={0.6}
        >
          <div className="ber z-20  md:flex   leading-none text-white "
            style={{
              fontSize: "clamp(1rem,24vw,200rem)",
              paddingBottom: "clamp(1rem,3vw,200rem)",

              lineHeight: 'clamp(1rem,15vw,200rem)'
            }}
          >SCRATCH</div>
        </Text> */}


      </div>

      {/* Connected Account Display */}
      {isConnected && (
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-700">
          <p className="text-white text-sm">
            {account?.slice(0, 6)}...{account?.slice(-4)}
          </p>
        </div>
      )}
    </div>
  )
}

export default Home
