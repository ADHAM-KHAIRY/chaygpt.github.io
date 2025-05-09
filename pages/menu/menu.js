document.addEventListener('DOMContentLoaded', function () {
    // Fetch the product data
    fetch('../products/product.json')
        .then(response => response.json())
        .then(data => {
            const products = data.products;
            const menuGrid = document.getElementById('menu-grid');

            // Clear any existing content (just in case)
            menuGrid.innerHTML = '';

            // Create and append menu items for each product
            products.forEach(product => {
                const menuItem = document.createElement('article');
                menuItem.className = 'menu-item';

                // Construct the image path - assuming images are in ../../images/products/
                const imagePath = `../../images/products/${product.image}`;

                menuItem.innerHTML = `
                    <img src="${imagePath}" alt="${product.name}" class="menu-item-img">
                    <h2 class="menu-item-title">${product.name}</h2>
                    <p class="menu-item-desc">${product.description}</p>
                    <span class="menu-item-price">${product.price.toFixed(2)} EGP</span>
                `;

                menuGrid.appendChild(menuItem);
            });
        })
        .catch(error => {
            console.error('Error loading products:', error);
            const menuGrid = document.getElementById('menu-grid');
            menuGrid.innerHTML = '<p class="error-message">Failed to load menu items. Please try again later.</p>';
        });
});