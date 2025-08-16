import Image from 'next/image'
import React from 'react'

const Profile1 = ({Name , address , image}) => {

    return (
        <div className='w-full bg-black p-[5vw] relative h-full'>

            <div className="w-fit h-full relative"> 
                <Image
                src={'/profile/card.svg'}
                width={200}
                height={200}
                className='w-full h-full'
                alt='profile-bg-card'
            />
            

                <Image
                src={image}
                width={200}
                height={200}
                className='w-40 absolute border-4 border-white rounded-full aspect-square top-[9%] left-[5%] h-auto'
                alt='profile-bg-card '
            />

                <div className="text-white  absolute top-[5%] left-[39%]"
                    style={{
                        fontSize: "clamp(1rem,2.5vw,200rem)"
                    }}
                >{Name}</div>

                <div className="text-white/65  absolute top-[20%] left-[39%]"
                    style={{
                        fontSize: "clamp(1rem,2vw,200rem)"
                    }}
                >
                    {address.slice(0, 7) + "..."}
                </div>
            </div>
        </div>
    )
}

export default Profile1