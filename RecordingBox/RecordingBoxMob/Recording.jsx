import React, { useContext, useRef, useState } from 'react'
import stylescss from "../../Css/RecordingButtons.module.css"


import { MicIcon, AnimationMic, StopMic, PlayMic } from "../../SvgIcons/SvgIcons"
import { readoutContext } from '../../Contextapi/ContextProvider';
import Timer from '../Timer';

const Recording = ({ sendBackend,setIsRecordingStarted }) => {
    const {setRemaingSkipCount, setIsAiResonce,isStartTimer, setIsStartTimer, isAiresponce, currentIndex, completedQuestionsId, setIsSkippedQuestions, setCompletedQuestionsId, questionData, setIsAudioSubmit, setAudioResponce, isloding, setIsLoding, isError, setIsError, errorMessage, setErrorMessage, setSkippedLimitReached, setAttemptsReached, attemptsReached } = useContext(readoutContext);
    const [isPlayRecording, setIsPlayRecording] = useState(true)
    const [playRecodring, setPlayRecording] = useState(true)
    const [isRecording, setIsRecording] = useState(false);
    const [recordedBlob, setRecordedBlob] = useState(null);
    const [isStopRecording, setIsStopRecording] = useState(false)
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const streamRef = useRef(null);
    const audioRef = useRef(null); // Add this inside your component
    
    const ErrorFunction = (message) => {
        setErrorMessage(message);
        setIsError(true)
        setTimeout(() => {
            setIsError(false);
            setErrorMessage("");
        }, 2000);
    }

    const isCompletedQuestion = completedQuestionsId?.[0]?.includes(questionData[currentIndex]?.question_id);
    const canRecord = !(attemptsReached && !isCompletedQuestion);

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
        setIsStopRecording(true)
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
        setIsStopRecording(false)

    }

    const submitHandler = async () => {
        setIsLoding(true)

        try {
            setIsPlayRecording(true);
            setIsStopRecording(false)
            setIsRecording(false)
            if (recordedBlob) {

                const formData = new FormData();

                formData.append("audio_url", recordedBlob, "response.webm");
                formData.append("question_id", sendBackend?.question_id);
                formData.append("category_level_id", sendBackend?.category_level_id);

                const status = await window.handleReadOutSubmit(formData)

                if (status) {
                    console.log(status, "status audio")

                    setIsAudioSubmit(status.status)
                    setAudioResponce(status)
                    setSkippedLimitReached(status.data.skipped_limit_reached)
                    setAttemptsReached(status.data.attempts_reached)
                    setCompletedQuestionsId(status?.completed_question_ids)
                    console.log(status.is_skipped, "is_skipped value")
                    setRemaingSkipCount(status?.data?.remaining_skip_count)
                    setIsSkippedQuestions(status.is_skipped)
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
            setIsLoding(false);
        }
    }


    return (
        <div className={stylescss.mainContainer} 
        style={{
            opacity: isloding ? "0.5" : "1",
            pointerEvents: isloding ? "none" : "auto",
             cursor: isloding ? "not-allowed" : "pointer",
          }}
        >
            <div className={stylescss.mainMic}
                style={{ backgroundColor: !isRecording ? "black" : "" }}
                onClick={isRecording ? !isPlayRecording ? playRecording : stopRecording : startRecording}

            >
                {isRecording ? isPlayRecording ?
                    <AnimationMic /> : !playRecodring ?
                        <PlayMic /> : <StopMic /> : <MicIcon width="30px" height="30px" />
                }
            </div>
            {/* <div className={`h7 ${stylescss.timers}`}>00:00:00</div> */}
            {!isRecording && (<div className={stylescss.buttons} onClick={startRecording} >
                Record
            </div>)}
            {isRecording && !isStopRecording &&  (<Timer/>)}
            {isRecording && !isStopRecording && (<div className={stylescss.buttons} onClick={stopRecording} >
                Stop
            </div>)}
            {(isStopRecording) && (<div className={stylescss.buttons} onClick={reRecordHandler} >
                Re-record
            </div>)}
            {(isStopRecording) && (<div className={stylescss.buttons} onClick={submitHandler} >
                Submit
            </div>)}


        </div>
    )
}




export default Recording