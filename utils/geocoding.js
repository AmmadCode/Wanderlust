const axios = require("axios");


async function geocodeAddress(address, country) {
  try {
    const fullAddress = `${address}, ${country}`;
    // Nominatim API endpoint (free, no API key required)
    const url = "https://nominatim.openstreetmap.org/search";
    const response = await axios.get(url, {
      params: {
        q: fullAddress,
        format: "json",
        limit: 1,
        // Important: Set a User-Agent as per Nominatim usage policy
        "User-Agent": "Wanderlust-App",
      },
      headers: {
        "User-Agent": "Wanderlust-App/1.0",
      },
    });
    if (response.data && response.data.length > 0) {
      const result = response.data[0];
      console.log(`result: ${result}`);
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        display_name: result.display_name,
      };
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

module.exports = { geocodeAddress };