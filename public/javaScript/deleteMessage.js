document.addEventListener('DOMContentLoaded', function () {
  const deleteBtn = document.getElementById('deleteBtn');
  const deleteModal = document.getElementById('deleteModal');
  const closeModal = document.getElementById('closeModal');
  const cancelDelete = document.getElementById('cancelDelete');
  const confirmDelete = document.getElementById('confirmDelete');
  const deleteForm = document.getElementById('deleteForm');

  // Store original button content
  const originalDeleteText = confirmDelete?.innerHTML;

  // 🔴 1. Show modal when Delete button clicked
  if (deleteBtn) {
    deleteBtn.addEventListener('click', function (e) {
      e.preventDefault();
      showModal();
    });
  }

  // 🔴 2. Close modal when ❌ button clicked
  if (closeModal) {
    closeModal.addEventListener('click', hideModal);
  }

  // 🔴 3. Close modal when Cancel button clicked
  if (cancelDelete) {
    cancelDelete.addEventListener('click', hideModal);
  }

  // 🔴 4. Close modal when clicking outside the modal content
  if (deleteModal) {
    deleteModal.addEventListener('click', function (e) {
      if (e.target === deleteModal) {
        hideModal();
      }
    });
  }

  // 🔴 5. Close modal when pressing ESC key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && deleteModal?.classList.contains('show')) {
      hideModal();
    }
  });

  // 🔴 6. Handle form submission when clicking "Yes, Delete"
  if (confirmDelete) {
    confirmDelete.addEventListener('click', function () {
      handleDelete();
    });
  }

  // 🔵 Show modal function with enhanced animations
  function showModal() {
    if (!deleteModal) return;
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Show modal with animation
    deleteModal.classList.add('show');
    
    // Focus management for accessibility
    setTimeout(() => {
      if (cancelDelete) {
        cancelDelete.focus();
      }
    }, 150); // Wait for animation to start
  }

  // 🔵 Hide modal function with smooth exit animation
  function hideModal() {
    if (!deleteModal) return;
    
    // Remove show class to trigger exit animation
    deleteModal.classList.remove('show');
    
    // Restore body scroll after animation completes
    setTimeout(() => {
      document.body.style.overflow = '';
    }, 300); // Match CSS transition duration
    
    // Return focus to delete button
    if (deleteBtn) {
      deleteBtn.focus();
    }
    
    // Reset button state if it was in loading state
    resetButtonState();
  }

  // 🔵 Handle delete confirmation with enhanced UX
  function handleDelete() {
    if (!confirmDelete || !deleteForm) return;
    
    // Add loading state with animation
    confirmDelete.innerHTML = '<i class="fa-solid fa-spinner"></i> Deleting...';
    confirmDelete.disabled = true;
    confirmDelete.classList.add('loading');
    
    // Disable cancel button during deletion
    if (cancelDelete) {
      cancelDelete.disabled = true;
    }
    
    // Add subtle shake animation to modal for feedback
    const modalContainer = deleteModal.querySelector('.modal-container');
    if (modalContainer) {
      modalContainer.style.animation = 'none';
      setTimeout(() => {
        modalContainer.style.animation = '';
      }, 10);
    }

    // Submit form after UX delay
    setTimeout(() => {
      try {
        deleteForm.submit();
      } catch (error) {
        console.error('Error submitting delete form:', error);
        handleDeleteError();
      }
    }, 1000); // Slightly longer delay for better UX
  }

  // 🔵 Reset button state function
  function resetButtonState() {
    if (confirmDelete && originalDeleteText) {
      confirmDelete.innerHTML = originalDeleteText;
      confirmDelete.disabled = false;
      confirmDelete.classList.remove('loading');
    }
    
    if (cancelDelete) {
      cancelDelete.disabled = false;
    }
  }

  // 🔵 Handle delete error
  function handleDeleteError() {
    resetButtonState();
    
    // Show error message (you can customize this)
    if (confirmDelete) {
      confirmDelete.innerHTML = '<i class="fa-solid fa-exclamation-triangle"></i> Error - Try Again';
      confirmDelete.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
      
      // Reset after 3 seconds
      setTimeout(() => {
        confirmDelete.innerHTML = originalDeleteText;
        confirmDelete.style.background = '';
      }, 3000);
    }
  }

  // 🔵 Enhanced keyboard navigation
  document.addEventListener('keydown', function (e) {
    if (!deleteModal?.classList.contains('show')) return;
    
    // Tab navigation within modal
    if (e.key === 'Tab') {
      const focusableElements = deleteModal.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
    
    // Enter key on confirm button
    if (e.key === 'Enter' && document.activeElement === confirmDelete) {
      e.preventDefault();
      handleDelete();
    }
  });
});
