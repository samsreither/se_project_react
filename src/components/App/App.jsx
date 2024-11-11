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

  const handleRegister = (data) => {
    return register(data) // Register the user
      .then((newUser) => {
        // newUser is returned from the register function
        return login({ email: data.email, password: data.password })
          .then((res) => {
            if (res.token) {
              // Successfully logged in, save the JWT token to localStorage
              localStorage.setItem("jwt", res.token);
              console.log("Token saved after login:", localStorage.getItem("jwt")); // log the token
              
              // After login, set the user data (newUser from register)
              setUser(newUser);  // store user data after registration
  
              // set the logged-in state
              setIsLoggedIn(true);
              
              closeActiveModal();
            } else {
              throw new Error("Login failed: No token returned");
            }
          });
      })
      .catch((error) => {
        console.error("Error during registration or login:", error);
        setError("Registration or login failed. Please try again.");
      });
  };

  const handleLogin = (data) => {
    return login(data)
    .then((res) => {
      if (res.token) {
        localStorage.setItem("jwt", res.token);
        console.log("Token saved after login:", localStorage.getItem("jwt"));
        return checkToken(res.token);
      } else {
        throw new Error("Login failed: No token returned");
      }
    })
    .then((userData) => {
      setUser(userData);
      console.log(user);
      setIsLoggedIn(true);
      closeActiveModal();
    })
    .catch((error) => {
      console.error("Error during login:", error);
      setError("Login failed. Please try again");
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
      // Add like - send request to add user's ID to card likes array
      api
        .addCardLike(id, token)
        .then((updatedCard) => {
          setClothingItems((cards) =>
            cards.map((item) => (item._id === id ? updatedCard : item))
          );
        })
        .catch((err) => console.log(err));
    } else {
      // Remove like - send request to remove user's ID from card likes array
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
    const token = localStorage.getItem("jwt");
    console.log("Token retrieved for addItem:", token);
    return addItem(newItem,token).then((addedItem) => {
      setClothingItems((prevItems) => [addedItem, ...prevItems]);
      closeActiveModal();
    });
  };

  const handleCardClick = (card) => {
    console.log('Card clicked:', card);
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
    const token = localStorage.getItem("jwt");

    if (!token) {
      console.error("No token found, cannot delete item");
      return;
    }

    checkToken(token)
      .then(() => {
        console.log("Attempting to delete item with ID:", cardToDelete._id);
        deleteItem(cardToDelete.data._id, token)
          .then(() => {
            setClothingItems((prevItems) =>
              prevItems.filter((item) => item.data._id !== cardToDelete.data._id)
            );
            closeActiveModal();
          })
          .catch((error) => {
            console.error("Error deleting item:", error);
          });
      })
      .catch((error) => {
        console.error("Token verification failed:", error);
      });
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
            <LoginModal
                isOpen={activeModal === "login"}
                onLogin={handleLogin}
                onCloseModal={closeActiveModal}
            />
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
