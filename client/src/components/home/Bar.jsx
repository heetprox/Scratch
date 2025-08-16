import Image from 'next/image'
import React from 'react'
import User from '../icons/User'
import Setting from '../icons/Setting'
import Cube from '../icons/Cube'
import Plus from '../icons/Plus'
import Search from '../icons/Search'
import Notification from '../icons/Notification'
import Hover from '../placeholder/Hover'

const Bar = () => {
    return (
        <div className='max-h-screen min-h-screen h-full w-16 fixed left-0 top-0 bottom-0 border-r border-black/15'>
            <div className="flex w-full h-full flex-col justify-between items-center"
                style={{
                    padding: "clamp(0.75rem, 0.95vw, 100rem)"
                }}
            >
                <div className="w-full">
                    <Image
                        src={"/logow.svg"}
                        width={100}
                        height={100}
                        alt='logo'
                        className='w-full border-2 opacity-50 rounded-sm  border-white h-auto aspect-square invert'

                    />
                </div>


                <div className="w-full flex flex-col gap-6">
                    <Plus />
                    <Hover text='search'>

                        <Search />
                    </Hover>

                    <Cube />

                    <Notification />
                </div>

                <div className="w-full flex flex-col gap-6">
                    <User />

                    <Setting />


                </div>



            </div>

        </div>
    )
}

export default Bar