import { BASE_URL } from "./constants";

function checkResponse(res) {
  if (res.ok) {
    return res.json();
  } else {
    return Promise.reject(`Error: ${res.status}`);
  }
}

function getItems() {
  return fetch(`${BASE_URL}/items`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(checkResponse)
    .catch((error) => {
      console.error("Failed to fetch items:", error);
      throw error;
    });
}

function addItem(item, token) {
  console.log("Adding item:", item);
  return fetch(`${BASE_URL}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`, // include token for authorization
    },
    body: JSON.stringify(item),
  })
    .then(checkResponse)
    .catch((error) => {
      console.error("Failed to add item:", error);
      throw error;
    });
}

function deleteItem(id, token) {
  return fetch(`${BASE_URL}/items/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  })
    .then(checkResponse)
    .catch((error) => {
      console.error("Failed to delete item:", error);
      throw error;
    });
}

export { checkResponse, getItems, addItem, deleteItem };
