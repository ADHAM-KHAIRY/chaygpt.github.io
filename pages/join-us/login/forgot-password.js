document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-container');
    const successMessage = document.getElementById('success-message');
    const verifyBtn = document.getElementById('verify-btn');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        verifyBtn.textContent = 'Sending..';
        setTimeout(function() {
            form.style.display = 'none';
            successMessage.style.display = 'block';
        }, 1500);
    });
    
});