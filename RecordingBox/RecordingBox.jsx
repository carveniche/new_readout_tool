
import React, { useContext, useEffect, useRef, useState } from 'react'
import '../Css/mic.css';
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { readoutContext } from '../Contextapi/ContextProvider';
import { MicIcon, AnimationMic, StopMic, PlayMic } from '../SvgIcons/SvgIcons';
import ListeningPanel from './ListeningPanel';
import AiFeedBackDes from './AiFeedBackDes';
import Timer from './Timer';

const RecordingBox = ({ data, currentPage, sendBackend }) => {
    // console.log(data, currentPage, sendBackend, "backendData")
    const {setRemaingSkipCount, setIsAiResonce,isStartTimer,setIsStartTimer, isAiresponce, currentIndex, completedQuestionsId, setIsSkippedQuestions, setCompletedQuestionsId, questionData, setIsAudioSubmit, setAudioResponce, isloding, setIsLoding, isError, setIsError, errorMessage, setErrorMessage, setSkippedLimitReached, setAttemptsReached, attemptsReached } = useContext(readoutContext);
    const [isSubmited, setIsSubmited] = useState(false)
    const [isPlayRecording, setIsPlayRecording] = useState(true)
    const [playRecodring, setPlayRecording] = useState(true)
    const [isRecording, setIsRecording] = useState(false);
    const [recordedBlob, setRecordedBlob] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const theme = useTheme();
    const isIpad = useMediaQuery(theme.breakpoints.down("md"));
    const streamRef = useRef(null);
     const audioRef = useRef(null); // Add this inside your component
    const [isRecordingStarted, setIsRecordingStarted] = useState(false);

    const isCompletedQuestion = completedQuestionsId?.[0]?.includes(questionData[currentIndex]?.question_id);
    const canRecord = !(attemptsReached && !isCompletedQuestion);
    const ErrorFunction = (message) => {
        setErrorMessage(message);
        setIsError(true)
        setTimeout(() => {
            setIsError(false);
            setErrorMessage("");
        }, 2000);
    }


    const startRecording = async () => {
        if (canRecord) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                streamRef.current = stream;

                // Safari-safe MIME type
                let mimeType = 'audio/webm';
                if (MediaRecorder.isTypeSupported('audio/webm')) {
                    mimeType = 'audio/webm';
                } else if (MediaRecorder.isTypeSupported('audio/aac')) {
                    mimeType = 'audio/aac';
                }

                const mediaRecorder = new MediaRecorder(stream, { mimeType });
                audioChunksRef.current = [];

                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        audioChunksRef.current.push(event.data);
                    }
                };

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
                    setRecordedBlob(audioBlob);

                    // ✅ stop microphone when recording ends
                    if (streamRef.current) {
                        streamRef.current.getTracks().forEach(track => track.stop());
                        streamRef.current = null;
                    }
                };

                mediaRecorderRef.current = mediaRecorder;
                mediaRecorder.start();
                setIsRecording(true);
                setIsRecordingStarted(true);
                setIsStartTimer(true)
            } catch (err) {
                console.error("Error accessing microphone:", err);
                alert("Microphone access denied or not available.");
            }
        } else {
            ErrorFunction("You’ve reached today’s limit. Please continue practicing previous questions.");
        }
    };


    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsPlayRecording(false);
        setIsRecordingStarted(false);
        setIsStartTimer(false)
    };

    const playRecording = () => {
        if (!recordedBlob) return;

        // If already playing, pause and reset
        if (audioRef.current && !audioRef.current.paused) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            // setIsPlayRecording(true);
            setPlayRecording(true);
            return;
        }

        // Create and play new audio
        const audioUrl = URL.createObjectURL(recordedBlob);
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.play();
        setPlayRecording(false)
        audio.onended = () => {
            setIsPlayRecording(false);
            setPlayRecording(true);
        };
    };

    const reRecordHandler = () => {
        if (isRecording) stopRecording();
        setRecordedBlob(null);
        startRecording();
        setIsPlayRecording(true);

    }
    const successfullSubmited = () => {
        alert("Audio has been successfully submitted!");
    };
    const submitHandler = async () => {
        setIsLoding(true)
        // setIsSubmited(true)
        try {
            setIsRecording(false)
            setIsPlayRecording(true)
            setPlayRecording(true)
            if (recordedBlob) {

                const formData = new FormData();

                formData.append("audio_url", recordedBlob, "response.webm");
                formData.append("question_id", sendBackend?.question_id);
                formData.append("category_level_id", sendBackend?.category_level_id);

                const status = await window.handleReadOutSubmit(formData)

                if (status) {
                    // console.log(status, "status audio")
                    setIsSubmited(status?.status)
                    setIsAudioSubmit(status?.status)
                    setAudioResponce(status)
                    setSkippedLimitReached(status?.data?.skipped_limit_reached)
                    setAttemptsReached(status?.data?.attempts_reached)
                    setCompletedQuestionsId(status?.completed_question_ids)
                    // console.log(status.is_skipped, "is_skipped value")
                    setIsSkippedQuestions(status?.is_skipped)
                    setRemaingSkipCount(status?.data?.remaining_skip_count)
                    setIsAiResonce(true)

                    if (status.status === false) {
                        setErrorMessage("Incorrect response. Please try again.");
                        setIsError(true)
                        setTimeout(() => {
                            setIsError(false);
                            setErrorMessage("");
                        }, 2000);
                    }
                }

            } else {
                console.warn("No recording found.");
            }
        } catch (e) {

        } finally {
            setIsLoding(false);  // ✅ Corrected placement
        }
    }



    const RecordingPanel = () => (

        <div
            style={{
                display: "flex",
                padding: "20px",
                flexDirection: "column",
                alignItems: "center",
                alignSelf: "stretch",
                width: isIpad ? "50%" : "",
                background: "#E7E8FE",
                borderRadius: "14px",
                gap: "10px",
                cursor: isloding ? "not-allowed" : "pointer",
                pointerEvents: isloding ? "none" : "auto",
                opacity: isloding ? 0.5 : 1,
            }}
        >
            <div
                style={{
                    backgroundColor: !isRecording ? "black" : "",
                    borderRadius: !isRecording ? "40px" : undefined,
                    padding: !isRecording ? "10px" : "",
                }}
                onClick={!isSubmited ? isRecording ? !isPlayRecording ? playRecording : stopRecording : startRecording : successfullSubmited}
            >
                {isRecording ? isPlayRecording ? <AnimationMic /> : !playRecodring ? <PlayMic /> : <StopMic /> : <MicIcon />}

            </div>
            {!isPlayRecording && (
                <div
                    style={
                        {
                            display: "flex",
                            gap: "5px",
                            width: "100%",
                            justifyContent: "center"
                        }
                    }
                >
                    <div
                        style={{
                            display: "flex",
                            // width: "80px",
                            borderRadius: "999px",
                            border: "1px solid #141414",
                            justifyContent: "center",
                            alignItems: "center",
                            // padding: "12px 5px",
                            padding: "15px",
                            flexShrink: 0,
                            cursor: "pointer",
                            // backgroundColor: "#FF8652",
                        }}
                         onMouseEnter={e => {
                            if (!isloding){ e.currentTarget.style.backgroundColor = "#141414";
                                e.currentTarget.style.color = "white";
                            }
                        }}
                        onMouseLeave={e => {
                            if (!isloding) {e.currentTarget.style.backgroundColor = "";
                            e.currentTarget.style.color = "black";
                            }
                        }}
                        onClick={reRecordHandler}
                    > Re-Record</div>
                    <div
                        style={{
                            display: "flex",
                            // width: "80px",
                            borderRadius: "999px",
                            border: "1px solid #141414",
                            justifyContent: "center",
                            alignItems: "center",
                            // padding: "12px 5px",
                            padding: "15px",
                            flexShrink: 0,
                            // backgroundColor: "#FF8652",
                            // cursor: "pointer",
                            // backgroundColor: isloding ? "#FFB28A" : "#FF8652",  // lighter color when disabled
                            cursor: isloding ? "not-allowed" : "pointer",
                            pointerEvents: isloding ? "none" : "auto",       // disables click events
                            userSelect: isloding ? "none" : "auto",
                            // hover:  backgroundColor: "#FF6A3D", // hover effect only when not disabled

                        }}
                        onMouseEnter={e => {
                            if (!isloding){ e.currentTarget.style.backgroundColor = "#141414";
                                e.currentTarget.style.color = "white";
                            }
                        }}
                        onMouseLeave={e => {
                            if (!isloding) {e.currentTarget.style.backgroundColor = "";
                            e.currentTarget.style.color = "black";
                            }
                        }}
                        onClick={submitHandler}
                    >Submit</div>
                </div>
            )}
            {!isRecording && (<div
                style={{

                    textAlign: "center",

                }}
                className='text_body_recording'
            >
                Press the icon to start recording
            </div>)}
            {(isRecording && isStartTimer )  && <Timer/>}
            <div

                className='text_body_recording'
            >
                {isPlayRecording ? "Don’t forget to press ‘stop’ once done" : playRecodring ? "Click the Play icon to listen the recoding" : "Click the Pause icon to stop listen the recoding"}
            </div>
        </div>

    );


    return (
        <div
            style={{
                display: "flex",
                display: "flex",
                flexDirection: isIpad ? "row" : "column",
                alignItems: "center",
                gap: "20px",
                // justifyContent: "space-evenly",
                borderRadius: "14px",
                height: "100%"
            }}
        >
            <RecordingPanel />
            <ListeningPanel data={data} currentPage={currentPage} isRecordingStarted={isRecordingStarted} />
            {isAiresponce && <AiFeedBackDes />}
        </div>
    );
};




export default RecordingBox