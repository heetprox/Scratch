import React from 'react'

const Hover = ({ children , text }) => {

  return (
    <div className='w-full overflow-auto flex cursor-pointer h-auto relative'>
        {children}
        <p className='text-white absolute top-0 left-0 bg-black hidden hover:block text-xl '>{text}</p>
    </div>
  )
}

export default Hover