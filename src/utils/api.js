const baseUrl = "http://localhost:3001";

function checkResponse(res) {
  if (res.ok) {
    return res.json();
  } else {
    return Promise.reject(`Error: ${res.status}`);
  }
}

function getItems() {
  return fetch(`${baseUrl}/items`)
    .then(checkResponse)
    .catch((error) => {
      console.error("Failed to fetch items:", error);
      throw error;
    });
}

function addItem(item) {
  console.log("Adding item:", item);
  return fetch(`${baseUrl}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  })
    .then(checkResponse)
    .catch((error) => {
      console.error("Failed to add item:", error);
      throw error;
    });
}

function deleteItem(id) {
  return fetch(`${baseUrl}/items/${id}`, {
    method: "DELETE",
  })
    .then(checkResponse)
    .catch((error) => {
      console.error("Failed to delete item:", error);
      throw error;
    });
}

export { checkResponse, getItems, addItem, deleteItem };
