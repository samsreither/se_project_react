import { useContext } from 'react';
import CurrentUserContext from '../../contexts/CurrentUserContext';
import "./ItemModal.css";
import whiteX from "../../assets/whiteX.svg";


function ItemModal({ activeModal, onClose, card, onDelete }) {

  // access current user from context
  const currentUser = useContext(CurrentUserContext);

  const isItemCreator = currentUser && currentUser.id === card.ownerId;

  return (
    <div className={`modal ${activeModal === "preview" ? "modal_opened" : ""}`}>
      <div className="modal__content modal__content_type_image">
        <button onClick={onClose} type="button" className="modal__close">
          <img src={whiteX} alt="Close" className="modal__close-icon" />
        </button>
        <img src={card.imageUrl} alt="modal-image" className="modal__image" />
        <div className="modal__footer">
          <h2 className="modal__caption">{card.name}</h2>
          <p className="modal__weather">Weather: {card.weather}</p>

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
            <p className="modal__no-permission">You cannot delete this item.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ItemModal;
