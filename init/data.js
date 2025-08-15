const sampleListings = [
  {
    title: "Luxury Villa in Hunza Valley",
    description: "Experience the breathtaking beauty of Hunza Valley from this traditional yet luxurious villa. Wake up to stunning views of Rakaposhi and immerse yourself in the rich culture of Northern Pakistan. Features modern amenities while maintaining authentic local architecture.",
    image: {
      url: "https://cdn.pixabay.com/photo/2018/08/27/12/50/chief-3634922_960_720.jpg",
      filename: "hunza-valley-villa"
    },
    price: 150,
    location: "Hunza Valley",
    country: "Pakistan",
    category: "mountains",
    geometry: {
      type: "Point",
      coordinates: [74.6607, 36.3167]
    }
  },
  {
    title: "Skardu Mountain Resort",
    description: "Nestled in the heart of Skardu, gateway to K2 and the Karakoram Range. This resort offers unparalleled access to some of the world's highest peaks, crystal-clear lakes, and ancient Buddhist rock carvings. Perfect for trekkers and nature enthusiasts.",
    image: {
      url: "https://images.unsplash.com/photo-1681020909618-75c9fa779b44?q=80&w=860&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      filename: "skardu-resort"
    },
    price: 120,
    location: "Skardu",
    country: "Pakistan",
    category: "mountains",
    geometry: {
      type: "Point",
      coordinates: [75.5472, 35.2971]
    }
  },
  {
    title: "Colonial Retreat in Murree Hills",
    description: "Charming colonial-era bungalow in the Queen of Hills. Enjoy cool mountain air, pine forests, and panoramic views of the Himalayan foothills. Walking distance to Mall Road and local attractions.",
    image: {
      url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
      filename: "murree-retreat"
    },
    price: 85,
    location: "Murree",
    country: "Pakistan",
    category: "mountains",
    geometry: {
      type: "Point",
      coordinates: [73.4057, 33.9070]
    }
  },
  {
    title: "Heritage Suite at Lahore Fort",
    description: "Stay near the magnificent Lahore Fort, a UNESCO World Heritage site. This boutique hotel offers views of the Mughal architecture and easy access to the Walled City's treasures including Badshahi Mosque and food street.",
    image: {
      url: "https://images.unsplash.com/photo-1669551671277-f9cbdd107288?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8TGFob3JlJTIwZm9ydHxlbnwwfHwwfHx8MA%3D%3D",
      filename: "lahore-fort-suite"
    },
    price: 95,
    location: "Lahore",
    country: "Pakistan",
    category: "castle",
    geometry: {
      type: "Point",
      coordinates: [74.3142, 31.5888]
    }
  },
  {
    title: "Badshahi Mosque View Hotel",
    description: "Wake up to the majestic view of Badshahi Mosque, one of the largest mosques in the world. This heritage hotel combines Mughal grandeur with modern comfort, located in the heart of historic Lahore.",
    image: {
      url: "https://images.unsplash.com/photo-1722926283743-1a537cc4262f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8QmFkc2hhaSUyMG1vc3F1ZXxlbnwwfHwwfHx8MA%3D%3D",
      filename: "badshahi-mosque-hotel"
    },
    price: 110,
    location: "Lahore",
    country: "Pakistan",
    category: "iconic-cities",
    geometry: {
      type: "Point",
      coordinates: [74.3104, 31.5888]
    }
  },
  {
    title: "Archaeological Lodge at Mohenjo-daro",
    description: "Experience 5000 years of history at this unique lodge near the ancient Indus Valley Civilization site. Explore the ruins of one of the world's earliest major cities while enjoying modern accommodations.",
    image: {
      url: "https://images.unsplash.com/photo-1595361316014-d4e3f86aa26d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHBha2lzdGFufGVufDB8fDB8fHww",
      filename: "mohenjo-daro-lodge"
    },
    price: 75,
    location: "Mohenjo-daro",
    country: "Pakistan",
    category: "trending",
    geometry: {
      type: "Point",
      coordinates: [68.1381, 27.3242]
    }
  },
  {
    title: "Everest Base Camp Lodge",
    description: "The ultimate mountain experience at 17,598 feet. This eco-friendly lodge offers breathtaking views of Mount Everest and surrounding peaks. Perfect base for trekkers and mountaineers seeking the adventure of a lifetime.",
    image: {
      url: "https://images.unsplash.com/photo-1486911278844-a81c5267e227?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bW91bnQlMjBldmVyZXN0fGVufDB8fDB8fHww",
      filename: "everest-base-camp"
    },
    price: 200,
    location: "Everest Region",
    country: "Nepal",
    category: "mountains",
    geometry: {
      type: "Point",
      coordinates: [86.9250, 27.9881]
    }
  },
  {
    title: "K2 Base Camp Expedition Tents",
    description: "Experience the Savage Mountain up close. Professional expedition-style camping at K2 Base Camp, the world's second-highest peak. Includes full support team, meals, and equipment for serious adventurers.",
    image: {
      url: "https://images.unsplash.com/photo-1627896157734-4d7d4388f28b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8SzJ8ZW58MHx8MHx8fDA%3D",
      filename: "k2-base-camp"
    },
    price: 350,
    location: "K2 Base Camp",
    country: "Pakistan",
    category: "camping",
    geometry: {
      type: "Point",
      coordinates: [76.5133, 35.8825]
    }
  },
  {
    title: "Swiss Alps Luxury Chalet",
    description: "Traditional Alpine luxury in Zermatt with direct views of the Matterhorn. Features include private spa, wine cellar, and ski-in/ski-out access. Perfect for both winter sports and summer hiking.",
    image: {
      url: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2FtcGluZ3xlbnwwfHwwfHx8MA%3D%3D",
      filename: "swiss-alps-chalet"
    },
    price: 850,
    location: "Zermatt",
    country: "Switzerland",
    category: "mountains",
    geometry: {
      type: "Point",
      coordinates: [7.7491, 46.0207]
    }
  },
  {
    title: "Eiffel Tower Penthouse",
    description: "Exclusive penthouse with panoramic views of the Eiffel Tower and Paris skyline. Located in the prestigious 7th arrondissement, walking distance to major attractions. Features luxury amenities and 24/7 concierge.",
    image: {
      url: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZWZmaWVsJTIwdG93ZXJ8ZW58MHx8MHx8fDA%3D",
      filename: "paris-penthouse"
    },
    price: 1200,
    location: "Paris",
    country: "France",
    category: "iconic-cities",
    geometry: {
      type: "Point",
      coordinates: [2.2945, 48.8584]
    }
  },
  {
    title: "Burj Khalifa Sky Suite Dubai",
    description: "Ultra-luxury suite in the world's tallest building. Experience Dubai from the clouds with floor-to-ceiling windows, private butler service, and access to exclusive lounges. The pinnacle of modern luxury.",
    image: {
      url: "https://images.unsplash.com/photo-1640953036047-5566900ea05d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fEJ1cmolMjBraGFsaWZhfGVufDB8fDB8fHww",
      filename: "burj-khalifa-suite"
    },
    price: 2000,
    location: "Dubai",
    country: "UAE",
    category: "trending",
    geometry: {
      type: "Point",
      coordinates: [55.2744, 25.1972]
    }
  },
  {
    title: "Manhattan Skyline Loft",
    description: "Stylish loft in the heart of New York City with stunning views of the Manhattan skyline. Walking distance to Times Square, Central Park, and Broadway. Features industrial-chic design and modern amenities.",
    image: {
      url: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800",
      filename: "manhattan-loft"
    },
    price: 450,
    location: "New York City",
    country: "USA",
    category: "iconic-cities",
    geometry: {
      type: "Point",
      coordinates: [-72.9597, -51.2538]
    }
  },
  {
    title: "Lapland Ice Hotel Suite",
    description: "Sleep in a room made entirely of ice and snow. Experience the Arctic wilderness, Northern Lights, reindeer sledding, and warm up in traditional saunas. A unique winter wonderland adventure.",
    image: {
      url: "https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=800",
      filename: "lapland-ice-hotel"
    },
    price: 520,
    location: "Kiruna",
    country: "Sweden",
    category: "arctic",
    geometry: {
      type: "Point",
      coordinates: [20.2253, 67.8558]
    }
  },
  {
    title: "Great Barrier Reef Yacht",
    description: "Explore the world's largest coral reef system on a luxury yacht. Includes diving equipment, marine biologist guide, and gourmet meals. Discover pristine reefs and tropical islands.",
    image: {
      url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      filename: "barrier-reef-yacht"
    },
    price: 650,
    location: "Cairns",
    country: "Australia",
    category: "boats",
    geometry: {
      type: "Point",
      coordinates: [145.7781, -16.9186]
    }
  },
  {
    title: "Provence Lavender Farmhouse",
    description: "Charming stone farmhouse surrounded by lavender fields. Experience the French countryside with local markets, wine tours, and cooking classes. Perfect for a peaceful retreat.",
    image: {
      url: "https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=800",
      filename: "provence-farmhouse"
    },
    price: 240,
    location: "Provence",
    country: "France",
    category: "farmhouse",
    geometry: {
      type: "Point",
      coordinates: [5.0650, 43.9493]
    }
  },
  {
    title: "Angkor Wat Temple Villa",
    description: "Traditional Khmer villa near the magnificent Angkor Wat temple complex. Combines ancient culture with modern luxury. Includes temple tours, traditional dance shows, and spa treatments.",
    image: {
      url: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800",
      filename: "angkor-wat-villa"
    },
    price: 150,
    location: "Siem Reap",
    country: "Cambodia",
    category: "trending",
    geometry: {
      type: "Point",
      coordinates: [103.8670, 13.4125]
    }
  },
  {
    title: "Cappadocia Cave Hotel",
    description: "Unique cave hotel carved into fairy chimneys of Cappadocia. Famous for hot air balloon rides at sunrise. Features authentic Turkish hospitality and stunning geological formations.",
    image: {
      url: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YmVkcm9vbXxlbnwwfHwwfHx8MA%3D%3D",
      filename: "cappadocia-cave"
    },
    price: 180,
    location: "Göreme",
    country: "Turkey",
    category: "rooms",
    geometry: {
      type: "Point",
      coordinates: [34.8289, 38.6431]
    }
  },
  {
    title: "Traditional Ryokan in Tokyo",
    description: "Experience authentic Japanese hospitality in this traditional inn. Features tatami floors, futon beds, onsen baths, and kaiseki dining. Located in historic Asakusa district near Senso-ji Temple.",
    image: {
      url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
      filename: "tokyo-ryokan"
    },
    price: 280,
    location: "Tokyo",
    country: "Japan",
    category: "rooms",
    geometry: {
      type: "Point",
      coordinates: [139.7690, 35.6762]
    }
  },
  {
    title: "Clifton Beach Resort Karachi",
    description: "Luxury beachfront resort on Karachi's famous Clifton Beach. Enjoy Arabian Sea views, water sports, and vibrant city life. Features multiple pools, spa, and fine dining restaurants.",
    image: {
      url: "https://images.unsplash.com/photo-1501951023790-cefecd517f88?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGxpZnRvbiUyMEJlYWNoJTIwUmVzb3J0JTIwS2FyYWNoaXxlbnwwfHwwfHx8MA%3D%3D",
      filename: "clifton-beach-resort"
    },
    price: 130,
    location: "Karachi",
    country: "Pakistan",
    category: "pools",
    geometry: {
      type: "Point",
      coordinates: [67.0307, 24.8007]
    }
  },
  {
    title: "Faisal Mosque View Apartment",
    description: "Modern apartment with spectacular views of Faisal Mosque, one of the largest mosques in the world. Located in upscale F-7 sector of Islamabad with easy access to Margalla Hills and diplomatic enclave.",
    image: {
      url: "https://images.unsplash.com/photo-1605795733251-a0b6c96d9dea?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8RmFpc2FsJTIwTW9zcXVlfGVufDB8fDB8fHww",
      filename: "faisal-mosque-apartment"
    },
    price: 90,
    location: "Islamabad",
    country: "Pakistan",
    category: "iconic-cities",
    geometry: {
      type: "Point",
      coordinates: [73.0369, 33.7295]
    }
  },
  {
    title: "Neuschwanstein Castle Suite",
    description: "Stay near the fairy-tale Neuschwanstein Castle in Bavaria. This luxury hotel offers stunning views of the castle that inspired Disney. Includes guided tours and access to nearby Alpine attractions.",
    image: {
      url: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800",
      filename: "neuschwanstein-suite"
    },
    price: 320,
    location: "Schwangau",
    country: "Germany",
    category: "castle",
    geometry: {
      type: "Point",
      coordinates: [10.7498, 47.5576]
    }
  },
  {
    title: "Versailles Palace Guest House",
    description: "Historic guest house on the grounds of Versailles. Experience royal luxury with private garden access, antique furnishings, and proximity to the magnificent palace and gardens of Louis XIV.",
    image: {
      url: "https://images.unsplash.com/photo-1549144511-f099e773c147?w=800",
      filename: "versailles-guest-house"
    },
    price: 480,
    location: "Versailles",
    country: "France",
    category: "castle",
    geometry: {
      type: "Point",
      coordinates: [2.1204, 48.8049]
    }
  },
  {
    title: "Maldives Overwater Villa",
    description: "Luxury overwater bungalow in crystal-clear turquoise waters. Features glass floor panels, private infinity pool, and direct ocean access. All-inclusive resort with world-class diving and water sports.",
    image: {
      url: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800",
      filename: "maldives-villa"
    },
    price: 1500,
    location: "Malé",
    country: "Maldives",
    category: "pools",
    geometry: {
      type: "Point",
      coordinates: [73.5093, 4.1755]
    }
  },
  {
    title: "Sahara Desert Luxury Camp",
    description: "Experience the magic of the Sahara in luxury Berber tents. Includes camel treks, traditional music, stargazing, and gourmet dining under the stars. An unforgettable desert adventure.",
    image: {
      url: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800",
      filename: "sahara-camp"
    },
    price: 250,
    location: "Merzouga",
    country: "Morocco",
    category: "deserts",
    geometry: {
      type: "Point",
      coordinates: [-4.0000, 31.0852]
    }
  },
  {
    title: "Thar Desert Heritage Camp",
    description: "Authentic Rajasthani desert experience near Jaisalmer. Stay in decorated tents with modern amenities, enjoy camel safaris, folk performances, and traditional cuisine under starlit skies.",
    image: {
      url: "https://images.unsplash.com/photo-1542401886-65d6c61db217?w=800",
      filename: "thar-desert-camp"
    },
    price: 120,
    location: "Jaisalmer",
    country: "India",
    category: "deserts",
    geometry: {
      type: "Point",
      coordinates: [70.9083, 26.9157]
    }
  },
  {
    title: "Iceland Northern Lights Igloo",
    description: "Glass igloo perfect for viewing the Aurora Borealis. Located in remote Iceland with heated glass dome, cozy interiors, and access to hot springs. A magical Arctic experience.",
    image: {
      url: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=800",
      filename: "iceland-igloo"
    },
    price: 450,
    location: "Reykjavik",
    country: "Iceland",
    category: "arctic",
    geometry: {
      type: "Point",
      coordinates: [-21.8174, 64.1265]
    }
  },
  {
    title: "Norwegian Fjord Glass Cabin",
    description: "Minimalist glass cabin overlooking dramatic Norwegian fjords. Experience midnight sun in summer or Northern Lights in winter. Includes sauna, hiking trails, and boat access to explore fjords.",
    image: {
      url: "https://images.unsplash.com/photo-1600256698889-61ff2cd73cd8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fG5vcndheXxlbnwwfHwwfHx8MA%3D%3D",
      filename: "norway-cabin"
    },
    price: 380,
    location: "Bergen",
    country: "Norway",
    category: "arctic",
    geometry: {
      type: "Point",
      coordinates: [5.3221, 60.3913]
    }
  },
  {
    title: "Tuscany Vineyard Farmhouse",
    description: "Restored 16th-century farmhouse in the heart of Chianti wine region. Surrounded by vineyards and olive groves, featuring pool, wine cellar, and cooking classes. Perfect for a romantic getaway.",
    image: {
      url: "https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFybWhvdXNlfGVufDB8fDB8fHww",
      filename: "tuscany-farmhouse"
    },
    price: 280,
    location: "Chianti",
    country: "Italy",
    category: "farmhouse",
    geometry: {
      type: "Point",
      coordinates: [11.3847, 43.4586]
    }
  },
  {
    title: "Cotswolds Country Manor",
    description: "Charming English countryside manor in the picturesque Cotswolds. Features traditional stone architecture, English gardens, and proximity to quaint villages. Includes afternoon tea and countryside activities.",
    image: {
      url: "https://images.unsplash.com/photo-1600457008548-8a153e914616?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGZhcm0lMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D",
      filename: "cotswolds-manor"
    },
    price: 220,
    location: "Cotswolds",
    country: "UK",
    category: "farmhouse",
    geometry: {
      type: "Point",
      coordinates: [-1.7297, 51.9950]
    }
  },
  {
    title: "Mediterranean Yacht Charter",
    description: "Luxury yacht for exploring the French Riviera. Sleeps 8 guests with full crew, gourmet chef, and water toys. Cruise from Monaco to St. Tropez in ultimate style and comfort.",
    image: {
      url: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHlhY2h0fGVufDB8fDB8fHww",
      filename: "mediterranean-yacht"
    },
    price: 3000,
    location: "Monaco",
    country: "Monaco",
    category: "boats",
    geometry: {
      type: "Point",
      coordinates: [7.4246, 43.7384]
    }
  },
  {
    title: "Greek Island Catamaran",
    description: "Sail the crystal-clear waters of the Greek islands on this modern catamaran. Visit Santorini, Mykonos, and hidden coves. Includes captain, snorkeling equipment, and Mediterranean cuisine.",
    image: {
      url: "https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=800",
      filename: "greek-catamaran"
    },
    price: 800,
    location: "Santorini",
    country: "Greece",
    category: "boats",
    geometry: {
      type: "Point",
      coordinates: [25.4615, 36.3932]
    }
  },
  {
    title: "Bali Infinity Pool Villa",
    description: "Stunning clifftop villa with infinity pool overlooking the Indian Ocean. Features traditional Balinese architecture, private spa, and butler service. Walking distance to Uluwatu Temple.",
    image: {
      url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
      filename: "bali-villa"
    },
    price: 350,
    location: "Uluwatu",
    country: "Indonesia",
    category: "pools",
    geometry: {
      type: "Point",
      coordinates: [115.0890, -8.8291]
    }
  },
  {
    title: "Santorini Cave Pool Suite",
    description: "Iconic blue-domed cave suite carved into Santorini's caldera cliffs. Features private plunge pool, sunset views, and traditional Cycladic design. The perfect Greek island escape.",
    image: {
      url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800",
      filename: "santorini-cave"
    },
    price: 550,
    location: "Oia",
    country: "Greece",
    category: "trending",
    geometry: {
      type: "Point",
      coordinates: [25.3755, 36.4618]
    }
  },
  {
    title: "Amazon Rainforest Eco Lodge",
    description: "Sustainable luxury in the heart of the Amazon. Elevated treehouse suites with wildlife viewing, guided jungle tours, and indigenous cultural experiences. A true adventure in biodiversity.",
    image: {
      url: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800",
      filename: "amazon-lodge"
    },
    price: 180,
    location: "Manaus",
    country: "Brazil",
    category: "camping",
    geometry: {
      type: "Point",
      coordinates: [-60.0217, -3.1190]
    }
  },
  {
    title: "Petra Desert Camp",
    description: "Bedouin-style luxury camp near the ancient city of Petra. Experience Jordanian hospitality with traditional tents, stargazing, and easy access to the Treasury and Monastery.",
    image: {
      url: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800",
      filename: "petra-camp"
    },
    price: 160,
    location: "Petra",
    country: "Jordan",
    category: "deserts",
    geometry: {
      type: "Point",
      coordinates: [35.4444, 30.3285]
    }
  },
  {
    title: "Scottish Highland Castle",
    description: "Stay in a real Scottish castle complete with turrets, grand halls, and Highland views. Features include falconry, whisky tasting, and access to private lochs for fishing.",
    image: {
      url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800",
      filename: "scottish-castle"
    },
    price: 400,
    location: "Inverness",
    country: "Scotland",
    category: "castle",
    geometry: {
      type: "Point",
      coordinates: [-4.2026, 57.4778]
    }
  },
  {
    title: "Machu Picchu Mountain Lodge",
    description: "Exclusive lodge with direct views of Machu Picchu. Wake up to sunrise over the ancient Incan citadel. Includes guided tours, traditional Peruvian cuisine, and access to hiking trails.",
    image: {
      url: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800",
      filename: "machu-picchu-lodge"
    },
    price: 320,
    location: "Aguas Calientes",
    country: "Peru",
    category: "mountains",
    geometry: {
      type: "Point",
      coordinates: [-72.5450, -13.1631]
    }
  },
  {
    title: "Dubai Desert Safari Lodge",
    description: "Luxury desert resort offering authentic Arabian experiences. Enjoy dune bashing, camel rides, falconry, and traditional entertainment under the stars. Just 45 minutes from Dubai city.",
    image: {
      url: "https://images.unsplash.com/photo-1504326787394-e6d75cae8027?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGR1YmFpJTIwZGVzZXJ0fGVufDB8fDB8fHww",
      filename: "dubai-desert"
    },
    price: 280,
    location: "Dubai Desert",
    country: "UAE",
    category: "deserts",
    geometry: {
      type: "Point",
      coordinates: [55.5500, 24.8500]
    }
  },
  {
    title: "Banff Mountain Chalet",
    description: "Cozy Canadian Rockies chalet with stunning mountain views. Perfect for skiing in winter and hiking in summer. Features hot tub, fireplace, and proximity to Lake Louise.",
    image: {
      url: "https://images.unsplash.com/photo-1609688669309-fc15db557633?w=800",
      filename: "banff-chalet"
    },
    price: 260,
    location: "Banff",
    country: "Canada",
    category: "mountains",
    geometry: {
      type: "Point",
      coordinates: [-115.5708, 51.1784]
    }
  },
  {
    title: "Serengeti Safari Tent",
    description: "Luxury tented camp in the heart of Serengeti National Park. Witness the Great Migration, enjoy game drives, and experience African wilderness in comfort and style.",
    image: {
      url: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800",
      filename: "serengeti-tent"
    },
    price: 450,
    location: "Serengeti",
    country: "Tanzania",
    category: "camping",
    geometry: {
      type: "Point",
      coordinates: [34.8333, -2.3333]
    }
  }
];



module.exports = { data: sampleListings };
