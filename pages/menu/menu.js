document.addEventListener('DOMContentLoaded', function () {
    fetch('../products/product.json')
        .then(response => response.json())
        .then(data => {
            const products = data.products;
            const menuContainer = document.getElementById('menu-container');
            menuContainer.innerHTML = '';

            // Group products by category
            const categories = {};
            products.forEach(product => {
                if (!categories[product.category]) {
                    categories[product.category] = [];
                }
                categories[product.category].push(product);
            });

            // Create sections for each category
            for (const [category, items] of Object.entries(categories)) {
                const categoryBox = document.createElement('div');
                categoryBox.className = 'category-box';
                
                const categoryTitle = document.createElement('h2');
                categoryTitle.className = 'category-title';
                categoryTitle.textContent = category;
                categoryBox.appendChild(categoryTitle);
                
                const productsGrid = document.createElement('div');
                productsGrid.className = 'products-grid';
                
                items.forEach(product => {
                    const productCard = document.createElement('a'); // Changed to <a> tag
                    productCard.className = 'product-card';
                    // Set href to the product page path
                    const imageName = product.image.split('.')[0]; // Remove .jpg extension
                    productCard.href = `../products/${imageName}.html`;
                    
                    const imagePath = `../../images/products/${product.image}`;
                    
                    productCard.innerHTML = `
                        <img src="${imagePath}" alt="${product.name}" class="product-img">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-desc">${product.description}</p>
                        <span class="product-price">${product.price.toFixed(2)} EGP</span>
                    `;
                    
                    productsGrid.appendChild(productCard);
                });
                
                categoryBox.appendChild(productsGrid);
                menuContainer.appendChild(categoryBox);
            }
        })
        .catch(error => {
            console.error('Error loading products:', error);
            const menuContainer = document.getElementById('menu-container');
            menuContainer.innerHTML = '<p class="error-message">Failed to load menu items. Please try again later.</p>';
        });
});
