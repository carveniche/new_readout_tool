import React, { useEffect, useState, useMemo, useContext } from 'react'
import { colors, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import RecordingBox from '../RecordingBox/RecordingBox';
import styless from "../Css/poster.module.css"
import { readoutContext } from '../Contextapi/ContextProvider';
import AiFeedBackBox from '../RecordingBox/AiFeedBackBox';
import Button from '../CommonComponent/Button';
import ShowError from '../CommonComponent/ShowError';
import AudioSubmittingMessage from '../CommonComponent/AudioSubmittingMessage';
import SuccessFullMessage from '../CommonComponent/SuccessFullMessage';
import PopUpMessage from '../CommonComponent/PopUpMessage';
import AiFeedBack from '../RecordingBox/AiFeedBack';
import RecordingBoxMain from '../RecordingBox/RecordingBoxMob/RecordingBoxMain';
import AiFeedBackMessage from '../RecordingBox/AiFeedBackMessage';
import SkipPopup from '../CommonComponent/SkipPopUp';


const Posters = ({ data }) => {

    const {isAiresponce,isSkipPopup,openFeedback,isLastQuestionSkip,currentIndex,questionData, setCurrentIndex, isAudioSubmit, setIsAudioSubmit,isError, setIsError, setErrorMessage,attemptsReached,isloding } = useContext(readoutContext);
    const theme = useTheme();
    const des = useMediaQuery(theme.breakpoints.down("lg"), { noSsr: true });
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
    const isLastQuestion = (isLastQuestionSkip || isAudioSubmit)  && currentIndex === questionData.length - 1

    return (
        <div className={styless.outcontainer}>
             {(matchesTablet === false && openFeedback) && <AiFeedBackMessage />}
            <div className={styless.mainContainer}>
                <div className={styless.questionOutBox} 
                >
                    {isError && <ShowError/>}
                    {isloding && <AudioSubmittingMessage/>}
                    {isAudioSubmit && <SuccessFullMessage/> }
                    {isLastQuestion && <PopUpMessage/>}
                    {isSkipPopup && <SkipPopup/>}
                   
                    <div className={styless.Container}>

                        <div className={styless.posterHead}>
                            {passage}
                        </div>
                        <div className={`${styless.posterText} ${styless.Text}`}>
                            {textVoice}
                        </div>
                    </div>

                    <Button  buttonContainerStyle={{ position: "absolute", bottom: 0, zIndex: 2 }} />
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
    imageStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: '10px',
        zIndex: 0,
    },

    outcontainer: {
        width: "100%",
        maxWidth: "70.0625rem",
        margin: "auto", 
        backgroundColor: "#A3A6FA",
        boxSizing: "border-box",
        borderRadius: "8px",
        padding: "16px 17px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "10px",
        height:"100%",
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
        // height: des ? "36rem" : "40rem",
        backgroundColor: "#FFF",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        backgroundImage: "url('https://d3g74fig38xwgn.cloudfront.net/readout-activity/Background-images/Postes.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",

    },
    Container: {
        // position: "absolute",
        display: 'flex',
        flexDirection: 'column',
        gap: "10%",
        width: '70%',
        height: '70%',

    },







};


export default Posters