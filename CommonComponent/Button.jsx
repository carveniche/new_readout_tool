import React, { useContext, useEffect, useState } from 'react'
import { readoutContext } from '../Contextapi/ContextProvider';
import { hover } from '@testing-library/user-event/dist/hover';
import { useMediaQuery, useTheme } from '@mui/material';
import buttonStyle from '../Css/button.module.css'

const Button = ({ buttonContainerStyle = {} }) => {
    const {
        questionData, setCompletedQuestionsId, completedQuestionsId, skippedQuestionsId,
        setSkippedQuestionsId, isAudioSubmit, setIsAudioSubmit,
        isloding, skippedLimitReached, setSkippedLimitReached,
        attemptsReached, setAttemptsReached, setIsError, setErrorMessage,
        setCurrentIndex, currentIndex, setIsSkippedQuestions,
        setIsLastQuestionSkip,setIsAiResonce,setIsSkipPopUp
    } = useContext(readoutContext);
    const theme = useTheme();
    const isIpad = useMediaQuery(theme.breakpoints.down("sm"), { noSsr: true });
    const [hover, setHover] = useState(false);
    const [totalQuestion, setTotalQuestion] = useState(0);

    const isCompletedQuestion = completedQuestionsId?.[0]?.includes(questionData[currentIndex]?.question_id);

    useEffect(() => {
        setTotalQuestion(questionData.length);
    }, [questionData]);

    const prevButtonDisabled = currentIndex < 1 || isloding;

    const preButton = {
        
        background: prevButtonDisabled ? "#4A52F5" : "#1C24F3",
        color: "white",
        cursor: prevButtonDisabled ? "not-allowed" : "pointer",
        // opacity: prevButtonDisabled ? 0.5 : 1,

    }

    const nextButtonDisabled = isloding || currentIndex >= totalQuestion - 1;

    const nextButton = {
       
        cursor: nextButtonDisabled ? "not-allowed" : "pointer",
        opacity: nextButtonDisabled ? 0.5 : 1,
    }


    const skipDisabled = isloding || currentIndex > totalQuestion - 1 || skippedLimitReached || isCompletedQuestion;
    const pointerdisabled = isloding || currentIndex > totalQuestion - 1 || isCompletedQuestion;

    const skipbuttonStyle = {
       
        borderRadius: "var(--Button-Radius, 62.4375rem)",
        border: hover && !skipDisabled
            ? "2px solid var(--Greyscale-Text-Title, #0A0A0A)"
            : "2px solid var(--Greyscale-Surface-Disabled, #B3B8BC)",
        background: hover && !skipDisabled
            ? "var(--Greyscale-Text-Title, #0A0A0A)"
            : "transparent",
        color: hover && !skipDisabled
            ? "var(--Greyscale-Surface-Default, #FFFFFF)"
            : "var(--Greyscale-Text-Title, #0A0A0A)",
        cursor: pointerdisabled ? "not-allowed" : "pointer",
        opacity: skipDisabled ? 0.5 : 1,
    };







    const handleSkip = async () => {
        console.log("sdfsdfsdfsd")
        if(attemptsReached){
            ErrorFunction("Today's questions are exhausted.");
            return;
        }
        if (skippedLimitReached  && isCompletedQuestion === false ) {
            // console.log("Buttons skippedLimitReached ", skippedLimitReached)
            setErrorMessage("Skipped limit reached.");
            setIsError(true);

            setTimeout(() => {
                setIsError(false);
                setErrorMessage("");
            }, 2000);
        }else if(isCompletedQuestion === false ){

            setIsSkipPopUp(true)
        }
        
    }


    const preHandler = () => {
        if (isloding === false) {
            setCurrentIndex((prevIndex) => {
                if (prevIndex > 0) {
                    return prevIndex - 1;
                }
                return prevIndex; // stay at current index if already at start
            });
            setIsAudioSubmit(false)
            setIsAiResonce(false)
        }
    };

    const ErrorFunction = (message) => {
        setErrorMessage(message);
        setIsError(true)
        setTimeout(() => {
            setIsError(false);
            setErrorMessage("");
        }, 2000);
    }


    const nextHandler = () => {

        if (isCompletedQuestion) {
            setCurrentIndex((prevIndex) => {
                if (prevIndex < questionData.length - 1) {
                    return prevIndex + 1;
                }
                return prevIndex; // stay at current index if already at end
            });
            setIsAudioSubmit(false)
            setIsAiResonce(false)
            return;
        }

        if (attemptsReached) {
            ErrorFunction("Today's questions are exhausted.");
            return;
        }



        if (isAudioSubmit) {
            setCurrentIndex((prevIndex) => {
                if (prevIndex < questionData.length - 1) {
                    return prevIndex + 1;
                }
                return prevIndex; // stay at current index if already at end
            });
            setIsAudioSubmit(false)
            setIsAiResonce(false)
        } else {
            ErrorFunction("Please submit your audio response to continue.");
            return;
        }
    };

    // useEffect(() => {

    //     if (skippedLimitReached && hover && isCompletedQuestion === false) {
    //         // console.log("Buttons skippedLimitReached ", skippedLimitReached)
    //         setErrorMessage("Skipped limit reached.");
    //         setIsError(true);

    //         setTimeout(() => {
    //             setIsError(false);
    //             setErrorMessage("");
    //         }, 2000);
    //     }

    //     // if (isCompletedQuestion) {
    //     //     setErrorMessage("Already Skipped Question.");
    //     //     setIsError(true);
    //     //     setTimeout(() => {
    //     //         setIsError(false);
    //     //         setErrorMessage("");
    //     //     }, 2000);
    //     // }

    // }, [hover])

    return (
        <div style={{ width: "100%", ...buttonContainerStyle }}>
            <div className={buttonStyle.buttonContainer} >
                <div style={preButton} className={`${buttonStyle.preButton} h4`} onClick={preHandler}>
                    Previous
                </div>
                <div style={skipbuttonStyle} className={`${buttonStyle.skipbuttonStyle} h4`}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)} 
                    onClick={handleSkip} >Skip</div>
                <div style={nextButton} className={`${buttonStyle.nextButton} h4`} onClick={nextHandler} >
                    Next
                </div>
            </div>
        </div>
    )
}











export default Button