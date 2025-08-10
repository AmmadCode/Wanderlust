// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

// Password toggle functionality
function togglePassword(inputId) {
  const passwordInput = document.getElementById(inputId);
  const eyeIcon = document.getElementById(inputId + '-eye');
  
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    eyeIcon.classList.remove('fa-eye');
    eyeIcon.classList.add('fa-eye-slash');
  } else {
    passwordInput.type = 'password';
    eyeIcon.classList.remove('fa-eye-slash');
    eyeIcon.classList.add('fa-eye');
  }
}

// Initialize password toggle functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Add smooth transitions to all interactive elements
  const interactiveElements = document.querySelectorAll('button, .nav-link, .auth-btn, .form-control');
  interactiveElements.forEach(element => {
    element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
  });
});