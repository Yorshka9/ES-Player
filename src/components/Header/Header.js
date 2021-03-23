import React from "react";
import "./Header.css";

const Header = ({ playlistName, playlistDescription, coverImage }) => {
  return (
    <div className="header-container">
      <div className="header-text">
      <h1>{playlistName}</h1>
      <p>{playlistDescription}</p>
      </div>
      <img className="cover-image" src={coverImage} />
    </div>
  );
};

export default Header;
