import React, {useEffect, useState} from 'react'
import './CreatePlaylist.css'


const CreatePlaylist = ({createPlaylistModalIsOpen, setCreatePlaylistModalIsOpen}) => {

  const node = React.useRef()


  const handleClick = e => {
    if (node.current.contains(e.target)) {
      // inside click
      console.log("clicked inside")
      return;
    }
    // outside click
    setCreatePlaylistModalIsOpen(false)
    console.log("clicked outside")
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

    return (
      <div className="new-playlist-popup-box">
        <div ref={node}  className="new-playlist-box">CREATE PLAYLIST
        <div className="input-wrapper">
        <input className="playlist-input" placeholder="Playlist name"></input>
        <input className="playlist-input" placeholder="Add to Project (Optional)"></input>
        </div>
        <div className="button-wrapper">
          <button className="blue-button cancel-button">Cancel</button>
          <button className="save-button">Save</button>
        </div>
        </div>
      </div>
    )

    

};

export default CreatePlaylist