import React, { useEffect, useState, useMemo, useContext } from 'react'
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'
import { colors, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import RecordingBox from '../RecordingBox/RecordingBox';
import styles from "../Css/timeTable.module.css"
import { readoutContext } from '../Contextapi/ContextProvider';
import AiFeedBackBox from '../RecordingBox/AiFeedBackBox';
import Button from '../CommonComponent/Button';
import { SunIcon } from '../SvgIcons/SvgIcons';
import ShowError from '../CommonComponent/ShowError';
import AudioSubmittingMessage from '../CommonComponent/AudioSubmittingMessage';
import SuccessFullMessage from '../CommonComponent/SuccessFullMessage';
import PopUpMessage from '../CommonComponent/PopUpMessage';
import RecordingBoxMain from '../RecordingBox/RecordingBoxMob/RecordingBoxMain';
import AiFeedBack from '../RecordingBox/AiFeedBack';
import AiFeedBackMessage from '../RecordingBox/AiFeedBackMessage';
import SkipPopup from '../CommonComponent/SkipPopUp';

const TimeTables = () => {

    const {isAiresponce,isSkipPopup,openFeedback, currentIndex, questionData, isLastQuestionSkip, setCurrentIndex, isAudioSubmit, attemptsReached, setIsAudioSubmit, isError, setIsError, setErrorMessage, isloding } = useContext(readoutContext);
    const theme = useTheme();
    const isIpad = useMediaQuery(theme.breakpoints.down("lg"), { noSsr: true });
    const matchesTablet = useMediaQuery(' (max-width:1024px)');
    const [sendBackend, setsendBackend] = useState({})
    const [passage, setPassage] = useState()
    const [textVoice, setTextVoice] = useState("")
    const [text, setText] = useState("")
    const [totalQuestion, setTotalQuestion] = useState()


    useEffect(() => {
        const parsed = JSON.parse(JSON.stringify(questionData)); // deep copy
        // console.log(parsed, "parsed")
        setTotalQuestion(parsed.length)
        const questionText = parsed[currentIndex].question_text;
        const parsedQuestionText = JSON.parse(questionText);
        // console.log(parsedQuestionText.items, "parsedQuestionText")
        setsendBackend(parsed[currentIndex])
        setTextVoice(parsedQuestionText.items)
        const allText = parsedQuestionText.items?.map(item => item.text).join(' ');
        setText(allText);
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
                        <div className={`${styles.timeTableHead} ${styles.headering}`} >
                            {passage}
                            {!matchesTablet && <div style={{ position: "absolute", right: "10%", bottom: "-40%" }}><SunIcon /></div>}
                        </div>

                        <div className={styles.timeTablesContainer}>

                            {
                                Object.values(textVoice)?.map((item, index) => (
                                    <div key={index} className={`${styles.timeTableText} ${styles.content}`} style={{backgroundColor: index === 0 ? "#FBEF8C" :"#F4BBF0"}} >
                                        {item.text}
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    <Button />
                    {(matchesTablet && isAiresponce) && <AiFeedBack />}
                </div>
                <div className={styles.readOutContainer}>
                    {
                        matchesTablet ? (
                            <RecordingBoxMain  data={text} sendBackend={sendBackend}/>
                        
                        ) : (
                            !isAudioSubmit ? (
                                <RecordingBox data={text} currentPage={currentIndex} sendBackend={sendBackend} />
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






export default TimeTables