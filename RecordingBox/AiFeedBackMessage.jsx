import React, { useContext, useState } from 'react';
import { readoutContext } from '../Contextapi/ContextProvider';
import '../Css/AiFeedBackMessage.css'; 

const AiFeedBackMessage = () => {
    const { audioResponce , setOpenFeedBack} = useContext(readoutContext);
    const [isClosing, setIsClosing] = useState(false);

    const feedback =
        audioResponce?.ai_feedback ?? "No feedback available.";
       
    const clickHandler = () => {
        setIsClosing(true); // trigger closing animation
        setTimeout(() => {
            setOpenFeedBack(false); // remove after animation
        }, 400); // match animation duration
    };

    return (
        <div style={styles.overlay}>
            <div 
              className={`modal-slide ${isClosing ? 'modal-slide-up' : ''}`} 
              style={styles.modal}
            >
                <div style={styles.header}>
                    <span></span>
                    <span className='h3'>AI Feedback</span>
                    <button style={styles.closeBtn} onClick={clickHandler}>↑</button>
                </div>
                <div style={styles.content} className='text_body_2x'><div dangerouslySetInnerHTML={{ __html: feedback.replace(/\n/g, "<br/>") }} /></div>
            </div>
        </div>
    );
};


const styles = {
    overlay: {
        position: "absolute",
        top: "0",
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        zIndex: 9999,
    },
    modal: {
        width: "50%",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        fontSize: "14px",
        maxHeight: "80vh",
        overflowY: "auto",
        marginTop:"1rem",
        position:"absolute",
        left:"11%"

    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontWeight: "bold",
        marginBottom: "10px",
    },
    content: {
        lineHeight: "1.5",
        color: "#333",
    },
    closeBtn: {
        background: "transparent",
        border: "none",
        fontSize: "20px",
        cursor: "pointer",
    },
};

export default AiFeedBackMessage;
