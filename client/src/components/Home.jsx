import Image from 'next/image'
import React from 'react'

const Home = () => {
  return (
    <div className='bg-[#FFE6CD] w-full h-[100vh]'>

      <div className="w-full h-full  flex flex-col justify-center items-center">
        {/* <div className="flex z-10 text-black"
          style={{
            fontSize: "clamp(1rem,3vw,200rem)",
            marginBottom: "-5vw"

          }}
        >Scratch your web3 card.</div> */}

        <div className="ber flex z-10   leading-none text-black"
          style={{
            fontSize: "clamp(1rem,35vw,200rem)",
          }}
        >SCRATCH</div>
        <div className="flex absolute z-0 inset-0 w-full justify-center">
          <Image
            src="/bg-logo.svg"
            width={200}
            height={200}
            alt='bg'
            className='w-[50vw]'
          />
        </div>

      </div>
    </div>
  )
}

export default Home
