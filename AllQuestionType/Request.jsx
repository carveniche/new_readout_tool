import React, { useEffect, useState, useMemo, useContext } from 'react'
import { colors, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import RecordingBox from '../RecordingBox/RecordingBox';
import styles from "../Css/request.module.css"
import { readoutContext } from '../Contextapi/ContextProvider';
import AiFeedBackBox from '../RecordingBox/AiFeedBackBox';
import Button from '../CommonComponent/Button';
import ShowError from '../CommonComponent/ShowError';
import AudioSubmittingMessage from '../CommonComponent/AudioSubmittingMessage';
import SuccessFullMessage from '../CommonComponent/SuccessFullMessage';
import PopUpMessage from '../CommonComponent/PopUpMessage';
import RecordingBoxMain from '../RecordingBox/RecordingBoxMob/RecordingBoxMain';
import AiFeedBack from '../RecordingBox/AiFeedBack';
import AiFeedBackMessage from '../RecordingBox/AiFeedBackMessage';
import {safeJSONParseObject} from "../CommonComponent/jsonParse.js"
import SkipPopup from '../CommonComponent/SkipPopUp.jsx';

const Request = () => {

    const {isAiresponce,isSkipPopup,openFeedback,isLastQuestionSkip,currentIndex,questionData, setCurrentIndex, isAudioSubmit, setIsAudioSubmit,isloding,isError, setIsError,attemptsReached, setErrorMessage } = useContext(readoutContext);
    const theme = useTheme();
    const isIpad = useMediaQuery(theme.breakpoints.down("lg"), { noSsr: true });
    // const [currentIndex, setCurrentIndex] = useState(0);
    const [sendBackend, setsendBackend] = useState({})
    const [textVoice, setTextVoice] = useState("")
    const [totalQuestion, setTotalQuestion] = useState()
       const matchesTablet = useMediaQuery(' (max-width:1024px)');
       const [translatedPassage, setTranslatedPassage] = useState("")

    
       

    useEffect(() => {
        const parsed = JSON.parse(JSON.stringify(questionData)); // deep copy
        console.log(parsed, "parsed")
        setTotalQuestion(parsed.length)
        const questionText = parsed[currentIndex].question_text;
        const parsedQuestionText = JSON.parse(questionText);
        const parsedLangTrans = safeJSONParseObject(parsed[currentIndex]?.traslated_word)
        setTranslatedPassage(parsedLangTrans.text)
        setsendBackend(parsed[currentIndex])
        setTextVoice(parsedQuestionText.text)
       
    }, [currentIndex])
    const isLastQuestion = (isLastQuestionSkip || isAudioSubmit)  && currentIndex === questionData.length - 1

    return (
        <div className={styles.outcontainer}>
             {(matchesTablet === false && openFeedback) && <AiFeedBackMessage />}
            <div className={styles.mainContainer}>
                <div className={styles.questionOutBox} >
                {isError && <ShowError/>}
                {isloding && <AudioSubmittingMessage/>}
                {isAudioSubmit && <SuccessFullMessage/> }
                {isLastQuestion && <PopUpMessage/>}
                {isSkipPopup && <SkipPopup/>}
                   <div className={`${styles.content}`} >
                        <span  className={`${styles.requestText}`}>{textVoice}</span>
                        <span className={`${styles.transText}`}>{translatedPassage}</span>
                   </div>

                    <Button buttonContainerStyle={{ position: "absolute", bottom: 0 }}  />
                    {(matchesTablet && isAiresponce) && <AiFeedBack />}
                </div>
                <div className={styles.readOutContainer}>
                   
                    {
                        matchesTablet ? (
                            <RecordingBoxMain data={textVoice} sendBackend={sendBackend}/>
                           
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





export default Request