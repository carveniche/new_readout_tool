import React, { useEffect, useState, useMemo, useContext } from 'react'
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import RecordingBox from '../RecordingBox/RecordingBox';
import styles from "../Css/classRoomInstruction.module.css"
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

const ClassRoomInstructions = () => {
  // const textVoice = data[0].text

  const { isAiresponce,isSkipPopup, openFeedback, isLastQuestionSkip, questionData, currentIndex, setCurrentIndex, isAudioSubmit, setIsAudioSubmit, isError, setIsError, setErrorMessage, attemptsReached, isloding } = useContext(readoutContext);
  const theme = useTheme();
  const isIpad = useMediaQuery(theme.breakpoints.down("lg"), { noSsr: true });
  // const [currentIndex, setCurrentIndex] = useState(0);
  const [sendBackend, setsendBackend] = useState({})
  const [textVoice, setTextVoice] = useState("")
  const [totalQuestion, setTotalQuestion] = useState()
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
  const matchesTablet = useMediaQuery(' (max-width:1024px)');
  const isLastQuestion = (isLastQuestionSkip || isAudioSubmit) && currentIndex === questionData.length - 1


  return (
    <div className={styles.outcontainer}>
      {(matchesTablet === false && openFeedback) && <AiFeedBackMessage />}
      <div className={styles.mainContainer}>
        <div className={styles.questionBox}>
          {isError && <ShowError />}
          {isloding && <AudioSubmittingMessage />}
          {isAudioSubmit && <SuccessFullMessage />}
          {isLastQuestion && <PopUpMessage />}
          {isSkipPopup && <SkipPopup/>}
          <div className={styles.ImageContainer}>
            <img src="https://d3g74fig38xwgn.cloudfront.net/readout-activity/Background-images/classRoomImage.svg" alt="Text Image" className={styles.Image} />
            <img src="https://d3g74fig38xwgn.cloudfront.net/readout-activity/ClassRoomInsBackgroundImage.svg" alt="Text Image" className={styles.mobImage} />
            <div style={{
              position: "absolute",
              top: "40%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "white",
              textAlign: "center"
            }} className={styles.classRoomtext} >
              <div >

                {textVoice}
              </div>
              <div style={{color:"#ccd609"}} className={styles.classRoomtextTrans} >{translatedPassage}</div>
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






export default ClassRoomInstructions