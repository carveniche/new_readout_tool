import React, { useEffect, useState, useMemo, useContext } from 'react'

import { colors, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import RecordingBox from '../RecordingBox/RecordingBox';
import styles from "../Css/announcements.module.css"
import { readoutContext } from '../Contextapi/ContextProvider';
import AiFeedBackBox from '../RecordingBox/AiFeedBackBox';
import Button from '../CommonComponent/Button';
import { MiniDilogLeftArrow, MiniDilogRightArrow } from '../SvgIcons/SvgIcons';
import ShowError from '../CommonComponent/ShowError';
import AudioSubmittingMessage from '../CommonComponent/AudioSubmittingMessage';
import SuccessFullMessage from '../CommonComponent/SuccessFullMessage';
import PopUpMessage from '../CommonComponent/PopUpMessage';
import RecordingBoxMain from '../RecordingBox/RecordingBoxMob/RecordingBoxMain';
import AiFeedBack from '../RecordingBox/AiFeedBack';
import AiFeedBackMessage from '../RecordingBox/AiFeedBackMessage';
import SkipPopup from '../CommonComponent/SkipPopUp';

const Announcements = () => {

    const {openFeedback,isSkipPopup, isLastQuestionSkip,isAiresponce, attemptsReached, questionData, isAudioSubmit, setIsAudioSubmit, isloding, isError, setIsError, setErrorMessage, currentIndex, setCurrentIndex } = useContext(readoutContext);
    const theme = useTheme();
    const isIpad = useMediaQuery(theme.breakpoints.down("lg"), { noSsr: true });
    // const [currentIndex, setCurrentIndex] = useState(0);
    const [sendBackend, setsendBackend] = useState({})
    const [passage, setPassage] = useState()
    const [textVoice, setTextVoice] = useState("")
    const [totalQuestion, setTotalQuestion] = useState()
 const matchesTablet = useMediaQuery(' (max-width:1024px)');

    useEffect(() => {
        const parsed = JSON.parse(JSON.stringify(questionData)); // deep copy
        console.log(parsed, "parsed")
        setTotalQuestion(parsed.length)
        const questionText = parsed[currentIndex].question_text;
        const parsedQuestionText = JSON.parse(questionText);
        console.log(parsedQuestionText.message, "parsedQuestionText")
        setsendBackend(parsed[currentIndex])
        setTextVoice(parsedQuestionText.message)
        setPassage(parsedQuestionText.title);
    }, [currentIndex])
    const isLastQuestion = (isLastQuestionSkip || isAudioSubmit) && currentIndex === questionData.length - 1

    return (
        <div className={styles.outcontainer}>
            {(matchesTablet === false && openFeedback) && <AiFeedBackMessage />}
            <div className={styles.mainContainer}>
                <div className={styles.questionOutBox} >
                    {isError && <ShowError />}
                    {isloding && <AudioSubmittingMessage />}
                    {isAudioSubmit && <SuccessFullMessage />}
                    {isLastQuestion && <PopUpMessage />}
                    {isSkipPopup && <SkipPopup/>}
                    <div className={styles.Container}>
                        <div className={styles.headingBox}>
                            <img src="https://d3g74fig38xwgn.cloudfront.net/readout-activity/Background-images/Announcement.svg" alt="Text Image" className={styles.image} />
                            <div className={`${styles.announcementHead} ${styles.heading}`} >
                                {passage}
                            </div>
                        </div>
                        <div className={` ${styles.messageBox} ${styles.announcementText}`} >
                            <div className={styles.message}>
                                {textVoice}
                            </div>
                        </div>
                    </div>

                    <Button />
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









export default Announcements