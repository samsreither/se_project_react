import React, { useState, useEffect } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./EditProfileModal.css";

const EditProfileModal = ({ currentUser={} , isOpen, onClose, onSubmit, onChange, className }) => {
   
  return (
    <ModalWithForm
      title="Change profile data"
      buttonText="Save changes"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      className={className}
      
    >
      <label htmlFor="name" className="modal__label">
        Name
        <input
          type="text"
          className="modal__input"
          id="name"
          name="name"
          placeholder="Name"
          value={currentUser.name || ''}
          onChange={onChange}
        />
      </label>
      <label htmlFor="avatar" className="modal__label">
        Avatar
        <input
          type="url"
          className="modal__input"
          id="avatar"
          name="avatar"
          placeholder="avatar"
          value={currentUser.avatar || ''}
          onChange={onChange}
        />
      </label>
      
    </ModalWithForm>
  );
};

export default EditProfileModal;