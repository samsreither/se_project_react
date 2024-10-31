import { useState, useEffect } from "react";
import "./App.css";
import { coordinates, APIkey } from "../../utils/constants";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Main from "../Main/Main";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import ItemModal from "../ItemModal/ItemModal";
import Profile from "../Profile/Profile";
import { getWeather, filterWeatherData } from "../../utils/weatherApi";
import CurrentTemperatureUnitContext from "../../utils/CurrentTemperatureUnitContext";
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
    addItem(newItem)
      .then((savedItem) => {
        console.log("Item added:", savedItem);
        setClothingItems([savedItem, ...clothingItems]);
      })
      .catch((error) => {
        console.error("Error adding item:", error);
      });
  };

  const handleCardClick = (card) => {
    setActiveModal("preview");
    setSelectedCard(card);
  };

  const handleAddClick = () => {
    setActiveModal("add-garment");
    setIsAddItemModalOpen(true);
  };

  const closeActiveModal = () => {
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
        setActiveModal("");
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
          </div>
          <Footer />
          <ModalWithForm
            buttonText="Add garment"
            title="New garment"
            isOpen={activeModal === "add-garment"}
            onClose={closeActiveModal}
            onSubmit={(event) => {
              event.preventDefault(); 
              const name = event.target.name.value; 
              const imageUrl = event.target.imageUrl.value; 
              const weatherType = event.target.weatherType.value; 

              const newItem = {
                _id: Date.now(), 
                name,
                imageUrl: imageUrl,
                weatherType,
              };

              handleAddItemSubmit(newItem); 
              closeActiveModal(); 
            }}
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
                  name="weatherType"
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
                  name="weatherType"
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
                  name="weatherType"
                />{" "}
                Cold
              </label>
            </fieldset>
          </ModalWithForm>
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
