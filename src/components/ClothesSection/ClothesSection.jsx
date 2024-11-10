import { useContext } from 'react';
import CurrentUserContext from '../../contexts/CurrentUserContext';
import ItemCard from "../ItemCard/ItemCard";
import "./ClothesSection.css";



function ClothesSection({ onCardClick, onAddClick, clothingItems }) {
  const currentUser = useContext(CurrentUserContext); // access the current user
  // filter items by owner
  const userClothingItems = clothingItems.filter(item => item.owner === currentUser?._id);


  return (
    <div className="clothes-section">
      <div className="clothes-section__labels">
        <p className="clothes-section__text">Your items</p>
        <button className="clothes-section__add-btn" onClick={onAddClick}>
          + Add New
        </button>
      </div>

      <ul className="clothes-section__items">
        {clothingItems.length > 0 ? (
          clothingItems.map((item) => {
            console.log(item);
            return (
            <ItemCard key={item._id} item={item} onCardClick={onCardClick} />
          );
        })
        ) : (
          // need to style this section
          <li className="clothes-section__no-items">No clothing items available.</li>
        )}
      </ul>
    </div>
  );
}

export default ClothesSection;
