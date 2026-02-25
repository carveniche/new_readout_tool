import React, { useEffect, useState } from 'react';

const SuccessFullMessage = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 2000); // hide after 2 sec

    return () => clearTimeout(timer); // cleanup
  }, []);

  if (!visible) return null;

  return (
    <div style={styles.message}>
      Your audio response is correct.
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
    color: "#155724", // dark green text
    background: "#d4edda", // light green background
    border: "1px solid #c3e6cb", // green border
    padding: "10px 20px",
    borderRadius: "8px",
    textAlign: "center",
    zIndex: 9999,
  }
};

export default SuccessFullMessage;
