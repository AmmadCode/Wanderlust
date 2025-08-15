
document.addEventListener('DOMContentLoaded', function() {
  // Check if map element exists
  const mapElement = document.getElementById('listing-map');
  if (mapElement) {
    // Use Intersection Observer for lazy loading
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          initializeMap(); // Call map setup only when visible
          observer.unobserve(entry.target);
        }
      });
    });
    
    observer.observe(mapElement);
  }

  // Map initialization logic
  function initializeMap() {
    const mapDataElement = document.getElementById('map-data');
    
    if (mapDataElement) {
      const mapData = JSON.parse(mapDataElement.textContent);
      
      // Initialize the map
      const map = L.map('listing-map').setView([mapData.lat, mapData.lng], 13);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Create custom icon for Wanderlust
      const wanderlustIcon = L.divIcon({
        html: `
          <div class="custom-marker">
            <i class="fa-solid fa-compass-drafting"></i>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
        className: 'wanderlust-marker'
      });

      // Add marker with custom icon
      const marker = L.marker([mapData.lat, mapData.lng], { 
        icon: wanderlustIcon 
      }).addTo(map);

      // Popup content
      const popupContent = `
        <div class="map-popup">
          <div class="popup-header">
            <i class="fa-solid fa-compass-drafting"></i>
            <span>Wanderlust</span>
          </div>
          <h5>${mapData.title}</h5>
          <p><i class="fa-solid fa-location-dot"></i> ${mapData.location}, ${mapData.country}</p>
          <p class="popup-price">${mapData.price} / night</p>
        </div>
      `;

      marker.bindPopup(popupContent).openPopup();
    }
  }
});

