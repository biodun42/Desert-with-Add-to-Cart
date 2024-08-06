let divOne = document.getElementById("all-desert");
let cartTotal = 0;
let itemCount = 0;
let cartItems = []; // Array to hold items added to the cart

function updateItemCount() {
  document.getElementById("it").innerText = `Your Cart (${itemCount})`;
}

async function getData() {
  try {
    let response = await fetch("./data.json");
    let data = await response.json();
    data.map((item, index) => {
      divOne.innerHTML += `
        <div class="each-desert" data-index="${index}">
          <img class="des" src="${item.image.desktop}" alt="desert">
          <button id="btn1-${index}" onclick="addToCart(${index})" class="btn1">
            <img src="assets/images/icon-add-to-cart.svg" alt="" />Add to Cart
          </button>
          <button id="btn2-${index}" class="btn2" style="display: none;">
            <img src="assets/images/icon-decrement-quantity.svg" onclick="decrementQuantity(${index})" alt="" />
            <span id="quantity-display-${index}">1</span>
            <img src="assets/images/icon-increment-quantity.svg" onclick="incrementQuantity(${index})" alt="" />
          </button>
          <h4 class="category">${item.category}</h4>
          <h3 class="name">${item.name}</h3>
          <p class="price">$${item.price.toFixed(2)}</p>
        </div>
      `;
    });
  } catch (error) {
    console.log(error);
  }
}

getData();

function addToCart(index) {
  const zeroItems = document.querySelector(".nothing");
  let cart = document.getElementById("Cart-item");
  let total = document.getElementById("Cart-item-2");

  total.classList.remove("active");
  const item = document.querySelector(`.each-desert[data-index="${index}"]`);
  const category = item.querySelector(".category").innerText;
  const price = parseFloat(item.querySelector(".price").innerText.substring(1));

  cartTotal += price;
  itemCount++;

  cartItems.push({ index, price, quantity: 1 });

  const btn1 = document.getElementById(`btn1-${index}`);
  const btn2 = document.getElementById(`btn2-${index}`);
  btn1.classList.add("active");
  btn2.style.display = "flex";

  zeroItems.classList.add("active");
  cart.innerHTML += `
    <div class="list" data-index="${index}" data-price="${price}">
      <div class="item-name">
        <h4>${category}</h4>
        <div class="pricing">
          <p id="quantity-${index}">1x</p>
          <span class="span1">@ $${price.toFixed(2)}</span>
          <span id="total-${index}" class="span2">$${price.toFixed(2)}</span>
        </div>
      </div>
      <img onclick="removeItem(this, ${price}, ${index})" src="assets/images/icon-remove-item.svg" alt="" />
    </div>
    <hr />
  `;

  updateTotal();
  updateItemCount();
}

function updateTotal() {
  let total = document.getElementById("Cart-item-2");
  total.innerHTML = `
    <div class="Total">
      <h3>Order Total</h3>
      <h1>$${cartTotal.toFixed(2)}</h1>
    </div>
    <button onclick="confirmOrder()" class="btn-2">Confirm Order</button>
  `;
}

function removeItem(element, price, index) {
  let cart = document.getElementById("Cart-item");
  const itemDiv = element.closest(".list");
  let total = document.getElementById("Cart-item-2");

  const quantity = parseInt(
    document
      .getElementById(`quantity-${index}`)
      .innerText.replace("x", "")
      .trim()
  );
  const itemTotalPrice = price * quantity;

  cartTotal -= itemTotalPrice;
  itemCount -= quantity;

  cartItems = cartItems.filter((item) => item.index !== index);

  if (
    itemDiv.nextElementSibling &&
    itemDiv.nextElementSibling.tagName === "HR"
  ) {
    itemDiv.nextElementSibling.remove();
  }
  itemDiv.remove();

  updateTotal();
  updateItemCount();

  if (cart.children.length === 0) {
    const zeroItems = document.querySelector(".nothing");
    zeroItems.classList.remove("active");
    total.innerHTML = "";
  }

  const btn1 = document.getElementById(`btn1-${index}`);
  const btn2 = document.getElementById(`btn2-${index}`);
  btn1.classList.remove("active");
  btn2.style.display = "none";
}

