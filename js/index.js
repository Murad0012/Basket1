import { products } from "./data.js";

const productContainer = document.querySelector(".product-container");

products.forEach((product) => {
  const { id, name, price, imgName } = product;
  let productCard = generateProductCard(id, name, price, imgName);
  productContainer.innerHTML += productCard;
});

function generateProductCard(id, name, price, imgName) {
  let productCard = `
  <div class="col card-container">
    <div class="card" style="width: 18rem">
      <img
        src="./images/${imgName}"
        class="card-img-top"
        alt="${name}"
      />
      <div class="card-body">
        <h5 class="card-title">${name}</h5>
        <p class="card-text">Price: $<span class="price">${price}</span></p>
        <button data-id=${id} class="add-to-basket-btn  btn btn-primary">Add to card</button>
      </div>
    </div>
  </div>`;
  return productCard;
}

let cart = [];

const cartButton = document.getElementById("cartButton");
const cartItems = document.getElementById("cartItems");
const cartTotalPrice = document.getElementById("cartTotalPrice");

function updateCartButton() {
  const totalItemsInCart = cart.reduce((acc, item) => acc + item.count, 0);
  cartButton.textContent = `Cart(${totalItemsInCart})`;
}

function renderCart() {
  cartItems.innerHTML = "";
  let total = 0.00;
  let totalProductPrice = 0.00;

  cart.forEach((item) => {
    const product = products.find((p) => p.id === item.id);

    if (product) {
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");
      cartItem.innerHTML = `
        <span class="productName">${product.name}</span>
        <span class="productPrice">($${product.price.toFixed(2)})</span>
        <div class="buttons">
        <button class="btn btn-sm custom-button decrease-btn" data-id="${item.id}">-</button>
        <button class="productCount">${item.count}</button>
        <button class="btn btn-sm custom-button increase-btn" data-id="${item.id}">+</button>
        </div>
        <button class="btn btn-danger delete-btn" data-id="${item.id}">X</button>
        <span class="productTotalPrice">$${(product.price * item.count).toFixed(2)}</span>
      `;

      cartItems.appendChild(cartItem);

      totalProductPrice += product.price * item.count;
    }
  });

  cartTotalPrice.textContent = totalProductPrice.toFixed(2);
  updateCartButton();


  document.querySelectorAll(".decrease-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.target.getAttribute("data-id"));
      removeFromCart(id);
    });
  });

  document.querySelectorAll(".increase-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.target.getAttribute("data-id"));
      addToCart(id);
    });
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.target.getAttribute("data-id"));
      removeAllFromCart(id);
    });
  });
}

function removeAllFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  renderCart();
  updateCartStorage();
}

function updateCartStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCartFromStorage() {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
}

function addToCart(id) {
  const existingItem = cart.find((item) => item.id === id);
  if (existingItem) {
    existingItem.count++;
  } else {
    cart.push({ id, count: 1 });
  }
  updateCartStorage();
  renderCart();
}

function removeFromCart(id) {
  const itemIndex = cart.findIndex((item) => item.id === id);
  if (itemIndex !== -1) {
    if (cart[itemIndex].count > 1) {
      cart[itemIndex].count--;
    } else {
      cart.splice(itemIndex, 1);
    }
  }
  updateCartStorage();
  renderCart();
}

document.querySelectorAll(".add-to-basket-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const id = parseInt(e.target.getAttribute("data-id"));
    addToCart(id);
  });
});

document.querySelectorAll(".decrease-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const id = parseInt(e.target.getAttribute("data-id"));
    removeFromCart(id);
  });
});

document.querySelectorAll(".delete-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const id = parseInt(e.target.getAttribute("data-id"));
    cart = cart.filter((item) => item.id !== id);
    renderCart();
  });
})

document.querySelector(".btn.btn-danger").addEventListener("click", () => {
  cart = [];
  updateCartStorage();
  renderCart();
})

loadCartFromStorage();

renderCart();