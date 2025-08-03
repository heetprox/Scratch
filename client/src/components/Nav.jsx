import { MoveRight } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const Nav = () => {
  return (
    <div className='w-full flex flex-col justify-start absolute top-0 left-0 right-0 gap-2'
      style={{
        padding: 'clamp(1rem,1vw,200rem)',
        fontSize: "clamp(1rem,1.75vw,200rem)",
      }}
    >
      <div className="flex gap-2">
        <Image
          src="/logo.svg"
          width={200}
          height={200}
          alt='bg'
          className='h-full p-4 w-auto border-2 border-double border-white rounded-2xl'
        />

        <div className="flex justify-end items-center  text-right z-10 text-white border-2 border-white p-4  rounded-2xl border-double">
          About
        </div>
        <div className="flex justify-end items-center  text-right z-10 text-white border-2 border-white p-4  rounded-2xl border-double"
          style={{
            // fontSize: "clamp(1rem,2vw,200rem)",
          }}
        >connect
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex w-fit justify-end items-center  text-right z-10 text-white border-2 border-white px-4 py-8  rounded-2xl border-double">
          Demo
        </div>
        <div className="flex w-fit justify-end items-center  text-right z-10 text-white border-2 border-white px-4 py-8  rounded-2xl border-double">
          Contact
        </div>
      </div>

      <div className="flex w-fit justify-end items-center  text-right z-10 text-white border-2 border-white px-4 py-8  rounded-2xl border-double">
        START HERE
      </div>



    </div>
  )
}

export default Nav
