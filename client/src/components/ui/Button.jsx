import React from 'react'

const Button = ({ text, color, textColor = "#000" }) => {
    return (
        <div
            className="text-white w-fit py-5 cursor-pointer px-8 rounded-lg transition-colors ber font-medium text-lg"
            style={{
                backgroundColor: color,
                color: textColor

            }}
        >
            {text}
        </div>
    )
}

export default Button