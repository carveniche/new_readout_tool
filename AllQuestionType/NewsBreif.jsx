import React, { useContext, useEffect, useState } from 'react'
import News from '../Css/newsbreif.module.css'
import RecordingBox from '../RecordingBox/RecordingBox';
import AiFeedBackBox from '../RecordingBox/AiFeedBackBox';
import { readoutContext } from '../Contextapi/ContextProvider';
import Button from '../CommonComponent/Button';
import ShowError from '../CommonComponent/ShowError';
import AudioSubmittingMessage from '../CommonComponent/AudioSubmittingMessage';
import SuccessFullMessage from '../CommonComponent/SuccessFullMessage';
import PopUpMessage from '../CommonComponent/PopUpMessage';
import AiFeedBack from '../RecordingBox/AiFeedBack';
import RecordingBoxMain from '../RecordingBox/RecordingBoxMob/RecordingBoxMain';
import AiFeedBackMessage from '../RecordingBox/AiFeedBackMessage';
import { useMediaQuery } from '@mui/material';
import SkipPopup from '../CommonComponent/SkipPopUp';
function NewsBreif() {
    const { isAiresponce,isSkipPopup, openFeedback, isLastQuestionSkip, currentIndex, questionData, setCurrentIndex, isAudioSubmit, setIsAudioSubmit, isError, setIsError, setErrorMessage, attemptsReached, isloding } = useContext(readoutContext);
    const [textVoice, setTextVoice] = useState("")
    const [textAnswer, setTextAnswer] = useState("")
    const [image, setImage] = useState('')
    const matchesTablet = useMediaQuery(' (max-width:1024px)');
    const [sendBackend, setsendBackend] = useState({})
    const [totalQuestion, setTotalQuestion] = useState()
    const [passage, setPassage] = useState()
    const [answerPassage, setAnswerPassage] = useState()


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
    const isLastQuestion = (isLastQuestionSkip || isAudioSubmit) && currentIndex === questionData.length - 1

    return (
        <>
            <div className={News.mainStoryContent}>
                <div className={News.firstContainer}>
                    {(matchesTablet === false && openFeedback) && <AiFeedBackMessage />}
                    <div className={News.storyContainer}>
                        {isError && <ShowError />}
                        {isloding && <AudioSubmittingMessage />}
                        {isAudioSubmit && <SuccessFullMessage />}
                        {isLastQuestion && <PopUpMessage />}
                        {isSkipPopup && <SkipPopup/>}
                        {!matchesTablet && <div className={News.topHeadingContainer}>
                            <h2 className={News.topHeading}>News Breif</h2>
                        </div>}
                        <div className={News.storyImageContainer}>
                            <div className={News.storyImageContainerinner}>
                                {matchesTablet && <div className={News.storyHeadingDivOuter}>
                                    <div className={News.storyHeadingDiv}>
                                    <p className={News.newsBreifHead}>{textVoice}</p>
                                </div>
                                    </div>}
                                <div className={News.storyImageRectangelCont}>
                                    <img src={image} alt="image" />
                                </div>
                                <div className={News.storyContainerStart}>
                                    {!matchesTablet && <div className={News.storyHeadingDiv}>
                                        <p className={News.newsBreifHead}>{textVoice}</p>
                                    </div>}
                                    <div className={News.storyAnswerDiv}>
                                        <p className={News.newsBreifText}>{textAnswer}</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <Button buttonContainerStyle={{ position: "" }} />
                        {(matchesTablet && isAiresponce) && <AiFeedBack />}
                    </div>
                    <div className={News.readOutContainer}>

                        {
                            matchesTablet ? (
                                <RecordingBoxMain data={combinedData} sendBackend={sendBackend} />

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

export default NewsBreif