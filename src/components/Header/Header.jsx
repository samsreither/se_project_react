import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import logo from "../../assets/wtwr-logo.svg";
import avatar from "../../assets/wtwr-avatar.svg";
import ToggleSwitch from "../../ToggleSwitch/ToggleSwitch";

function Header({ handleAddClick, weatherData }) {
  const currentDate = new Date().toLocaleString("default", {
    month: "long",
    day: "numeric",
  });

  const [isFahrenheit, setIsFahrenheit] = useState(true);

  const onToggle = () => {
    setIsFahrenheit((prev) => !prev);
  };

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
      <Link to="/profile" className="header__link">
        <div className="header__user-container">
          <div className="header__user-name">Terrence Tegegne</div>
          <img src={avatar} alt="Terrence Tegegne" className="header__avatar" />
        </div>
      </Link>
    </header>
  );
}

export default Header;
