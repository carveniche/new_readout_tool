import React from 'react';

const AudioSubmittingMessage = () => {
  return (
    <div style={styles.message}>
      Please wait, your audio response is being submitted...
    </div>
  );
};

const styles = {
    message: {
        position: "absolute",
        left: "50%",
        top: "20px",
        transform: "translateX(-50%)",
        fontSize: "16px",
        fontWeight: "500",
        color: "#1C1D1F", // neutral text
        background: "#E8F4FF", // light blue info background
        border: "1px solid #90CAF9", // subtle border
        padding: "10px 20px",
        borderRadius: "8px",
        textAlign: "center",
        zIndex: 9999,
      }
};

export default AudioSubmittingMessage;
