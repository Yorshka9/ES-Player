import React, { useState, useRef } from "react";
import Header from "./components/Header";
import TrackRow from "./components/TrackRow";
import AudioPlayer from "./components/AudioPlayer";
import "./App.css";
import Playlist from "./components/Playlist";
import CreatePlaylist from './components/CreatePlaylist'
import {connect, useDispatch} from 'react-redux'
import {increment, decrement, log_in} from './actions'
import counterReducer from "./reducers/counter";

const App = ({counter, isLogged}) => {
 
  console.log(counterReducer)

  const dispatch = useDispatch()

  const [error, setError] = React.useState(null);
  const [tracks, setTracks] = React.useState(null);
  const [playlistData, setPlaylistData] = React.useState(null);
  const [selectedTracks, setSelectedTracks] = React.useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentId, setCurrentId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [createPlaylistModalIsOpen, setCreatePlaylistModalIsOpen] = useState(false);
  const [currentStem, setCurrentStem] = React.useState('full')
  const [index, setIndex] = React.useState(0)



  const handleAddToPlaylist = () => {

    setModalIsOpen(true);

  };

  // toggle function for toggling whether audio is played or paused
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // onClick function for handling currentTrack and isPlaying state. set current stem back to full whenever track changes
  const handleClickPlay = (track) => {
    setCurrentTrack(track);
    setCurrentId(track.id);
    setIndex(tracks.indexOf(track))
    if (track.id === currentId) {
      togglePlay();
    } else {
      setIsPlaying(true);
      setCurrentStem('full')
    }
  };

  const handleDeselect = () => {
    setSelectedTracks([])
  }

  React.useEffect(() => {
    fetch("/album.json")
      .then((response) => response.json())
      .then((data) => {
        const tracks = Object.values(data.entities.tracks);
        const playlist = Object.values(data.entities.albums)[0];
        setTracks(tracks);
        setPlaylistData(playlist);
      });
  }, []);

  // function for handling what track is selected
  const handleTrackSelect = (el, track) => {
    if (el.ctrlKey && selectedTracks.includes(track)) {
      console.log("ctrl key detected");
      setSelectedTracks(selectedTracks.filter((el) => (el !== track)))
      console.log("removed track from array")
    } else if (el.ctrlKey) {
      setSelectedTracks((selectedTracks) => [...selectedTracks, track]);
      console.log("added track to array")
    } else if (el.shiftKey && selectedTracks.includes(track)) {
      console.log("already selected")
      return
    } else if (el.shiftKey) {
      const startTrack = selectedTracks[selectedTracks.length - 1];
      const start = tracks.indexOf(startTrack);
      const end = tracks.indexOf(track)

      const tracksToSelect = end < start 
      ? tracks.slice(end, start)
      : tracks.slice(start + 1, end + 1);
      setSelectedTracks([...selectedTracks, ...tracksToSelect])
      console.log("shift key detected")
    } else  {
      setSelectedTracks([track]);
      console.log("added track to array")
    }
    
  };

  const handleNewPlaylist = () => {
    
    setCreatePlaylistModalIsOpen(true);
    setModalIsOpen(false)


  };

  if (!tracks || !playlistData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header
        playlistName={playlistData.title}
        playlistDescription={playlistData.description}
        coverImage={playlistData.coverImageUrl}
      />
      {/* <h1>Counter {counter}</h1>
      <button onClick={() => dispatch(increment(5))}>+</button>
      <button onClick={() => dispatch(decrement(5))}>-</button>
      <button onClick={() => dispatch(log_in())}>Login</button>
      {isLogged && <h3>Logged in</h3>} */}

      <table cellSpacing="0" className="center">
        <tbody>
          {tracks.map((track) => (
            <TrackRow
              track={track}
              handleSelect={(e) => handleTrackSelect(e, track)}
              isSelected={selectedTracks.includes(track)}
              handleClickPlay={handleClickPlay}
              isPlaying={isPlaying && track.id === currentId}
            />
          ))}
        </tbody>
      </table>
       { selectedTracks.length >= 2 && <div className="selected-tracks">
       <h3 className="selected-tracks-h3"> {selectedTracks.length} TRACKS SELECTED </h3>
       <div onClick={handleAddToPlaylist} className="add-to-playlist"><svg className="add-to-playlist-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" height="18px" width="18px" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000">
              <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
              <g fill="#009de0"><g><path d="M990,569.1H569.1V990H430.9V569.1H10V430.9h420.9V10h138.1v420.9H990V569.1z"/></g></g>
            </svg> Add to Playlist</div>
       <button onClick={handleDeselect} className="deselect">Deselect All</button>
      </div>}
      {currentTrack && <AudioPlayer
        isPlaying={isPlaying && currentTrack.id === currentId}
        setIsPlaying={setIsPlaying}
        currentTrack={currentTrack}
        setCurrentTrack={setCurrentTrack}
        handleClickPlay={handleClickPlay}
        currentId={currentId}
        currentTrackLength={currentTrack && currentTrack.length}
        currentStem={currentStem}
        setCurrentStem={setCurrentStem}
        tracks={tracks}
        index={index}
        setIndex={setIndex}
        setCurrentId={setCurrentId}
      /> }
          {modalIsOpen && <Playlist modalIsOpen={modalIsOpen} handleNewPlaylist={handleNewPlaylist} setModalIsOpen={setModalIsOpen} content="Copied to Clipboard" />}
          {createPlaylistModalIsOpen && <CreatePlaylist createPlaylistModalIsOpen={createPlaylistModalIsOpen} handleNewPlaylist={handleNewPlaylist} setCreatePlaylistModalIsOpen={setCreatePlaylistModalIsOpen} content="Copied to Clipboard" />}
    </div>
  );
};

const mapStateToProps = ({counter, isLogged}) => {
  return {
    counter,
    isLogged
  }
}


export default connect(mapStateToProps)(App)



