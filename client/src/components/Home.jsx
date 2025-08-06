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

        <div className="flex absolute z-0 inset-0 w-full h-full justify-end flex-col items-center md:items-end"
        style={{
              padding: "0 clamp(1rem, 2vw, 40rem)",
        }}
        >

          <div className="flex flex-col bg-gradient-to-tl from-neutral-700/90 via-black to-neutral-400/60 w-[90%] md:w-[60%] h-[60vh] md:h-[35vw] border-t-4 border-x-4 border-white/60 rounded-t-[20vw] md:rounded-t-[6vw]"
            style={{
              padding: "clamp(1rem, 2vw, 40rem)",
              gap: "clamp(1rem, 1vw, 40rem)",
            }}
          >
            <div className="h-[30vh] md:h-[8.5vw]"
            >
              <Image
                src="/bg-logo-2.svg"
                width={400}
                height={400}
                alt='bg'
                className='select-none rounded-l-full w-fit h-full '
              />
            </div> 
            <div className="h-[30vh] md:h-[8.5vw]"
            >
              <Image
                src="/heet.jpg"
                width={400}
                height={400}
                alt='bg'
                className='select-none rounded-full border-4 border-white/90 w-fit h-full '
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
    </div>
  )
}

export default Home
