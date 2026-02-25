import React, { useContext, useEffect, useState } from "react";
import App from "../Css/applications.module.css";
import RecordingBox from "../RecordingBox/RecordingBox";
import AiFeedBackBox from "../RecordingBox/AiFeedBackBox";
import { readoutContext } from "../Contextapi/ContextProvider";
import Button from "../CommonComponent/Button";
import ShowError from "../CommonComponent/ShowError";
import AudioSubmittingMessage from "../CommonComponent/AudioSubmittingMessage";
import SuccessFullMessage from "../CommonComponent/SuccessFullMessage";
import PopUpMessage from "../CommonComponent/PopUpMessage";
import RecordingBoxMain from "../RecordingBox/RecordingBoxMob/RecordingBoxMain";
import { useMediaQuery } from "@mui/material";
import AiFeedBack from "../RecordingBox/AiFeedBack";
import SkipPopup from "../CommonComponent/SkipPopUp";
function Applications() {
  const {isAiresponce,isSkipPopup,isLastQuestionSkip,currentIndex,questionData, setCurrentIndex, isAudioSubmit, setIsAudioSubmit,isError, setIsError, setErrorMessage,attemptsReached,isloding } = useContext(readoutContext);
  const [textVoice, setTextVoice] = useState("");
  const [textAnswer, setTextAnswer] = useState([]);
  const [textAnswerTwo, setTextAnswerTwo] = useState("");
  const [image, setImage] = useState("");
  // const [currentIndex, setCurrentIndex] = useState(0);
  const [sendBackend, setsendBackend] = useState({});
  const [totalQuestion, setTotalQuestion] = useState();
  const [passage, setPassage] = useState();
  const [answerPassage, setAnswerPassage] = useState();
  const [parsedQuestion, setParsedQuestion] = useState(null);
  const matchesTablet = useMediaQuery(' (max-width:1024px)');
 

  useEffect(() => {
    const parsed = JSON.parse(JSON.stringify(questionData));
    setTotalQuestion(parsed.length);

    const questionText = parsed[currentIndex].question_text;
    const images_data = parsed[currentIndex].image_url;
    const parsedQuestionText = JSON.parse(questionText);

    setsendBackend(parsed[currentIndex]);
    setParsedQuestion(parsedQuestionText); // save full parsed object

    const combined = parsedQuestionText?.title;
    const combined_answer = parsedQuestionText?.fields || {}; // ✅ fix typo (was feilds)

    // if you need Speaker/Answer stuff
    const formattedAnswer = Array.isArray(combined_answer)
      ? combined_answer
        .map((item) => `Speaker ${item.speaker}: ${item.text}`)
        .join(" ||| ")
      : "";

    setTextAnswerTwo(formattedAnswer);
    setImage(images_data);
    setTextVoice(combined);
    setTextAnswer(combined_answer);
    setPassage(parsedQuestionText.title);
    setAnswerPassage(parsedQuestionText.message);
  }, [currentIndex]);
  //    console.log(answerPassage,"answerPassage")
  const textVoiceWithStop = textVoice.trim().endsWith(".")
    ? textVoice
    : `${textVoice}.`;
  const combinedData = `${textVoiceWithStop}|||${textAnswerTwo}`;
  const fullName = `${parsedQuestion?.fields?.first_name || ""} ${parsedQuestion?.fields?.last_name || ""
    }`;
  const fullSpeech = `
  
${parsedQuestion?.title?.includes("Library Name:")
      ? "Library name: " +
      parsedQuestion.title.replace("Library Name:", "").trim()
      : parsedQuestion?.title?.includes("Club Name:")
        ? "Club name: " + parsedQuestion.title.replace("Club Name:", "").trim()
        : parsedQuestion?.title || ""
    }.
First name: ${parsedQuestion?.fields?.first_name || ""}.
Last name: ${parsedQuestion?.fields?.last_name || ""}.
Date of birth: ${parsedQuestion?.fields?.date_of_birth || ""}.
Address: ${parsedQuestion?.fields?.address || ""}.
Postcode: ${parsedQuestion?.fields?.postcode || ""}.
Phone number: ${parsedQuestion?.fields?.phone_number || ""}.
Email: ${parsedQuestion?.fields?.email || ""}.

Agreement: ${parsedQuestion?.agreement || ""}.
Full Name: ${fullName}.
Date: ${parsedQuestion?.date || ""}.
`;
  //   console.log(image,"image")
  const isLastQuestion = (isLastQuestionSkip || isAudioSubmit)  && currentIndex === questionData.length - 1

  return (
    <>
      <div className={App.reportContainer}>
        <div className={App.reportContent}>
          <div className={App.reportBoxContainer}>
          {isError && <ShowError/>}
          {isloding && <AudioSubmittingMessage />}
          {isAudioSubmit && <SuccessFullMessage/> }
          {isLastQuestion && <PopUpMessage/>}
          {isSkipPopup && <SkipPopup/>}
            <div className={App.reportBoxUp}>
              <div className={App.reportBoxHead}>
                <h2 className="h3">Registration</h2>
              </div>
              <div className={App.mobileDiv}>
              <div className={App.reportAnswer}>
                <div className={App.reportInputFirstContainer}>
                  <div className={App.reportFirstBoxAns}>
                    <span className={App.h4Two}>Library name</span>
                    <div className={App.textDiv}>
                      <h2 className="subtitle">
                        {parsedQuestion?.title?.includes("Library Name:")
                          ? parsedQuestion.title
                            .replace("Library Name:", "")
                            .trim()
                          : parsedQuestion?.title?.includes("Club Name:")
                            ? parsedQuestion.title
                              .replace("Club Name:", "")
                              .trim()
                            : parsedQuestion?.title || ""}
                      </h2>
                    </div>
                  </div>

                  <div className={App.reportFirstBoxAns}>
                    <span className={App.h4Two}>First name</span>
                    <div className={App.textDiv}>
                      <h2 className="subtitle">
                        {parsedQuestion?.fields?.first_name}
                      </h2>
                    </div>
                  </div>

                  <div className={App.reportFirstBoxAns}>
                    <span className={App.h4Two}>Last name</span>
                    <div className={App.textDiv}>
                      <h2 className="subtitle">
                        {parsedQuestion?.fields?.last_name}
                      </h2>
                    </div>
                  </div>

                  <div className={App.reportFirstBoxAns}>
                    <span className={App.h4Two}>Date of birth (DD/MM/YYYY)</span>
                    <div className={App.textDiv}>
                      <h2 className="subtitle">
                        {parsedQuestion?.fields?.date_of_birth}
                      </h2>
                    </div>
                  </div>
                </div>

                <div className={App.reportInputFirstContainer}>
                  <div className={App.reportFirstBoxAns}>
                    <span className={App.h4Two}>Postcode</span>
                    <div className={App.textDiv}>
                      <h2 className="subtitle">
                        {parsedQuestion?.fields?.postcode}
                      </h2>
                    </div>
                  </div>

                  <div className={App.reportFirstBoxAns}>
                    <span className={App.h4Two}>Phone number</span>
                    <div className={App.textDiv}>
                      <h2 className="subtitle">
                        {parsedQuestion?.fields?.phone_number}
                      </h2>
                    </div>
                  </div>

                  <div className={App.reportFirstBoxAns}>
                    <span className={App.h4Two}>Email</span>
                    <div className={App.textDiv}>
                      <h2 className="subtitle">
                        {parsedQuestion?.fields?.email}
                      </h2>
                    </div>
                  </div>

                  <div className={App.reportFirstBoxAns}>
                    <span className={App.h4Two}>Address</span>
                    <div className={App.textDiv}>
                      <h2 className="subtitle">
                        {parsedQuestion?.fields?.address}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
              <div className={App.emailVerifyCheck}>
                <div className={App.confirmationText}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="44"
                    height="22"
                    viewBox="0 0 44 22"
                    fill="none"
                  >
                    <rect width="44" height="22" rx="11" fill="black" />
                    <circle cx="33" cy="11" r="10" fill="white" />
                  </svg>
                  <span className={App.h4Two} style={{ color: "black" }}>
                    {parsedQuestion?.agreement}
                  </span>
                </div>
                <div className={App.signDate}>
                  <div className={App.signDateOne}>
                    <div className={App.nameDiv}>
                      <span className={App.textItalic}>{parsedQuestion?.fields?.first_name} </span>
                      <span className={App.textItalic}> {parsedQuestion?.fields?.last_name}</span>
                    </div>
                    <hr />
                    <span className={App.h4Two}>Signature (full name)</span>
                  </div>
                  <div className={App.signDateTwo}>
                    <div className={App.nameDiv}>
                      <span className={App.textItalic}  >{parsedQuestion?.date} </span>
                    </div>
                    <hr />
                    <span className={App.h4Two}>Date (DD/MM/YYYY)</span>
                  </div>
                </div>
              </div>
              </div>
            </div>
            <div className={App.reportBoxDown}>
              <Button
                buttonContainerStyle={{ position: "" }}
              />
            </div>
            {(matchesTablet && isAiresponce) && <AiFeedBack />}
          </div>
          
          <div className={App.readOutContainer}>
            {
              matchesTablet ? (
                            <RecordingBoxMain data={fullSpeech} sendBackend={sendBackend}/>
                            // <></>
                        ) : (
                            !isAudioSubmit ? (
                                <RecordingBox data={fullSpeech} currentPage={currentIndex} sendBackend={sendBackend} />
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

export default Applications;
