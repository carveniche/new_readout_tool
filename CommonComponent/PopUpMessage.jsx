import React, { useContext } from 'react';
import { readoutContext } from '../Contextapi/ContextProvider';

import styles from "../Css/popUpMessage.module.css";
const PopUpMessage = () => {

    const {
        questionData, currentIndex, isSkippedquestions, setIsSkippedQuestions,setIsLastQuestionSkip
    } = useContext(readoutContext);



    const backHandler = () => {
        console.log("back")
        if (typeof window.backButtonFunction === "function") {
            window.backButtonFunction();
            setIsSkippedQuestions(false)
            setIsLastQuestionSkip(false)
        }

    }

    const isValue = currentIndex === questionData.length - 1

    const continueHandler = () => {
        if (isValue) {
            console.log("continue")
            if (typeof window.fetchSkipQuestion === "function") {
                window.fetchSkipQuestion();
                setIsSkippedQuestions(false)
                setIsLastQuestionSkip(false)
            } else {
                console.warn("fetchSkipQuestion is not defined on window");
            }
        }
    }


    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                <div className={styles.messageBox}>
                    <span className={styles.headingText}>You’ve completed all the questions.</span>

                    <span  className={`${styles.message} ${styles.messageText}`}>Would you like to go Home or practice Completed questions again?</span>
                </div>
                {/* <p style={styles.message}>{message || "You’ve completed all the questions. Would you like to go Home or practice old questions again?"}</p> */}
                <div className={styles.buttons}>
                    <button className={`${styles.continueBtn} ${styles.buttontext}`}  onClick={continueHandler}>Continue</button>
                    <button className={`${styles.homeBtn} ${styles.buttontext}`}   onClick={backHandler}>Home</button>
                </div>
            </div>
        </div>
    );
};

// const styles = {
//     overlay: {
//         position: "fixed",
//         top: 0, left: 0,
//         width: "100%", height: "100%",
//         backgroundColor: "rgba(0,0,0,0.5)",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         zIndex: 1000
//     },
//     popup: {
//         background: "#fff",
//         padding: "20px",
//         borderRadius: "10px",
//         width: "400px",
//         textAlign: "center",
//         boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
//     },
//     messageBox: {
//         display: "flex",
//         flexDirection: "column",
//         gap: "5px",
//         padding: "20px"
//     },
//     message: {
//         color: "black"
//     },

//     buttons: {
//         display: "flex",
//         justifyContent: "space-around"
//     },
//     homeBtn: {
//         padding: "8px 16px",
//         border: "none",
//         borderRadius: "6px",
//         background: "#ff4d4f",
//         color: "#fff",
//         cursor: "pointer"
//     },
//     continueBtn: {
//         padding: "8px 16px",
//         border: "none",
//         borderRadius: "6px",
//         background: "#4CAF50",
//         color: "#fff",
//         cursor: "pointer"
//     }
// };

export default PopUpMessage;
