let products = []; //მერე დაემატება პროდუქტი
let cartList = new Map(); 
let searchInput = document.querySelector("input[type=search]"); 
let productList = document.getElementById("product-list");

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

function createProductList(items) {
  productList.innerHTML = ""; // მონაცემების განახლება წაშლით
  items.forEach(function (item) {
    //პროდუქტები სხვა ფაილიდან
    let itemHTML = itemToHTML(item);
    productList.innerHTML += itemHTML;
  });

  // ვამაგრებ EventListener ყოველ ჯერზე, როცა პროდუქტის სია შეიქმნება
  let addToCartButtons = document.querySelectorAll(".item button");
  addToCartButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      let productId = parseInt(this.dataset.id);
      addToCart(productId);
    });
  });
}

function itemToHTML(item) {
  let btnTxt = checkInCart(item.id) ? "Remove from Cart" : "Add to Cart";
  let itemHTML = `<div class="item">
                <img src="${item.image}" alt="${item.name}" />
                <h4 class="item-title">${item.name}</h4>
                <p>${item.description}</p>
                <p class="item-price">$${item.price}</p>
                <button data-id='${item.id}'>${btnTxt}</button>
            </div>`;
  return itemHTML;
}

function checkInCart(productId) {
  loadFromStorage(); // კალათიდან განახლებული ინფორმაციის წამორება
  return cartList.has(productId); 
}

function filterByProductName(productName) {
  if (productName.length === 0) {
    createProductList(products);
    return;
  }

  let filteredItems = products.filter(function (item) {
    return item.name.toLowerCase().includes(productName);
  });

  if (filteredItems.length > 0) {
    createProductList(filteredItems);
  } else {
    productList.innerHTML = "<p>No products found.</p>";
  }
}

function addToCart(productId) { 
  //ღილაკის ფუნქციის განსაზღვრა
  let product = products.find(function (item) {
    return item.id === productId; 
  });

  if (product) {
    if (cartList.has(productId)) {
      // თუ პროდუქტი უკვე არის კალათაში, მაშინ დაკლიკენა წაშლის
      cartList.delete(productId);
     
    } else {
      cartList.set(productId, product);
      
    }
    saveToStorage();
    createProductList(products); // განახლება HTML
  }
}

// საწყისი წერტილი
fetch("./script/dummy.json")
  .then((data) => data.json())
  .then((data) => {
    products = data;
    createProductList(products); 
  });


searchInput.addEventListener("keyup", function () {
  let productName = this.value.toLowerCase();
  filterByProductName(productName);
});
