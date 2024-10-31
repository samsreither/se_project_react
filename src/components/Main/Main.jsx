import React from "react";
import "./Main.css";
import WeatherCard from "../WeatherCard/WeatherCard";
import ItemCard from "../ItemCard/ItemCard";

function Main({ weatherData, clothingItems, onCardClick }) {
  return (
    <main>
      <WeatherCard weatherData={weatherData} />
      <section className="cards">
        <p className="cards__text">
          Today is {weatherData.temp.F} &deg; F / You may want to wear:
        </p>
        <ul className="cards__list">
          {clothingItems.length > 0 ? (
            clothingItems
              .filter((item) => item.weather === weatherData.type)
              .map((item) => (
                <ItemCard
                  key={item._id}
                  item={item}
                  onCardClick={onCardClick}
                />
              ))
          ) : (
            <li>No clothing items available.</li>
          )}
        </ul>
      </section>
    </main>
  );
}

export default Main;
