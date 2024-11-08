import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import logo from "../../assets/wtwr-logo.svg";
import avatar from "../../assets/wtwr-avatar.svg";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function Header({ handleAddClick, weatherData, openLoginModal, openRegisterModal }) {
  const currentDate = new Date().toLocaleString("default", {
    month: "long",
    day: "numeric",
  });

  const [isFahrenheit, setIsFahrenheit] = useState(true);

  const onToggle = () => {
    setIsFahrenheit((prev) => !prev);
  };

  // access current user from context
  const currentUser = useContext(CurrentUserContext);

  console.log("Current user:", currentUser);

  // make first letter of name as avatar if no avatar is provided
  const avatarPlaceholder = currentUser ? currentUser.name[0] : "U";

  return (
    <header className="header">
      <Link to="/" className="header_logo-link">
        <img className="header__logo" alt="logo" src={logo} />
      </Link>
      <p className="header__date-and-location">
        {currentDate}, {weatherData.city}
      </p>
      <div className="header__controls">
        <ToggleSwitch isFahrenheit={isFahrenheit} onToggle={onToggle} />
        <button
          onClick={handleAddClick}
          type="button"
          className="header__add-clothes-btn"
        >
          + Add clothes
        </button>
      </div>

      {/* User Info Section */}
      <div className="header__auth-links">
        {!currentUser ? (
          <div className="header__auth-links-container">
            <button onClick={openRegisterModal} className="header__auth-link">
              Sign Up
            </button>
            <button onClick={openLoginModal} className="header__auth-link">
              Log In
            </button>
          </div>
        ) : (
          <Link to="/profile" className="header__link">
            <div className="header__user-container">
              <div className="header__user-name">{currentUser.name}</div>
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="header__avatar"
                />
              ) : (
                <div className="header__avatar-placeholder">
                  {avatarPlaceholder}
                </div>
              )}
            </div>
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
