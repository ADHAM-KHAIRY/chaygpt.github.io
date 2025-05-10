let productData = null;

document.addEventListener("DOMContentLoaded", function () {
  // Add custom styles for buttons
  addCustomStyles();

  // Load cart items
  loadCartItems();
  setupEventListeners();
});
function addCustomStyles() {
  const styleElement = document.createElement("style");
  styleElement.textContent = `
        /* Quantity control buttons */
        .quantity-controls {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .decrease-btn, .increase-btn {
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #4a6741;
            color: black;
            border: none;
            border-radius: 50%;
            font-size: 18px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .decrease-btn:hover, .increase-btn:hover {
            background-color: #3a5331;
            transform: scale(1.05);
        }
        
        .quantity {
            font-weight: bold;
            min-width: 20px;
            text-align: center;
        }
        
        /* Remove button */
        .remove-btn {
            background-color: #e74c3c;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 6px 12px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 8px;
        }
        
        .remove-btn:hover {
            background-color: #c0392b;
            transform: scale(1.05);
        }
        
        .remove-btn::before {
            content: "×";
            margin-right: 5px;
            font-size: 16px;
            font-weight: bold;
        }
        
        /* Cart item container */
        .cart-item {
            padding: 15px;
            border-bottom: 1px solid #eee;
            display: grid;
            grid-template-columns: auto 1fr auto;
            gap: 15px;
            align-items: center;
        }
        
        .cart-item-image img {
            max-width: 80px;
            border-radius: 8px;
        }
        
        .cart-item-details h3 {
            margin-top: 0;
            margin-bottom: 8px;
            color: #333;
        }
        
        .item-price {
            font-weight: bold;
            color: #4a6741;
            margin: 5px 0;
        }
        
        .item-options {
            font-size: 14px;
            color: #666;
        }
        
        .item-total {
            font-weight: bold;
            color: #4a6741;
            margin: 10px 0;
        }
        
        /* Responsive cart items */
        @media (max-width: 600px) {
            .cart-item {
                grid-template-columns: 1fr;
                text-align: center;
            }
            
            .cart-item-image img {
                max-width: 120px;
                margin: 0 auto;
            }
            
            .quantity-controls {
                justify-content: center;
                margin: 10px 0;
            }
        }
    `;
  document.head.appendChild(styleElement);
}

function updateCartCount() {
  const cartCountElement = document.querySelector(".cart-count");
  if (!cartCountElement) return;

  try {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    // Calculate total quantity by summing all item quantities
    const totalQuantity = cart.reduce(
      (total, item) => total + item.quantity,
      0
    );
    cartCountElement.textContent = totalQuantity;
  } catch (error) {
    console.error("Error updating cart count:", error);
  }
}

/**
 * Loads and displays cart items from localStorage
 * Fetches product data if needed
 */
async function loadCartItems() {
  const cartItemsContainer = document.getElementById("cart-items-container");
  const emptyCartMessage = document.querySelector(".empty-cart-message");

  updateCartCount();

  try {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
      if (emptyCartMessage) emptyCartMessage.style.display = "block";
      updateTotals(0, 0);
      return;
    }

    if (emptyCartMessage) emptyCartMessage.style.display = "none";

    if (!productData) {
      const response = await fetch("../products/product.json");
      if (!response.ok) throw new Error("Failed to fetch product data");
      const data = await response.json();
      productData = data.products;
    }

    if (!cartItemsContainer) throw new Error("Cart container not found");

    cartItemsContainer.innerHTML = "";

    let totalQuantity = 0;
    let totalPrice = 0;

    cart.forEach((cartItem, index) => {
      const product = productData.find((p) => p.id === cartItem.id);

      if (product) {
        const itemTotal = product.price * cartItem.quantity;
        totalQuantity += cartItem.quantity;
        totalPrice += itemTotal;

        // Create cart item element
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("cart-item");
        cartItemElement.dataset.index = index;

        cartItemElement.innerHTML = `
                    <div class="cart-item-image">
                        <img src="../../images/products/${
                          product.image
                        }" alt="${product.name}">
                    </div>
                    <div class="cart-item-details">
                        <h3>${product.name}</h3>
                        <p class="item-price">${product.price.toFixed(
                          2
                        )} EGP</p>
                        <p class="item-options">
                            ${cartItem.size ? `Size: ${cartItem.size}` : ""}
                            ${
                              cartItem.milkOption &&
                              cartItem.milkOption !== "Regular"
                                ? `, Milk: ${cartItem.milkOption}`
                                : ""
                            }
                        </p>
                    </div>
                    <div class="cart-item-actions">
                        <p class="item-total">${itemTotal.toFixed(2)} EGP</p>
                        <div class="quantity-controls">
                            <button class="decrease-btn" type="button">-</button>
                            <span class="quantity">${cartItem.quantity}</span>
                            <button class="increase-btn" type="button">+</button>
                        </div>
                        <button class="remove-btn" type="button">Remove</button>
                    </div>
                `;

        cartItemsContainer.appendChild(cartItemElement);
      }
    });

    updateTotals(totalQuantity, totalPrice);
  } catch (error) {
    console.error("Error loading cart items:", error);
    if (cartItemsContainer) {
      cartItemsContainer.innerHTML = `<p class="error">Error loading cart items: ${error.message}</p>`;
    }
  }
}

