import React, { useEffect, useState, useMemo, useContext } from 'react'
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import RecordingBox from '../RecordingBox/RecordingBox';
import styles from "../Css/textPhrase.module.css"
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





const Sentence = () => {
    const { isAiresponce,isSkipPopup, openFeedback, isLastQuestionSkip, currentIndex, questionData, setCurrentIndex, isAudioSubmit, setIsAudioSubmit, isloding, setIsLoding, isError, setIsError, attemptsReached, setErrorMessage } = useContext(readoutContext);
    const theme = useTheme();
    const isIpad = useMediaQuery(theme.breakpoints.down("lg"), { noSsr: true });
    const matchesTablet = useMediaQuery(' (max-width:1024px)');
    const [passage, setPassage] = useState()
    // const [currentIndex, setCurrentIndex] = useState(0);
    const [sendBackend, setsendBackend] = useState({})
    const [totalQuestion, setTotalQuestion] = useState()
    const [translatedPassage, setTranslatedPassage] = useState("")


    useEffect(() => {
        const parsed = JSON.parse(JSON.stringify(questionData)); // deep copy

        // Access the first item in the array
        console.log(parsed[currentIndex], "parsed")
        setTotalQuestion(parsed.length)
        const questionText = parsed[currentIndex].question_text; // still a JSON string

      
        const parsedLangTrans = safeJSONParseObject(parsed[currentIndex]?.traslated_word)
        setTranslatedPassage(parsedLangTrans?.text)
        const parsedQuestionText = JSON.parse(questionText);
        setsendBackend(parsed[currentIndex])
        console.log(parsedQuestionText, "dsfsdf");
        setPassage(parsedQuestionText.text);
        
    }, [currentIndex])

    const isLastQuestion = (isLastQuestionSkip || isAudioSubmit) && currentIndex === questionData.length - 1


    return (
        <div className={styles.outcontainerreadout}>
            {(matchesTablet === false && openFeedback) && <AiFeedBackMessage />}
            <div className={styles.mainContainer}>
                <div className={styles.InnerContainer} >
                    {isError && <ShowError />}
                    {isloding && <AudioSubmittingMessage />}
                    {isAudioSubmit && <SuccessFullMessage />}
                    {isLastQuestion && <PopUpMessage />}
                    {isSkipPopup && <SkipPopup/>}
                    <div className={styles.ContentContainer}>

                        <div className={styles.ImageContainer}>
                            <img src={sendBackend.image_url} alt="Text Image" className={styles.image} />
                        </div>
                        <div className={styles.passageContainer} >

                            <div className={styles.everydaytext}>{passage}</div>

                            <div className={styles.everydaytexttran}>{translatedPassage}</div>
                        </div>


                    </div>

                    <Button />
                    {(matchesTablet && isAiresponce) && <AiFeedBack />}

                </div>
                <div className={styles.readOutContainer}>

                    {
                        matchesTablet ? (
                            <RecordingBoxMain data={passage} sendBackend={sendBackend} />

                        ) : (
                            !isAudioSubmit ? (
                                <RecordingBox data={passage} currentPage={currentIndex} sendBackend={sendBackend} />
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









export default Sentence