import ItemCard from "../ItemCard/ItemCard";
import "./ClothesSection.css";

function ClothesSection({ onCardClick, onAddClick, clothingItems }) {
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
          clothingItems.map((item) => (
            <ItemCard key={item._id} item={item} onCardClick={onCardClick} />
          ))
        ) : (
          <li>No clothing items available.</li>
        )}
      </ul>
    </div>
  );
}

export default ClothesSection;
