import React, { useState, useEffect, useRef, useContext } from 'react';
import { readoutContext } from '../Contextapi/ContextProvider';

function Timer() {
    const { isStartTimer, setIsStartTimer } = useContext(readoutContext);
    const [seconds, setSeconds] = useState(0);
    const intervalRef = useRef(null);

    // Format seconds to HH:MM:SS
    const formatTime = (totalSeconds) => {
        const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const secs = String(totalSeconds % 60).padStart(2, '0');
        return `${hrs}:${mins}:${secs}`;
    };

    // Start timer when recording starts
    useEffect(() => {
        if (isStartTimer) {
            intervalRef.current = setInterval(() => {
                setSeconds((prev) => prev + 1);
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
            setSeconds(0); // Reset timer on stop
        }

        // Cleanup when component unmounts or isRecording changes
        return () => clearInterval(intervalRef.current);
    }, [isStartTimer]);

    

    return (
        <div style={styles.timer}>
            {formatTime(seconds)}
        </div>
    );
}

const styles = {
    timer: {
        color: '#835DF1',
        textAlign: 'center',
        fontFamily: 'Reddit Sans',
        fontSize: '1rem',
        fontStyle: 'normal',
        fontWeight: 700,
        lineHeight: '120%',
    }
};


export default Timer