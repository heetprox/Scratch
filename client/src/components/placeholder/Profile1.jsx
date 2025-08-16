import Image from 'next/image'
import React from 'react'

const Profile1 = ({ Name, address, image }) => {

    return (
        <div className='w-full bg-[#000000] rounded-4xl overflow-hidden p-[0vw] relative h-full'
        style={{
                    borderRadius: "clamp(1.25rem,3vw,200rem)"

        }}
        >


            <Image
                src={'/logo.svg'}
                width={200}
                height={200}
                style={{
                    width: "clamp(1.25rem,4vw,200rem)",

                }}
                className='select-none absolute aspect-square bottom-[5%] right-[3%] h-auto'
                alt='profile-bg-card '
            />
            <div className="w-fit h-full relative">
                <div className="w-full h-full absolute bottom-0 right-0 bg-gradient-to-br rounded-full rounded-br-full"></div>

                <Image
                    src={'/profile/card.svg'}
                    width={200}
                    height={200}
                    className='w-full border-4 rounded-4xl border-r-white/70 border-b-white/70   rounded-br-[50vw] select-none h-full'
                    alt='profile-bg-card'
                />


                <Image
                    src={image}
                    width={200}
                    height={200}
                    style={{
                        width: "clamp(6.25rem,12vw,200rem)",
                        border: "clamp(0.5px,0.25vw,200px) solid white"

                    }}
                    className='w-40 select-none object-cover absolute border-4 border-white rounded-full aspect-square top-[9%] left-[5%] h-auto'
                    alt='profile-bg-card '
                />

                <div className="text-white  absolute top-[5%] left-[39%]"
                    style={{
                        fontSize: "clamp(1.5rem,2.5vw,200rem)"
                    }}
                >{Name}</div>

                <div className="text-white/65  absolute top-[20%] left-[39%]"
                    style={{
                        fontSize: "clamp(1rem,2vw,200rem)"
                    }}
                >
                    {`${address}`.slice(0, 7) + "..."}
                </div>
            </div>
        </div>
    )
}

export default Profile1