import React from 'react'
import "./Marker.css"


const Marker = ({handleHoldScrubbing, markerRef, currentTime, duration, onMouseUp}) => {
    

    return (
      <div className="marker"
        ref={ markerRef }
        onMouseDown={ handleHoldScrubbing }
        onMouseUp={onMouseUp}
        style={{left: (100 * currentTime) / duration + '%' }}>
      </div>
    )
  }
  
  export default Marker