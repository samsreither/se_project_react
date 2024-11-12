import React, { useState, useContext, useEffect } from 'react';
import ClothesSection from "../ClothesSection/ClothesSection";
import Sidebar from "../Sidebar/Sidebar";
import "./Profile.css";
import EditProfileModal from '../EditProfile/EditProfile';
import CurrentUserContext from "../../contexts/CurrentUserContext";
import { checkToken } from '../../utils/auth';
import { handleUpdateProfile } from '../../utils/auth';

function Profile({ onCardClick, onAddClick, clothingItems, onSignOut, onCardLike, setUser }) {

  
  const [isEditProfileOpen, setEditProfileOpen] = useState(false);
  
  const [currentUser, setCurrentUser] = useState({ name: '', avatar: ''});

  const userContext = useContext(CurrentUserContext);

  useEffect(() => {
    if (isEditProfileOpen) {
      setCurrentUser({
        name: userContext.name,
        avatar: userContext.avatar
      });
    }
  }, [isEditProfileOpen, userContext]);


  const handleChangeProfileData = () => {
    setEditProfileOpen(true);
  };

  const handleCloseProfileData = () => {
    setEditProfileOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // packages name and avatar into userData, then calls handleUpdateProfile, passing
  // token and userData, which performs API call to update profile on the server
  const updateProfile = (token, name, avatar) => {
    const userData = { name, avatar};
    handleUpdateProfile(token, userData) // update profile on server (API) - handleUpdateProfile is in api.js
    .then((updatedUser) => {
      console.log('Current user is...', updatedUser); //updatedUser is correct here
      setUser(updatedUser);
      // profile does not update until I refresh the page!!
      handleCloseProfileData();
    })
    .catch((error) => {
      console.error('Error updating profile:',error); // error if request fails
    })
  }

  // triggered when form is submitted
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // get current values for name and avatar
    const name = currentUser.name;
    const avatar = currentUser.avatar;
    const token = localStorage.getItem("jwt");

    // get token - THIS might not be right?? ERROR HAPPENING HERE!
    if (token) {
      updateProfile(token, name, avatar);
    } else {
      console.error("Error. No token found");
    }
  };


  return (
    <div className="profile__page">
      <section className="profile__sidebar">
        <Sidebar />
        <div className="profile__buttons">
          <button className="profile__change-data" onClick={handleChangeProfileData}>
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
          onCardLike={onCardLike}
        />
      </section>

      
      {isEditProfileOpen && (
        <EditProfileModal
          className="edit-profile-modal"
          currentUser={currentUser}
          onClose={handleCloseProfileData}
          onUpdate={handleUpdateProfile}
          isOpen={isEditProfileOpen}
          onChange={handleInputChange}
          onSubmit={handleFormSubmit}
      />
    )}
      
    </div>
  );
}

export default Profile;
