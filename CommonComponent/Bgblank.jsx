import React from 'react'

const Bgblank = () => {
  return (
    <div style={styles.overlay}></div>
  )
}
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
}
export default Bgblank