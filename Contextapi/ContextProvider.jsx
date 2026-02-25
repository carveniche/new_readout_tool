// component/Contextapi/ContextProvider.js

import React, { createContext, useState } from 'react';

// 1. Create the context
const readoutContext = createContext();

// 2. Create the provider component
const ContextProvider = ({ children }) => {
  const [isAudioSubmit, setIsAudioSubmit] = useState(false)
  const [isloding, setIsLoding] = useState(false)
  const [audioResponce,setAudioResponce]= useState({})
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [skippedLimitReached, setSkippedLimitReached] = useState(false);
  const [attemptsReached, setAttemptsReached] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionData, setQuestionData] = useState(null);
  const [skippedQuestionsId, setSkippedQuestionsId] = useState(null);
  const [QuestionID, setQuestionID] = useState()
  const [completedQuestionsId,setCompletedQuestionsId]= useState();
  const [isSkippedquestions, setIsSkippedQuestions]= useState(false);
  const [isLastQuestionSkip, setIsLastQuestionSkip] = useState(false);
  const [isAiresponce, setIsAiResonce]= useState(false)
  const [openFeedback, setOpenFeedBack]=  useState(false)
   const [isStartTimer, setIsStartTimer] = useState(false);
   const [isSkipPopup, setIsSkipPopUp] = useState(false)
   const [remaningSkipCount, setRemaingSkipCount] = useState()
  

  const contextValue = {
   
    isAudioSubmit,
    setIsAudioSubmit,
    audioResponce,
    setAudioResponce,
    isloding, 
    setIsLoding,
    isError,
    setIsError,
    errorMessage, 
    setErrorMessage,
    skippedLimitReached, 
    setSkippedLimitReached,
    attemptsReached, 
    setAttemptsReached,
    currentIndex, 
    setCurrentIndex,
    questionData, 
    setQuestionData,
    skippedQuestionsId, 
    setSkippedQuestionsId,
    QuestionID, 
    setQuestionID,
    completedQuestionsId,
    setCompletedQuestionsId,
    isSkippedquestions,
     setIsSkippedQuestions,
     isLastQuestionSkip, 
     setIsLastQuestionSkip,
     isAiresponce, 
     setIsAiResonce,
     openFeedback, setOpenFeedBack,
     isStartTimer, setIsStartTimer,
     isSkipPopup, setIsSkipPopUp,
     remaningSkipCount, setRemaingSkipCount,
    
  };
  return (
    <readoutContext.Provider value={contextValue}>
      {children}
    </readoutContext.Provider>
  );
};

// 3. Export both context and provider
export { readoutContext };
export default ContextProvider;
