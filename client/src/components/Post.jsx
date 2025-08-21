import React from 'react'

const Post = () => {
    return (
        <div className='w-full border  aspect-square h-fit p-1'>
            <div className="flex flex-col gap-2 w-full">
                <div className="flex w-full gap-2">
                    <div className="w-12 aspect-square h-12 bg-black/15 rounded-full"></div>

                    <div className="flex flex-col justify-center">
                        <div className="text-md">heet vavadiya</div>
                        <div className="text-sm text-black/50">Déjà vu! heet.pro</div>
                    </div>
                </div>


                <div className="w-full aspect-square h-auto bg-black/15">
                </div>
            </div>
        </div>
    )
}

export default Post