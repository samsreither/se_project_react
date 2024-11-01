import React, { useContext } from "react";
import "./ToggleSwitch.css";
import CurrentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext";

function ToggleSwitch() {
  const { currentTemperatureUnit, handleToggleSwitchChange } = useContext(
    CurrentTemperatureUnitContext
  );

  return (
    <div className="toggle-switch">
      <input
        type="checkbox"
        className="toggle-switch__checkbox"
        checked={currentTemperatureUnit === 'C'}
        onChange={handleToggleSwitchChange}
      />
      <label className="toggle-switch__slider">
        <span
          className={`toggle-switch__label f-label ${currentTemperatureUnit === "F" ? "active" : ""}`}
        >
          F
        </span>
        <span
          className={`toggle-switch__label c-label ${currentTemperatureUnit === "C" ? "active" : ""}`}
        >
          C
        </span>
      </label>
    </div>
  );
}

export default ToggleSwitch;
