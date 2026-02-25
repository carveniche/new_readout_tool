import React, { useContext, useEffect, useState } from 'react'
import stylescss from "../../Css/ListningBoxMod.module.css"


import { ListenIcon, ListenStarted, ListenEndResume, } from "../../SvgIcons/SvgIcons"
import { readoutContext } from '../../Contextapi/ContextProvider';


const Listning = ({ data, isRecordingStarted }) => {

  const { currentIndex, questionData } = useContext(readoutContext);
  const [IsSpeaking, setIsSpeaking] = useState(false);
  const [startspeaking, setStartSpeaking] = useState(true)
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState([]);


  function speak(speech) {
    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(speech);
      utterance.rate = 0.7;

      // const selectedVoice = voices.find((v) => v.lang === "en-US");
      // Pick female voice
      const femaleVoices = voices.filter(v =>
        /female|woman|samantha|victoria|eva|zira|linda|google us english|google uk english/i
          .test(v.name + ' ' + v.lang)
      );

      // Use the first female voice or fallback to first available voice
      const selectedVoice = femaleVoices[0] || voices[0];
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        resolve();
      };

      utterance.onerror = (event) => {
        console.error("SpeechSynthesis error:", event.error);
        reject(event.error);
      };

      speechSynthesis.speak(utterance);
    });
  }


  async function speakFullText(text) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    setIsSpeaking(true)
    try {
      for (let sentence of sentences) {
        await speak(sentence.trim());
      }
    } catch (error) {
      console.error("Error during speech:", error);
    } finally {
      setIsSpeaking(false);
    }
  }

  useEffect(() => {
    const handleVoices = () => {
      const loadedVoices = speechSynthesis.getVoices();
      if (loadedVoices.length > 0) {
        setVoices(loadedVoices);
      }
    };

    handleVoices();
    window.speechSynthesis.onvoiceschanged = handleVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);



  const stopSpeech = () => {
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setStartSpeaking(true);
    setIsPaused(false);
    // console.log("🔇 Speech stopped (React or Rails call)");
  };


  useEffect(() => {
    if (isRecordingStarted === true) {
      stopSpeech();
    }
  }, [isRecordingStarted]);

  useEffect(() => {
    stopSpeech();
  }, [currentIndex]);


  useEffect(() => {
    window.stopSpeech = stopSpeech;

    return () => {
      stopSpeech();
      delete window.stopSpeech;
    };
  }, []);


  const pageContent = data;

  const speakingHandler = async () => {

    if (speechSynthesis.speaking && !isPaused) {
      speechSynthesis.pause();
      setIsPaused(true);
      console.log(speechSynthesis.speaking, speechSynthesis.paused)
      return;
    }

    if (isPaused) {
      speechSynthesis.resume();
      setIsPaused(false);
      return;
    }

    if (IsSpeaking) return;

    if (typeof pageContent === 'string' && pageContent.trim() !== '') {
      setStartSpeaking(false);
      setIsPaused(false);
      try {
        await speakFullText(pageContent);
      } catch (error) {
        console.error("Error during speaking:", error);
      }
    } else {
      console.warn("pageContent is empty or not a string:", pageContent);
    }
  }

  const litenStartHandler = () => {
    stopSpeech()
    speakingHandler()
  }

  return (
    <div className={stylescss.mainContainer}
      style={{
        opacity: isRecordingStarted ? "0.5" : "1",
        pointerEvents: isRecordingStarted ? "none" : "auto",
        cursor: isRecordingStarted ? "not-allowed" : "pointer",
      }}
    >
      <div
        onClick={!isRecordingStarted ? speakingHandler : undefined}
      >   {startspeaking
        ? <ListenIcon width="44px" height="44px" />
        : isPaused
          ? <ListenEndResume width="44px" height="44px" />
          : IsSpeaking
            ? <ListenStarted width="44px" height="44px" />
            : <ListenEndResume width="44px" height="44px" />
        }

      </div>

      <div className={stylescss.buttons} onClick={!isRecordingStarted ? litenStartHandler : undefined} >
        Listen to Start
      </div>
    </div>
  )
}






export default Listning