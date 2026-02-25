import React, { useContext, useEffect, useRef, useState } from "react";
import "../Css/mic.css";
import "../Css/aiFeedback.css";
import PlayMic from "./CommonComponent/PlayMic";
import StopMic from "./CommonComponent/StopMic";
import { readoutContext } from "../Contextapi/ContextProvider";
import AiFeedBackDes from "./AiFeedBackDes";




const AiFeedBackBox = () => {
    const { audioResponce ,isAiresponce} = useContext(readoutContext);
    const src =
        audioResponce?.audio_url?.audio_response?.url ;

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





    return (
        <div className="aimainContainer">
            <div className="aiplayAudio">
                <audio ref={audioRef} preload="auto" playsInline />
                <div
                    className="aiPlayAudioContainer"
                    style={{ gap: 20, }}

                >
                    <div className="playandPauseContainer" style={{ cursor: "pointer" }} onClick={togglePlayPause}>
                        {isPlaying ? <PlayMic /> : <StopMic />}
                    </div>
                    <div className="aitextContainer">Press the icon to play recording</div>
                </div>
            </div>

            {isAiresponce && <AiFeedBackDes/>}
        </div>
    );
};

export default AiFeedBackBox;