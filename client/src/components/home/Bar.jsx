'use client'

import Image from 'next/image'
import User from '../icons/User'
import Setting from '../icons/Setting'
import Cube from '../icons/Cube'
import Plus from '../icons/Plus'
import Search from '../icons/Search'
import Notification from '../icons/Notification'
import Hover from '../placeholder/Hover'

import React, { useState, useEffect } from 'react'
import Home from '../icons/Home'
const Bar = () => {

    return (
        <div className='max-h-screen bg-white min-h-screen h-full w-14 fixed  z-[999] left-0 top-0 bottom-0 border-r border-black/15'>
            <div className="flex w-full h-full flex-col justify-between items-center"
                style={{
                    padding: "clamp(0.85rem, 0.75vw, 100rem)"
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

                    <Hover text='home'>
                        <Home />
                    </Hover>

                    <Hover text='create a post'>
                        <Plus />
                    </Hover>

                    <Hover text='search'>
                        <Search />
                    </Hover>

                    <Hover text='explore'>
                        <Cube />
                    </Hover>

                    <Hover text='notifications'>
                        <Notification />
                    </Hover>
                </div>

                <div className="w-full flex flex-col gap-6">
                     <Hover text='me'>
                        <User />
                    </Hover>


                    <Hover text='settings'>
                        <Setting />
                    </Hover>


                </div>



            </div>

        </div>
    )
}

export default Bar