
const fullPath = window.location.pathname;
const fileName = fullPath.substring(fullPath.lastIndexOf('/') + 1);
const baseName = fileName.split('.')[0];
console.log("Base File Name:", baseName);

//get data from json file
async function getProductData() {
    try {
        
        const response = await fetch('product.json');
        if (!response.ok) {
            throw new Error('Failed to fetch product data');
        }
        const data = await response.json();
        const productData = data.products;
        
        
        const productContainer = document.querySelector(".product-page");
        if (!productContainer) {
            console.error("Product container not found");
            return;
        }
        
        
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
 * 
 * @param {Object} currentProduct - The current product data
 * @param {Array} allProducts  All products data
 * @param {HTMLElement} container  container element
 */
function displayProduct(currentProduct, allProducts, container) {
    // Create a product element
    const product = document.createElement("div");
    product.classList.add("product");
    
    // find similar products
    const similarProducts = allProducts
        .filter(product => product.id !== currentProduct.id && 
                (product.category === currentProduct.category || 
                Math.random() > 0.5)) 
        .slice(0, 3);
    
    
    const formattedPrice = currentProduct.price.toFixed(2);
    
    
    const sizeOptions = currentProduct.options.filter(option => 
        ['Small', 'Medium', 'Large'].includes(option)
    );
    
    // milk option or no milk
    const milkOptions = currentProduct.options.filter(option => 
        ['Oat milk', 'Almond milk', 'Soy milk'].includes(option)
    );
    
    // html code
    product.innerHTML = `
        <main class="product-area">
            <div class="main-product">
                <img src="../../images/products/${currentProduct.image}" alt="${currentProduct.name}">
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
        <div class="product-info">
            <div class="ingredients-section">
                <h2 class="section-title">Ingredients</h2>
                <ul class="ingredients-list">
                    ${currentProduct.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                </ul>
            </div>
            <div class="nutritional-info">
                <h2 class="section-title">Nutritional Information</h2>
                    <div class="nutrition">
                    <div class="nutrition-item">Calories: ${currentProduct.nutritionalInfo.calories}</div>
                    <div class="nutrition-item">Fat: ${currentProduct.nutritionalInfo.fat}g</div>
                    <div class="nutrition-item">Protein: ${currentProduct.nutritionalInfo.protein}g</div>
                    <div class="nutrition-item">Caffeine: ${currentProduct.nutritionalInfo.caffeine}</div>
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

/**
 * 
 * @param {Object} currentProduct - The current product data
 */
function initializeProductInteractions(currentProduct) {
    // select product size
    const sizeOptions = document.querySelectorAll('.size-option');
    const selectedSizeShown = document.querySelector('#selected-size');
    
    if (sizeOptions.length > 0 && selectedSizeShown) {
        
        const defaultSize = currentProduct.options.find(opt => opt === 'Medium' || opt === 'M') || 
                        currentProduct.options.find(opt => 
                            ['Small', 'Medium', 'Large'].includes(opt)
                        );
        
        // medium is default
        let selectedSize = defaultSize || 'M';
        selectedSizeShown.textContent = selectedSize;
        
        
        sizeOptions.forEach(option => {
            
            if (option.getAttribute('data-size') === selectedSize) {
                option.classList.add('selected');
            }
            
            option.addEventListener('click', function() {
                
                sizeOptions.forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                
                this.classList.add('selected');
                
                
                selectedSize = this.getAttribute('data-size');
                selectedSizeShown.textContent = selectedSize;
            });
        });
    }
    
    // add to cart
    const addToCartButton = document.querySelector('.add-to-cart');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', function() {
            
            const selectedSize = document.getElementById('selected-size')?.textContent || 'Medium';
            
            
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
                quantity: 1
            };
            
            
            addToCart(cartItem);
            
            
            alert(`Added ${currentProduct.name} (Size: ${selectedSize}${milkOption !== "Regular" ? ', Milk: ' + milkOption : ''}) to your cart!`);
            
            
            
        });
    }
    
    

    const productOptions = document.querySelector(".product-options");
    const optionsArea = document.querySelector(".options-area");
    
    // show product options
    if (productOptions && optionsArea) {
        productOptions.onclick = function () {
            optionsArea.classList.toggle("show");
        };
    }
}

/**
 * 
 * @param {Object} item the item to add to cart
 */
function addToCart(item) {
    // get cart items
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // see if item exist in cart
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
}

/**
 * 
 * @param {HTMLElement} container  the container element
 * @param {string} message the error message
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

// some css code
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

// load functions when page is loaded
document.addEventListener('DOMContentLoaded', () => {
    addProductStyles();
    getProductData();
});