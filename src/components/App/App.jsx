import { useState, useEffect, useContext } from "react";
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
import { addCardLike, removeCardLike } from "../../utils/auth";

function App() {
  const currentUser = useContext(CurrentUserContext);
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

  // function to toggle between Login and Register modals
  const toggleModal = () => {
    setActiveModal((prevModal) => (prevModal === "login" ? "register" : "login"));
  };

  const handleLogin = (data) => {
    return login(data)
    .then((res) => {
      if (res.token) {
        localStorage.setItem("jwt", res.token);
        return checkToken(res.token);
      } else {
        throw new Error("Login failed: No token returned");
      }
    })
    .then((userData) => {
      setUser(userData);
      console.log('user is...',user);
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
    const token = localStorage.getItem("jwt");
    
    checkToken(token)
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
      addCardLike(id, token)
        .then((updatedCard) => {
          setClothingItems((cards) =>
            cards.map((item) => (item._id === id ? updatedCard.data : item))
          );
          console.log("Item liked", updatedCard);
        })
        .catch((err) => console.log(err));
    } else {
      // Remove like - send request to remove user's ID from card likes array
      removeCardLike(id, token)
        .then((updatedCard) => {
          setClothingItems((cards) =>
            cards.map((item) => (item._id === id ? updatedCard.data : item))
          );
        })
        .catch((err) => console.log(err));
    }
  };

  const handleAddItemSubmit = (newItem) => {
    const token = localStorage.getItem("jwt");
    console.log('adding item to mongo', newItem);
    return addItem(newItem,token).then((addedItem) => {
      console.log('item added to mongo', addedItem);
      setClothingItems((prevItems) => [addedItem.data, ...prevItems]);
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
    const token = localStorage.getItem("jwt");
    if (!token) {
      console.error("No token found, cannot delete item");
      return;
    }

    checkToken(token)
      .then(() => {
        const itemId = cardToDelete.data ? cardToDelete.data._id : cardToDelete._id;
        
        deleteItem(itemId, token)
          .then(() => {
            // update state to reflect deletion of the item
            setClothingItems((prevItems) => {
              const filteredItems = prevItems.filter((item) => {
                return item.data && item.data._id !== itemId;
              });
              return filteredItems;
            }
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
    getItems()
      .then((data) => {
        // If user is logged in, filter items by the user's ID
        if (isLoggedIn && user) {
          const userItems = data.filter((item) => item.owner === user._id);
          setClothingItems(userItems);
        } else {
          // Show all items when no user is logged in
          setClothingItems(data);
        }
      })
      .catch(console.error);
  }, [isLoggedIn, user]); // refetch when login status or user data changes

  // Log the active modal state every time it changes
  useEffect(() => {
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
                      setUser={setUser}
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
                onToggleModal={toggleModal}
                error={error}
            />
            )}
            {activeModal === "login" && (
            <LoginModal
                isOpen={activeModal === "login"}
                onLogin={handleLogin}
                onCloseModal={closeActiveModal}
                onToggleModal={toggleModal}
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
