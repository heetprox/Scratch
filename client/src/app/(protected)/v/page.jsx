import Bar from '@/components/home/Bar'
import Post from '@/components/Post'
import React from 'react'

const page = () => {
  return (
    <div className='w-full h-full flex justify-center bg-white min-h-screen'>
      <div className="w-[30vw] mt-10">
        <Post />
      </div>
    </div>

  )
}

export default page