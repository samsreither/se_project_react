import { useContext } from 'react';
import CurrentUserContext from '../../contexts/CurrentUserContext';
import "./ItemModal.css";
import grayX from "../../assets/grayX.svg";


function ItemModal({ activeModal, onClose, card, onDelete }) {

  const handleBackdropClick = (e) => {
    // function to close the modal if backdrop is clicked on
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  // access current user from context
  const currentUser = useContext(CurrentUserContext);
  const { name, imageUrl, weather, owner } = card || {};
  const isItemCreator = currentUser && currentUser.id === card.ownerId;
  return (
    <div className={`modal ${activeModal === "preview" ? "modal_opened" : ""}`}
    onClick={handleBackdropClick}>
      <div className="modal__content modal__content_type_image">
        <button onClick={onClose} type="button" className="modal__close">
          <img src={grayX} alt="Close" className="modal__close-icon" />
        </button>
        <img src={imageUrl} alt="modal-image" className="modal__image" />
        <div className="modal__footer">
          <h2 className="modal__caption">{name}</h2>
          <p className="modal__weather">Weather: {weather}</p>

          {/* conditionally render the delete button based on the current user */}
          {isItemCreator && (
            <button
              onClick={() => onDelete(card)}
              className="modal__delete-button"
            >
              Delete item
            </button>
          )}
          {!isItemCreator && (
            <p className="modal__no-permission">Can't delete. Please log in.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ItemModal;
