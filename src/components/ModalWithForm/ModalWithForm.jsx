import "./ModalWithForm.css";
import grayX from "../../assets/grayX.svg";

function ModalWithForm({
  children,
  buttonText,
  title,
  isOpen,
  onClose,
  onSubmit,
  additionalLink = null,
  className = "",
}) {
  const handleBackdropClick = (e) => {
    // function to close the modal if backdrop is clicked on
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`modal ${className} ${isOpen ? "modal_opened" : ""}`}
      onClick={handleBackdropClick}
    >
      <div className="modal__content">
        <h2 className="modal__title">{title}</h2>
        <button onClick={onClose} type="button" className="modal__close">
          <img src={grayX} alt="Close" className="modal__close-icon" />
        </button>
        <form onSubmit={onSubmit} className="modal__form">
          {children}
          <div className="modal__actions">
            <button
              type="submit"
              className="modal__submit modal__submit-save-changes"
            >
              {buttonText}
            </button>
            {additionalLink && (
              <span className="modal__additional-text">{additionalLink}</span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalWithForm;
