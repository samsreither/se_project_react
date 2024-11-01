import { useState, useEffect } from "react";
import "./App.css";
import { coordinates, APIkey } from "../../utils/constants";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Main from "../Main/Main";
import AddItemModal from "../AddItemModal/AddItemModal";
import ItemModal from "../ItemModal/ItemModal";
import Profile from "../Profile/Profile";
import { getWeather, filterWeatherData } from "../../utils/weatherApi";
import CurrentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { getItems, addItem, deleteItem } from "../../utils/api";

function App() {
  const [weatherData, setWeatherData] = useState({
    type: "",
    temp: { F: 999 },
    city: "",
  });
  const [activeModal, setActiveModal] = useState("");
  const [selectedCard, setSelectedCard] = useState({});
  const [currentTemperatureUnit, setCurrentTemperatureUnit] = useState("F");
  const [clothingItems, setClothingItems] = useState([]);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);

  const handleAddItemSubmit = (newItem) => {
    return addItem(newItem)
      .then((addedItem) => {
        console.log("Item added:", addedItem);

        setClothingItems((prevItems) => {
          const updatedItems = [addedItem, ...prevItems];
          console.log("Updated clothing items array:", updatedItems);
          return updatedItems;
        });
        closeActiveModal();
      })
      .catch(console.error);
  };

  const handleCardClick = (card) => {
    setActiveModal("preview");
    setSelectedCard(card);
  };

  const handleAddClick = () => {
    setActiveModal("add-garment");
  };

  const closeActiveModal = () => {
    console.log("Modal closed");
    setActiveModal("");
  };

  const handleToggleSwitchChange = () => {
    setCurrentTemperatureUnit((prevUnit) => (prevUnit === "F" ? "C" : "F"));
  };

  const handleCardDelete = (cardToDelete) => {
    deleteItem(cardToDelete._id)
      .then(() => {
        setClothingItems((prevItems) =>
          prevItems.filter((item) => item._id !== cardToDelete._id)
        );
        closeActiveModal;
      })
      .catch(console.error);
  };

  useEffect(() => {
    getWeather(coordinates, APIkey)
      .then((data) => {
        const filteredData = filterWeatherData(data);
        setWeatherData(filteredData);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    getItems()
      .then((data) => {
        console.log("Fetched Items:", data);
        setClothingItems(data);
      })
      .catch(console.error);
  }, []);

  return (
    <CurrentTemperatureUnitContext.Provider
      value={{ currentTemperatureUnit, handleToggleSwitchChange }}
    >
      <Router>
        <div className="page">
          <div className="page__content">
            <Header handleAddClick={handleAddClick} weatherData={weatherData} />
            <Routes>
              <Route
                path="/"
                element={
                  <Main
                    weatherData={weatherData}
                    onCardClick={handleCardClick}
                    clothingItems={clothingItems}
                  />
                }
              ></Route>
              <Route
                path="/profile"
                element={
                  <Profile
                    onCardClick={handleCardClick}
                    onAddClick={handleAddClick}
                    clothingItems={clothingItems}
                  />
                }
              ></Route>
            </Routes>
            <Footer />
          </div>
          
          <AddItemModal
            buttonText="Add garment"
            title="New garment"
            isOpen={activeModal === "add-garment"}
            onCloseModal={closeActiveModal}
            onSubmit={handleAddItemSubmit}
          >
            <label htmlFor="name" className="modal__label">
              Name
              <input
                type="text"
                className="modal__input"
                id="name"
                placeholder="Name"
              />
            </label>
            <label htmlFor="imageUrl" className="modal__label">
              Image
              <input
                type="url"
                className="modal__input"
                id="imageUrl"
                placeholder="Image URL"
              />
            </label>
            <fieldset className="modal__radio-buttons">
              <legend className="modal__legend">
                Select the weather type:
              </legend>

              <label
                htmlFor="hot"
                className="modal__label modal__label_type_radio"
              >
                <input
                  type="radio"
                  className="modal__radio-input"
                  id="hot"
                  name="weather"
                  value="hot"
                />{" "}
                Hot
              </label>

              <label
                htmlFor="warm"
                className="modal__label modal__label_type_radio"
              >
                <input
                  type="radio"
                  className="modal__radio-input"
                  id="warm"
                  name="weather"
                  value="warm"
                />{" "}
                Warm
              </label>

              <label
                htmlFor="cold"
                className="modal__label modal__label_type_radio"
              >
                <input
                  type="radio"
                  className="modal__radio-input"
                  id="cold"
                  name="weather"
                  value="cold"
                />{" "}
                Cold
              </label>
            </fieldset>
          </AddItemModal>
          <ItemModal
            activeModal={activeModal}
            card={selectedCard}
            onClose={closeActiveModal}
            onDelete={handleCardDelete}
          />
        </div>
      </Router>
    </CurrentTemperatureUnitContext.Provider>
  );
}

export default App;
