import Image from 'next/image'
import React from 'react'

const Profile1 = () => {
    return (
        <div className='w-full h-full'>
            <Image
                src={'/profile/card.svg'}
                width={200}
                height={200}
                className='w-full h-full'
                alt='profile-bg-card'
            />
        </div>
    )
}

export default Profile1