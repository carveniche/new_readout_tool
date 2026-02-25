import React, { useContext, useEffect, useState } from 'react'
import Conver from '../Css/conversation.module.css'
import RecordingBox from '../RecordingBox/RecordingBox';
import AiFeedBackBox from '../RecordingBox/AiFeedBackBox';
import { readoutContext } from '../Contextapi/ContextProvider';
import Button from '../CommonComponent/Button';
import ShowError from '../CommonComponent/ShowError';
import AudioSubmittingMessage from '../CommonComponent/AudioSubmittingMessage';
import SuccessFullMessage from '../CommonComponent/SuccessFullMessage';
import PopUpMessage from '../CommonComponent/PopUpMessage';
import AiFeedBack from '../RecordingBox/AiFeedBack';
// import RecordingBoxMain from '../RecordingBox/RecordingBoxMain';
import { useMediaQuery } from '@mui/material';
import RecordingBoxMain from '../RecordingBox/RecordingBoxMob/RecordingBoxMain';
import AiFeedBackMessage from '../RecordingBox/AiFeedBackMessage';
import SkipPopup from '../CommonComponent/SkipPopUp';
function Conversation() {
  const {isAiresponce,isSkipPopup,openFeedback,isLastQuestionSkip,currentIndex,questionData, setCurrentIndex, isAudioSubmit, setIsAudioSubmit,isError, setIsError, setErrorMessage,attemptsReached,isloding } = useContext(readoutContext);
  const [textVoice, setTextVoice] = useState("")
  const [textAnswer, setTextAnswer] = useState([])
  const [textAnswerTwo, setTextAnswerTwo] = useState('')
  const [image, setImage] = useState('')
  // const [currentIndex, setCurrentIndex] = useState(0);
  const [sendBackend, setsendBackend] = useState({})
  const [totalQuestion, setTotalQuestion] = useState()
  const [passage, setPassage] = useState()
  const [answerPassage, setAnswerPassage] = useState()
const matchesTablet = useMediaQuery(' (max-width:1024px)');

  useEffect(() => {
    const parsed = JSON.parse(JSON.stringify(questionData));
    //    console.log(parsed,"parsed")
    setTotalQuestion(parsed.length)
    const questionText = parsed[currentIndex].question_text;
    const images_data = parsed[currentIndex].image_url;
    //   console.log(images_data,"images_data")
    const parsedQuestionText = JSON.parse(questionText);
    //    console.log(parsedQuestionText,"parsedQuestionText")
    setsendBackend(parsed[currentIndex])
    const combined = parsedQuestionText?.title;
    const combined_answer = parsedQuestionText?.lines || [];

    const formattedAnswer = combined_answer
      .map(item => `Speaker ${item.speaker}: ${item.text}`)
      .join(" ||| ");   // <<< separator for pauses if needed

    setTextAnswerTwo(formattedAnswer);




    setImage(images_data)
    console.log(combined_answer, "combined_answer")
    setTextVoice(combined)
    setTextAnswer(combined_answer)
    setPassage(parsedQuestionText.title);
    setAnswerPassage(parsedQuestionText.message);
  }, [currentIndex])
  //    console.log(answerPassage,"answerPassage")
  const textVoiceWithStop = textVoice.trim().endsWith('.') ? textVoice : `${textVoice}.`;
  const combinedData = `${textVoiceWithStop}|||${textAnswerTwo}`;
  //   console.log(image,"image")
  const isLastQuestion = (isLastQuestionSkip || isAudioSubmit)  && currentIndex === questionData.length - 1

  return (
    <>
      <div className={Conver.reportContainer}>
      {(matchesTablet === false && openFeedback) && <AiFeedBackMessage />}
        <div className={Conver.reportContent}>
          <div className={Conver.reportBoxContainer}>
          {isError && <ShowError/>}
          {isloding && <AudioSubmittingMessage />}
          {isAudioSubmit && <SuccessFullMessage/> }
          {isLastQuestion && <PopUpMessage/>}
          {isSkipPopup && <SkipPopup/>}
            <div className={Conver.reportBoxUp}>
              <div className={Conver.reportBoxHead}>
                <h2 className='h3'>{textVoice}</h2>
              </div>
              <div className={Conver.reportAnswer}>
                {
                  textAnswer.map((items, index) => {
                    return (
                      <div key={index} className={Conver.renderAnswerBox}>
                        {
                          items.speaker == "A" ? (
                            <div className={Conver.renderAnswerA}>
                              <img src="https://d3g74fig38xwgn.cloudfront.net/readout-activity/Background-images/ATypeConversation.jpg" alt="A" />
                              <div className={Conver.renderAnswerAText}><h2 className={Conver.h2text}>{items.text}</h2></div>
                            </div>
                          ) : (
                            <div className={Conver.renderAnswerB}>
                              <div className={Conver.renderAnswerBText}><h2 className={Conver.h2text}>{items.text}</h2></div>
                              <img src="https://d3g74fig38xwgn.cloudfront.net/readout-activity/Background-images/BTypeConversation.jpg" alt="B" />

                            </div>
                          )

                        }
                      </div>
                    )
                  })
                }
              </div>
            </div>
            <div className={Conver.reportBoxDown}>
              <Button  buttonContainerStyle={{ position: "" }}  />
            </div>
            {(matchesTablet && isAiresponce) && <AiFeedBack />}
          </div>
          <div className={Conver.readOutContainer}>
           
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
    </>
  )
}

export default Conversation