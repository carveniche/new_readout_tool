import React, { useContext, useEffect, useState } from 'react'
import Story from '../Css/stories.module.css'
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
import AiFeedBack from '../RecordingBox/AiFeedBack';
import AiFeedBackMessage from '../RecordingBox/AiFeedBackMessage';
import SkipPopup from '../CommonComponent/SkipPopUp';
function StoriesBreif() {
    const {isAiresponce,isSkipPopup,openFeedback,isLastQuestionSkip,currentIndex,questionData, setCurrentIndex, isAudioSubmit, setIsAudioSubmit, isError, setIsError, setErrorMessage,attemptsReached, isloding } = useContext(readoutContext);
    const [textVoice, setTextVoice] = useState("")
    const [textAnswer, setTextAnswer] = useState("")
    const [image, setImage] = useState('')
    // const [currentIndex, setCurrentIndex] = useState(0);
    const [sendBackend, setsendBackend] = useState({})
    const [totalQuestion, setTotalQuestion] = useState()
    const [passage, setPassage] = useState()
    const [answerPassage, setAnswerPassage] = useState()
    const matchesTablet = useMediaQuery(' (max-width:1024px)');
    
    useEffect(() => {
        const parsed = JSON.parse(JSON.stringify(questionData));
        console.log(parsed, "parsed")
        setTotalQuestion(parsed.length)
        const questionText = parsed[currentIndex].question_text;
        const images_data = parsed[currentIndex].image_url;
        //   console.log(images_data,"images_data")
        const parsedQuestionText = JSON.parse(questionText);
        //    console.log(parsedQuestionText,"parsedQuestionText")
        setsendBackend(parsed[currentIndex])
        const combined = parsedQuestionText?.title;
        const combined_answer = parsedQuestionText?.body;
        setImage(images_data)
        //    console.log(combined,"combined",combined_answer,"combined_answer")
        setTextVoice(combined)
        setTextAnswer(combined_answer)
        setPassage(parsedQuestionText.title);
        setAnswerPassage(parsedQuestionText.body);
    }, [currentIndex])
    //    console.log(answerPassage,"answerPassage")
    const textVoiceWithStop = textVoice.trim().endsWith('.') ? textVoice : `${textVoice}.`;
    const combinedData = `${textVoiceWithStop}|||${textAnswer}`;
    //   console.log(image,"image")
    const isLastQuestion = (isLastQuestionSkip || isAudioSubmit)  && currentIndex === questionData.length - 1

    return (
        <>
            <div className={Story.mainStoryContent}>
            {(matchesTablet === false && openFeedback) && <AiFeedBackMessage />}
                <div className={Story.firstContainer}>
                    <div className={Story.storyContainer}>
                        {isError && <ShowError />}
                        {isloding && <AudioSubmittingMessage />}
                        {isAudioSubmit && <SuccessFullMessage/> }
                        {isLastQuestion && <PopUpMessage/>}
                        {isSkipPopup && <SkipPopup/>}
                        <div className={Story.storyImageContainer}>

                            <div className={Story.storyImageRectangelCont}>
                                <img src={image} alt="image" />
                            </div>
                            <div className={Story.storyContainerStart}>
                                <div className={Story.storyHeadingDiv}>
                                    <p className={Story.storyheading}>{textVoice}</p>
                                </div>
                                <div className={Story.storyImageRectangelContMobile}>
                                <img src={image} alt="image" className={Story.storyImageMobile} />
                                </div>
                                <div className={Story.storyAnswerDiv}>
                                    <p>{textAnswer}</p>
                                </div>
                            </div>


                        </div>
                        <Button  buttonContainerStyle={{ position: "" }}  />
                        {(matchesTablet && isAiresponce) && <AiFeedBack />}
                    </div>
                    <div className={Story.readOutContainer}>
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

export default StoriesBreif