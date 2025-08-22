import { Plus } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const Post = () => {
    return (
        <div className='w-full  aspect-square h-fit p-1'>
            <div className="flex flex-col items-end gap-2 w-full">
                <div className="flex w-full px-2 justify-end gap-2">
                   <div className="flex">
                        <div className="flex flex-col justify-center">
                            <div className="text-md text-black/50">2h ago </div>
                        </div>
                   </div>
                   
                    <div className="flex">
                        <div className="flex flex-col justify-center">
                            <div className="text-2xl text-black/50">•</div>
                        </div>
                   </div>
                   
                   <div className="flex gap-3">
                        <div className="flex flex-col justify-center">
                            <div className="text-md">heet vavadiya</div>
                        </div>

                        <div className="w-10 aspect-square h-10 bg-black/15 rounded-full relative">
                            <Image
                                src={"/heet.jpg"}

                                width={100}
                                height={100}
                                alt='logo'
                                className='w-full rounded-full   h-auto aspect-square'
                            />
                            <div className="bg-white border-black border absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex justify-center flex-col items-center">
                                <Plus className='w-5 h-5' color='black' />
                            </div>

                        </div>
                    </div>


                </div>


                <div className="w-full aspect-square rounded-3xl overflow-hidden h-auto bg-black/15">
                    <Image
                        src={"/post.webp"}
                        width={100}
                        height={100}
                        alt='logo'
                        className='w-full border-2   border-white h-auto aspect-square'
                    />
                </div>



                <div className="flex gap-2 w-full">
                    <div className=""></div>

                </div>
            </div>
        </div>
    )
}

export default Post