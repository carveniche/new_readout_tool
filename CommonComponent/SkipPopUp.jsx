import React, { useContext } from "react";
import { readoutContext } from "../Contextapi/ContextProvider";

const SkipPopup = () => {
    const {
        questionData, setCompletedQuestionsId, completedQuestionsId, skippedQuestionsId,
        setSkippedQuestionsId, isAudioSubmit, setIsAudioSubmit,
        isloding, skippedLimitReached, setSkippedLimitReached,
        attemptsReached, setAttemptsReached, setIsError, setErrorMessage,
        setCurrentIndex, currentIndex, setIsSkippedQuestions,
        setIsLastQuestionSkip, setIsAiResonce,
        setIsSkipPopUp,
        remaningSkipCount, setRemaingSkipCount,
    } = useContext(readoutContext);
    const cancleHandler = () => {
        setIsSkipPopUp(false)
    }
    const isCompletedQuestion = completedQuestionsId?.[0]?.includes(questionData[currentIndex]?.question_id);
    const continueHandler = async () => {
        if (skippedLimitReached === false && isCompletedQuestion === false && isAudioSubmit === false) {
            try {
                const formData = new FormData();
                formData.append("skipped", true);
                formData.append("question_id", questionData[currentIndex]?.question_id);
                formData.append("category_level_id", questionData[currentIndex]?.category_level_id);
                if (typeof window.handleReadOutSkip === "function") {
                    const responce = await window.handleReadOutSkip(formData)

                    if (responce) {
                        setSkippedLimitReached(responce?.data?.skipped_limit_reached);
                        setAttemptsReached(responce?.data?.attempts_reached);
                        setSkippedQuestionsId(responce?.skipped_questions)
                        console.log("skip Data", responce)
                        setRemaingSkipCount(responce.data?.remaining_skip_count)
                        setCompletedQuestionsId(responce?.completed_question_ids)
                        setIsSkippedQuestions(responce?.is_skipped)
                        if (currentIndex === questionData.length - 1) {
                            setIsLastQuestionSkip(true)
                        }
                        setIsSkipPopUp(false)
                    }

                } else {
                    console.warn("handleReadOutSkip is not defined yet!");
                }
            } catch (e) {
                console.error("Error in handleSkip:", e);
            } finally {
                setCurrentIndex((prevIndex) => {
                    if (prevIndex < questionData.length - 1) {
                        return prevIndex + 1;
                    }
                    return prevIndex;
                });
                setIsAudioSubmit(false)
                setIsAiResonce(false)
                setIsSkipPopUp(false)
            }



        }
    }

    return (
        <div style={styles.overlay}>
            <div style={styles.popup}>
                <p>Are you sure you want to skip?</p>
                {remaningSkipCount !== undefined && remaningSkipCount !== null && (
                    <p>You have {remaningSkipCount} skips remaining for today.</p>
                )}

                <div style={styles.buttonContainer}>
                    <button style={styles.continueBtn} onClick={continueHandler} >
                        Continue
                    </button>
                    <button style={styles.cancelBtn} onClick={cancleHandler} >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

// Example CSS in JS
const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
    },
    popup: {
        backgroundColor: "#fff",
        padding: "1rem",
        borderRadius: "10px",
        textAlign: "center",
        minWidth: "300px",
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "space-around",
        marginTop: "1.5rem",
    },
    continueBtn: {
        padding: "0.5rem 1rem",
        backgroundColor: "#4CAF50",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    cancelBtn: {
        padding: "0.5rem 1rem",
        backgroundColor: "#f44336",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
};

export default SkipPopup;

