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

document.addEventListener('DOMContentLoaded', () => {
    const footerElement = document.getElementById("footer");
    if (footerElement) {
        footerElement.innerHTML = footerHTML;
    } else {
        console.error("Footer element not found");
    }

    addProductStyles();
    getProductData();
});

document.addEventListener('DOMContentLoaded', function () {
    fetch('../products/product.json')
        .then(response => response.json())
        .then(data => {
            const products = data.products;
            const menuContainer = document.getElementById('menu-container');
            menuContainer.innerHTML = '';

            const categories = {};
            products.forEach(product => {
                if (!categories[product.category]) {
                    categories[product.category] = [];
                }
                categories[product.category].push(product);
            });


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
                    const productCard = document.createElement('a');
                    productCard.className = 'product-card';

                    const imageName = product.image.split('.')[0];
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
