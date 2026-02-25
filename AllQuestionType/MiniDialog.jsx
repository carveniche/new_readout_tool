import React, { useEffect, useState, useMemo, useContext } from 'react'
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'
import { colors, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import RecordingBox from '../RecordingBox/RecordingBox';

import styless from "../Css/miniDilog.module.css"
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
import {safeJSONParseObject} from "../CommonComponent/jsonParse.js"
import SkipPopup from '../CommonComponent/SkipPopUp.jsx';

const MiniDialog = ({ data }) => {
    // const textVoice = data[0].text
    const {isSkipPopup,isAiresponce,openFeedback,isLastQuestionSkip,currentIndex,questionData, setCurrentIndex, isAudioSubmit, setIsAudioSubmit,isloding,isError, setIsError,attemptsReached, setErrorMessage } = useContext(readoutContext);
    const theme = useTheme();
    const isIpad = useMediaQuery(theme.breakpoints.down("lg"), { noSsr: true });
    // const [currentIndex, setCurrentIndex] = useState(0);
    const [sendBackend, setsendBackend] = useState({})
    const [passage, setPassage] = useState()
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
        // console.log(parsedLangTrans?.lines,"sdfsdfsdfsdf")
        setTranslatedPassage(parsedLangTrans.lines)
        setsendBackend(parsed[currentIndex])
        const combined = parsedQuestionText.lines.map(line => `speaker${line.speaker}: ${line.text}`).join(' ');
        setTextVoice(combined)
        setPassage(parsedQuestionText.lines);
    }, [currentIndex])
    const isLastQuestion = (isLastQuestionSkip || isAudioSubmit)  && currentIndex === questionData.length - 1

    return (
        <div className={styless.outcontainer}>
            {(matchesTablet === false && openFeedback) && <AiFeedBackMessage />}
            <div className={styless.mainContainer}>
                <div className={styless.questionOutBox} >
                {isError && <ShowError/>}
                {isloding && <AudioSubmittingMessage/>}
                {isAudioSubmit && <SuccessFullMessage/> }
                {isLastQuestion && <PopUpMessage/>}
                {isSkipPopup && <SkipPopup/>}
                    <div className={styless.AContainer}>
                        <div className={`${styless.Abutton} h1`} >
                            {passage?.[0]?.speaker}
                        </div>
                        <div style={{ position: "relative", }}>
                            <div className={`${styless.AContent} `} style={{display:"flex", flexDirection:"column"}}>
                                <div className={`${styless.miniText}`}>{passage?.[0]?.text}</div>
                                <div  style={{color:"#60B75A"}} className={styless.transText} >{translatedPassage?.[0]?.text}</div>
                            </div>
                            <div className={styless.firstArrow} >
                                <img src="https://d3g74fig38xwgn.cloudfront.net/readout-activity/Background-images/miniLeftArrow.svg" alt="Text Image" className={styless.firstArrowImage}  />
                              
                            </div>
                        </div>
                    </div>
                    <div className={styless.BContainer}>
                        <div className={`${styless.BContent} `} style={{display:"flex", flexDirection:"column"}}>
                        <div className={`${styless.miniText}`}>{passage?.[1]?.text}</div>
                        <div style={{color:"#60B75A"}} className={styless.transText}>{translatedPassage?.[1]?.text}</div>
                        </div>
                        <div style={{ position: "relative", }} >
                            <div className={`${styless.Bbutton} h1`}>
                                {passage?.[1]?.speaker}
                            </div>
                            <div className={styless.secondArrow} >
                                <img src="https://d3g74fig38xwgn.cloudfront.net/readout-activity/Background-images/minirightArrow.svg" alt="Text Image"  className={styless.secondArrowImage} />
                            </div>

                        </div>

                    </div>
                    <Button  buttonContainerStyle={{ position: "absolute", bottom: 0 }}  />
                     {(matchesTablet && isAiresponce) && <AiFeedBack />}
                </div>
                <div className={styless.readOutContainer}>
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


const styles = {
    outcontainer: {
        width: "100%",
        maxWidth: "70.0625rem",
        margin: "auto", 
        height: "604px",
        backgroundColor: "#A3A6FA",
        boxSizing: "border-box",
        borderRadius: "8px",
        padding: "16px 17px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "10px",
        height: "100%",
        position:"relative",
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
        backgroundImage: "url('https://d3g74fig38xwgn.cloudfront.net/readout-activity/Background-images/MiniDialogues.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        borderRadius: "10px",
        position: "relative"
    },
    AContent: {
        display: "flex",
        width: "354px",
        height: "77px",
        padding: "10px",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
        flexShrink: 0,
        borderRadius: "50px",
        backgroundColor: "#F7C3E5",
        boxShadow: "0 4px 0 0 #000",
    },
    Abutton: {
        display: "flex",
        width: "77px",
        height: "77px",
        padding: "11px 21px",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
        color: "white",
        borderRadius: "50%",
        background: "var(--Secondary-Border-Default, #86C440)",
        boxShadow: "0 4px 0 0 #000",
        top: "24%",
        left: "10%"
    },
    AContainer: {
        display: "flex",
        position: "absolute",
        gap: "20px",
        top: "24%",
        left: "10%"
    },
    BContainer: {
        display: "flex",
        position: "absolute",
        gap: "20px",
        bottom: "24%",
        right: "10%"
    },
    Bbutton: {
        display: "flex",
        width: "77px",
        height: "77px",
        padding: "11px 21px",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
        borderRadius: "50%",
        background: "var(--Secondary-Border-Default, #1E90FF)",
        boxShadow: "0 4px 0 0 #000",
        color: "white",

    },

    BContent: {
        display: "flex",
        width: "354px",
        height: "77px",
        padding: "10px",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
        flexShrink: 0,
        borderRadius: "50px",
        backgroundColor: "#EEE853",
        boxShadow: "0 4px 0 0 #000",
    },
};





export default MiniDialog