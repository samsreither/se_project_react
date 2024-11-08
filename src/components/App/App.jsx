import { useState, useEffect } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import CurrentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import RegisterModal from "../RegisterModal/RegisterModal";
import LoginModal from "../LoginModal/LoginModal";
import { register, login, checkToken } from "../../utils/auth";
import "./App.css";
import { coordinates, APIkey } from "../../utils/constants";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Main from "../Main/Main";
import AddItemModal from "../AddItemModal/AddItemModal";
import ItemModal from "../ItemModal/ItemModal";
import Profile from "../Profile/Profile";
import { getWeather, filterWeatherData } from "../../utils/weatherApi";
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
  const [user, setUser] = useState(null); // holds user data if authenticated
  const [error, setError] = useState(null); // holds any authentication errors
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // functions to open the modals
  const openRegisterModal = () => setActiveModal("register");
  const openLoginModal = () => setActiveModal("login");

  // handler for registration
  const handleRegister = (data) => {
    return register(data)
      .then((newUser) => {
        localStorage.setItem("jwt", data.token);
        console.log("Token saved after login:", localStorage.getItem("jwt")); // log the stored item
        setUser(newUser); // store user data on successful registration
        closeActiveModal();
      })
      .catch(setError);
  };

  // handler for login
  const handleLogin = (data) => {
    return login(data)
      .then((loggedInUser) => {
        localStorage.setItem("jwt", data.token);
        console.log("Token saved after login:", localStorage.getItem("jwt")); // log the stored item
        setUser(loggedInUser); // store user data on successful login
        setIsLoggedIn(true);
        closeActiveModal();
      })
      .catch((err) => {
        setError(err.response ? err.response.data.message : "Login failed");
      });
  };
  // check for token on App load
  useEffect(() => {
    checkToken()
      .then((user) => {
        setUser(user); // set user if token is valid
        setIsLoggedIn(true);
      })
      .catch((err) => {
        setIsLoggedIn(false);
        setUser(null);
      });
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("jwt"); // remove token from local storage
    setUser(null); // reset user state to null
    setIsLoggedIn(false);
  };

  const handleCardLike = ({ id, isLiked }) => {
    const token = localStorage.getItem("jwt");

    if (!isLiked) {
      // Add like
      api
        .addCardLike(id, token)
        .then((updatedCard) => {
          setClothingItems((cards) =>
            cards.map((item) => (item._id === id ? updatedCard : item))
          );
        })
        .catch((err) => console.log(err));
    } else {
      // Remove like
      api
        .removeCardLike(id, token)
        .then((updatedCard) => {
          setClothingItems((cards) =>
            cards.map((item) => (item._id === id ? updatedCard : item))
          );
        })
        .catch((err) => console.log(err));
    }
  };

  const handleAddItemSubmit = (newItem) => {
    return addItem(newItem).then((addedItem) => {
      setClothingItems((prevItems) => [addedItem, ...prevItems]);
      closeActiveModal();
    });
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
    if (user && user.token) {
      deleteItem(cardToDelete._id)
        .then(() => {
          setClothingItems((prevItems) =>
            prevItems.filter((item) => item._id !== cardToDelete._id)
          );
          closeActiveModal();
        })
        .catch(console.error);
    } else {
      console.error("No token found, cannot delete item");
    }
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
    if (user && user.token) {
      getItems()
        .then((data) => {
          console.log("Fetched Items:", data);
          setClothingItems(data);
        })
        .catch(console.error);
    }
  }, [user]); // only fetch items when user is logged in

  // Log the active modal state every time it changes
  useEffect(() => {
    console.log("Active Modal:", activeModal);
  }, [activeModal]);

  return (
    <CurrentUserContext.Provider value={user}>
      <CurrentTemperatureUnitContext.Provider
        value={{ currentTemperatureUnit, handleToggleSwitchChange }}
      >
        <Router>
          <div className="page">
            <div className="page__content">
              <Header
                handleAddClick={handleAddClick}
                weatherData={weatherData}
                openRegisterModal={openRegisterModal}
                openLoginModal={openLoginModal}
              />
              <Routes>
                <Route
                  path="/"
                  element={
                    <Main
                      weatherData={weatherData}
                      onCardClick={handleCardClick}
                      onCardLike={handleCardLike}
                      clothingItems={clothingItems}
                    />
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <Profile
                      onCardClick={handleCardClick}
                      onAddClick={handleAddClick}
                      clothingItems={clothingItems}
                      onCardLike={handleCardLike}
                      onSignOut={handleSignOut}
                    />
                  }
                />
              </Routes>
            </div>

            {/* Modals */}
            {activeModal === "register" && (
              <RegisterModal
                isOpen={activeModal === "register"}
                onRegister={handleRegister}
                onCloseModal={closeActiveModal}
                error={error}
              />
            )}
            <AddItemModal
              buttonText="Add garment"
              title="New garment"
              isOpen={activeModal === "add-garment"}
              onCloseModal={closeActiveModal}
              onSubmit={handleAddItemSubmit}
            />
            <ItemModal
              activeModal={activeModal}
              card={selectedCard}
              onClose={closeActiveModal}
              onDelete={handleCardDelete}
            />
            <Footer />
          </div>
        </Router>
      </CurrentTemperatureUnitContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default App;
