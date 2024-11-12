import React, { useContext } from "react";
import "./ItemCard.css";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import likeImage from "../../assets/like-image.svg";
import likedImage from "../../assets/liked-image.svg";

function ItemCard({ item, onCardClick, onCardLike }) {
  const { name, imageUrl, Likes } = item || {};
  const currentUser = useContext(CurrentUserContext);

  // check if current user's id is in the item.likes array
  const isLiked = Array.isArray(item.likes) && item.likes.some((id) => id === currentUser?._id);
  const handleCardClick = () => {
    onCardClick(item);
  };

  const handleLike = (event) => {
    event.stopPropagation();
    if (currentUser) {
      console.log("like button clicked");

      onCardLike({ id: item._id, isLiked }); // call oncardlike with items id and whether it's liked
      console.log(isLiked);
    }
  };

  // set button style based on like status
  const itemLikeButtonClassName = isLiked ? "like-button liked" : "like-button";

  return (
    <li className="card" onClick={handleCardClick}>
      <div className="card__header">
        <h2 className="card__name">{name}</h2>
        {currentUser && (
        <button className={itemLikeButtonClassName} onClick={handleLike}>
            <img 
            src={isLiked ? likedImage : likeImage} alt={isLiked ? "Unlike" : "Like"} className="like-button__icon" 
            />
        </button>
        )}
      </div>
      <img className="card__image" src={imageUrl} alt={name} />
    </li>
  );
}

export default ItemCard;
