import React, { useEffect, useState, useMemo, useContext } from 'react'
import { colors, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import RecordingBox from '../RecordingBox/RecordingBox';
import styless from "../Css/message.module.css"
import { readoutContext } from '../Contextapi/ContextProvider';
import AiFeedBackBox from '../RecordingBox/AiFeedBackBox';
import Button from '../CommonComponent/Button';
import { MessageIcon, MessageSendIcon } from '../SvgIcons/SvgIcons';
import { heIL } from '@mui/material/locale';
import ShowError from '../CommonComponent/ShowError';
import AudioSubmittingMessage from '../CommonComponent/AudioSubmittingMessage';
import SuccessFullMessage from '../CommonComponent/SuccessFullMessage';
import PopUpMessage from '../CommonComponent/PopUpMessage';
import AiFeedBack from '../RecordingBox/AiFeedBack';
import AiFeedBackMessage from '../RecordingBox/AiFeedBackMessage';
import RecordingBoxMain from '../RecordingBox/RecordingBoxMob/RecordingBoxMain';

const Messages = () => {

    const { openFeedback, isAiresponce, isLastQuestionSkip, currentIndex, questionData, setCurrentIndex, isAudioSubmit, setIsAudioSubmit, isError, setIsError, setErrorMessage, attemptsReached, isloding } = useContext(readoutContext);
    const theme = useTheme();
    const isIpad = useMediaQuery(theme.breakpoints.down("lg"), { noSsr: true });
    const matchesTablet = useMediaQuery(' (max-width:1024px)');
    const smalldes = useMediaQuery("(min-width:1024px) and (max-width:1280px)");
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
                    <div className={styless.Container}>
                        {isError && <ShowError />}
                        {isloding && <AudioSubmittingMessage />}
                        {isAudioSubmit && <SuccessFullMessage />}
                        {isLastQuestion && <PopUpMessage />}
                        <div className={`${styless.ContainerHeader} ${styless.messageHead}`}>
                            {passage}
                        </div>
                        <div className={styless.messageBox}>
                            {/* <div className={styless.ContainerHeaderBox}> */}
                            <div className={styless.ContainerHeaderdiv}>
                                <div
                                    className={styless.ContainerHeaderIcon}
                                >
                                    <MessageIcon />
                                </div>
                                <div className={`${styless.ContainerText}  ${styless.messageText}` }>
                                    <div dangerouslySetInnerHTML={{
                                          __html: textVoice.replace(/\n+/g, "<br/>"),
                                         }} />
                                </div>
                            </div>
                            {/* </div> */}
                            <div className={styless.messageContainer}>
                                <div className={styless.messageSendInputBox}>

                                </div>
                                <MessageSendIcon />
                            </div>
                        </div>
                        {(matchesTablet && isAiresponce) && <AiFeedBack />}
                    </div>
                    <Button
                        // buttonContainerStyle={{
                        //     position: smalldes ? "absolute" :"",
                        //     bottom: smalldes ? "0px" : ""
                        // }}
                    />
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
        height: "80vh",
        position: "relative"

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
        backgroundColor: "#FFE300",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        // position: "relative",

        alignItems: "center",

    },
    Container: {
        display: 'flex',
        width: '100%',
        height: "100%",
        flexDirection: 'column',
        backgroundColor: "#fff",
        gap: '20px',
        borderRadius: "10px",
        // paddingBottom: "10%",
        position: "relative",

    },
    ContainerHeader: {
        // width: '100%',
        textAlign: 'center',
        padding: "20px",
        backgroundColor: "#EBEBEB",
        borderRadius: "10px",
    },
    ContainerHeaderBox: {
        display: 'flex',
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
        width: "100%",



    },
    messageBox: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
    },
    ContainerHeaderIcon: {
        display: 'flex',
        height: "100%",
        gap: "10px",

    },
    ContainerHeaderdiv: {
        width: "70%",
        display: 'flex',
        justifyContent: "center",
        alignItems: "end",
        gap: "10px",
        // width: "595px",



    },
    ContainerText: {
        backgroundColor: "#EBEBEB",
        padding: "30px",
        borderRadius: "10px",
        minHeight: "18rem",
        maxHeight: "18rem",
        display: "flex",
        justifyContent: "center",
        // alignItems: "center",
        overflowY: "auto",
        // scrollbarWidth: "none",       // ✅ Firefox
        // msOverflowStyle: "none",      // ✅ IE & Edge
    },
    messageContainer: {
        display: "flex",
        width: "100%",
        paddingLeft: "23%",
        height: "100%",
        gap: "10px",


    },
    messageSendInputBox: {

        width: "82%",
        height: "50px",
        backgroundColor: "#EBEBEB",
        borderRadius: "47px",
        display: "flex",
        justifyContent: "end"

    }






};

export default Messages