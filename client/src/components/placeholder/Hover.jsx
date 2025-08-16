'use client'
import React, { useEffect, useState } from 'react'

const Hover = ({ children, text }) => {
    const [isHovered, setIsHovered] = useState(false)
    const [showTooltip, setShowTooltip] = useState(false)

    useEffect(() => {
    let timeoutId
    if (isHovered) {
      timeoutId = setTimeout(() => {
        setShowTooltip(true)
      }, 300)
    } else {
      clearTimeout(timeoutId)
      setShowTooltip(false)
    }

    // Cleanup function to clear timeout
    return () => clearTimeout(timeoutId)
  }, [isHovered])

    return (
        <div className="w-full cursor-pointer relative h-auto"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {children}

            {showTooltip && (
                  <div className="absolute  top-0 left-12 px-2 capitalize text-sm py-0.5 bg-black ber text-white whitespace-nowrap z-50">
                    {text}
                </div>
            )}
        </div>
    )
}

export default Hover