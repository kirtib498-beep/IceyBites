const tabs = document.querySelectorAll(".tab");
const cards = document.querySelectorAll(".card");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const productDialog = document.getElementById("productDialog");
const dialogImage = document.getElementById("dialogImage");
const dialogName = document.getElementById("dialogName");
const dialogDesc = document.getElementById("dialogDesc");
const dialogIngredients = document.getElementById("dialogIngredients");
const dialogPrice = document.getElementById("dialogPrice");
const qtyValue = document.getElementById("qtyValue");
const plusQty = document.getElementById("plusQty");
const minusQty = document.getElementById("minusQty");
const closeDialog = document.getElementById("closeDialog");
const addToCartBtn = document.getElementById("addToCartBtn");

const openCartBtn = document.getElementById("openCartBtn");
const cartDialog = document.getElementById("cartDialog");
const closeCartDialog = document.getElementById("closeCartDialog");
const cartItems = document.getElementById("cartItems");
const emptyCartMsg = document.getElementById("emptyCartMsg");
const orderNowBtn = document.getElementById("orderNowBtn");

const loginDialog = document.getElementById("loginDialog");
const closeLoginDialog = document.getElementById("closeLoginDialog");
const cancelLoginBtn = document.getElementById("cancelLoginBtn");
const loginForm = document.getElementById("loginForm");
const loginNamePopup = document.getElementById("loginNamePopup");
const userNameDisplay = document.getElementById("userNameDisplay");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentProduct = null;
let currentQty = 1;
let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function saveLoginState(name) {
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("userName", name);
  isLoggedIn = true;
}

function updateUserName() {
  const savedName = localStorage.getItem("userName");
  userNameDisplay.textContent = savedName ? savedName : "Login";
}

function filterCards(category) {
  cards.forEach((card) => {
    const itemCategory = card.dataset.category;
    card.classList.toggle("hide", !(category === "all" || itemCategory === category));
  });
}

function showAllCards() {
  cards.forEach((card) => card.classList.remove("hide"));
}

function searchCards() {
  const query = searchInput.value.toLowerCase().trim();

  cards.forEach((card) => {
    const title = card.querySelector("h3").textContent.toLowerCase();
    const text = card.textContent.toLowerCase();
    card.classList.toggle("hide", !(query === "" || title.includes(query) || text.includes(query)));
  });

  tabs.forEach((t) => t.classList.remove("active"));
  document.querySelector('.tab[data-filter="all"]').classList.add("active");
}

function renderCart() {
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    emptyCartMsg.style.display = "block";
    orderNowBtn.style.display = "none";
    return;
  }

  emptyCartMsg.style.display = "none";
  orderNowBtn.style.display = "inline-block";

  cart.forEach((item) => {
    const row = document.createElement("div");
    row.classList.add("cart-item");
    row.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-details">
        <h4>${item.name}</h4>
        <p>₹${item.price} x ${item.qty}</p>
      </div>
    `;
    cartItems.appendChild(row);
  });
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    searchInput.value = "";
    filterCards(tab.dataset.filter);
  });
});

searchBtn.addEventListener("click", searchCards);

searchInput.addEventListener("input", () => {
  if (searchInput.value.trim() === "") {
    showAllCards();
    tabs.forEach((t) => t.classList.remove("active"));
    document.querySelector('.tab[data-filter="all"]').classList.add("active");
  } else {
    searchCards();
  }
});

cards.forEach((card) => {
  const openBtn = card.querySelector(".view-btn");

  openBtn.addEventListener("click", () => {
    currentProduct = {
      name: card.dataset.name,
      price: card.dataset.price,
      desc: card.dataset.desc,
      ingredients: card.dataset.ingredients,
      image: card.dataset.image
    };

    currentQty = 1;
    qtyValue.textContent = currentQty;

    dialogImage.src = currentProduct.image;
    dialogImage.alt = currentProduct.name;
    dialogName.textContent = currentProduct.name;
    dialogDesc.textContent = currentProduct.desc;
    dialogIngredients.textContent = currentProduct.ingredients;
    dialogPrice.textContent = currentProduct.price;

    productDialog.showModal();
  });
});

closeDialog.addEventListener("click", () => {
  productDialog.close();
});

productDialog.addEventListener("click", (e) => {
  if (e.target === productDialog) productDialog.close();
});

plusQty.addEventListener("click", () => {
  currentQty += 1;
  qtyValue.textContent = currentQty;
});

minusQty.addEventListener("click", () => {
  if (currentQty > 1) {
    currentQty -= 1;
    qtyValue.textContent = currentQty;
  }
});

addToCartBtn.addEventListener("click", () => {
  if (!isLoggedIn) {
    productDialog.close();
    loginDialog.showModal();
    return;
  }

  const existingItem = cart.find((item) => item.name === currentProduct.name);

  if (existingItem) {
    existingItem.qty += currentQty;
  } else {
    cart.push({
      ...currentProduct,
      qty: currentQty
    });
  }

  saveCart();
  productDialog.close();
  alert(`${currentProduct.name} added to cart`);
});

openCartBtn.addEventListener("click", () => {
  renderCart();
  cartDialog.showModal();
});

closeCartDialog.addEventListener("click", () => {
  cartDialog.close();
});

cartDialog.addEventListener("click", (e) => {
  if (e.target === cartDialog) cartDialog.close();
});

orderNowBtn.addEventListener("click", () => {
  alert("Order placed successfully!");
  cart = [];
  saveCart();
  renderCart();
});

closeLoginDialog.addEventListener("click", () => {
  loginDialog.close();
});

cancelLoginBtn.addEventListener("click", () => {
  loginDialog.close();
});

loginDialog.addEventListener("click", (e) => {
  if (e.target === loginDialog) loginDialog.close();
});

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = loginNamePopup.value.trim();
  saveLoginState(name);
  updateUserName();
  loginDialog.close();
  alert("Signed in successfully.");
});

updateUserName();

window.addEventListener("load", () => {
  if (!isLoggedIn) {
    loginDialog.showModal();
  }
});

filterCards("all");