import React, { useContext } from "react";
import "./ItemCard.css";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function ItemCard({ item, onCardClick }) {
  const currentUser = useContext(CurrentUserContext);
  // check if current user's id is in the item.likes array
  const isLiked = item.likes.some((id) => id === currentUser?.id);

  const handleCardClick = () => {
    onCardClick(item);
  };

  const handleLike = () => {
    if (currentUser) {
      onCardLike({ id: item._id, isLiked }); // call oncardlike with items id and whether it's liked
    }
  };

  // set button style based on like status
  const itemLikeButtonClassName = isLiked ? "like-button liked" : "like-button";

  return (
    <li className="card" onClick={handleCardClick}>
      <h2 className="card__name">{item.name}</h2>
      <img className="card__image" src={item.imageUrl} alt={item.name} />

      {/* Like button */}
      {currentUser && (
        <button
          className={itemLikeButtonClassName}
          onClick={handleLike}
        >
          {isLiked ? "Unlike" : "Like"}
        </button>
      )}
    </li>
  );
}

export default ItemCard;
