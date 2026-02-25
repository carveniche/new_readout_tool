import React, { useContext, useEffect, useState } from "react";
import Menu from "../Css/menuReadout.module.css";
import RecordingBox from "../RecordingBox/RecordingBox";
import AiFeedBackBox from "../RecordingBox/AiFeedBackBox";
import { readoutContext } from "../Contextapi/ContextProvider";
import Button from "../CommonComponent/Button";
import ShowError from "../CommonComponent/ShowError";
import AudioSubmittingMessage from "../CommonComponent/AudioSubmittingMessage";
import SuccessFullMessage from "../CommonComponent/SuccessFullMessage";
import PopUpMessage from "../CommonComponent/PopUpMessage";
import AiFeedBack from "../RecordingBox/AiFeedBack";
import RecordingBoxMain from "../RecordingBox/RecordingBoxMob/RecordingBoxMain";
import { useMediaQuery } from "@mui/material";
import AiFeedBackMessage from "../RecordingBox/AiFeedBackMessage";
import SkipPopup from "../CommonComponent/SkipPopUp";
function MenuReadOut() {
  const {isAiresponce,isSkipPopup,openFeedback,isLastQuestionSkip,currentIndex,questionData, setCurrentIndex, isAudioSubmit, setIsAudioSubmit, isError, setIsError, setErrorMessage,attemptsReached, isloding } = useContext(readoutContext);
  const [textVoice, setTextVoice] = useState("");
  const [textAnswer, setTextAnswer] = useState("");
  const [image, setImage] = useState("");
  // const [currentIndex, setCurrentIndex] = useState(0);
  const [sendBackend, setsendBackend] = useState({});
  const [totalQuestion, setTotalQuestion] = useState();
  const [passage, setPassage] = useState();
  const [answerPassage, setAnswerPassage] = useState();
  const [shareData, setShareData] = useState();
  const matchesTablet = useMediaQuery(' (max-width:1024px)');

 
  useEffect(() => {
    const parsed = JSON.parse(JSON.stringify(questionData));
    //    console.log(parsed,"parsed")
    setTotalQuestion(parsed.length);
    const questionText = parsed[currentIndex].question_text;
    const images_data = parsed[currentIndex].image_url;
    //   console.log(images_data,"images_data")
    const parsedQuestionText = JSON.parse(questionText);
    console.log(parsedQuestionText, "parsedQuestionText");
    setsendBackend(parsed[currentIndex]);
    const combined = parsedQuestionText?.title;
    const combined_answer = parsedQuestionText?.items
      .map((items) => `${items.name} - ${items.price}`)
      .join("<br>");

    const combinedWithDot = combined ? combined : `${combined}.`;

    const combined_answer_data = [
      combinedWithDot,
      ...(parsedQuestionText?.items || []).map(
        (item) => `${item.name} - ${item.price}`
      ),
    ];

    setShareData(combined_answer_data);
    // console.log(combined_answer_data, "combined_answer_data");
    setImage(images_data);
    //    console.log(combined,"combined",combined_answer,"combined_answer")
    setTextVoice(combined);
    setTextAnswer(combined_answer);
    setPassage(parsedQuestionText.title);
    setAnswerPassage(parsedQuestionText.items);
  }, [currentIndex]);
  //    console.log(answerPassage,"answerPassage")
  const textVoiceWithStop = textVoice.trim().endsWith(".")
    ? textVoice
    : `${textVoice}.`;
  const combinedData = `${textVoiceWithStop}|||${textAnswer}`;
  const getData = (shareData || [])
    .map((item) => item.replace(".", " point "))
    .join("|||");
  //   console.log(combinedData, "image");
  //   console.log(getData, "getData");
  const isLastQuestion = (isLastQuestionSkip || isAudioSubmit)  && currentIndex === questionData.length - 1

  return (
    <>
      <div className={Menu.reportContainer}>
      {(matchesTablet === false && openFeedback) && <AiFeedBackMessage />}
        <div className={Menu.menuParentContainer}>
          <div className={Menu.menuRightContainer}>
            {isError && <ShowError />}
            {isloding && <AudioSubmittingMessage />}
            {isAudioSubmit && <SuccessFullMessage/> }
            {isLastQuestion && <PopUpMessage/>}
            {isSkipPopup && <SkipPopup/>}
            <div className={Menu.menuTextContent}>
              <h2 className={Menu.headingText}>{textVoice}</h2>
              <h3
                className={`h8 ${Menu.mobileText}`}
                dangerouslySetInnerHTML={{ __html: textAnswer }}
              />
            </div>
            <Button
              
              buttonContainerStyle={{ position: "" }}
              
            />
              {(matchesTablet && isAiresponce) && <AiFeedBack />}
          </div>
          <div className={Menu.readOutContainer}>
             {
                        matchesTablet ? (
                            <RecordingBoxMain data={getData}/>
                            // <></>
                        ) : (
                            !isAudioSubmit ? (
                                <RecordingBox data={getData} currentPage={currentIndex} sendBackend={sendBackend} />
                            ) : (
                                <AiFeedBackBox />
                            )
                        )
                    }
          </div>
        </div>
      </div>
    </>
  );
}

export default MenuReadOut;
