import React, { useContext, useEffect, useState } from 'react';
import Recording from './Recording';
import Listning from './Listning';
import { useMediaQuery } from '@mui/material';
import Audio from './Audio';
import { readoutContext } from '../../Contextapi/ContextProvider';

const RecordingBoxMain = ({ data, sendBackend }) => {
  const { isAudioSubmit } = useContext(readoutContext);
  const matchesTablet = useMediaQuery('(min-width:768px) and (max-width:1024px)');
  const [isRecordingStarted, setIsRecordingStarted] = useState(false);
  const styles = {
    mainContainer: {
      width: '100%',
      height: '100%',
      display: "flex",
      flexDirection: matchesTablet ? "row" : "column",
      justifyContent: "space-between",
      gap: "10px",
    },

  };


  return (
    <div style={styles.mainContainer}>
      {!isAudioSubmit ? (<Recording sendBackend={sendBackend} setIsRecordingStarted={setIsRecordingStarted} />)

        : (<Audio />)
      }

      <Listning data={data} isRecordingStarted={isRecordingStarted} />
    </div>
  );
};



export default RecordingBoxMain;
