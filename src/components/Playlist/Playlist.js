import React, {useEffect, useState} from 'react'
import "./Playlist.css"

const Playlist = ({modalIsOpen, setModalIsOpen, handleNewPlaylist}) => {

  const [playlists, setPlaylists] = useState();
  const [createPlaylistModal, setCreatePlaylistModal] = useState(false);
  const node = React.useRef()

    const handleClick = e => {
        if (node.current.contains(e.target)) {
          // inside click
          console.log("clicked inside")
          return;
        }
        // outside click
        setModalIsOpen(false)
        console.log("clicked outside")
      };

      useEffect(() => {
        document.addEventListener("mousedown", handleClick);
    
        return () => {
          document.removeEventListener("mousedown", handleClick);
        };
      }, []);

    return (
      <div className="popup-box">
        <div ref={node}  className="box">ADD TO PLAYLIST
        <input className="playlist-input" placeholder="Filter Playlist"></input>
        <button onClick={handleNewPlaylist} className="blue-button">New Playlist</button>
        </div>
      </div>
    );
  };
  
  export default Playlist;
  