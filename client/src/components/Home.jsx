import Image from 'next/image'
import React from 'react'
import Text from './Text'

const Home = () => {
  return (
    <div className='bg-[#FFE6CD] w-full h-[100vh]'>

      <div className="w-full h-full  flex flex-col justify-center items-center">
        <div className="flex z-10 text-black"
          style={{
            fontSize: "clamp(1rem,3vw,200rem)",
          }}
        >Scratch your web3 card.</div>
         <div className="flex absolute z-0 inset-0 w-full h-full justify-center flex-col items-center">
          <Image
            src="/bg-logo.svg"
            width={200}
            height={200}
            alt='bg'
            className='h-[100vh] w-auto '
          />
        </div>
        <Text
        delay={0.6}
        >
          <div className="ber z-20 hidden md:flex   leading-none text-black"
            style={{
              fontSize: "clamp(1rem,35vw,200rem)",
              lineHeight: 'clamp(1rem,30vw,200rem)'
            }}
          >SCRATCH</div>
        </Text>
         {/* <div className="flex z-10 text-black"
          style={{
            fontSize: "clamp(1rem,3vw,200rem)",
          }}
        >{"START HERE->"}</div> */}
       

      </div>
    </div>
  )
}

export default Home
