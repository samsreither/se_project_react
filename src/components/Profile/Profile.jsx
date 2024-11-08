import ClothesSection from "../ClothesSection/ClothesSection";
import Sidebar from "../Sidebar/Sidebar";
import "./Profile.css";

function Profile({ onCardClick, onAddClick, clothingItems, onSignOut }) {
  return (
    <div className="profile__page">
      <section className="profile__sidebar">
        <Sidebar />
        <button className="signout-button" onClick={onSignOut}>
          Sign Out
        </button>
      </section>
      <section className="profile__clothing-items">
        <ClothesSection
          onCardClick={onCardClick}
          onAddClick={onAddClick}
          clothingItems={clothingItems}
        />
      </section>
    </div>
  );
}

export default Profile;
