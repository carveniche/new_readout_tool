import React from 'react'
import ContextProvider from './Contextapi/ContextProvider'
import "./Css/FontStyle.css"
import ReadoutLoudMain from './ReadoutLoudMain'

const Main = () => {
  return (
     <ContextProvider>
      <ReadoutLoudMain />
    </ContextProvider>
  )
}

export default Main