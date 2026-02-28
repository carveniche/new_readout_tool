import React, { useContext, useEffect, useState } from 'react'
import TextPhrase from './AllQuestionType/TextPhrase'
import QuestionAnswer from './AllQuestionType/QuestionAnswer'
import ClassRoomInstructions from './AllQuestionType/ClassRoomInstructions'
import MiniDialog from './AllQuestionType/MiniDialog'
import Announcements from './AllQuestionType/Announcements'
import Notices from './AllQuestionType/Notices'
import Request from './AllQuestionType/Request'
import Posters from './AllQuestionType/Posters'
import Messages from './AllQuestionType/Messages'
import TimeTables from './AllQuestionType/TimeTables'
import Sentence from './AllQuestionType/Sentence'
import MenuReadOut from './AllQuestionType/MenuReadOut'
import ReportReadOut from './AllQuestionType/ReportReadOut'
import NewsBreif from './AllQuestionType/NewsBreif'
import StoriesBreif from './AllQuestionType/StoriesBreif'
import Conversation from './AllQuestionType/Conversation'
import { data } from "./JsonData/JsonData"
import Applications from './AllQuestionType/Applications'
import { readoutContext } from './Contextapi/ContextProvider'
import LanguageTranstations from './CommonComponent/LanguageTranstations'

const ReadoutLoudMain = () => {
    const {
        setCurrentIndex, setCompletedQuestionsId,
        setSkippedLimitReached, setSkippedQuestionsId, setAttemptsReached,
        setQuestionData, questionData,
         setRemaingSkipCount
    } = useContext(readoutContext);

    // const [selectedLanguage, setSelectedLanguage]= useState(null)
    const [languageOptions, setLanguageOptions] = useState(null)
    const [isTranslation,setIsTranslation] = useState(false)
    const [firstCatName, setFirstCatName] = useState([])

    // useEffect(() => {
    //     setQuestionData(data);
    //     console.log(data, "data")
    // }, []);

    useEffect(() => {
        window.setReadoutData = (data) => {
            const dataReceived = data?.[0];
            console.log("React received:", dataReceived);
            setQuestionData(dataReceived?.question_data)
            setSkippedLimitReached(dataReceived?.readout_details?.skipped_limit_reached);
            setAttemptsReached(dataReceived?.readout_details?.attempts_reached);
            setSkippedQuestionsId(dataReceived?.skipped_questions)
            setCompletedQuestionsId(dataReceived?.completed_question_ids)
            const completed = dataReceived?.question_data.filter(item => item.is_completed).length;
            const renderIndex = dataReceived?.question_data.length === completed ? 0 : completed;
            setCurrentIndex(renderIndex);
            setLanguageOptions(dataReceived?.languages)
            setIsTranslation(dataReceived?.is_translated)
            console.log(dataReceived.level_one_categories,"listofcategoty")
            setFirstCatName(dataReceived?.level_one_categories)
            setRemaingSkipCount(dataReceived?.readout_details?.remaining_skip_count)
        };

        // If Rails sent it before React mounted
        if (window.__pendingReadoutData) {
            window.setReadoutData(window.__pendingReadoutData);
            delete window.__pendingReadoutData;
        }

        return () => {
            delete window.setReadoutData;
        };
    }, []);

    const componentMap = {
        "Everyday Phrases": <TextPhrase />,
        "Question & Answers": <QuestionAnswer />,
        "Classroom instructions": <ClassRoomInstructions />,
        "Mini Dialogues": <MiniDialog />,
        "Announcements": <Announcements />,
        "Notices": <Notices />,
        "Requests": <Request />,
        "Posters": <Posters />,
        "Messages": <Messages />,
        "Timetables": <TimeTables />,
        "Sentences": <Sentence />,
        "Stories": <StoriesBreif />,
        "News Briefs": <NewsBreif />,
        "Reports": <ReportReadOut />,
        "Menus": <MenuReadOut />,
        "Conversations": <Conversation />,
        "Applications": <Applications />,
    };
    
    console.log(questionData,"questionData")
  
    if (!questionData) return null;
    
    const categoriesToCheck = ["Everyday Phrases", "Question & Answers","Mini Dialogues", "Classroom instructions","Requests","Sentences"];
    if (  Array.isArray(firstCatName) && firstCatName.includes(questionData[0].category_name)   && isTranslation === false ) {
        return (
            <LanguageTranstations  languageOptions={languageOptions}/>
        );
    }
   
    return (
        <>
            {componentMap[questionData[0]?.category_name]}
        </>
    )
}

export default ReadoutLoudMain
