import React from "react";
import "./AudioPlayer.css"
import Marker from "../Marker";
import {useSelector, useDispatch} from 'react-redux'
import {log_in} from '../../actions'

const AudioPlayer = ({
  currentTrack,
  isPlaying,
  setIsPlaying,
  handleClickPlay,
  currentStem,
  setCurrentStem,
  tracks,
  index,
  setIndex,
  setCurrentTrack,
  setCurrentId

}) => {
  const dispatch = useDispatch()
  const [currentTime, setCurrentTime] = React.useState();
  const [duration, setDuration] = React.useState();
  const [menuIsActive, setMenuIsActive] = React.useState(false)
  const [volume, setVolume] = React.useState(1)
  const [isMuted, setIsMuted] = React.useState(true)
  const [markerIsPressed, setMarkerIsPressed] = React.useState(false)
  const [markerPosition, setMarkerPosition] = React.useState(0)
  const markerRef = React.useRef()
  const [renderedStems, setRenderedStems] = React.useState({
    full: 'Full',
    melody: 'Melody',
    instruments: 'Instruments',
    bass: 'bass',
    drums: 'drums'

  })
  
  const clear = () => window.clearInterval(timeId.current);
  const timeId = React.useRef();
  const audio = React.useRef();
  const dropdownRef = React.useRef(null)
  const handleStemClick = stem => setCurrentStem(stem)
  
  // formatting seconds into "minutes : seconds"
  const fmtMSS = (s) => {
    return (s - (s %= 60)) / 60 + (9 < s ? ":" : ":0") + s;
  };

  // changing the value of time into the formatted time
  const formattedTime = fmtMSS(currentTime);
  const formattedTrackLength = fmtMSS(currentTrack.length)
  const setTime = (time) => {
  audio.current.currentTime = time
    
  }
  
  const handleMenu = () => {
    setMenuIsActive(!menuIsActive)
  }

  React.useEffect(() => {
    audio.current.oncanplay = () => {
      setDuration(audio.current.duration);
    };
  
  }, []);

  const handleClick = () => {
    handleClickPlay(currentTrack);
  };

    // Handle next track by incrementing index state
    
    const handleNextTrack = () => {

      setIndex(index + 1)

    }
    
    // useEffect for changing to next track to current index, and to not run if index is equal or higher than number of tracks
    React.useEffect(() => {
      if (index >= tracks.length) {
        return
      } if (index <= tracks.length) {
      setCurrentTrack(tracks[index])
      setCurrentId(tracks[index].id)
      setIsPlaying(true);
      } 

    }, [currentTrack, index, duration, currentTime])

    React.useEffect(() => {
      if (currentTime == Math.floor(duration)) {
        handleNextTrack()
        setIsPlaying(true)
      }
    }, [currentTime])

 
    // SCRUBBING //

    // variable that will be re-used in the different scrub-functions (getBoundingRect)
    const elem = document.getElementById("timebar")

    const scrub = e => {
      const barPosition = elem.getBoundingClientRect();
      const scrubValue = (e.pageX - barPosition.x) / barPosition.width;
      audio.current.currentTime = audio.current.duration * scrubValue;
    };
    
    const handleMouseDown = e => {
      setMarkerIsPressed(true);
      scrub(e);
    }
    
    const handleMouseMove = e => {
      if (markerIsPressed) {
        scrub(e);
      }
    }
    
    const handleMouseUp = () => {
      setMarkerIsPressed(false);
    }

    const handleScrub = e => {
      if (!markerIsPressed){
        // get width of timebar div
        const barPosition = elem.getBoundingClientRect();
      // Get click position relative to element and turn into percentage
      const scrubValue = (e.pageX - barPosition.x) / barPosition.width;
      audio.current.currentTime = audio.current.duration * scrubValue;
      console.log(barPosition.width)
      }
    }

    const handleHoldScrubbing = () => {
      setMarkerIsPressed(true)
    }
    
          
    // const onMouseUp = (e) => {
    //   setMarkerIsPressed(false)
    //     // get width of timebar div
    //     const barPosition = elem.getBoundingClientRect();
    //   // Get click position relative to element and turn into percentage
    //   const scrubValue = (e.pageX - barPosition.x) / barPosition.width;
    //   audio.current.currentTime = audio.current.duration * scrubValue;
    // }
    // // Update the current position if mouse is down

    // const onMouseMove = (e) => {
    //       if (markerIsPressed) {
    //     // get width of timebar div
    //     const barPosition = elem.getBoundingClientRect();
    //     // Get click position relative to element and turn into percentage
    //     const scrubValue = (e.pageX - barPosition.x) / barPosition.width;
    //     audio.current.currentTime = audio.current.duration * scrubValue;
    //     console.log(scrubValue)
    //     console.log(e.target)

    //       }
      
    // }

    React.useEffect(() => {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }, []);
    
    // useEffect for setting markerispressed to false whenever mouseup
    React.useEffect(() => {
      const mouseUp = () => setMarkerIsPressed(false)
      window.addEventListener('mouseup', mouseUp)
      
      return () => window.removeEventListener('mouseup', mouseUp);
    }, []);
        
    React.useEffect(() => {
      if (isPlaying && !markerIsPressed) {
  
          audio.current.ontimeupdate = () =>
          setCurrentTime(Math.floor(audio.current.currentTime));
          return () => clear();
        
      }
    }, [setTime]);

    // VOLUME SLIDER //

    const handleVolume = (e) => {
      setVolume(e.target.value)
      audio.current.volume = volume
      if (e.target.value == 0) {
        setIsMuted(true)
      } if (e.target.value > 0) {
        setIsMuted(false)
      }
      }
    

    const toggleMute = () => {
      setIsMuted(!isMuted)
  }
  console.log(isMuted)

  React.useEffect(() => {
    if (isMuted) {
    audio.current.volume = 0;
    } if ( !isMuted) {
      audio.current.volume = volume
    } if (audio.current.volume > 0) {
      setIsMuted(false)
    }  if (isMuted) {
      setVolume(0)
      audio.current.volume = volume
    }
  });
  
  React.useEffect(() => {
    if (currentTrack) {
      if (isPlaying) {
        audio.current.play();
      } else {
        audio.current.pause();
      }
    }
  }, [currentTrack, isPlaying]);


  // useEffect for closing stems menu window when clicking outside of it
  React.useEffect(() => {
    const pageClickEvent = (e) => {
      if (dropdownRef.current !== null && !dropdownRef.current.contains(e.target)) {
        setMenuIsActive(!menuIsActive);
      }
    };
  
    // If the item is active (ie open) then listen for clicks
    if (menuIsActive) {
      window.addEventListener('click', pageClickEvent);
    }
  
    return () => {
      window.removeEventListener('click', pageClickEvent);
    }
  
  }, [menuIsActive]);

  React.useEffect(() => {
    const PlayCurrentStem = () => {
      audio.current.play()
      setIsPlaying(true)
    }
    audio.current.addEventListener('canplay', PlayCurrentStem);

    return () => audio.current.removeEventListener('canplay', PlayCurrentStem)
  }, [currentStem]);

  // conditionally render the drums stem when current track has it or not
    React.useEffect(() => {
      if (currentTrack) {
        if (!currentTrack.stems.drums) {
         delete renderedStems.drums
        }
      }
      if (currentTrack.stems.drums) {
        renderedStems.drums = 'drums'
      }
    })



  return (
      <div className="audioplayer">
        <audio src={currentTrack.stems[currentStem].lqMp3Url} ref={audio}></audio>

        <div className="track-wrapper"><h3 className="track-title">{currentTrack.title}</h3><h3 className="track-title artist-name">{currentTrack.creatives.mainArtists.map((artist) => " " + artist.name) + " "}</h3></div>
        <button className="play-pause-button" onClick={handleClick}>{isPlaying ? 
        <svg height="25px"  version="1.1" viewBox="0 0 512 512" width="25px"><g fill="#fff"><path d="M224,435.8V76.1c0-6.7-5.4-12.1-12.2-12.1h-71.6c-6.8,0-12.2,5.4-12.2,12.1v359.7c0,6.7,5.4,12.2,12.2,12.2h71.6   C218.6,448,224,442.6,224,435.8z"/><path d="M371.8,64h-71.6c-6.7,0-12.2,5.4-12.2,12.1v359.7c0,6.7,5.4,12.2,12.2,12.2h71.6c6.7,0,12.2-5.4,12.2-12.2V76.1   C384,69.4,378.6,64,371.8,64z"/></g>
        </svg> : 
        <svg version="1.1"  width="40px" height="40px" viewBox="0 0 512 512">
          <g>
          </g>
	        <path d="M152.443 136.417l207.114 119.573-207.114 119.593z" fill="#fff"/>
        </svg>}
        </button>
        <button onClick={handleNextTrack} className="next-track-button">
        <svg width="25" height="25" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#FFF"><path d="M15 13.75V19H18V12V5H15V10.25L6 5V19L15 13.75Z"></path><rect x="15" y="5" width="3" height="14"></rect></svg>
        </button>
        <h2>{formattedTime}</h2>
        <div onMouseMove={handleMouseMove} onClick={handleScrub}           onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp} id="timebar" className="timebar">
        <div className="bar"> 
          <div className="bar-two" style={{width: (100 * currentTime) / duration + '%'}}></div>
          <Marker
          setMarkerIsPressed={setMarkerIsPressed} 
          position={markerPosition}
          markerRef={markerRef}
          currentTime={currentTime}
          duration={duration}
          handleHoldScrubbing={handleHoldScrubbing}
            />
        </div>
        </div>
              <h2>{formattedTrackLength}</h2>
        <div className='slider-wrapper'> 
            <label>
              <input type="range" min='0' max='1' value={volume} onChange={handleVolume} step='0.01' />
            
            </label>
            <div>
            {isMuted ? <svg onClick={toggleMute} fill="#fff" width="23" height="23" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000"><metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata><g><g><path d="M73.2,400.3v224.2c0,68.8,55.8,124.6,124.6,124.6H328l358.7,235.6c36.3,20.1,85.8-18.8,110-68L161.2,281.2C110.3,296.8,73.2,344.2,73.2,400.3z"/><path d="M811.2,143.8c0-68.8-62.3-164-124.6-124.6L357.9,254.8l453.4,453.4V143.8z"/><path d="M187.5,276.2l618,618l60.4,60.4c11.1,11.1,25.6,16.7,40.2,16.7c14.5,0,29.1-5.6,40.2-16.7c22.2-22.2,22.2-58.1,0-80.3l-135-135L339.7,267.8L134.1,62.2C123,51.1,108.5,45.6,93.9,45.6c-14.5,0-29.1,5.6-40.2,16.7c-22.2,22.2-22.2,58.1,0,80.3L187.5,276.2z"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></g></svg>
                     : <svg onClick={toggleMute} fill="#fff" width="23" height="23" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000">
            <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
            <g><path d="M836.5,95.6l-52.7,52.7C866,242.4,916,365.2,916,500c0,134.8-50.1,257.6-132.1,351.7l52.7,52.7C932,796.8,990,655.2,990,500S932,203.2,836.5,95.6z M472.3,185.7c-13.3,0-25.4,4.9-35,12.7l-0.2-0.2L249.2,351.9H65.3v0.1C34.8,352.2,10,377,10,407.5v184.9c0,30.6,24.8,55.5,55.5,55.5h185.3l188.8,137.3l0.1-0.1c9.2,6.7,20.3,10.7,32.5,10.7c30.6,0,55.5-24.8,55.5-55.5V241.1C527.7,210.5,502.9,185.7,472.3,185.7z M692.3,239.8l-52.6,52.6c45.6,56.9,72.9,129,72.9,207.6s-27.4,150.7-72.9,207.6l52.6,52.7c58.8-70.5,94.2-161.2,94.2-260.3S751.2,310.3,692.3,239.8z"/></g>
            </svg>}
            </div>
        </div>
          
        <div/>
        <div className="button-action-wrapper">
          <button onClick={handleMenu} class="track-action stems" title="stems">
          <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#FFF"><path fill-rule="evenodd" clip-rule="evenodd" d="M15 2H13V5V7V11V13V17V19V22H15V19H22V17H15V13H18V11H15V7H21V5H15V2ZM6 5H11V7H6V5ZM11 17H6V19H11V17ZM11 11H2V13H11V11Z"></path></svg>
          </button>
          Stems

        </div>
        <div className="menu-container">
        <div ref={dropdownRef} className={`menu ${menuIsActive ? 'active' : 'inactive'}`}>
                <ul>
                  {Object.keys(renderedStems).map(stem => (
                    <li className="stem-list-item" onClick={() => handleStemClick(stem)}><image className={stem}></image><span>{renderedStems[stem]} </span></li>
                  ))}
                </ul>
            </div>
            </div>
        <div className="button-action-wrapper">
          <button class="track-action similar" title="similar">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" height="20px" width="20px" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" >
              <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
              <g fill="#fff"><g transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)"><path d="M3133.5,4974.1C1769,4713.3,753.2,3764.2,392.3,2408.8c-87.9-330.5-109.2-1046.1-42.4-1403.9C543.9-20,1144.3-860,2051-1381.5c121.3-66.7,360.8-172.9,533.7-236.5l315.4-115.2l21.2-175.9c54.6-436.6,272.9-985.5,561-1419.1c188-282,600.4-694.4,882.4-882.4c309.3-206.2,742.9-406.3,1088.6-497.3c263.8-69.7,357.8-78.8,812.6-81.9c585.2-3,815.7,36.4,1273.6,215.3c1037.1,406.3,1773.9,1243.2,2083.2,2365.2c57.6,203.2,66.7,315.3,66.7,812.6c0,497.3-9.1,609.5-66.7,812.6C9446.7,58.8,9173.8,537.9,8737.2,983.6c-409.4,418.4-767.2,648.9-1306.9,843l-312.4,112.2l-36.4,227.4c-106.1,685.3-451.8,1349.4-964.3,1861.8c-418.5,418.5-979.4,736.9-1555.6,888.5C4191.8,5010.5,3488.3,5040.8,3133.5,4974.1z M4413.1,4109.9c955.2-285,1664.7-1049.2,1852.7-1995.3l21.2-100.1h-166.8c-369.9,0-967.3-157.7-1367.6-363.9C3855.2,1189.8,3209.3,371.1,2975.8-593.2c-30.3-139.5-63.7-257.7-72.8-266.8c-30.3-27.3-576.1,257.7-767.2,400.3c-476.1,360.8-839.9,937-967.3,1528.3c-54.6,266.8-54.6,797.5,3,1067.4c106.1,500.3,342.6,930.9,712.6,1303.9c360.8,357.8,803.6,603.4,1288.7,709.5C3476.2,4216,4128.1,4194.8,4413.1,4109.9z M6265.9,1098.9c-118.2-594.3-467-1161.4-937-1531.3c-391.2-306.3-909.7-512.4-1373.7-545.8c-251.7-21.2-242.6-30.3-172.8,245.6c69.7,272.9,288.1,703.5,485.2,955.2c436.6,557.9,1191.7,952.1,1855.8,970.3l163.8,3L6265.9,1098.9z M7497,904.8C8194.4,547,8685.6-105,8846.3-887.3c66.7-318.4,42.5-903.6-48.5-1222c-248.7-864.2-964.3-1564.6-1849.7-1807.2c-285-78.9-1027.9-78.9-1303.9,0c-979.4,282-1704.2,1052.2-1895.2,2013.4l-21.2,97h151.6c382.1,0,934,145.5,1355.4,354.8c369.9,185,621.6,366.9,912.7,661c476,482.1,773.2,1049.2,933.9,1783C7105.8,1095.8,7130.1,1092.8,7497,904.8z"/></g></g>
            </svg>
            </button>
            Similar
        </div>
        <div className="button-action-wrapper">
          <button class="track-action buy" title="buy">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" height="20px" width="20px"  x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000">
              <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
              <g fill="#fff"><path d="M959.3,223.8L360.1,213c-17.7-0.9-32.7,13.1-33.4,30.9c-0.8,17.9,13,33,30.7,33.7l557.3,8.9L790.5,606.4H284.6l-91.4-502.3c-2-11-9.5-20.2-19.8-24.3L53.8,34.4C37.3,27.8,18.7,36,12.2,52.6c-6.5,16.7,1.6,35.5,18.1,42l102.9,38.8l93,511.1c2.8,15.3,16.1,26.5,31.6,26.5h15.4l-35.2,98.8c-3,8.3-1.8,17.5,3.2,24.7c5,7.2,13.2,11.4,21.9,11.4h24.7c-15.3,17.2-24.7,39.9-24.7,64.8c0,53.5,43.2,97.1,96.2,97.1c53.1,0,96.2-43.6,96.2-97.1c0-24.9-9.4-47.5-24.7-64.8h209.8c-15.3,17.2-24.7,39.9-24.7,64.8c0,53.5,43.2,97.1,96.2,97.1c53,0,96.2-43.6,96.2-97.1c0-24.9-9.4-47.5-24.7-64.8h30.1c14.7,0,26.7-12.1,26.7-27c0-14.9-11.9-27-26.7-27H301.2l28.9-80.9h483.8c14,0,26.3-9.1,30.5-22.5L988.5,266c3.1-9.6,1.5-20.1-4.2-28.4C978.5,229.3,969.3,224.2,959.3,223.8L959.3,223.8z M712.3,827.6c23.6,0,42.7,19.4,42.7,43.1c0,23.8-19.2,43.2-42.7,43.2c-23.6,0-42.8-19.3-42.8-43.2C669.5,847,688.7,827.6,712.3,827.6L712.3,827.6z M359.4,827.6c23.6,0,42.8,19.4,42.8,43.1c0,23.8-19.2,43.2-42.8,43.2c-23.5,0-42.7-19.3-42.7-43.2C316.7,847,335.9,827.6,359.4,827.6L359.4,827.6z"/></g>
            </svg>
          </button>
          Add to cart
        </div>

        <div className="button-action-wrapper">
          <button class="track-action add" title="add">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" height="20px" width="20px" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000">
              <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
              <g fill="#fff"><g><path d="M990,569.1H569.1V990H430.9V569.1H10V430.9h420.9V10h138.1v420.9H990V569.1z"/></g></g>
            </svg>
            </button>
            Add to playlist
        </div>

        <div className="button-action-wrapper">
          <button class="track-action download" title="download">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" height="20px" width="20px" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000">
            <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
            <g fill="#fff"><g><path d="M745,353.2H598v-294H402v294H255l245,245L745,353.2z M957.5,673.3c-10.3-11-78.9-84.4-98.5-103.6c-13-12.7-31.6-20.5-51.1-20.5h-86.1L872,695.9H698.3c-5,0-9.5,2.5-11.8,6.5l-40,91.8H353.4l-40-91.8c-2.3-4-6.8-6.5-11.8-6.5H128l150.1-146.7h-86c-19.5,0-38,7.8-51.1,20.5c-19.6,19.2-88.2,92.7-98.5,103.6c-24,25.5-37.1,45.9-30.9,71L39,894.9c6.3,25.2,33.9,45.9,61.3,45.9h799.3c27.5,0,55.1-20.7,61.3-45.9l27.5-150.6C994.7,719.1,981.5,698.8,957.5,673.3L957.5,673.3z"/></g></g>
          </svg>
          </button>
          Download
        </div>
      </div>
  );
};

export default AudioPlayer;
