import { CircleUser, CircleUserRound, Search, Settings, SquarePlus, Telescope } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import User from '../icons/User'
import Setting from '../icons/Setting'
import Cube from '../icons/Cube'
import Plus from '../icons/Plus'

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
                        src={"/logo.svg"}
                        width={100}
                        height={100}
                        alt='logo'
                        className='w-full border-2 p-1  border-white h-auto aspect-square invert'

                    />
                </div>


                <div className="w-full flex flex-col gap-6">
                    <Plus />


                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-auto aspect-square">
                        <path strokeLinecap="round" color='rgb(0, 0, 0, 0.4)' strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>

                    <Cube />


                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-auto aspect-square">
                        <path strokeLinecap="round" color='rgb(0, 0, 0, 0.4)' strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                    </svg>


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