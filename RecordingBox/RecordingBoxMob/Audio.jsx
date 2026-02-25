import React, { useContext, useEffect, useRef, useState } from 'react'
import stylescss from "../../Css/ListningBoxMod.module.css"

import { readoutContext } from '../../Contextapi/ContextProvider';
import PlayMic from "../CommonComponent/PlayMic";
import StopMic from "../CommonComponent/StopMic";

const Audio = ({ data, isRecordingStarted }) => {

    const { audioResponce, isAudioSubmit } = useContext(readoutContext);
    const src =
        audioResponce?.audio_url?.audio_response?.url || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" ;

    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Keep UI in sync with the real element state
    useEffect(() => {
        const el = audioRef.current;
        if (!el) return;

        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);
        const onEnded = () => setIsPlaying(false);
        const onError = () =>
            console.error("Audio error:", el?.error?.code, el?.error?.message);

        el.addEventListener("play", onPlay);
        el.addEventListener("pause", onPause);
        el.addEventListener("ended", onEnded);
        el.addEventListener("error", onError);
        return () => {
            el.removeEventListener("play", onPlay);
            el.removeEventListener("pause", onPause);
            el.removeEventListener("ended", onEnded);
            el.removeEventListener("error", onError);
        };
    }, []);

    // If the src changes, load the new one and reset state
    useEffect(() => {
        const el = audioRef.current;
        if (!el) return;
        el.src = src;
        el.load();
        setIsPlaying(false);
    }, [src]);

    const togglePlayPause = () => {
        const el = audioRef.current;
        if (!el) return;
        if (el.paused) {
            el.play().catch((err) => console.error("Play failed:", err));
        } else {
            el.pause();
        }
    };
    useEffect(() => {
        const el = audioRef.current;
        if (!el) return;
    
        if (!isAudioSubmit) {
          el.pause();
          el.currentTime = 0; // optional: reset to start
          setIsPlaying(false);
        }
      }, [isAudioSubmit]);


    return (
        <div className={stylescss.mainContainer}>
             <audio ref={audioRef} preload="auto" playsInline />
            <div style={{ cursor: "pointer" }} onClick={togglePlayPause}>
                {isPlaying ? <PlayMic /> : <StopMic />}
            </div>

            <div className={stylescss.buttons} onClick={togglePlayPause} >
                Play
            </div>
        </div>
    )
}







export default Audio