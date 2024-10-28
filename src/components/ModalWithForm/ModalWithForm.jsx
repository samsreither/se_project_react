import "./ModalWithForm.css";
import grayX from "../../assets/grayX.svg";

function ModalWithForm({ children, buttonText, title, activeModal, onClose }) {
    return (
        <div className={`modal ${activeModal === "add-garment" ? "modal__opened" : ""}`}>
            <div className="modal__content">
                <h2 className="modal__title">{title}</h2>
                <button 
                    onClick={onClose} 
                    type="button" 
                    className="modal__close"
                >
                    <img src={grayX} alt="Close" className="modal__close-icon" />
                </button>
                <form action="" className="modal__form">
                    {children}
                    <button type="submit" className="modal__submit">
                        {buttonText}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ModalWithForm;