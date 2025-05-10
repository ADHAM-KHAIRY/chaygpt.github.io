// header

const headerHTML = 
`<header>
    <nav>
        <div class="main-logo">
            <a href="../../index.html"><img src="../../images/chay-gpt-logo.jpg" alt="ChayGPT Logo"></a>
        </div>
        <a href="../../index.html"><h1 class="brand-name">ChayGPT</h1></a>
        <ul class="nav-links">
            <li class="links"><a href="../../index.html">Home</a></li>
            <li class="links"><a href="../../pages/about/about.html">About</a></li>
            <li class="links"><a href="../../pages/contact/contact.html">Contact</a></li>
            <li class="links"><a href="../../pages/menu/menu.html">Menu</a></li>
        </ul>
        <ul class="nav-links">
            <li class="links"><a href="../checkout/checkout.html">Go to checkout</a></li>
        </ul>
    </nav>
</header>`;

// load heaader.
document.addEventListener('DOMContentLoaded', () => {
    const headerElement = document.getElementById("header");
    headerElement.innerHTML = headerHTML;
});


const fullPath = window.location.pathname;
const fileName = fullPath.substring(fullPath.lastIndexOf('/') + 1);
const baseName = fileName.split('.')[0];
console.log("Base File Name:", baseName);

// get el data
async function getProductData() {
    try {
        const response = await fetch('product.json');
        if (!response.ok) {
            throw new Error('Failed to fetch product data');
        }
        const data = await response.json();
        const productData = data.products;
        
        const productContainer = document.querySelector(".product-page");
        const currentProduct = productData.find(product => product.id === baseName);
        
        if (currentProduct) {
            displayProduct(currentProduct, productData, productContainer);
        } else {
            console.error(`Product with id "${baseName}" not found in product data`);
            displayErrorMessage(productContainer, "Product not found");
        }
    } catch (error) {
        console.error('Error:', error);
        const productContainer = document.querySelector(".product-page");
        if (productContainer) {
            displayErrorMessage(productContainer, "Failed to load product information");
        }
    }
}

