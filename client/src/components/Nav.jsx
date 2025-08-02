import Image from 'next/image'
import React from 'react'

const Nav = () => {
  return (
    <div className='w-full absolute top-0 left-0 right-0'
    style={{
      padding: 'clamp(1rem,2vw,200rem)'
    }}
    >
      <Image
            src="/logo.svg"
            width={200}
            height={200}
            alt='bg'
            className='h-[7vh] w-auto '
          />
    </div>
  )
}

export default Nav
