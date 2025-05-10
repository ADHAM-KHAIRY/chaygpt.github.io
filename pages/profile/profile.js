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