function displayProduct(currentProduct, allProducts, container) {
    
    const product = document.createElement("div");
    product.classList.add("product");
    

    const similarProducts = allProducts
        .filter(product => product.id !== currentProduct.id && 
            (product.category === currentProduct.category )).slice(0, 3);
    
    const formattedPrice = currentProduct.price.toFixed(2);

    const sizeOptions = currentProduct.options ? currentProduct.options.filter(option => 
        ['Small', 'Medium', 'Large'].includes(option)) : [];
    
    const milkOptions = currentProduct.options ? currentProduct.options.filter(option => 
        ['Oat milk', 'Almond milk', 'Soy milk'].includes(option)) : [];
    
    // Create HTML content
    product.innerHTML = `
        <main class="product-area">
            <div class="main-product">
                <img src="../../images/products/${currentProduct.image}" alt="${currentProduct.name}">
                <div class="product-area-text">
                    <h2 class="product-name">${currentProduct.name}</h2>
                    <br>
                    <p class="product-description">${currentProduct.description}</p>
                    <p class="product-price">${formattedPrice}EGP</p>
                    <br>
                    ${currentProduct.allergens && currentProduct.allergens.length > 0 ? 
                        `<p class="allergens">Allergens: ${currentProduct.allergens.join(', ')}</p>` : 
                        '<p class="allergens">Allergens: None</p>'}
                </div>
            </div>
            <div class="purchase-info">
                <h4 class="product-options">Product Options</h4>
                <a href="../../pages/menu/menu.html"><h4 class="back-to-menu">Back to menu</h4></a>
            </div>
        </main>
        <div class="options-area">
            ${sizeOptions.length > 0 ? `
                <div class="size">
                    <div class="size-title">Size</div>
                    ${sizeOptions.map(size => `<div class="size-option" data-size="${size}">${size}</div>`).join('')}
                </div>
                <div class="size-info">Selected size: <span id="selected-size">${
                    sizeOptions.includes('Medium') ? 'Medium' : sizeOptions[0]
                }</span></div>
            ` : ''}
            
            ${milkOptions.length > 0 ? `
                <div class="milk-options">
                    <div class="milk-title">Milk Options</div>
                    <select id="milk-choice">
                        <option value="Regular">Regular</option>
                        ${milkOptions.map(milk => `<option value="${milk}">${milk}</option>`).join('')}
                    </select>
                </div>
            ` : ''}
            
            <button class="add-to-cart">Add to Cart - ${formattedPrice}EGP</button>
        </div>
        <div class="product-info">
            <div class="ingredients-section">
                <h2 class="section-title">Ingredients</h2>
                <ul class="ingredients-list">
                    ${currentProduct.ingredients && currentProduct.ingredients.length > 0 ? 
                    currentProduct.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('') :
                    '<li>No ingredients listed</li>'}
                </ul>
            </div>
            <div class="nutritional-info">
                <h2 class="section-title">Nutritional Information</h2>
                <div class="nutrition">
                    ${currentProduct.nutritionalInfo ? `
                        <div class="nutrition-item">Calories: ${currentProduct.nutritionalInfo.calories || 'N/A'}</div>
                        <div class="nutrition-item">Fat: ${currentProduct.nutritionalInfo.fat || '0'}g</div>
                        <div class="nutrition-item">Protein: ${currentProduct.nutritionalInfo.protein || '0'}g</div>
                        <div class="nutrition-item">Caffeine: ${currentProduct.nutritionalInfo.caffeine || 'N/A'}</div>
                    ` : '<div class="nutrition-item">Nutritional information not available</div>'}
                </div>
            </div>
        </div>
        
        ${similarProducts.length > 0 ? `
            <main class="similar-items-box">
                <h2 class="people-also-buy">You May Also Like</h2>
                <div class="similar-items">
                    ${similarProducts.map(item => `
                        <div class="similar-item"> 
                            <a href="${item.id}.html">
                                <img src="../../images/products/${item.image}" alt="${item.name}">
                                <p>${item.name}</p>
                                <p class="similar-price">$${item.price.toFixed(2)}</p>
                            </a>
                        </div>
                    `).join('')}
                    <a class="see-more-products" href="../../pages/menu/menu.html">See more</a>
                </div>
            </main>
        ` : ''}
    `;
    
    container.appendChild(product);
    
    initializeProductInteractions(currentProduct);
}
function addToCart(item) {
    try {
        let cart = [];
        const cartData = localStorage.getItem('cart');
        
        if (cartData) {
            cart = JSON.parse(cartData);
            if (!Array.isArray(cart)) {
                cart = [];
                console.error("Cart data is not an array, resetting");
            }
        }
        
        const existingItemIndex = cart.findIndex(cartItem => 
            cartItem.id === item.id && 
            cartItem.size === item.size && 
            cartItem.milkOption === item.milkOption
        );
        
        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push(item);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        
    } catch (error) {
        console.error("Error adding item to cart:", error);
        alert("There was an error adding this item to your cart. Please try again.");
    }
}
function initializeProductInteractions(currentProduct) {
    
    const sizeOptions = document.querySelectorAll('.size-option');
    const selectedSizeShown = document.getElementById('selected-size');
    
    if (sizeOptions.length > 0 && selectedSizeShown) {
        
        const defaultSize = currentProduct.options && currentProduct.options.find(opt => opt === 'Medium' ) || 'Medium';
        
        let selectedSize = defaultSize;
        selectedSizeShown.textContent = selectedSize;
        
        sizeOptions.forEach(option => {
            if (option.getAttribute('data-size') === selectedSize) {
                option.classList.add('selected');
            }
            
            option.addEventListener('click', function() {
                // remove selected
                sizeOptions.forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                // add selected
                this.classList.add('selected');
                
                selectedSize = this.getAttribute('data-size');
                selectedSizeShown.textContent = selectedSize;
            });
        });
    }
    

    const addToCartButton = document.querySelector('.add-to-cart');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', function() {
            
            const selectedSizeElement = document.getElementById('selected-size');
            const selectedSize = selectedSizeElement ? selectedSizeElement.textContent : 'Medium';
            
            let milkOption = "Regular";
            const milkSelector = document.getElementById('milk-choice');
            if (milkSelector) {
                milkOption = milkSelector.value;
            }
            const cartItem = {
                id: currentProduct.id,
                name: currentProduct.name,
                price: currentProduct.price,
                size: selectedSize,
                milkOption: milkOption,
                quantity: 1,
                image: currentProduct.image
            };
            
            addToCart(cartItem);
            alert(`Added ${currentProduct.name} (Size: ${selectedSize}${milkOption !== "Regular" ? ', Milk: ' + milkOption : ''}) to your cart!`);
        });
    }
    
    const productOptions = document.querySelector(".product-options");
    const optionsArea = document.querySelector(".options-area");
    
    if (productOptions && optionsArea) {
        productOptions.addEventListener('click', function() {
            optionsArea.classList.toggle("show");
        });
    }
}

function displayErrorMessage(container, message) {
    container.innerHTML = `
        <div class="error-message">
            <h2>${message}</h2>
            <p>Please try refreshing the page or contact customer support if the problem persists.</p>
            <a href="../../pages/menu/menu.html" class="error-link">Return to Menu</a>
        </div>
    `;
}

// css.
function addProductStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .error-message {
            text-align: center;
            padding: 50px 20px;
        }
        
        .error-link {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #4a6741;
            color: white;
            text-decoration: none;
            border-radius: 4px;
        }
    `;
    document.head.appendChild(styleElement);
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
document.addEventListener('DOMContentLoaded', () => {
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