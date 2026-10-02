import { Wifi, Car, UtensilsCrossed, Waves, Flower2, Dumbbell, Plane } from "lucide-react";

export type Hotel = {
  id: number;
  name: string;
  city: string;
  stars: number;
  rating: number;
  reviews: number;
  price: number;
  image: string;
  gallery: string[];
  amenities: string[];
  address: string;
  phone: string;
  description: string;
  highlights: string[];
};

export const hotels: Hotel[] = [
  // --- ALGIERS ---
  {
    id: 1,
    name: "Hotel El Djazaïr (Saint George)",
    city: "Algiers",
    stars: 5,
    rating: 4.6,
    reviews: 320,
    price: 16500,
    image: "/images/hotels/hotels_1_alger_s_george_img_9622_jpg.webp",
    gallery: [
      "/images/hotels/hotels_1_alger_s_george_img_9622_jpg.webp",
      "/images/hotels/hotels_22_photo-1584132967334-10e028bd69f7.webp",
      "/images/hotels/hotels_21_photo-1582719508461-905c673771fd.webp",
    ],
    amenities: ["wifi", "parking", "restaurant", "pool", "spa"],
    address: "24 Avenue des Souidani Boudjemaa, El Mouradia, Alger",
    phone: "+213 21 69 21 21",
    description:
      "Hôtel mythique niché dans un somptueux jardin botanique au cœur d'Alger. Alliant architecture hispano-mauresque et luxe intemporel.",
    highlights: ["Jardin botanique séculaire", "Architecture hispano-mauresque", "Piscine extérieure", "Restaurant gastronomique"],
  },
  {
    id: 2,
    name: "Sofitel Algiers Hamma Garden",
    city: "Algiers",
    stars: 5,
    rating: 4.8,
    reviews: 486,
    price: 22000,
    image: "/images/hotels/hotels_21_photo-1582719508461-905c673771fd.webp",
    gallery: [
      "/images/hotels/hotels_21_photo-1582719508461-905c673771fd.webp",
      "/images/hotels/hotels_22_photo-1584132967334-10e028bd69f7.webp",
      "/images/hotels/hotels_23_photo-1552566626-52f8b828add9.webp",
    ],
    amenities: ["wifi", "parking", "restaurant", "pool", "spa", "gym"],
    address: "Rue Hassiba Ben Bouali, face au Jardin d'Essai, Alger",
    phone: "+213 21 68 60 00",
    description:
      "Surplombant le Jardin d'Essai et la baie d'Alger, le Sofitel offre des suites raffinées, un spa d'exception et une gastronomie franco-méditerranéenne.",
    highlights: ["Vue panoramique baie & jardin", "Spa de luxe", "Piscine intérieure chauffée", "Service de conciergerie VIP"],
  },
  {
    id: 3,
    name: "El Aurassi Hotel",
    city: "Algiers",
    stars: 5,
    rating: 4.7,
    reviews: 412,
    price: 19500,
    image: "/images/hotels/hotels_24_photo-1568495248636-6432b97bd949.webp",
    gallery: [
      "/images/hotels/hotels_24_photo-1568495248636-6432b97bd949.webp",
      "/images/hotels/hotels_25_photo-1587985064135-0366536eab42.webp",
      "/images/hotels/hotels_23_photo-1552566626-52f8b828add9.webp",
    ],
    amenities: ["wifi", "parking", "restaurant", "pool", "spa", "gym", "shuttle"],
    address: "Avenue Frantz Fanon, Alger Centre, Alger",
    phone: "+213 21 64 88 00",
    description:
      "Symbole emblématique de la capitale dominant la baie, l'Hôtel El Aurassi offre un panorama spectaculaire sur le port et la Méditerranée.",
    highlights: ["Vue imprenable sur la baie", "Rotonde panoramique", "Grandes salles de réception", "Navette aéroport VIP"],
  },
  {
    id: 4,
    name: "Hyatt Regency Algiers Airport",
    city: "Algiers",
    stars: 5,
    rating: 4.8,
    reviews: 350,
    price: 21000,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&h=800&fit=crop&q=80",
    ],
    amenities: ["wifi", "parking", "restaurant", "pool", "spa", "gym", "shuttle"],
    address: "Aéroport International Houari Boumediene, Alger",
    phone: "+213 23 88 12 34",
    description:
      "Directement relié au terminal international, cet hôtel allie design ultra-moderne, insonorisation de pointe et confort d'affaires absolu.",
    highlights: ["Accès direct terminal", "Insonorisation acoustique", "Centre de fitness 24/7", "Salons exécutifs"],
  },
  {
    id: 5,
    name: "AZ Hotel Kouba",
    city: "Algiers",
    stars: 4,
    rating: 4.4,
    reviews: 198,
    price: 11500,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&h=800&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&h=800&fit=crop&q=80",
      "/images/hotels/hotels_23_photo-1552566626-52f8b828add9.webp",
    ],
    amenities: ["wifi", "parking", "restaurant", "spa", "gym"],
    address: "Kouba, Alger",
    phone: "+213 23 78 40 40",
    description:
      "Élégance contemporaine et accueil soigné sur les hauteurs de Kouba. Chambres lumineuses, spa complet et restaurant méditerranéen.",
    highlights: ["Accès rapide autoroute", "Spa & hammam", "Chambres contemporaines", "Petit-déjeuner buffet"],
  },
  {
    id: 6,
    name: "Hotel El Andalous",
    city: "Algiers",
    stars: 3,
    rating: 4.1,
    reviews: 145,
    price: 7500,
    image: "/images/hotels/hotels_15_hotel_el_andalous_-_panoramio_jpg.webp",
    gallery: [
      "/images/hotels/hotels_15_hotel_el_andalous_-_panoramio_jpg.webp",
      "/images/hotels/hotels_16_hotel_jardy_-_panoramio_jpg.webp",
    ],
    amenities: ["wifi", "parking", "restaurant"],
    address: "Fondouk El Andalous, Alger Centre",
    phone: "+213 21 71 23 45",
    description:
      "Hôtel de caractère au décor d'inspiration andalouse, idéalement placé pour visiter la Casbah historique et le front de mer.",
    highlights: ["Proche de la Casbah", "Ambiance andalouse", "Accueil chaleureux", "Emplacement central"],
  },

  // --- ORAN ---
  {
    id: 7,
    name: "Sheraton Oran Hotel",
    city: "Oran",
    stars: 5,
    rating: 4.7,
    reviews: 420,
    price: 16500,
    image: "/images/hotels/hotels_4_sheraton_oran_hotel_algeria_jpg.webp",
    gallery: [
      "/images/hotels/hotels_4_sheraton_oran_hotel_algeria_jpg.webp",
      "/images/hotels/hotels_5_sheraton_oran_8_jpg.webp",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&h=800&fit=crop&q=80",
    ],
    amenities: ["wifi", "parking", "restaurant", "pool", "spa", "gym"],
    address: "Quartier Seddikia, Front de Mer Est, Oran",
    phone: "+213 41 26 60 00",
    description:
      "Le Sheraton Oran domine majestueusement le front de mer avec ses tours modernes. Piscines intérieure et extérieure, spa et restaurants internationaux.",
    highlights: ["Vue panoramique baie d'Oran", "Piscine lagon extérieure", "Centre de remise en forme", "Restaurants gastronomiques"],
  },
  {
    id: 8,
    name: "Le Méridien Oran Hotel & Convention",
    city: "Oran",
    stars: 5,
    rating: 4.8,
    reviews: 388,
    price: 18500,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&h=800&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&h=800&fit=crop&q=80",
      "/images/hotels/hotels_5_sheraton_oran_8_jpg.webp",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&h=800&fit=crop&q=80",
    ],
    amenities: ["wifi", "parking", "restaurant", "pool", "spa", "gym"],
    address: "Les Genêts, Chemin des Crêtes, Oran",
    phone: "+213 41 98 40 00",
    description:
      "Perché sur une falaise spectaculaire face à la Méditerranée, Le Méridien offre une vue à couper le souffle, une piscine à débordement et un confort d'élite.",
    highlights: ["Piscine à débordement falaise", "Vue mer à 180°", "Centre de congrès international", "Cuisine fusion"],
  },
  {
    id: 9,
    name: "Royal Hotel Oran MGallery",
    city: "Oran",
    stars: 5,
    rating: 4.9,
    reviews: 290,
    price: 21500,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&h=800&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&h=800&fit=crop&q=80",
      "/images/hotels/hotels_4_sheraton_oran_hotel_algeria_jpg.webp",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=800&fit=crop&q=80",
    ],
    amenities: ["wifi", "parking", "restaurant", "spa", "gym"],
    address: "1 Boulevard de la Soummam, Oran",
    phone: "+213 41 29 17 17",
    description:
      "Joyau historique du centre-ville d'Oran fondé en 1920, alliant mobilier d'époque, œuvres d'art originales et service palace discret.",
    highlights: ["Hôtel historique de charme", "Collection d'œuvres d'art", "Spa & soins sur mesure", "Emplacement cœur de ville"],
  },
  {
    id: 10,
    name: "Hotel Liberté Oran",
    city: "Oran",
    stars: 4,
    rating: 4.3,
    reviews: 172,
    price: 9500,
    image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&h=800&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&h=800&fit=crop&q=80",
      "/images/hotels/hotels_5_sheraton_oran_8_jpg.webp",
    ],
    amenities: ["wifi", "parking", "restaurant", "pool", "gym"],
    address: "Zone des Hôtels, USTO, Oran",
    phone: "+213 41 27 00 00",
    description:
      "Complexe hôtelier moderne doté d'une piscine couverte, de chambres spacieuses et de restaurants variés, idéal pour voyages d'affaires et séjours en famille.",
    highlights: ["Piscine intérieure", "Proche de l'USTO", "Buffet varié", "Parking sécurisé"],
  },

  // --- CONSTANTINE ---
  {
    id: 11,
    name: "Constantine Marriott Hotel",
    city: "Constantine",
    stars: 5,
    rating: 4.8,
    reviews: 310,
    price: 17500,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&h=800&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200&h=800&fit=crop&q=80",
    ],
    amenities: ["wifi", "parking", "restaurant", "pool", "spa", "gym"],
    address: "Chaab Ersas, Université Mentouri, Constantine",
    phone: "+213 31 73 10 00",
    description:
      "Somptueux complexe hôtelier 5 étoiles célébrant l'élégance de la ville des ponts suspendus. Grands jardins, spa d'élite et restaurants raffinés.",
    highlights: ["Piscine olympique extérieure", "Spa Saray haut de gamme", "Cuisine internationale", "Vue sur les collines"],
  },
  {
    id: 12,
    name: "Hotel Cirta Constantine",
    city: "Constantine",
    stars: 4,
    rating: 4.6,
    reviews: 245,
    price: 12500,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&h=800&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&h=800&fit=crop&q=80",
    ],
    amenities: ["wifi", "parking", "restaurant", "pool"],
    address: "1 Avenue Rahmani Cherif, Place du 1er Novembre, Constantine",
    phone: "+213 31 92 64 64",
    description:
      "Bâti en 1912 au cœur historique de Constantine, l'Hôtel Cirta a été magnifiquement restauré avec ses arabesques, ses coupoles et son charme néo-mauresque.",
    highlights: ["Monument historique 1912", "Cœur battant de la ville", "Proche du pont Sidi M'Cid", "Architecture néo-mauresque"],
  },
  {
    id: 13,
    name: "Protea Hotel by Marriott Constantine",
    city: "Constantine",
    stars: 4,
    rating: 4.4,
    reviews: 180,
    price: 10500,
    image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200&h=800&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&h=800&fit=crop&q=80",
    ],
    amenities: ["wifi", "parking", "restaurant", "gym"],
    address: "Bellevue, Route de Sétif, Constantine",
    phone: "+213 31 84 88 00",
    description:
      "Hôtel contemporain et fonctionnel situé dans le quartier dynamique de Bellevue, à proximité immédiate des grands axes et des universités.",
    highlights: ["Chambres modernes & spacieuses", "Restaurant panoramique", "Centre d'affaires", "Accès aéroport facile"],
  },

  // --- TLEMCEN ---
  {
    id: 14,
    name: "Renaissance Tlemcen Hotel",
    city: "Tlemcen",
    stars: 5,
    rating: 4.8,
    reviews: 340,
    price: 16000,
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&h=800&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&h=800&fit=crop&q=80",
      "/home-page-pic/el-machouar.jpg",
    ],
    amenities: ["wifi", "parking", "restaurant", "pool", "spa", "gym"],
    address: "Plateau Lalla Setti, Tlemcen",
    phone: "+213 43 40 11 11",
    description:
      "Perché sur le célèbre plateau de Lalla Setti avec une vue panoramique sur toute la cité zianide, le Renaissance incarne le grand luxe et l'art de vivre tlemcénien.",
    highlights: ["Vue panoramique plateau Lalla Setti", "Piscines extérieure et couverte", "Hammam traditionnel & spa", "Parc boisé et téléphérique"],
  },
  {
    id: 15,
    name: "Hotel Les Zianides",
    city: "Tlemcen",
    stars: 4,
    rating: 4.3,
    reviews: 195,
    price: 9000,
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&h=800&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&h=800&fit=crop&q=80",
      "/images/destinations/destinations_13_grande_mosqu_e_de_tlemcen_jpg.webp",
    ],
    amenities: ["wifi", "parking", "restaurant", "pool"],
    address: "Boulevard Khedim Ali, Tlemcen",
    phone: "+213 43 27 71 20",
    description:
      "Hôtel historique de Tlemcen aux lignes andalouses élégantes, entouré de jardins d'oliviers et doté d'une superbe piscine centrale.",
    highlights: ["Jardin andalou et piscine", "Proche du Palais El Mechouar", "Cuisine traditionnelle zianide", "Ambiance paisible"],
  },

  // --- ANNABA ---
  {
    id: 16,
    name: "Sheraton Annaba Hotel",
    city: "Annaba",
    stars: 5,
    rating: 4.7,
    reviews: 310,
    price: 15500,
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1200&h=800&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1200&h=800&fit=crop&q=80",
      "/images/hotels/hotels_5_hotel_mountazeh1_jpg.webp",
      "/home-page-pic/annaba.jpg",
    ],
    amenities: ["wifi", "parking", "restaurant", "pool", "spa", "gym"],
    address: "Boulevard Victor Hugo, Centre-ville, Annaba",
    phone: "+213 38 45 10 00",
    description:
      "Tour de verre futuriste dressée face à la mer et au cours de la Révolution. Suites de grand prestige, spa panoramique et gastronomie d'élite.",
    highlights: ["Tour panoramique face mer", "Piscine sur le toit", "Spa moderne", "Cœur vibrant d'Annaba"],
  },
  {
    id: 17,
    name: "Sabri Hotel Annaba",
    city: "Annaba",
    stars: 4,
    rating: 4.4,
    reviews: 185,
    price: 9500,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&h=800&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&h=800&fit=crop&q=80",
      "/home-page-pic/Annaba #6.jpg",
    ],
    amenities: ["wifi", "parking", "restaurant", "pool", "beach"],
    address: "Corniche de Chapuis, Plage Rafaello, Annaba",
    phone: "+213 38 88 50 00",
    description:
      "Situé en front de mer sur la corniche de Chapuis avec accès direct aux plages et aux animations maritimes estivales.",
    highlights: ["Accès direct plage Chapuis", "Piscine face mer", "Terrasse marine", "Idéal vacances balnéaires"],
  },
  {
    id: 18,
    name: "Hotel Mountazah Séraïdi",
    city: "Annaba",
    stars: 3,
    rating: 4.2,
    reviews: 140,
    price: 7500,
    image: "/images/hotels/hotels_5_hotel_mountazeh1_jpg.webp",
    gallery: [
      "/images/hotels/hotels_5_hotel_mountazeh1_jpg.webp",
      "/images/hotels/hotels_6_mountazah_s_ra_di_annaba_mahieddine.webp",
    ],
    amenities: ["wifi", "parking", "restaurant", "pool"],
    address: "Village de Séraïdi, Massif de l'Édough, Annaba",
    phone: "+213 38 87 12 34",
    description:
      "Perché à 850 mètres d'altitude dans les forêts de chênes-lièges de Séraïdi, offrant un air pur et un panorama exceptionnel sur le golfe d'Annaba.",
    highlights: ["Altitude 850m & air pur", "Panorama sur la baie", "Forêt de l'Édough", "Climat frais en été"],
  },

  // --- GHARDAÏA (M'ZAB VALLEY) ---
  {
    id: 19,
    name: "Maison d'Hôtes Akham M'Zab",
    city: "Ghardaïa",
    stars: 4,
    rating: 4.9,
    reviews: 165,
    price: 11000,
    image: "https://images.unsplash.com/photo-1549294413-26f195200c16?w=1200&h=800&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1549294413-26f195200c16?w=1200&h=800&fit=crop&q=80",
      "/images/destinations/destinations_13_ksar_ghardaia_place_march_1_jpg.webp",
    ],
    amenities: ["wifi", "parking", "restaurant"],
    address: "Palmeraie de Beni Isguen, Vallée du M'Zab, Ghardaïa",
    phone: "+213 29 88 41 12",
    description:
      "Demeure d'hôte d'exception construite en argile traditionnelle au cœur de la palmeraie. Sérénité, architecture mozabite classée UNESCO et dîners aux chandelles.",
    highlights: ["Architecture mozabite UNESCO", "Palmeraie paisible", "Cuisine du terroir du M'Zab", "Visites guidées des ksour"],
  },
  {
    id: 20,
    name: "Hotel Belvédère Ghardaïa",
    city: "Ghardaïa",
    stars: 3,
    rating: 4.2,
    reviews: 110,
    price: 6800,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=800&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=800&fit=crop&q=80",
      "/images/destinations/destinations_13_ksar_ghardaia_place_march_1_jpg.webp",
    ],
    amenities: ["wifi", "parking", "restaurant", "pool"],
    address: "Route de Melika, Ghardaïa",
    phone: "+213 29 87 23 45",
    description:
      "Sur les hauteurs dominant la pentapole du M'Zab, cet hôtel offre une vue remarquable sur les minarets pyramidaux et les palmeraies.",
    highlights: ["Vue panoramique pentapole", "Piscine au soleil", "Terrasse d'observation", "Excursions dans le désert"],
  },

  // --- DJANET (TASSILI N'AJJER) ---
  {
    id: 21,
    name: "Tassili Lodge Djanet",
    city: "Djanet",
    stars: 4,
    rating: 4.9,
    reviews: 142,
    price: 13500,
    image: "/home-page-pic/tassili-djanet.jpg",
    gallery: [
      "/home-page-pic/tassili-djanet.jpg",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1200&h=800&fit=crop&q=80",
    ],
    amenities: ["wifi", "parking", "restaurant", "shuttle"],
    address: "Oasis de Taghfassat, Djanet",
    phone: "+213 29 47 15 60",
    description:
      "Écolodge raffiné aux portes du Parc National du Tassili N'Ajjer. Confort discret, repas traditionnels touaregs sous les étoiles et guides certifiés.",
    highlights: ["Porte du Tassili N'Ajjer (UNESCO)", "Tentes berbères & suites climatisées", "Bivouacs sur mesure", "Hospitalité touarègue"],
  },
  {
    id: 22,
    name: "Tenere Desert Luxury Camp",
    city: "Djanet",
    stars: 4,
    rating: 4.8,
    reviews: 98,
    price: 14000,
    image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1200&h=800&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1200&h=800&fit=crop&q=80",
      "/home-page-pic/tassili-djanet.jpg",
    ],
    amenities: ["parking", "restaurant", "shuttle"],
    address: "Plateau d'Ihadjen, Djanet",
    phone: "+213 29 47 33 21",
    description:
      "Campement d'exception sous les cieux les plus purs du Sahara. Lits confortables, cuisine saharienne raffinée et soirées contes autour du feu de camp.",
    highlights: ["Nuit sous la Voie Lactée", "Feu de camp & thé traditionnel", "Circuits en 4x4", "Cuisine locale bio"],
  },

  // --- TAGHIT & BÉCHAR ---
  {
    id: 23,
    name: "Hôtel Saoura Taghit",
    city: "Taghit",
    stars: 4,
    rating: 4.7,
    reviews: 215,
    price: 11500,
    image: "/images/hotels/hotels_13_42_taghit_jpg.webp",
    gallery: [
      "/images/hotels/hotels_13_42_taghit_jpg.webp",
      "/images/hotels/hotels_12_b_char_taghit_hotel_jpg.webp",
      "/home-page-pic/beni-abbes.jpg",
    ],
    amenities: ["wifi", "parking", "restaurant", "pool"],
    address: "Face à la Grande Dune, Taghit, Saoura",
    phone: "+213 49 76 10 00",
    description:
      "Chef-d'œuvre de l'architecte Fernand Pouillon posé face à la monumentale grande dune dorée de Taghit. Piscine avec vue sur les crêtes de sable.",
    highlights: ["Vue frontale sur la grande dune", "Architecture Pouillon", "Piscine bordée de palmiers", "Excursions gravures rupestres"],
  },
  {
    id: 24,
    name: "Taghit Hotel Oasis",
    city: "Béchar",
    stars: 3,
    rating: 4.1,
    reviews: 120,
    price: 6500,
    image: "/images/hotels/hotels_12_b_char_taghit_hotel_jpg.webp",
    gallery: [
      "/images/hotels/hotels_12_b_char_taghit_hotel_jpg.webp",
      "/images/hotels/hotels_13_42_taghit_jpg.webp",
    ],
    amenities: ["wifi", "parking", "restaurant"],
    address: "Entrée Ksar historique, Béchar",
    phone: "+213 49 76 12 34",
    description:
      "Idéal pour explorer les ksour de la Saoura, cet établissement convivial propose des chambres climatisées et des guides pour les randonnées chamelières.",
    highlights: ["Proche du Ksar", "Sorties méharées", "Dîners sahariens", "Tarif accessible"],
  },

  // --- TIMIMOUN ---
  {
    id: 25,
    name: "Gourara Hotel Timimoun",
    city: "Timimoun",
    stars: 4,
    rating: 4.5,
    reviews: 190,
    price: 9800,
    image: "/images/hotels/hotels_10_gourara_pouillon_jpg.webp",
    gallery: [
      "/images/hotels/hotels_10_gourara_pouillon_jpg.webp",
      "/images/hotels/hotels_11_terrasse_de_l_hotel_oasis_rouge_de_.webp",
      "/images/destinations/destinations_48_entr_e_de_timimoun_jpg.webp",
    ],
    amenities: ["wifi", "parking", "restaurant", "pool"],
    address: "Corniche de Timimoun, L'Oasis Rouge",
    phone: "+213 49 90 20 00",
    description:
      "Œuvre remarquable en terre cuite rouge de Fernand Pouillon épousant les formes de la falaise dominant la Sebkha et les dunes du Grand Erg.",
    highlights: ["Architecture en terre ocre", "Piscine avec vue sur la sebkha", "Couchers de soleil magiques", "Oasis rouge"],
  },
  {
    id: 26,
    name: "Hotel Oasis Rouge",
    city: "Timimoun",
    stars: 3,
    rating: 4.2,
    reviews: 115,
    price: 6500,
    image: "/images/hotels/hotels_11_terrasse_de_l_hotel_oasis_rouge_de_.webp",
    gallery: [
      "/images/hotels/hotels_11_terrasse_de_l_hotel_oasis_rouge_de_.webp",
      "/images/hotels/hotels_10_gourara_pouillon_jpg.webp",
    ],
    amenities: ["wifi", "parking", "restaurant", "pool"],
    address: "Route de Tindouf, Timimoun",
    phone: "+213 49 90 34 56",
    description:
      "Auberge chaleureuse offrant une vaste terrasse panoramique ombragée par les palmiers et une immersion totale dans la culture gourarie.",
    highlights: ["Terrasse panoramique", "Piscine rafraîchissante", "Musique et thé le soir", "Découverte des foggaras"],
  },

  // --- BÉJAÏA ---
  {
    id: 27,
    name: "Atlantis Hotel Béjaïa",
    city: "Béjaïa",
    stars: 4,
    rating: 4.6,
    reviews: 210,
    price: 11000,
    image: "https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=1200&h=800&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=1200&h=800&fit=crop&q=80",
      "/images/hotels/hotels_7_hotel_raya_-_tichy_-_panoramio_jpg.webp",
      "/images/destinations/destinations_6_b_ja_a_brise_de_mer_jpg.webp",
    ],
    amenities: ["wifi", "parking", "restaurant", "pool", "spa", "gym"],
    address: "Boulevard Krim Belkacem, Béjaïa",
    phone: "+213 34 16 00 00",
    description:
      "Établissement moderne offrant des vues splendides sur le golfe de Bougie et le mont Gouraya. Chambres haut de gamme et restaurant panoramique.",
    highlights: ["Vue baie et Cap Carbon", "Spa & piscine couverte", "Restauration fruits de mer", "Proche du centre d'affaires"],
  },
  {
    id: 28,
    name: "Hotel Raya Tichy",
    city: "Béjaïa",
    stars: 3,
    rating: 4.1,
    reviews: 130,
    price: 6500,
    image: "/images/hotels/hotels_7_hotel_raya_-_tichy_-_panoramio_jpg.webp",
    gallery: [
      "/images/hotels/hotels_7_hotel_raya_-_tichy_-_panoramio_jpg.webp",
      "https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=1200&h=800&fit=crop&q=80",
    ],
    amenities: ["wifi", "parking", "restaurant", "beach"],
    address: "Front de Mer, Tichy, Béjaïa",
    phone: "+213 34 21 56 78",
    description:
      "Situé au bord de la plage dorée de Tichy avec en arrière-plan les majestueuses montagnes de Kabylie. Accueil familial et convivial.",
    highlights: ["Accès direct plage de Tichy", "Vue montagnes & Méditerranée", "Terrasse marine", "Idéal séjours balnéaires"],
  },
  {
    id: 29,
    name: "Hotel Les Oliviers",
    city: "Béjaïa",
    stars: 3,
    rating: 4.0,
    reviews: 95,
    price: 5800,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=800&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=800&fit=crop&q=80",
      "/images/destinations/destinations_6_b_ja_a_brise_de_mer_jpg.webp",
    ],
    amenities: ["wifi", "parking", "restaurant"],
    address: "Rue de la Liberté, Béjaïa Centre",
    phone: "+213 34 22 14 30",
    description:
      "Hôtel agréable au cœur de Béjaïa pour profiter des ruelles historiques, du port et des sentiers du Parc National de Gouraya.",
    highlights: ["Centre-ville commerçant", "Rapport qualité/prix", "Excursions Gouraya", "Atmosphère chaleureuse"],
  },

  // --- TIPAZA ---
  {
    id: 30,
    name: "Dar El Ghaba Tipaza",
    city: "Tipaza",
    stars: 4,
    rating: 4.7,
    reviews: 180,
    price: 10500,
    image: "/images/hotels/hotels_28_photo-1445019980597-93fa8acb246c.webp",
    gallery: [
      "/images/hotels/hotels_28_photo-1445019980597-93fa8acb246c.webp",
      "/images/hotels/hotels_29_photo-1611892440504-42a792e24d32.webp",
      "/home-page-pic/tipaza.jpg",
    ],
    amenities: ["wifi", "parking", "restaurant", "pool"],
    address: "Colline des Pins, Route des Ruines, Tipaza",
    phone: "+213 24 43 21 08",
    description:
      "Niché au milieu d'une pinède parfumée surplombant la mer et les célèbres ruines romaines classées UNESCO. Piscine d'eau de source et calme olympien.",
    highlights: ["Vue panoramique mer et ruines", "Cadre forestier reposant", "Piscine dans les pins", "Gastronomie de poissons frais"],
  },
  {
    id: 31,
    name: "Hôtel La Baie des Pirates",
    city: "Tipaza",
    stars: 4,
    rating: 4.4,
    reviews: 135,
    price: 9000,
    image: "/home-page-pic/Tipaza ✨🇩🇿.jpg",
    gallery: [
      "/home-page-pic/Tipaza ✨🇩🇿.jpg",
      "/images/hotels/hotels_28_photo-1445019980597-93fa8acb246c.webp",
    ],
    amenities: ["wifi", "parking", "restaurant", "beach"],
    address: "Plage Chenoua, Tipaza",
    phone: "+213 24 47 50 12",
    description:
      "Face aux eaux turquoise de la crique de Chenoua, cet hôtel de villégiature garantit des vacances pieds dans l'eau inoubliables.",
    highlights: ["Pieds dans l'eau crique Chenoua", "Cuisine de la mer", "Terrasse au coucher du soleil", "Proche port de Tipaza"],
  },

  // --- BISKRA ---
  {
    id: 32,
    name: "Hotel Les Zibans",
    city: "Biskra",
    stars: 4,
    rating: 4.4,
    reviews: 160,
    price: 8500,
    image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&h=800&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&h=800&fit=crop&q=80",
      "/images/hotels/hotels_17_eljanoub_hotel_by_fayeq_alnatour_jp.webp",
    ],
    amenities: ["wifi", "parking", "restaurant", "pool", "spa"],
    address: "Boulevard de la Palmeraie, Biskra",
    phone: "+213 33 74 20 20",
    description:
      "La reine des Zibans. Cet hôtel doté d'une immense piscine ombragée par des dattiers Deglet Nour offre tout le charme de la porte du désert.",
    highlights: ["Piscine sous les palmiers", "Dégustation Deglet Nour", "Bains thermaux Hammam Salhine", "Ambiance saharienne"],
  },
  {
    id: 33,
    name: "Hotel El Janoub",
    city: "Biskra",
    stars: 3,
    rating: 4.0,
    reviews: 75,
    price: 5200,
    image: "/images/hotels/hotels_17_eljanoub_hotel_by_fayeq_alnatour_jp.webp",
    gallery: [
      "/images/hotels/hotels_17_eljanoub_hotel_by_fayeq_alnatour_jp.webp",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&h=800&fit=crop&q=80",
    ],
    amenities: ["wifi", "parking", "restaurant"],
    address: "Centre-ville, Biskra",
    phone: "+213 33 74 56 78",
    description:
      "Hôtel étape confortable pour découvrir les gorges d'El Kantara, le balcon de Rhoufi et les marchés de dattes de la région.",
    highlights: ["Porte des Aurès & Sahara", "Proche marché de dattes", "Excursions canyon Rhoufi", "Prix abordable"],
  },

  // --- MOSTAGANEM ---
  {
    id: 34,
    name: "Hotel Zina Beach Resort",
    city: "Mostaganem",
    stars: 4,
    rating: 4.3,
    reviews: 145,
    price: 9500,
    image: "/images/hotels/hotels_18_bureau_reception_hotel_zina_beach_m.webp",
    gallery: [
      "/images/hotels/hotels_18_bureau_reception_hotel_zina_beach_m.webp",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&h=800&fit=crop&q=80",
    ],
    amenities: ["wifi", "parking", "restaurant", "pool", "beach"],
    address: "Plage des Sablettes, Mostaganem",
    phone: "+213 45 21 67 89",
    description:
      "Resort familial les pieds dans l'eau avec parcs aquatiques, piscines et accès direct aux longues plages de sable fin de la côte ouest.",
    highlights: ["Accès direct plage", "Piscines & toboggans", "Idéal vacances famille", "Cuisine méditerranéenne"],
  },

  // --- TIKJDA / BOUIRA ---
  {
    id: 35,
    name: "Hotel Djurdjura Tikjda",
    city: "Tikjda",
    stars: 3,
    rating: 4.2,
    reviews: 110,
    price: 6000,
    image: "/images/hotels/hotels_8_djurdjura_hotel_jpg.webp",
    gallery: [
      "/images/hotels/hotels_8_djurdjura_hotel_jpg.webp",
      "/images/hotels/hotels_9_h_tel_de_tikjda_nuit_jpg.webp",
    ],
    amenities: ["wifi", "parking", "restaurant"],
    address: "Station de ski & montagne de Tikjda, Bouira",
    phone: "+213 26 34 12 56",
    description:
      "Au cœur de la forêt de cèdres millénaires du Parc National du Djurdjura à 1478m d'altitude. Neige en hiver et fraîcheur en été.",
    highlights: ["Altitude 1478m", "Forêt de cèdres de l'Atlas", "Ski d'hiver & randonnées d'été", "Paysages grandioses"],
  },

  // --- BATNA ---
  {
    id: 36,
    name: "Hôtel Timgad Batna",
    city: "Batna",
    stars: 3,
    rating: 4.1,
    reviews: 90,
    price: 5800,
    image: "/images/hotels/hotels_26_photo-1587985064135-0366536eab42.webp",
    gallery: [
      "/images/hotels/hotels_26_photo-1587985064135-0366536eab42.webp",
      "/images/destinations/destinations_5_roman_ruins_of_timgad_jpg.webp",
    ],
    amenities: ["wifi", "parking", "restaurant"],
    address: "Boulevard de la Liberté, Batna",
    phone: "+213 33 81 22 47",
    description:
      "Base idéale pour explorer la cité romaine intacte de Timgad (UNESCO) et les spectaculaires canyons des Aurès.",
    highlights: ["Proche de Timgad antique", "Cœur commerçant de Batna", "Excursions canyon du Ghoufi", "Bon rapport qualité/prix"],
  },

  // --- OUARGLA ---
  {
    id: 37,
    name: "Hotel El Mehri Ouargla",
    city: "Ouargla",
    stars: 3,
    rating: 4.0,
    reviews: 65,
    price: 5500,
    image: "/images/hotels/hotels_18_ouarglahotel_png.webp",
    gallery: [
      "/images/hotels/hotels_18_ouarglahotel_png.webp",
      "/images/destinations/destinations_28_ouargla_jpg.webp",
    ],
    amenities: ["wifi", "parking", "restaurant"],
    address: "Boulevard Colonel Si El Haouas, Ouargla",
    phone: "+213 29 76 12 34",
    description:
      "Au carrefour des grandes routes sahariennes et des oasis du Sud, proposant un hébergement pratique et climatisé.",
    highlights: ["Carrefour saharien", "Musée du Sahara à proximité", "Chambres climatisées", "Cuisine du terroir"],
  },

  // --- RELIZANE ---
  {
    id: 38,
    name: "Grand Hotel Mina",
    city: "Relizane",
    stars: 3,
    rating: 3.9,
    reviews: 50,
    price: 5000,
    image: "/images/hotels/hotels_14_grand_hotel_mina_relizane_alg_rie_j.webp",
    gallery: [
      "/images/hotels/hotels_14_grand_hotel_mina_relizane_alg_rie_j.webp",
    ],
    amenities: ["wifi", "parking", "restaurant"],
    address: "Boulevard de la République, Relizane",
    phone: "+213 37 50 12 34",
    description:
      "Hôtel central idéal pour une escale reposante entre Alger et l'Oranie, au milieu des riches plaines agricoles de la Mina.",
    highlights: ["Étape autoroute Est-Ouest", "Centre-ville paisible", "Accueil chaleureux", "Tarif avantageux"],
  },
];

export const amenityIcons: Record<string, typeof Wifi> = {
  wifi: Wifi,
  parking: Car,
  restaurant: UtensilsCrossed,
  pool: Waves,
  beach: Waves,
  spa: Flower2,
  gym: Dumbbell,
  shuttle: Plane,
};

export const amenityLabels: Record<string, string> = {
  wifi: "WiFi",
  parking: "Parking",
  restaurant: "Restaurant",
  pool: "Piscine",
  beach: "Plage",
  spa: "Spa & Bien-être",
  gym: "Salle de sport",
  shuttle: "Navette aéroport",
};

export const cities = [
  "All",
  "Algiers",
  "Oran",
  "Constantine",
  "Tlemcen",
  "Annaba",
  "Ghardaïa",
  "Djanet",
  "Taghit",
  "Timimoun",
  "Béjaïa",
  "Tipaza",
  "Biskra",
  "Mostaganem",
  "Tikjda",
  "Batna",
  "Ouargla",
  "Relizane",
  "Béchar",
];
