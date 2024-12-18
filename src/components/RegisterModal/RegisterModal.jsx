import React, { useState, useEffect } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useForm } from "../../hooks/useForm";

const RegisterModal = ({ isOpen, onRegister, onCloseModal, onToggleModal }) => {
  const { values, handleChange, setValues } = useForm({
    name: "",
    avatar: "",
    email: "",
    password: "",
  });

  const { name, avatar, email, password } = values;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    onRegister(values)
      .then(() => {
        setValues({ name: "", avatar: "", email: "", password: "" });
        onCloseModal();
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <ModalWithForm
      title="Sign Up"
      buttonText={loading ? "Signing Up..." : "Sign Up"}
      isOpen={isOpen}
      onClose={onCloseModal}
      onSubmit={handleSubmit}
      additionalLink={
        <a className="modal__sign-in-link" onClick={onToggleModal}>
          or Log In
        </a>
      }
    >
      <label htmlFor="register-name" className="modal__label">
        Name
        <input
          type="text"
          className="modal__input"
          id="register-name"
          name="name"
          placeholder="Your Name"
          value={name}
          onChange={handleChange}
        />
      </label>
      <label htmlFor="avatar" className="modal__label">
        Avatar URL
        <input
          type="url"
          className="modal__input"
          id="avatar"
          name="avatar"
          placeholder="Avatar URL"
          value={avatar}
          onChange={handleChange}
        />
      </label>
      <label htmlFor="email" className="modal__label">
        Email
        <input
          type="email"
          className="modal__input"
          id="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={handleChange}
        />
      </label>
      <label htmlFor="password" className="modal__label">
        Password
        <input
          type="password"
          className="modal__input"
          id="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={handleChange}
        />
      </label>
      {error && <p className="modal__error">{error}</p>}
    </ModalWithForm>
  );
};

export default RegisterModal;
