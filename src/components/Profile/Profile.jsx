import ClothesSection from "../ClothesSection/ClothesSection";
import Sidebar from "../Sidebar/Sidebar";
import "./Profile.css";

function Profile({ onCardClick, onAddClick, clothingItems, onSignOut }) {
  return (
    <div className="profile__page">
      <section className="profile__sidebar">
        <Sidebar />
        <div className="profile__buttons">
          <button className="profile__change-data">
            Change profile data
          </button>
          <button className="profile__signout" onClick={onSignOut}>
            Log Out
          </button>
        </div>
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
