import React, { useState, useEffect } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useForm } from "../../hooks/useForm";

const LoginModal = ({ isOpen, onLogin, onCloseModal, onToggleModal }) => {
  const { values, handleChange, setValues } = useForm({
    email: "",
    password: "",
  });

  const { email, password } = values;
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

    onLogin(values)
      .then(() => {
        setValues({ email: "", password: "" });
        setLoading(false);
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
      title="Log In"
      buttonText={loading ? "Logging in..." : "Log In"}
      isOpen={isOpen}
      onClose={onCloseModal}
      onSubmit={handleSubmit}
      additionalText={<a className="modal__sign-up-link" onClick={onToggleModal}>or Sign Up</a>}
    >
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

export default LoginModal;
