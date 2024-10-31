import avatar from "../../assets/wtwr-avatar.svg";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <img className="sidebar__avatar" src={avatar} alt="avatar" />
      <p className="sidebar__username">Terrence Tegegne</p>
    </div>
  );
}

export default Sidebar;
