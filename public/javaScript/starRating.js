// Star rating functionality
document.addEventListener("DOMContentLoaded", function () {
  const stars = document.querySelectorAll('.star-rating input[type="radio"]');
  const ratingText = document.querySelector(".rating-text");

  const ratingDescriptions = {
    1: "Terrible",
    2: "Not good",
    3: "Average",
    4: "Very good",
    5: "Amazing",
  };

  // Update rating text based on selection
  function updateRatingText(rating) {
    if (ratingText) {
      ratingText.textContent = ratingDescriptions[rating] || "Select a rating";

      // Add color animation
      ratingText.style.color = getColorForRating(rating);
      ratingText.style.transform = "scale(1.1)";
      setTimeout(() => {
        ratingText.style.transform = "scale(1)";
      }, 200);
    }
  }

  // Get color based on rating
  function getColorForRating(rating) {
    const colors = {
      1: "#dc3545", // Red
      2: "#fd7e14", // Orange
      3: "#ffc107", // Yellow
      4: "#28a745", // Green
      5: "#20c997", // Teal
    };
    return colors[rating] || "#666";
  }

  // Add click event listeners to stars
  stars.forEach((star) => {
    star.addEventListener("change", function () {
      updateRatingText(this.value);

      // Add pulse animation to selected stars
      const labels = document.querySelectorAll(".star-rating label");
      labels.forEach((label) => {
        const labelFor = label.getAttribute("for");
        const starNumber = parseInt(labelFor.replace("star", ""));

        if (starNumber <= parseInt(this.value)) {
          label.querySelector("i").style.animation = "starPulse 0.3s ease";
          setTimeout(() => {
            label.querySelector("i").style.animation = "";
          }, 300);
        }
      });
    });
  });

  // Set initial rating text
  const checkedStar = document.querySelector('.star-rating input[type="radio"]:checked');
  if (checkedStar) {
    updateRatingText(checkedStar.value);
  }

  // Add hover effects
  const labels = document.querySelectorAll(".star-rating label");
  labels.forEach((label) => {
    label.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.1)";
    });

    label.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)";
    });
  });
});