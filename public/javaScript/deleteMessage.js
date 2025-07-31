document.addEventListener('DOMContentLoaded', function () {
  const deleteBtn = document.getElementById('deleteBtn');
  const deleteModal = document.getElementById('deleteModal');
  const closeModal = document.getElementById('closeModal');
  const cancelDelete = document.getElementById('cancelDelete');
  const confirmDelete = document.getElementById('confirmDelete');
  const deleteForm = document.getElementById('deleteForm');

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
    if (e.key === 'Escape' && deleteModal.classList.contains('show')) {
      hideModal();
    }
  });

  // 🔴 6. Handle form submission when clicking "Yes, Delete"
  if (confirmDelete) {
    confirmDelete.addEventListener('click', function () {
      handleDelete();
    });
  }

  // 🔵 Show modal function
  function showModal() {
    deleteModal.classList.add('show');
    document.body.style.overflow = 'hidden'; // prevent scroll
    setTimeout(() => {
      cancelDelete.focus(); // accessibility: focus Cancel
    }, 100);
  }

  // 🔵 Hide modal function
  function hideModal() {
    deleteModal.classList.remove('show');
    document.body.style.overflow = ''; // allow scroll again
    deleteBtn.focus(); // return focus to delete button
  }

  // 🔵 Handle delete confirmation
  function handleDelete() {
    // Add loading state to confirm button
    confirmDelete.innerHTML = 'Deleting...';
    confirmDelete.disabled = true;
    cancelDelete.disabled = true;

    // Submit the form after delay
    setTimeout(() => {
      deleteForm.submit();
    }, 800); // small UX delay
  }
});
