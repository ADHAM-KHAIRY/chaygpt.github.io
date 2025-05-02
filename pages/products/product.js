// Toggle product options visibility
const productOptions = document.querySelector(".product-options");
const optionsArea = document.querySelector(".options-area");

// Add event listener only if element exists
if (productOptions && optionsArea) {
    productOptions.onclick = function () {
        optionsArea.classList.toggle("show");
    };
}

// Get the current page filename to identify which product to display
const fullPath = window.location.pathname;
const fileName = fullPath.substring(fullPath.lastIndexOf('/') + 1);
const baseName = fileName.split('.')[0];
console.log("Base File Name:", baseName);

/**
 * Main function to fetch and display product data
 */
async function getProductData() {
    try {
        // Load product data from JSON file
        const response = await fetch('product.json');
        if (!response.ok) {
            throw new Error('Failed to fetch product data');
        }
        const data = await response.json();
        const productData = data.products; // Access the products array
        
        // Get the product container element
        const productContainer = document.querySelector(".product-page");
        if (!productContainer) {
            console.error("Product container not found");
            return;
        }
        
        // Find the product that matches the current page
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

/**
 * Display the product information on the page
 * @param {Object} currentProduct - The current product data
 * @param {Array} allProducts - All products data
 * @param {HTMLElement} container - The container element
 */
function displayProduct(currentProduct, allProducts, container) {
    // Create a product element
    const product = document.createElement("div");
    product.classList.add("product");
    
    // Get similar products (excluding current product)
    const similarProducts = allProducts
        .filter(product => product.id !== currentProduct.id && 
                (product.category === currentProduct.category || 
                 Math.random() > 0.5)) // Fallback to random if no similar category exists
        .slice(0, 3); // Limit to 3 similar products
    
    // Format price to always show 2 decimal places
    const formattedPrice = currentProduct.price.toFixed(2);
    
    // Determine which size options to show
    const sizeOptions = currentProduct.options.filter(option => 
        ['Small', 'Medium', 'Large', 'XL', 'S', 'M', 'L'].includes(option)
    );
    
    // Determine if we have milk options
    const milkOptions = currentProduct.options.filter(option => 
        ['Oat milk', 'Almond milk', 'Soy milk'].includes(option)
    );
    
    // Populate the product element with HTML
    product.innerHTML = `
        <main class="product-area">
            <div class="main-product">
                <img src="../../images/productes/${currentProduct.image}" alt="${currentProduct.name}">
                <div class="product-area-text">
                    <h2 class="product-name">${currentProduct.name}</h2>
                    <br>
                    <p class="product-description">${currentProduct.description}</p>
                    <p class="product-price">$${formattedPrice}</p>
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
            
            <button class="add-to-cart">Add to Cart - $${formattedPrice}</button>
        </div>
        <div class="ingredients-section">
            <h2 class="section-title">Ingredients</h2>
            <ul class="ingredients-list">
                ${currentProduct.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
        </div>
        
        <div class="nutritional-info">
            <h2 class="section-title">Nutritional Information</h2>
            <div class="nutrition-grid">
                <div class="nutrition-item">Calories: ${currentProduct.nutritionalInfo.calories}</div>
                <div class="nutrition-item">Fat: ${currentProduct.nutritionalInfo.fat}g</div>
                <div class="nutrition-item">Protein: ${currentProduct.nutritionalInfo.protein}g</div>
                <div class="nutrition-item">Caffeine: ${currentProduct.nutritionalInfo.caffeine}</div>
            </div>
        </div>
        
        ${similarProducts.length > 0 ? `
            <main class="similar-items-box">
                <h2 class="people-also-buy">You May Also Like</h2>
                <div class="similar-items">
                    ${similarProducts.map(item => `
                        <div class="similar-item"> 
                            <a href="${item.id}.html">
                                <img src="../../images/productes/${item.image}" alt="${item.name}">
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
    
    // Add the product element to the container
    container.appendChild(product);
    
    // Add event listeners and initialize product interactions
    initializeProductInteractions(currentProduct);
}

/**
 * Set up event listeners and interactions for the product page
 * @param {Object} currentProduct - The current product data
 */
function initializeProductInteractions(currentProduct) {
    // Set up size selection
    const sizeOptions = document.querySelectorAll('.size-option');
    const selectedSizeShown = document.querySelector('#selected-size');
    
    if (sizeOptions.length > 0 && selectedSizeShown) {
        // Find default size (Medium or first available)
        const defaultSize = currentProduct.options.find(opt => opt === 'Medium' || opt === 'M') || 
                        currentProduct.options.find(opt => 
                            ['Small', 'Medium', 'Large', 'XL', 'S', 'M', 'L'].includes(opt)
                        );
        
        // Set default selected size
        let selectedSize = defaultSize || 'M';
        selectedSizeShown.textContent = selectedSize;
        
        // Add click event listeners to each size option
        sizeOptions.forEach(option => {
            // Select default option
            if (option.getAttribute('data-size') === selectedSize) {
                option.classList.add('selected');
            }
            
            option.addEventListener('click', function() {
                // Remove 'selected' class from all options
                sizeOptions.forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                // Add 'selected' class to clicked option
                this.classList.add('selected');
                
                // Update selected size text
                selectedSize = this.getAttribute('data-size');
                selectedSizeShown.textContent = selectedSize;
            });
        });
    }
    
    // Add to cart functionality
    const addToCartButton = document.querySelector('.add-to-cart');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', function() {
            // Get the currently selected size
            const selectedSize = document.getElementById('selected-size')?.textContent || 'Medium';
            
            // Get the selected milk option if available
            let milkOption = "Regular";
            const milkSelector = document.getElementById('milk-choice');
            if (milkSelector) {
                milkOption = milkSelector.value;
            }
            
            // Create a cart item object
            const cartItem = {
                id: currentProduct.id,
                name: currentProduct.name,
                price: currentProduct.price,
                size: selectedSize,
                milkOption: milkOption,
                quantity: 1
            };
            
            // Add to cart in localStorage
            addToCart(cartItem);
            
            // Show confirmation
            alert(`Added ${currentProduct.name} (Size: ${selectedSize}${milkOption !== "Regular" ? ', Milk: ' + milkOption : ''}) to your cart!`);
            
            // Update cart count in header if it exists
            updateCartCount();
        });
    }
    
    // Toggle options area visibility
    const productOptionsToggle = document.querySelector('.product-options');
    const optionsAreaElement = document.querySelector('.options-area');
    
    if (productOptionsToggle && optionsAreaElement) {
        // Show options by default
        optionsAreaElement.classList.add('show');
        
        productOptionsToggle.addEventListener('click', function() {
            optionsAreaElement.classList.toggle('show');
        });
    }
}

/**
 * Add item to cart in localStorage
 * @param {Object} item - The item to add to cart
 */
function addToCart(item) {
    // Get existing cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(cartItem => 
        cartItem.id === item.id && 
        cartItem.size === item.size && 
        cartItem.milkOption === item.milkOption
    );
    
    if (existingItemIndex !== -1) {
        // Increment quantity if item already exists
        cart[existingItemIndex].quantity += 1;
    } else {
        // Add new item to cart
        cart.push(item);
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

/**
 * Update cart count in header
 */
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }
}

/**
 * Display error message in product container
 * @param {HTMLElement} container - The container element
 * @param {string} message - The error message
 */
function displayErrorMessage(container, message) {
    container.innerHTML = `
        <div class="error-message">
            <h2>${message}</h2>
            <p>Please try refreshing the page or contact customer support if the problem persists.</p>
            <a href="../../pages/menu/menu.html" class="error-link">Return to Menu</a>
        </div>
    `;
}

/**
 * Add CSS styles for the product page
 */
function addProductStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .product {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .main-product {
            display: flex;
            gap: 30px;
            margin-bottom: 30px;
        }
        
        .main-product img {
            max-width: 400px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        .product-area-text {
            flex: 1;
        }
        
        .product-name {
            font-size: 32px;
            margin-bottom: 10px;
        }
        
        .product-description {
            font-size: 18px;
            line-height: 1.6;
            margin-bottom: 15px;
        }
        
        .product-price {
            font-size: 24px;
            font-weight: bold;
            color: #4a6741;
        }
        
        .allergens {
            font-style: italic;
            color: #777;
        }
        
        .purchase-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }
        
        .product-options {
            cursor: pointer;
            color: #4a6741;
        }
        
        .back-to-menu {
            color: #4a6741;
        }
        
        .options-area {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            display: none;
        }
        
        .options-area.show {
            display: block;
        }
        
        .size, .milk-options {
            margin-bottom: 20px;
        }
        
        .size-title, .milk-title {
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .size-option {
            display: inline-block;
            padding: 8px 15px;
            margin-right: 10px;
            margin-bottom: 10px;
            border: 2px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
        }
        
        .size-option.selected {
            background-color: #4a6741;
            color: white;
            border-color: #4a6741;
        }
        
        .size-info {
            margin: 15px 0;
        }
        
        #milk-choice {
            padding: 8px;
            border-radius: 4px;
            border: 1px solid #ddd;
        }
        
        .add-to-cart {
            background-color: #4a6741;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        
        .add-to-cart:hover {
            background-color: #3a5331;
        }
        
        .section-title {
            border-bottom: 2px solid #4a6741;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        
        .ingredients-list {
            list-style-type: disc;
            padding-left: 20px;
            margin-bottom: 30px;
        }
        
        .ingredients-list li {
            margin-bottom: 5px;
        }
        
        .nutritional-info {
            margin-bottom: 30px;
        }
        
        .nutrition-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 15px;
        }
        
        .nutrition-item {
            background-color: #f1f7ef;
            padding: 10px;
            border-radius: 4px;
            text-align: center;
        }
        
        .similar-items-box {
            margin-top: 40px;
        }
        
        .people-also-buy {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .similar-items {
            display: flex;
            gap: 20px;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .similar-item {
            width: 200px;
            text-align: center;
        }
        
        .similar-item img {
            width: 100%;
            border-radius: 8px;
            transition: transform 0.3s;
        }
        
        .similar-item img:hover {
            transform: scale(1.05);
        }
        
        .similar-item p {
            margin-top: 10px;
            font-weight: bold;
        }
        
        .similar-price {
            color: #4a6741;
        }
        
        .see-more-products {
            display: block;
            text-align: center;
            margin-top: 20px;
            color: #4a6741;
            text-decoration: underline;
        }
        
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
        
        @media (max-width: 768px) {
            .main-product {
                flex-direction: column;
            }
            
            .main-product img {
                max-width: 100%;
            }
        }
    `;
    document.head.appendChild(styleElement);
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    addProductStyles();
    getProductData();
});