function updateTotals(quantity, price) {
  const totalQuantityElement = document.querySelector(".totalQuantity");
  const totalPriceElement = document.querySelector(".totalPrice");

  if (totalQuantityElement) totalQuantityElement.textContent = quantity;
  if (totalPriceElement)
    totalPriceElement.textContent = `${price.toFixed(2)} EGP`;
}

function setupEventListeners() {
  const cartItemsContainer = document.getElementById("cart-items-container");
  const checkoutButton = document.getElementById("checkout-button");

  if (cartItemsContainer) {
    cartItemsContainer.addEventListener("click", function (event) {
      // Handle decrease button
      if (event.target.classList.contains("decrease-btn")) {
        const cartItem = event.target.closest(".cart-item");
        if (cartItem) {
          const index = parseInt(cartItem.dataset.index);
          changeQuantity(index, -1);
        }
      }

      // Handle increase button
      if (event.target.classList.contains("increase-btn")) {
        const cartItem = event.target.closest(".cart-item");
        if (cartItem) {
          const index = parseInt(cartItem.dataset.index);
          changeQuantity(index, 1);
        }
      }

      // Handle remove button
      if (event.target.classList.contains("remove-btn")) {
        const cartItem = event.target.closest(".cart-item");
        if (cartItem) {
          const index = parseInt(cartItem.dataset.index);
          removeCartItem(index);
        }
      }
    });
  }

  if (checkoutButton) {
    checkoutButton.addEventListener("click", handleCheckout);
  }

  setupFormValidation();
}

function changeQuantity(index, change) {
  try {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart[index]) {
      cart[index].quantity += change;

      if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
      }

      localStorage.setItem("cart", JSON.stringify(cart));

      updateCartCount();

      setTimeout(() => loadCartItems(), 100);
    }
  } catch (error) {
    console.error("Error changing quantity:", error);
  }
}

function removeCartItem(index) {
  try {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (index >= 0 && index < cart.length) {
      cart.splice(index, 1);

      localStorage.setItem("cart", JSON.stringify(cart));

      updateCartCount();

      setTimeout(() => loadCartItems(), 100);
    }
  } catch (error) {
    console.error("Error removing item:", error);
  }
}

function setupFormValidation() {
  const formFields = [
    document.getElementById("fullName"),
    document.getElementById("phone"),
    document.getElementById("address"),
    document.getElementById("city"),
    document.getElementById("area"),
  ];

  formFields.forEach((field) => {
    if (field) {
      field.addEventListener("blur", function () {
        validateInput(this);
      });

      field.addEventListener("input", function () {
        const errorElement = this.nextElementSibling;
        if (errorElement) errorElement.textContent = "";
      });
    }
  });
}

