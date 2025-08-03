import Image from 'next/image'
import React from 'react'
import Text from './Text'
import { MoveRight } from 'lucide-react'

const Home = () => {
  return (
    <div className='bg-[#000000] w-full h-[100vh]'>

      <div className="w-full h-full  flex flex-col justify-end items-center">
        <Text
          delay={0.6}
        >
          <div className="flex z-10 text-white"
            style={{
              fontSize: "clamp(1rem,3vw,200rem)",
            }}
          >your
            <span className='text-transparent select-none'>
              ----------------------------------------</span>web3
            <span className='text-transparent select-none'>

              --------------------------</span>
            card
          </div>
        </Text>

        <div className="flex absolute z-0 inset-0 w-full h-full justify-center flex-col items-center">
          <Image
            src="/bg-logo-2.svg"
            width={400}
            height={400}
            alt='bg'
            className='h-[30vh] md:h-[40vw] w-auto '
          />
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
    </div>
  )
}

export default Home
