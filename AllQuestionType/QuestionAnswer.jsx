import React, { useEffect, useState, useMemo, useContext } from 'react'
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import RecordingBox from '../RecordingBox/RecordingBox';
import styles from "../Css/questionAnswer.module.css"
import { readoutContext } from '../Contextapi/ContextProvider';
import AiFeedBackBox from '../RecordingBox/AiFeedBackBox';
import Button from '../CommonComponent/Button';
import { questionMark, invertedComma, reverseinvertedComma } from '../SvgIcons/SvgIcons';
import ShowError from '../CommonComponent/ShowError';
import AudioSubmittingMessage from '../CommonComponent/AudioSubmittingMessage';
import SuccessFullMessage from '../CommonComponent/SuccessFullMessage';
import PopUpMessage from '../CommonComponent/PopUpMessage';
import RecordingBoxMain from '../RecordingBox/RecordingBoxMob/RecordingBoxMain';
import AiFeedBack from '../RecordingBox/AiFeedBack';
import AiFeedBackMessage from '../RecordingBox/AiFeedBackMessage';
import {safeJSONParseObject} from "../CommonComponent/jsonParse.js"
import SkipPopup from '../CommonComponent/SkipPopUp.jsx';


const QuestionAnswer = () => {
    // const textVoice = data[0].question + data[0].answer

    const { isAiresponce,isSkipPopup, openFeedback, isLastQuestionSkip, currentIndex, questionData, setCurrentIndex, isAudioSubmit, setIsAudioSubmit, isError, setIsError, setErrorMessage, attemptsReached, isloding } = useContext(readoutContext);
    const theme = useTheme();
    const isIpad = useMediaQuery(theme.breakpoints.down("lg"), { noSsr: true });
    const matchesTablet = useMediaQuery(' (max-width:1024px)');
    const [passage, setPassage] = useState()
    // const [currentIndex, setCurrentIndex] = useState(0);
    const [textVoice, setTextVoice] = useState("")
    const [sendBackend, setsendBackend] = useState({})
    const [translatedPassage, setTranslatedPassage] = useState("")


    useEffect(() => {
        const parsed = JSON.parse(JSON.stringify(questionData)); 
        const questionText = parsed[currentIndex].question_text; 
        const parsedQuestionText = JSON.parse(questionText);
        const parsedLangTrans = safeJSONParseObject(parsed[currentIndex]?.traslated_word)
        setsendBackend(parsed[currentIndex])
        setPassage(parsedQuestionText);
        setTranslatedPassage(parsedLangTrans)
        setTextVoice(parsedQuestionText?.question + parsedQuestionText?.answer)
    }, [currentIndex])
    const isLastQuestion = (isLastQuestionSkip || isAudioSubmit) && currentIndex === questionData.length - 1


    return (
        <div className={styles.outcontainer}>
            {(matchesTablet === false && openFeedback) && <AiFeedBackMessage />}
            <div className={styles.mainContainer}>
                <div className={styles.innerContainer}>
                    {isError && <ShowError />}
                    {isloding && <AudioSubmittingMessage />}
                    {isAudioSubmit && <SuccessFullMessage />}
                    {isLastQuestion && <PopUpMessage />}
                    {isSkipPopup && <SkipPopup/>}
                    <div className={styles.questionBox}>
                        <div className={styles.questioncontainerFirst} >
                            {/* Top-left question mark */}
                            <div style={{ position: "absolute", top: "10px", left: "10px" }}>
                                {questionMark()}
                            </div>

                            {/* Centered question text */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "100%",
                                    textAlign: "center",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "20px"
                                }}
                                // className={styles.h3}
                            >
                                <span className={styles.h3}> {passage?.question}</span>

                                <span className={styles.transText} style={{color:"#6beb09"}}>{translatedPassage?.question}</span>
                            </div>

                        </div>

                        <div className={styles.questioncontainerSecond} >
                            {/* Top-left inverted comma */}
                            <span style={{ position: "absolute", top: "10px", left: "10px" }}>
                                {invertedComma()}
                            </span>
                            <div style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%",
                                textAlign: "center",
                                display: "flex",
                                flexDirection: "column",
                                gap: "20px"
                            }}
                                // className={styles.h3}
                            >

                                <span className={styles.h3} > {passage?.answer}</span>

                                <span className={styles.transText} style={{color:"#6beb09"}}>  {translatedPassage?.answer}</span>
                            </div>
                            {/* Bottom-right reverse inverted comma */}
                            <span style={{ position: "absolute", bottom: "10px", right: "10px" }}>
                                {reverseinvertedComma()}
                            </span>

                            {/* Main content */}

                        </div>
                    </div>
                    <Button />
                    {(matchesTablet && isAiresponce) && <AiFeedBack />}
                </div>
                <div className={styles.readOutContainer}>

                    {
                        matchesTablet ? (
                            <RecordingBoxMain data={textVoice} sendBackend={sendBackend} />
                        ) : (
                            !isAudioSubmit ? (
                                <RecordingBox data={textVoice} currentPage={currentIndex} sendBackend={sendBackend} />
                            ) : (
                                <AiFeedBackBox />
                            )
                        )
                    }
                </div>

            </div>
        </div>
    );
};





export default QuestionAnswer