function validateInput(input) {
  const errorElement = input.nextElementSibling;
  let errorMessage = "";

  switch (input.id) {
    case "fullName":
      if (!input.value.trim()) {
        errorMessage = "Full name is required";
      } else if (input.value.trim().length < 3) {
        errorMessage = "Name must be at least 3 characters";
      }
      break;

    case "phone":
      if (!input.value.trim()) {
        errorMessage = "Phone number is required";
      } else if (!/^01[0125][0-9]{8}$/.test(input.value.trim())) {
        errorMessage = "Please enter a valid Egyptian phone number";
      }
      break;

    case "address":
      if (!input.value.trim()) {
        errorMessage = "Address is required";
      } else if (input.value.trim().length < 10) {
        errorMessage = "Please enter a complete address";
      }
      break;

    case "city":
    case "area":
      if (!input.value) {
        errorMessage = "This field is required";
      }
      break;
  }

  if (errorElement) {
    errorElement.textContent = errorMessage;
  }

  return !errorMessage;
}

function handleCheckout() {
  // Get cart data
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Check if cart is empty
  if (cart.length === 0) {
    alert("Your cart is empty. Please add items before checking out.");
    return;
  }

  const fullNameInput = document.getElementById("fullName");
  const phoneInput = document.getElementById("phone");
  const addressInput = document.getElementById("address");
  const citySelect = document.getElementById("city");
  const areaSelect = document.getElementById("area");

  if (
    !fullNameInput ||
    !phoneInput ||
    !addressInput ||
    !citySelect ||
    !areaSelect
  ) {
    alert("Error: Form fields not found. Please try again later.");
    return;
  }

  let isValid = true;
  [fullNameInput, phoneInput, addressInput, citySelect, areaSelect].forEach(
    (input) => {
      if (!validateInput(input)) {
        isValid = false;
      }
    }
  );

  if (isValid) {
    const order = {
      customer: {
        fullName: fullNameInput.value.trim(),
        phone: phoneInput.value.trim(),
        address: addressInput.value.trim(),
        city: citySelect.value,
        area: areaSelect.value,
      },
      items: cart,
      orderDate: new Date().toISOString(),
      status: "pending",
    };

    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    localStorage.setItem("cart", JSON.stringify([]));

    updateCartCount();

    // Show success message and redirect
    alert("Order placed successfully! Thank you for your purchase.");
    window.location.href = "../../index.html";
  } else {
    alert("Please fill in all required fields correctly before proceeding.");
  }
}
// footer
const footerHTML = `
    <div class="footer-container">
        <div class="footer-section">
            <h3>About Us</h3>
            <p>ChayGPT - The best coffee shop in Helwan.</p>
        </div>
        <div class="footer-section">
            <h3>Quick Links</h3>
            <ul>
                <li><a href="../../index.html">Home</a></li>
                <li><a href="../menu/menu.html">Menu</a></li>
                <li><a href="../contact/contact.html">Contact</a></li>
                <li><a href="../menu/menu.html">Order Now</a></li>
            </ul>
        </div>
        <div class="footer-section">
            <h3>Legal</h3>
            <ul>
                    <li><a href="../legal/privacy-policy/privacy.html">Privacy Policy</a></li>
                    <li><a href="../legal/terms-of-service/terms.html">Terms of Service</a></li>
                    <li><a href="../legal/refund-policy/refund.html">Refund Policy</a></li>
            </ul>
        </div>
        <div class="footer-section">
            <h3>Follow Us</h3>
            <div class="social-links">
                <a href="https://github.com/ADHAM-KHAIRY/chaygpt.github.io" target="_blank"> <img src="../../images/github-icon.png" alt="Github"> </a>
                <a href="https://www.facebook.com/" target="_blank"> <img src="../../images/facebook-icon.png" alt="Facebook"> </a>
                <a href="https://www.instagram.com/" target="_blank"> <img src="../../images/instagram-icon.png" alt="Instagram"> </a>
            </div>
        </div>
    </div>
    <p class="copyright">© 2025 ChayGPT Coffee. All Rights Reserved.</p>
`;

// add footer after page load
document.addEventListener("DOMContentLoaded", () => {
  const footerElement = document.getElementById("footer");
  if (footerElement) {
    footerElement.innerHTML = footerHTML;
  } else {
    console.error("Footer element not found");
  }

  // load page
  addProductStyles();
  getProductData();
});
