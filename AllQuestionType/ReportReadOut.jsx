import React, { useContext, useEffect, useState } from 'react'
import Report from '../Css/reportReadout.module.css'
import RecordingBox from '../RecordingBox/RecordingBox';
import AiFeedBackBox from '../RecordingBox/AiFeedBackBox';
import { readoutContext } from '../Contextapi/ContextProvider';
import Button from '../CommonComponent/Button';
import ShowError from '../CommonComponent/ShowError';
import AudioSubmittingMessage from '../CommonComponent/AudioSubmittingMessage';
import SuccessFullMessage from '../CommonComponent/SuccessFullMessage';
import PopUpMessage from '../CommonComponent/PopUpMessage';
import RecordingBoxMain from '../RecordingBox/RecordingBoxMob/RecordingBoxMain';
import { useMediaQuery } from '@mui/material';
import reportMobileBg from '../SvgIcons/SvgIcons'
import AiFeedBack from '../RecordingBox/AiFeedBack';
import AiFeedBackMessage from '../RecordingBox/AiFeedBackMessage';
function ReportReadOut({data}) {
const {isAiresponce,openFeedback,isLastQuestionSkip,currentIndex,questionData, setCurrentIndex, isAudioSubmit, setIsAudioSubmit,isError, setIsError, setErrorMessage,attemptsReached,isloding } = useContext(readoutContext);
const [textVoice,setTextVoice]=useState("")
const [textAnswer,setTextAnswer]=useState("")
const [image,setImage]=useState('')
// const [currentIndex, setCurrentIndex] = useState(0);
const matchesTablet = useMediaQuery(' (max-width:1024px)');
const [sendBackend, setsendBackend] = useState({})
const [totalQuestion, setTotalQuestion]=useState()
const [passage, setPassage] = useState()
const [answerPassage, setAnswerPassage] = useState()

     
     useEffect(() => {
           const parsed = JSON.parse(JSON.stringify(questionData)); 
        //    console.log(parsed,"parsed")
           setTotalQuestion(parsed.length)
           const questionText = parsed[currentIndex].question_text; 
           const images_data =parsed[currentIndex].image_url;
        //   console.log(images_data,"images_data")
           const parsedQuestionText = JSON.parse(questionText);
        //    console.log(parsedQuestionText,"parsedQuestionText")
           setsendBackend(parsed[currentIndex])
           const combined = parsedQuestionText?.title;
           const combined_answer = parsedQuestionText?.message;
           setImage(images_data)
        //    console.log(combined,"combined",combined_answer,"combined_answer")
           setTextVoice(combined)
           setTextAnswer(combined_answer)
           setPassage(parsedQuestionText.title);
           setAnswerPassage(parsedQuestionText.message);
       }, [currentIndex])
    //    console.log(answerPassage,"answerPassage")
  const textVoiceWithStop = textVoice.trim().endsWith('.') ? textVoice : `${textVoice}.`;
  const combinedData = `${textVoiceWithStop}|||${textAnswer}`;
//   console.log(image,"image")
const isLastQuestion = (isLastQuestionSkip || isAudioSubmit)  && currentIndex === questionData.length - 1

  return (
    <>
     {/* <div className={Report.reportMainContainer}> */}
        <div className={Report.reportContainer}>
        {(matchesTablet === false && openFeedback) && <AiFeedBackMessage />}
            <div className={Report.reportContent}>
                <div className={Report.reportBoxContainer}>
                {isError && <ShowError/>}
                {isloding && <AudioSubmittingMessage />}
                {isAudioSubmit && <SuccessFullMessage/> }
                {isLastQuestion && <PopUpMessage/>}
                    <div className={Report.reportBoxUp}>
                        <div className={Report.reportImageContent}>
                          <img src="https://d3g74fig38xwgn.cloudfront.net/readout-activity/Background-images/ReportBackgroundImage.png" alt="ReportBackground"  />
                         {/* <div className={Report.mobileBgImage}>
                           <reportMobileBg/>
                           </div> */}
                           <div className={Report.reportText}>
                            <h2 className={Report.reportHeading}>{textVoice}</h2>
                            <h3 className={`text_body_2x  ${Report.textSubtitle}`} style={{textAlign:"center"}}>{textAnswer}</h3>
                         </div>
                        </div>
                    </div>
                    <div className={Report.reportBoxDown}>
                      <Button    />
                    </div>
                    {(matchesTablet && isAiresponce) && <AiFeedBack />}
                </div>
                <div className={Report.readOutContainer}>
                    {
                        matchesTablet ? (
                            <RecordingBoxMain data={combinedData} sendBackend={sendBackend}/>
                            // <></>
                        ) : (
                            !isAudioSubmit ? (
                                <RecordingBox data={combinedData} currentPage={currentIndex} sendBackend={sendBackend} />
                            ) : (
                                <AiFeedBackBox />
                            )
                        )
                    }
                </div>
            </div>
     
        </div>
        
    {/* </div>    */}
    </>
  )
}

export default ReportReadOut