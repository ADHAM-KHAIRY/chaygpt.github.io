let first =document.getElementById("first-name");
window.onload = function (){
    first.focus();
}
function validPassword(password) {
    const hasNumber = /[0-9]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    
    if (hasNumber && hasUpperCase) {
      return true;
    } else {
      return false;
    }
  }
  document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password');
    const submitButton = document.getElementById('submit');
    const errorMessage = document.getElementById('error1-message');
    
    passwordInput.addEventListener('input', function() {
      const password = passwordInput.value;
      
      if (validPassword(password)) {
        errorMessage.textContent = 'The password is valid.✅';
        errorMessage.style.color = 'green';
        submitButton.disabled = false;
      
      } else {
        errorMessage.textContent = 'password must contain at least one number and at least one capital letter.';
        errorMessage.style.color = 'red';
        submitButton.disabled = true;
      }
    });
  });
  
  document.addEventListener('DOMContentLoaded', function() {
    const field1 = document.getElementById('password');
    const field2 = document.getElementById('confirm-password');
    const errorMessage = document.getElementById('error2-message');
    const submitButton = document.getElementById('submit');
    
    function checkFieldsMatch(field1Value, field2Value) {
      return field1Value === field2Value;
    }
    
    function validFields() {
      const field1Value = field1.value;
      const field2Value = field2.value;
      
      if (field1Value && field2Value) {
        if (checkFieldsMatch(field1Value, field2Value)) {
          errorMessage.textContent = 'The fields match.✅';
          errorMessage.style.color = 'green';
          submitButton.disabled = false;
        } else {
          errorMessage.textContent = 'Failed! Fields do not match.❌';
          errorMessage.style.color = 'red';
          submitButton.disabled = true;
        }
      } else {
        errorMessage.textContent = 'Please fill in both fields';
        errorMessage.style.color = 'orange';
        submitButton.disabled = true;
      }
    }
    
    field1.addEventListener('input', validFields);
    field2.addEventListener('input', validFields);
    
    validFields();
  });
