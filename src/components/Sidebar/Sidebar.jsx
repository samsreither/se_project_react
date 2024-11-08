import React, { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import "./Sidebar.css";

function Sidebar() {
  const currentUser = useContext(CurrentUserContext); // get current user from context

  if (!currentUser) {
    return <p>Loading...</p>; // show loading state if user data is not available yet
  }

  return (
    <div className="sidebar">
      <img className="sidebar__avatar" src={currentUser.avatar} alt={currentUser.name} />
      <p className="sidebar__username">{currentUser.name}</p>
    </div>
  );
}

export default Sidebar;
