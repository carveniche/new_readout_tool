import React, { useContext, useEffect, useState } from 'react'
import { readoutContext } from '../Contextapi/ContextProvider';

const ShowError = () => {
    const {  errorMessage } = useContext(readoutContext);
  
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

    
    useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth <= 600);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
  
    if (!errorMessage) return null; // don't render if no error
  
    return (
    <div style={isMobile ? styles.MobileError : styles.Error}>{errorMessage}</div>
  )
}

const styles = {
  Error: {
    position: "absolute",
    left: "50%",
    top: "20px",
    transform: "translateX(-50%)",
    fontSize: "20px",
    fontWeight: "bold",
    color: "red",
    background: "#fdd",
    padding: "10px 20px",
    borderRadius: "8px",
    textAlign: "center",
    zIndex: 9999,
  },
  MobileError: {
    position: "absolute",
    top: 0,
    left: "20px",
    width: "80%",
    // height: "100vh", // full screen
    background: "#fdd",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "14px",
    fontWeight: "bold",
    color: "red",
    zIndex: 9999,
    textAlign: "center",
    padding: "0.5rem",
    borderRadius:"16px",
  },
};
export default ShowError