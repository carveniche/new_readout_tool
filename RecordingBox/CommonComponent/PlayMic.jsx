import React from 'react'
import '../../Css/mic.css';

const PlayMic = () => {
    return (

        <div className="mic-container">
            <span className="ring ring1"></span>
            <span className="ring ring2"></span>
            <span className="ring ring3"></span>
            <span className="ring ring4"></span>
            <div className="mic-button">
                <div className="play-min" >
                    <div className='play-min1' />
                    <div className='play-min2' />
                </div>
            </div>
        </div>

    )
}

export default PlayMic