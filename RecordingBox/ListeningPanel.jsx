import React, { useContext, useEffect, useRef, useState } from 'react'
import '../Css/mic.css';
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { readoutContext } from '../Contextapi/ContextProvider';
import { ListenIcon, ListenStarted, MicIcon, voiceRecordIcon, ListenEndResume, animationMic, stopMic, playMic } from '../SvgIcons/SvgIcons';
const ListeningPanel = ({ data, currentPage, isRecordingStarted }) => {



    const { setIsAudioSubmit, setAudioResponce, isloding, setIsLoding } = useContext(readoutContext);
    const [isSubmited, setIsSubmited] = useState(false)
    const [IsSpeaking, setIsSpeaking] = useState(false);
    const [startspeaking, setStartSpeaking] = useState(true)
    const [isPaused, setIsPaused] = useState(false);
    const [voices, setVoices] = useState([]);






    const theme = useTheme();
    const isIpad = useMediaQuery(theme.breakpoints.down("md"));
    function speak(speech) {
        return new Promise((resolve, reject) => {
            const utterance = new SpeechSynthesisUtterance(speech);
            utterance.rate = 0.7;

            // const selectedVoice = voices.find((v) => v.lang === "en-US");
            // Pick female voice
            const femaleVoices = voices.filter(v =>
                /female|woman|samantha|victoria|eva|zira|linda|google us english|google uk english/i
                    .test(v.name + ' ' + v.lang)
            );

            // Use the first female voice or fallback to first available voice
            const selectedVoice = femaleVoices[0] || voices[0];
            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }

            utterance.onstart = () => {
                setIsSpeaking(true);
            };

            utterance.onend = () => {
                setIsSpeaking(false);
                resolve();
            };

            utterance.onerror = (event) => {
                console.error("SpeechSynthesis error:", event.error);
                reject(event.error);
            };

            speechSynthesis.speak(utterance);
        });
    }


    async function speakFullText(text) {
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        setIsSpeaking(true)
        try {
            for (let sentence of sentences) {
                await speak(sentence.trim());
            }
        } catch (error) {
            console.error("Error during speech:", error);
        } finally {
            setIsSpeaking(false);
        }
    }

    useEffect(() => {
        const handleVoices = () => {
            const loadedVoices = speechSynthesis.getVoices();
            if (loadedVoices.length > 0) {
                setVoices(loadedVoices);
            }
        };

        handleVoices();
        window.speechSynthesis.onvoiceschanged = handleVoices;

        return () => {
            window.speechSynthesis.onvoiceschanged = null;
        };
    }, []);


    // ✅ Utility to stop speech everywhere
    const stopSpeech = () => {
        if (speechSynthesis.speaking || speechSynthesis.pending) {
            speechSynthesis.cancel();
        }
        setIsSpeaking(false);
        setStartSpeaking(true);
        setIsPaused(false);
        // console.log("🔇 Speech stopped (React or Rails call)");
    };


    useEffect(() => {
        if (isRecordingStarted === true) {
            stopSpeech();
        }
    }, [isRecordingStarted]);

    useEffect(() => {
        stopSpeech();
    }, [currentPage]);

    // ✅ Expose stopSpeech globally (Rails can call this)
    useEffect(() => {
        window.stopSpeech = stopSpeech;

        return () => {
            stopSpeech();
            delete window.stopSpeech;
        };
    }, []);


    const speakingHandler = async () => {
        const pageContent = data;

        if (speechSynthesis.speaking && !isPaused) {
            speechSynthesis.pause();
            setIsPaused(true);
            console.log(speechSynthesis.speaking, speechSynthesis.paused)
            return;
        }

        if (isPaused) {
            speechSynthesis.resume();
            setIsPaused(false);
            return;
        }

        if (IsSpeaking) return;

        if (typeof pageContent === 'string' && pageContent.trim() !== '') {
            setStartSpeaking(false);
            setIsPaused(false);
            try {
                await speakFullText(pageContent);
            } catch (error) {
                console.error("Error during speaking:", error);
            }
        } else {
            console.warn("pageContent is empty or not a string:", pageContent);
        }
    }

    const litenStartHandler = () => {
        stopSpeech()
        speakingHandler()
    }

    return (


        <div
            style={{
                display: "flex",
                padding: "20px",
                flexDirection: "column",
                alignItems: "center",
                alignSelf: "stretch",
                width: isIpad ? "50%" : "",
                // backgroundColor: "#E7E8FE",
                background: "#E7E8FE",
                borderRadius: "14px",
                gap: "10px",
                opacity: isRecordingStarted ? 0.5 : 1,
            }}
        >
            <div
                style={{

                    padding: "3px",
                }}
                onClick={!isRecordingStarted ? speakingHandler : undefined}
            >   {startspeaking
                ? <ListenIcon />
                : isPaused
                    ? <ListenEndResume />
                    : IsSpeaking
                        ? <ListenStarted />
                        : <ListenEndResume />
                }

            </div>
            <div
                style={{
                    color: "#000",
                    textAlign: "center",
                    fontFamily: "Reddit Sans",
                    fontSize: "var(--Typography-Text-Body-Size, 16px)",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "128%",
                    alignSelf: "stretch",
                }}
                className='text_body'

            >
                {startspeaking
                    ? "Click the icon above/button below to listen the story"
                    : isPaused
                        ? "Click the icon to resume listening"
                        : IsSpeaking
                            ? "Click the icon to pause listening"
                            : ""
                }

            </div>
            <div
                style={{
                    display: "flex",
                    // width: "144px",
                    padding: "12px 20px",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "var(--Button-Spacing, 8px)",
                    borderRadius: "999px",
                    // backgroundColor: "#FF8652",
                    border: "1px solid #141414",
                    textAlign: "center",

                    cursor: "pointer"
                }}
                onClick={!isRecordingStarted ? litenStartHandler : undefined}
            >

                Listen From Start

            </div>

        </div>


    )
}

export default ListeningPanel