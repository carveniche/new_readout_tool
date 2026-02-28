import React, { useEffect, useState, useMemo, useContext } from 'react'
import { colors, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import RecordingBox from '../RecordingBox/RecordingBox';
import styless from "../Css/notice.module.css"
import { readoutContext } from '../Contextapi/ContextProvider';
import AiFeedBackBox from '../RecordingBox/AiFeedBackBox';
import Button from '../CommonComponent/Button';
import { MiniDilogLeftArrow, MiniDilogRightArrow } from '../SvgIcons/SvgIcons';
import ShowError from '../CommonComponent/ShowError';
import AudioSubmittingMessage from '../CommonComponent/AudioSubmittingMessage';
import SuccessFullMessage from '../CommonComponent/SuccessFullMessage';
import PopUpMessage from '../CommonComponent/PopUpMessage';
import AiFeedBack from '../RecordingBox/AiFeedBack';
import AiFeedBackMessage from '../RecordingBox/AiFeedBackMessage';
import RecordingBoxMain from '../RecordingBox/RecordingBoxMob/RecordingBoxMain';
import SkipPopup from '../CommonComponent/SkipPopUp';

const Notices = () => {

    const { openFeedback,isSkipPopup, isAiresponce, isLastQuestionSkip, currentIndex, questionData, setCurrentIndex, isAudioSubmit, setIsAudioSubmit, isError, setIsError, setErrorMessage, attemptsReached, isloding } = useContext(readoutContext);
    const theme = useTheme();
    const isIpad = useMediaQuery(theme.breakpoints.down("lg"), { noSsr: true });
    const matchesTablet = useMediaQuery(' (max-width:1024px)');
    const [sendBackend, setsendBackend] = useState({})
    const [passage, setPassage] = useState()
    const [textVoice, setTextVoice] = useState("")
    const [totalQuestion, setTotalQuestion] = useState()

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
        <div className={styless.outcontainer}>
            {(matchesTablet === false && openFeedback) && <AiFeedBackMessage />}
            <div className={styless.mainContainer}>
                <div className={styless.questionOutBox} >
                    {isError && <ShowError />}
                    {isloding && <AudioSubmittingMessage />}
                    {isAudioSubmit && <SuccessFullMessage />}
                    {isLastQuestion && <PopUpMessage />}
                    {isSkipPopup && <SkipPopup/>}
                    <div className={styless.Container}>

                        <img
                            src="https://d3g74fig38xwgn.cloudfront.net/readout-activity/Background-images/noticesImage.png"
                            alt="Notices"
                            className={styless.imageStyle}
                        />
                        <img
                            src="https://d3g74fig38xwgn.cloudfront.net/readout-activity/NoticeBackgroundImage.svg"
                            alt="Notices"
                            className={styless.imageStyleMob}
                        />
                        <div className={styless.contentOverlay}>
                            <div className={styless.content}>
                                <div className='noticeHeadingFont'>
                                    {passage}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: "17px" }}>
                                    <div className='h3'>
                                        {textVoice.split(":")[0] + ":"}
                                    </div>
                                    <div className='h7'>
                                        {textVoice.split(":").slice(1).join(":").trim()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Button />
                    {(matchesTablet && isAiresponce) && <AiFeedBack />}
                </div>
                <div className={styless.readOutContainer}>
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


const styles = {

    outcontainer: {
        width: "100%",
        backgroundColor: "#A3A6FA",
        boxSizing: "border-box",
        borderRadius: "8px",
        padding: "16px 17px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "10px",
        position: "relative",

    },
    mainContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        alignSelf: "stretch",
        gap: "1rem",
        width: "100%",
        height: "100%",
    },
    questionOutBox: {
        width: "100%",
        height: "100%",
        backgroundColor: "#FFF",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",

    },
    Container: {
        display: 'flex',
        width: '768.901px',
        // padding: "96px 90px",
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '10px',
        position: "relative",
    },

    imageStyle: {
        width: '100%',
        height: '500px',
        objectFit: 'contain',
        borderRadius: '16px',
        position: "relative"
    },

    contentOverlay: {
        position: 'absolute',
        top: "23%",
        left: 0,
        width: '100%',
        height: '100%',

        gap: "55px",
        color: '#000',

    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: "10px 90px",
        gap: "55px",
    }




};







export default Notices