function incrementQuantity(index) {
  const item = document.querySelector(`.each-desert[data-index="${index}"]`);
  const price = parseFloat(item.querySelector(".price").innerText.substring(1));

  const quantityElement = document.getElementById(`quantity-${index}`);
  const quantityDisplayElement = document.getElementById(
    `quantity-display-${index}`
  );
  let quantity = parseInt(quantityElement.innerText.replace("x", "").trim());
  quantity++;
  quantityElement.innerText = `${quantity}x`;
  quantityDisplayElement.innerText = `${quantity}`;

  const totalElement = document.getElementById(`total-${index}`);
  const newTotal = price * quantity;
  totalElement.innerText = `$${newTotal.toFixed(2)}`;

  cartTotal += price;
  itemCount++;

  cartItems.find((item) => item.index === index).quantity = quantity;

  updateTotal();
  updateItemCount();
}

function decrementQuantity(index) {
  const item = document.querySelector(`.each-desert[data-index="${index}"]`);
  const price = parseFloat(item.querySelector(".price").innerText.substring(1));

  const quantityElement = document.getElementById(`quantity-${index}`);
  const quantityDisplayElement = document.getElementById(
    `quantity-display-${index}`
  );
  let quantity = parseInt(quantityElement.innerText.replace("x", "").trim());
  if (quantity > 1) {
    quantity--;
    quantityElement.innerText = `${quantity}x`;
    quantityDisplayElement.innerText = `${quantity}`;

    const totalElement = document.getElementById(`total-${index}`);
    const newTotal = price * quantity;
    totalElement.innerText = `$${newTotal.toFixed(2)}`;

    cartTotal -= price;
    itemCount--;

    cartItems.find((item) => item.index === index).quantity = quantity;
  } else {
    removeItem(
      document.querySelector(
        `.list[data-index="${index}"] img[onclick^="removeItem"]`
      ),
      price,
      index
    );
  }

  if (cart.children.length === 0) {
    const zeroItems = document.querySelector(".nothing");
    zeroItems.classList.remove("active");
    total.innerHTML = "";
  }

  updateTotal();
  updateItemCount();
}

function modal() {
  let modal = document.querySelector(".modal");
  modal.classList.add("active");
}

window.onload = modal();

function confirmOrder() {
  const section = document.querySelector("section");
  let modal = document.querySelector(".modal");

  section.classList.add("active");
  modal.classList.remove("active");

  let orderDetails = cartItems
    .map((item) => {
      let itemElement = document.querySelector(
        `.each-desert[data-index="${item.index}"]`
      );
      let itemName = itemElement.querySelector(".category").innerText;
      let itemImage = itemElement.querySelector(".des").src;
      let itemQuantity = item.quantity;
      let itemPrice = item.price * itemQuantity;

      return `
      <div class="arrange">
        <div class="it-image">
          <img src="${itemImage}" alt="" />
          <div class="it-name">
            <h3>${itemName}</h3>
            <div class="amount">
              <h4>${itemQuantity}x</h4>
              <p>$${item.price.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <h5>$${itemPrice.toFixed(2)}</h5>
      </div>
      <hr />
    `;
    })
    .join("");

  modal.innerHTML = `
  <div class="modal-window">
    <img src="assets/images/icon-order-confirmed.svg" alt="" />
    <h1>Order Confirmed</h1>
    <p>We hope you enjoy your food</p>
    <div class="Orders">
      ${orderDetails}
      <div class="tt-price">
        <h4>Order Total</h4>
        <h1>$${cartTotal.toFixed(2)}</h1>
      </div>
      <button onclick="startNewOrder()" class="btn3">Start New Order</button>
    </div>
  </div>
  `;
}

function startNewOrder() {
  const section = document.querySelector("section");
  const zeroItems = document.querySelector(".nothing");

  let modal = document.querySelector(".modal");
  let cart = document.getElementById("Cart-item");
  let total = document.getElementById("Cart-item-2");
  let btn1 = document.querySelectorAll(".btn1");
  let btn2 = document.querySelectorAll(".btn2");

  btn1.forEach((btn) => {
    btn.classList.remove("active");
  });
  btn2.forEach((btn) => {
    btn.style.display = "none";
  });

  modal.classList.remove("active");
  zeroItems.classList.remove("active");
  cart.innerHTML = "";
  total.classList.add("active");
  cartTotal = 0;
  itemCount = 0;
  cartItems = [];

  updateTotal();
  updateItemCount();

  section.classList.remove("active");
  modal.classList.remove("active");
  modal.innerHTML = "";
}
