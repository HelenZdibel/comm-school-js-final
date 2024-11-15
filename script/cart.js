let cartList = new Map();

function saveToStorage() {
  localStorage.setItem(
    "cartList",
    JSON.stringify(Array.from(cartList.entries()))
  );
}

function loadFromStorage() {
  let cartItems = JSON.parse(localStorage.getItem("cartList"));
  if (cartItems) {
    cartList = new Map(cartItems);
  }
}

function createProductList() {
  const cartContainer = document.getElementById("cart-container");
  cartContainer.innerHTML = "";

  if (cartList.size === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  cartList.forEach((item) => {
    cartContainer.innerHTML += `
      <div class="item">
        <img src="${item.image}" alt="${item.name}" />
        <h4>${item.name}</h4>
        <p>${item.description}</p>
        <p>Price: $${item.price}</p>
        <button data-id="${item.id}" class="remove-btn">Remove</button>
      </div>
    `;
  });
}

function setupCartActions() {
  document
    .getElementById("cart-container")
    .addEventListener("click", function (e) {
      if (e.target.classList.contains("remove-btn")) {
        const productId = parseInt(e.target.dataset.id);
        removeFromCart(productId);
        createProductList();
      }
    });
}

function removeFromCart(productId) {
  cartList.delete(productId);
  saveToStorage();
}

loadFromStorage();
createProductList();
setupCartActions();

