// Shared destinations data used across the app

export type Destination = {
  code?: number;
  name: string;
  subtitle: string;
  region: "north" | "highlands" | "sahara" | "littoral";
  type: string;
  rating: number;
  description: string;
  image: string;
};

export const destinations: Destination[] = [
  {
    "code": 1,
    "name": "Adrar",
    "subtitle": "Oasis / desert",
    "region": "sahara",
    "type": "Oasis",
    "rating": 4.5,
    "description": "Deep Sahara desert oasis with stunning landscapes and traditional ksars.",
    "image": "/home-page-pic/adrar.jpg"
  },
  {
    "code": 2,
    "name": "Chlef",
    "subtitle": "Mediterranean coast",
    "region": "north",
    "type": "Coastal",
    "rating": 4,
    "description": "Coastal wilaya with Mediterranean charm and historic sites.",
    "image": "/images/destinations/destinations_2_chelaf_jpg.webp"
  },
  {
    "code": 3,
    "name": "Laghouat",
    "subtitle": "Old Laghouat",
    "region": "highlands",
    "type": "Historical",
    "rating": 3.9,
    "description": "Gateway to the Sahara with traditional architecture and museums.",
    "image": "/images/destinations/destinations_3_mus_communal_de_laghouat_jpg.webp"
  },
  {
    "code": 4,
    "name": "Oum El Bouaghi",
    "subtitle": "City",
    "region": "highlands",
    "type": "City",
    "rating": 3.8,
    "description": "Highland city known for its agricultural heritage and traditional markets.",
    "image": "/images/destinations/destinations_4_images_5_-fi19766530_jpeg.webp"
  },
  {
    "code": 5,
    "name": "Batna",
    "subtitle": "Timgad & Aurès",
    "region": "highlands",
    "type": "UNESCO",
    "rating": 4.8,
    "description": "Home to UNESCO Timgad ruins, the Pompeii of Africa, and majestic Aurès mountains.",
    "image": "/images/destinations/destinations_5_roman_ruins_of_timgad_jpg.webp"
  },
  {
    "code": 6,
    "name": "Béjaïa",
    "subtitle": "Gouraya / coast",
    "region": "north",
    "type": "Coastal",
    "rating": 4.7,
    "description": "Beautiful coastal city with Gouraya National Park and pristine beaches.",
    "image": "/images/destinations/destinations_6_b_ja_a_brise_de_mer_jpg.webp"
  },
  {
    "code": 7,
    "name": "Biskra",
    "subtitle": "Palm oasis",
    "region": "sahara",
    "type": "Oasis",
    "rating": 4.4,
    "description": "Gateway to Sahara with vast palm groves, El Kantara gorges, and Deglet Nour dates.",
    "image": "/images/destinations/destinations_7_dattes_de_deglet_nour_tolga_wilaya_.webp"
  },
  {
    "code": 8,
    "name": "Béchar",
    "subtitle": "City / Taghit Sahara",
    "region": "sahara",
    "type": "Sahara",
    "rating": 4.6,
    "description": "Desert city gateway with Taghit oasis and stunning Saharan dunes.",
    "image": "/home-page-pic/Bechar.jpg"
  },
  {
    "code": 9,
    "name": "Blida",
    "subtitle": "Chréa mountains",
    "region": "north",
    "type": "Mountains",
    "rating": 4.3,
    "description": "Mountain wilaya famous for Chréa National Park and winter cedar forests.",
    "image": "/home-page-pic/chrea.jpg"
  },
  {
    "code": 10,
    "name": "Bouira",
    "subtitle": "Tikjda",
    "region": "north",
    "type": "Mountains",
    "rating": 4.4,
    "description": "Mountain destination with Tikjda ski resort and breathtaking views.",
    "image": "/images/destinations/destinations_10_c8af133772b605f88bbddc94068f8cf5_jp.webp"
  },
  {
    "code": 11,
    "name": "Tamanrasset",
    "subtitle": "Ahaggar & Assekrem",
    "region": "sahara",
    "type": "Sahara",
    "rating": 4.9,
    "description": "Gateway to Hoggar mountains and the majestic Assekrem plateau.",
    "image": "/images/destinations/destinations_11_cour_d_assises_de_tamanrasset_jpg.webp"
  },
  {
    "code": 12,
    "name": "Tébessa",
    "subtitle": "Roman ruins",
    "region": "highlands",
    "type": "UNESCO",
    "rating": 4.3,
    "description": "Ancient Roman city with well-preserved ruins and historic basilica.",
    "image": "/images/destinations/destinations_12_basilique_sainte-crispie_3_tebessa-.webp"
  },
  {
    "code": 13,
    "name": "Tlemcen",
    "subtitle": "Palais El Mechouar & Zianides",
    "region": "north",
    "type": "Historical",
    "rating": 4.8,
    "description": "Capital of Zianide kingdom with stunning Moorish architecture, El Mechouar Palace, and UNESCO Chedda heritage.",
    "image": "/home-page-pic/el-machouar.jpg"
  },
  {
    "code": 14,
    "name": "Tiaret",
    "subtitle": "City",
    "region": "highlands",
    "type": "City",
    "rating": 3.7,
    "description": "Historic highland city known for its agricultural traditions.",
    "image": "/images/destinations/destinations_63_ksar_chellala_jpg.webp"
  },
  {
    "code": 15,
    "name": "Tizi Ouzou",
    "subtitle": "Djurdjura",
    "region": "north",
    "type": "Mountains",
    "rating": 4.4,
    "description": "Heart of Kabylie with Djurdjura National Park and Berber culture.",
    "image": "/images/destinations/destinations_15_djurdjura6_jpg.webp"
  },
  {
    "code": 16,
    "name": "Algiers",
    "subtitle": "Bay of Algiers",
    "region": "north",
    "type": "Capital",
    "rating": 4.5,
    "description": "Capital city with UNESCO Casbah and stunning Mediterranean bay.",
    "image": "/images/destinations/destinations_16_la_baie_d_alger_cropped_jpg.webp"
  },
  {
    "code": 17,
    "name": "Djelfa",
    "subtitle": "City",
    "region": "highlands",
    "type": "City",
    "rating": 3.6,
    "description": "Highland steppe city with traditional markets and natural beauty.",
    "image": "/images/destinations/destinations_17_si_ahmed_ben_cherif_mosque_jpg.webp"
  },
  {
    "code": 18,
    "name": "Jijel",
    "subtitle": "Mediterranean coast",
    "region": "north",
    "type": "Coastal",
    "rating": 4.5,
    "description": "Stunning coastal wilaya with beaches, caves, and the famous Corniche.",
    "image": "/images/destinations/destinations_18_le_grand_far_de_jijel_jpg.webp"
  },
  {
    "code": 19,
    "name": "Sétif",
    "subtitle": "City",
    "region": "highlands",
    "type": "City",
    "rating": 4,
    "description": "Major highland city with modern shopping centers and cultural sites.",
    "image": "/images/destinations/destinations_19_park_mall_setif_jpg.webp"
  },
  {
    "code": 20,
    "name": "Saïda",
    "subtitle": "Mosque / city",
    "region": "highlands",
    "type": "Historical",
    "rating": 3.8,
    "description": "Historic city with beautiful mosques and traditional architecture.",
    "image": "/images/destinations/destinations_20_023_jpg.webp"
  },
  {
    "code": 21,
    "name": "Skikda",
    "subtitle": "Stora",
    "region": "north",
    "type": "Coastal",
    "rating": 4.2,
    "description": "Mediterranean port city with historic Stora marina and beaches.",
    "image": "/images/destinations/destinations_21_port_de_stora_skikda_jpg.webp"
  },
  {
    "code": 22,
    "name": "Sidi Bel Abbès",
    "subtitle": "City",
    "region": "highlands",
    "type": "City",
    "rating": 3.7,
    "description": "City known for its French Foreign Legion history and culture.",
    "image": "/images/destinations/destinations_22_084place_carnot_jpg.webp"
  },
  {
    "code": 23,
    "name": "Annaba",
    "subtitle": "Hippo Regius & Plages",
    "region": "north",
    "type": "Coastal",
    "rating": 4.6,
    "description": "Coastal city with Hippo Regius Roman ruins, Basilica of Saint Augustine, and Mediterranean beaches.",
    "image": "/home-page-pic/annaba.jpg"
  },
  {
    "code": 24,
    "name": "Guelma",
    "subtitle": "City",
    "region": "north",
    "type": "Historical",
    "rating": 3.9,
    "description": "Ancient city with Roman ruins and renowned thermal springs.",
    "image": "/images/destinations/destinations_24_gm_guelma_center01_jpg.webp"
  },
  {
    "code": 25,
    "name": "Constantine",
    "subtitle": "Bridges",
    "region": "north",
    "type": "Historical",
    "rating": 4.7,
    "description": "City of bridges with dramatic gorges and rich historical heritage.",
    "image": "/home-page-pic/constantine.jpg"
  },
  {
    "code": 26,
    "name": "Médéa",
    "subtitle": "City",
    "region": "highlands",
    "type": "City",
    "rating": 3.8,
    "description": "Highland city surrounded by mountains and fertile agricultural lands.",
    "image": "/home-page-pic/medea.jpg"
  },
  {
    "code": 27,
    "name": "Mostaganem",
    "subtitle": "El Arsa",
    "region": "north",
    "type": "Coastal",
    "rating": 4.1,
    "description": "Coastal city with historic El Arsa gate and beautiful beaches.",
    "image": "/images/destinations/destinations_25_el_arsa_gate_jpg.webp"
  },
  {
    "code": 28,
    "name": "M'Sila",
    "subtitle": "Kalaa Beni Hammad",
    "region": "highlands",
    "type": "UNESCO",
    "rating": 4.4,
    "description": "Home to UNESCO World Heritage Kalaa Beni Hammad ruins.",
    "image": "/images/destinations/destinations_2_28-2_kal_a_de_beni_hammad_2_jpg.webp"
  },
  {
    "code": 29,
    "name": "Mascara",
    "subtitle": "City center",
    "region": "highlands",
    "type": "City",
    "rating": 3.9,
    "description": "Historic city in wine country with traditional souks and markets.",
    "image": "/images/destinations/destinations_27_cm29_mascar_12_webp.webp"
  },
  {
    "code": 30,
    "name": "Ouargla",
    "subtitle": "Oasis / city",
    "region": "sahara",
    "type": "Oasis",
    "rating": 4,
    "description": "Sahara oasis city with Great Mosque and oil industry heritage.",
    "image": "/images/destinations/destinations_28_ouargla_jpg.webp"
  },
  {
    "code": 31,
    "name": "Oran",
    "subtitle": "Santa Cruz & Front de mer",
    "region": "north",
    "type": "Coastal",
    "rating": 4.6,
    "description": "Major coastal city with Santa Cruz fort, vibrant Raï culture, and seaside corniche.",
    "image": "/home-page-pic/oran.jpg"
  },
  {
    "code": 32,
    "name": "El Bayadh",
    "subtitle": "City",
    "region": "highlands",
    "type": "City",
    "rating": 3.6,
    "description": "Steppe city serving as gateway to the Sahara desert.",
    "image": "/images/destinations/destinations_30_mosqu_e_el_nour_el_bayadh_centre_vi.webp"
  },
  {
    "code": 33,
    "name": "Illizi",
    "subtitle": "Sahara / Tassili gateway",
    "region": "sahara",
    "type": "Sahara",
    "rating": 4.3,
    "description": "Gateway to Tassili N'Ajjer and stunning Saharan canyons and sand dunes.",
    "image": "/home-page-pic/illizi.jpg"
  },
  {
    "code": 34,
    "name": "Bordj Bou Arréridj",
    "subtitle": "City",
    "region": "highlands",
    "type": "City",
    "rating": 3.7,
    "description": "Commercial highland city on the national highway network.",
    "image": "/images/destinations/destinations_4_bba_route_nationale_n5_jpg.webp"
  },
  {
    "code": 35,
    "name": "Boumerdès",
    "subtitle": "Mediterranean coast",
    "region": "north",
    "type": "Coastal",
    "rating": 4,
    "description": "Coastal wilaya near Algiers with beaches and seaside resorts.",
    "image": "/images/destinations/destinations_5_boumerd_s_jpg.webp"
  },
  {
    "code": 36,
    "name": "El Tarf",
    "subtitle": "El Kala / coast",
    "region": "north",
    "type": "Coastal",
    "rating": 4.3,
    "description": "Eastern coastal region with El Kala National Park and wetlands.",
    "image": "/images/destinations/el_tarf.webp"
  },
  {
    "code": 37,
    "name": "Tindouf",
    "subtitle": "Sahara",
    "region": "sahara",
    "type": "Sahara",
    "rating": 3.8,
    "description": "Deep Saharan wilaya rich in nomad traditions, hospitality, and desert expanse.",
    "image": "/home-page-pic/tindouf.jpg"
  },
  {
    "code": 38,
    "name": "Tissemsilt",
    "subtitle": "City",
    "region": "highlands",
    "type": "City",
    "rating": 3.6,
    "description": "Highland agricultural city with traditional architecture.",
    "image": "/images/destinations/destinations_8_tissemsilt_-_panoramio_6_jpg.webp"
  },
  {
    "code": 39,
    "name": "El Oued",
    "subtitle": "City of a Thousand Domes",
    "region": "sahara",
    "type": "Sahara",
    "rating": 4.6,
    "description": "Unique desert city famous for its distinctive domed architecture.",
    "image": "/images/destinations/destinations_37_la_ville_d_el_oued_jpg.webp"
  },
  {
    "code": 40,
    "name": "Khenchela",
    "subtitle": "Aurès",
    "region": "highlands",
    "type": "Mountains",
    "rating": 4,
    "description": "Gateway to Aurès mountains with stunning natural landscapes.",
    "image": "/images/destinations/destinations_38_khenchela_jpg.webp"
  },
  {
    "code": 41,
    "name": "Souk Ahras",
    "subtitle": "City / Thagaste",
    "region": "north",
    "type": "Historical",
    "rating": 3.9,
    "description": "Ancient Thagaste, birthplace of Saint Augustine of Hippo.",
    "image": "/images/destinations/destinations_9_souk_ahras_41_jpg.webp"
  },
  {
    "code": 42,
    "name": "Tipaza",
    "subtitle": "Roman ruins / coast",
    "region": "north",
    "type": "UNESCO",
    "rating": 4.8,
    "description": "UNESCO Roman ruins on the Mediterranean coastline, praised by Albert Camus.",
    "image": "/home-page-pic/tipaza.jpg"
  },
  {
    "code": 43,
    "name": "Mila",
    "subtitle": "Old Mila",
    "region": "north",
    "type": "Historical",
    "rating": 3.8,
    "description": "Historic city with ancient roots and traditional old quarters.",
    "image": "/images/destinations/destinations_42_mila_ville_jpg.webp"
  },
  {
    "code": 44,
    "name": "Aïn Defla",
    "subtitle": "City",
    "region": "highlands",
    "type": "City",
    "rating": 3.7,
    "description": "Agricultural highland city with scenic countryside surroundings.",
    "image": "/images/destinations/destinations_43_daira_de_ain_defla_-_panoramio_jpg.webp"
  },
  {
    "code": 45,
    "name": "Naâma",
    "subtitle": "City / mosque",
    "region": "highlands",
    "type": "City",
    "rating": 3.6,
    "description": "Steppe city with modern mosques and proximity to the desert.",
    "image": "/images/destinations/destinations_44_ville_de_na_ma_48390207807_jpg.webp"
  },
  {
    "code": 46,
    "name": "Aïn Témouchent",
    "subtitle": "City & Plages",
    "region": "north",
    "type": "Coastal",
    "rating": 4.2,
    "description": "Coastal wilaya known for thermal springs and turquoise Mediterranean beaches.",
    "image": "/home-page-pic/ain-temouchent.jpg"
  },
  {
    "code": 47,
    "name": "Ghardaïa",
    "subtitle": "M'zab / Ksar",
    "region": "sahara",
    "type": "UNESCO",
    "rating": 4.8,
    "description": "UNESCO M'zab Valley with unique Mozabite architecture and culture.",
    "image": "/images/destinations/destinations_13_ksar_ghardaia_place_march_1_jpg.webp"
  },
  {
    "code": 48,
    "name": "Relizane",
    "subtitle": "City",
    "region": "highlands",
    "type": "City",
    "rating": 3.7,
    "description": "Agricultural city in the fertile plains of western Algeria.",
    "image": "/images/destinations/destinations_47__al_nour_mosque_relizane_png.webp"
  },
  {
    "code": 49,
    "name": "Timimoun",
    "subtitle": "Red oasis / ksar",
    "region": "sahara",
    "type": "Oasis",
    "rating": 4.8,
    "description": "Stunning red oasis with traditional ksars and vast palm groves.",
    "image": "/images/destinations/destinations_48_entr_e_de_timimoun_jpg.webp"
  },
  {
    "code": 50,
    "name": "Bordj Badji Mokhtar",
    "subtitle": "Sahara",
    "region": "sahara",
    "type": "Sahara",
    "rating": 3.4,
    "description": "Remote southern Sahara desert town and border crossing.",
    "image": "/images/destinations/destinations_49_bordj-mokhtar_1990_jpg.webp"
  },
  {
    "code": 51,
    "name": "Ouled Djellal",
    "subtitle": "Oasis",
    "region": "sahara",
    "type": "Oasis",
    "rating": 3.8,
    "description": "Saharan oasis town with palm groves and traditional desert life.",
    "image": "/images/destinations/destinations_50_ouled_djellal_jpg.webp"
  },
  {
    "code": 52,
    "name": "Béni Abbès",
    "subtitle": "Saoura oasis",
    "region": "sahara",
    "type": "Oasis",
    "rating": 4.5,
    "description": "The 'White Oasis' of the Saoura valley with majestic golden sand dunes.",
    "image": "/home-page-pic/beni-abbes.jpg"
  },
  {
    "code": 53,
    "name": "In Salah",
    "subtitle": "Sahara oasis",
    "region": "sahara",
    "type": "Oasis",
    "rating": 3.7,
    "description": "Ancient trans-Saharan trade route oasis city in deep desert.",
    "image": "/images/destinations/destinations_15_insalah_1991_jpg.webp"
  },
  {
    "code": 54,
    "name": "In Guezzam",
    "subtitle": "Sahara",
    "region": "sahara",
    "type": "Sahara",
    "rating": 3.3,
    "description": "Southernmost town at the Niger border crossing point.",
    "image": "/images/destinations/destinations_16_lossy-page1-3840px-thumbnail_tif_jp.webp"
  },
  {
    "code": 55,
    "name": "Touggourt",
    "subtitle": "Palm oasis",
    "region": "sahara",
    "type": "Oasis",
    "rating": 4,
    "description": "Large Saharan oasis city famous for its extensive palm groves.",
    "image": "/images/destinations/destinations_54_desertando-touggourt-2-1024x626_jpg.webp"
  },
  {
    "code": 56,
    "name": "Djanet",
    "subtitle": "Oasis / Tassili gateway",
    "region": "sahara",
    "type": "UNESCO",
    "rating": 4.9,
    "description": "Gateway to Tassili N'Ajjer UNESCO site with prehistoric rock art.",
    "image": "/images/destinations/destinations_55_djanet_jpg.webp"
  },
  {
    "code": 57,
    "name": "El M'Ghair",
    "subtitle": "Palm oasis",
    "region": "sahara",
    "type": "Oasis",
    "rating": 3.8,
    "description": "Desert oasis with date palm cultivation and traditional souks.",
    "image": "/images/destinations/destinations_56_343600510_jpg.webp"
  },
  {
    "code": 58,
    "name": "El Menia",
    "subtitle": "Oasis / El Goléa",
    "region": "sahara",
    "type": "Oasis",
    "rating": 3.9,
    "description": "Historic El Goléa oasis town with ancient ksar and palm groves.",
    "image": "/images/destinations/destinations_17_el_menia_02_jpg.webp"
  },
  {
    "code": 59,
    "name": "Aflou",
    "subtitle": "Saharan plateau",
    "region": "highlands",
    "type": "City",
    "rating": 3.8,
    "description": "Highland city on the Saharan plateau known for carpets and traditional crafts.",
    "image": "/images/destinations/destinations_58_march_d_aflou_1973_jpg.webp"
  },
  {
    "code": 60,
    "name": "Barika",
    "subtitle": "Mountains",
    "region": "highlands",
    "type": "City",
    "rating": 3.6,
    "description": "Mountain city in the Aurès region with rich agricultural heritage.",
    "image": "/images/destinations/destinations_59_apc_de_barika_jpg.webp"
  },
  {
    "code": 61,
    "name": "El Kantara",
    "subtitle": "Gorges",
    "region": "highlands",
    "type": "Historical",
    "rating": 4.1,
    "description": "Stunning gorges and natural gateway between the Aurès and Biskra regions.",
    "image": "/images/destinations/destinations_60_gorges_d_el_kantara_biskra01_jpg.webp"
  },
  {
    "code": 62,
    "name": "Bir El Ater",
    "subtitle": "Tebessa",
    "region": "highlands",
    "type": "Historical",
    "rating": 3.7,
    "description": "Historic city near Tebessa with Roman-era heritage and traditional culture.",
    "image": "/images/destinations/destinations_61_960px-from_east_of_algeria_al_frid_.webp"
  },
  {
    "code": 63,
    "name": "El Aricha",
    "subtitle": "Tlemcen",
    "region": "north",
    "type": "Historical",
    "rating": 3.9,
    "description": "Historic town near Tlemcen with ruins and cultural heritage sites.",
    "image": "/images/destinations/destinations_18_el_aricha_-_tlemcen_-_48390068131_j.webp"
  },
  {
    "code": 64,
    "name": "Ksar Chellala",
    "subtitle": "Tiaret",
    "region": "highlands",
    "type": "City",
    "rating": 3.6,
    "description": "Highland city known for its traditional ksars and agricultural landscape.",
    "image": "/images/destinations/destinations_63_ksar_chellala_jpg.webp"
  },
  {
    "code": 65,
    "name": "Aïn Oussara",
    "subtitle": "Djelfa",
    "region": "highlands",
    "type": "City",
    "rating": 3.7,
    "description": "Steppe city in the Djelfa region with traditional markets and landscapes.",
    "image": "/images/destinations/destinations_64_ain_oussera_jpg.webp"
  },
  {
    "code": 66,
    "name": "Messaad",
    "subtitle": "Djelfa",
    "region": "highlands",
    "type": "City",
    "rating": 3.5,
    "description": "Highland city surrounded by steppe plains and pastoral landscapes.",
    "image": "/images/destinations/destinations_19_mapmessadcastellumdimmidi_png.webp"
  },
  {
    "code": 67,
    "name": "Ksar El Boukhari",
    "subtitle": "Médéa",
    "region": "highlands",
    "type": "Historical",
    "rating": 3.8,
    "description": "Historic city with ancient ksar ruins and traditional Algerian architecture.",
    "image": "/images/destinations/destinations_66_ksar_el_boukhari_jpg.webp"
  },
  {
    "code": 68,
    "name": "Bou Saâda",
    "subtitle": "M'sila",
    "region": "highlands",
    "type": "City",
    "rating": 4,
    "description": "Gateway city to the Sahara with rich cultural traditions and historic souks.",
    "image": "/images/destinations/destinations_67_1280px-bousaayel_jpg.webp"
  },
  {
    "code": 69,
    "name": "El Abiodh Sidi Cheikh",
    "subtitle": "El Bayadh",
    "region": "highlands",
    "type": "Historical",
    "rating": 3.9,
    "description": "Historic town known for its resistance heritage and Saharan gateway culture.",
    "image": "/images/destinations/destinations_20_el_abiodh_sidi_cheikh_jpg.webp"
  },
  {
    "code": 70,
    "name": "Djémila",
    "subtitle": "Roman ruins / Sétif",
    "region": "highlands",
    "type": "UNESCO",
    "rating": 4.6,
    "description": "UNESCO Roman ruins in the highlands, one of the best-preserved Roman cities in North Africa.",
    "image": "/images/activities/activities_16_malysian_tourist_in_djmila_jpg.webp"
  },
  {
    "code": 71,
    "name": "Timgad",
    "subtitle": "Roman ruins / Batna",
    "region": "highlands",
    "type": "UNESCO",
    "rating": 4.7,
    "description": "UNESCO Roman colonial town, the Pompeii of Africa with spectacular ruins.",
    "image": "/images/destinations/destinations_5_roman_ruins_of_timgad_jpg.webp"
  }
];

export const OFFICIAL_WILAYA_COUNT = 69;
export const officialWilayas = destinations.filter(
  (destination) => (destination.code ?? 0) >= 1 && (destination.code ?? 0) <= OFFICIAL_WILAYA_COUNT
);

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .trim();
}

export function getDestinationBySlug(slug: string): Destination | undefined {
  return destinations.find((dest) => generateSlug(dest.name) === slug);
}

export function getDestinationByCode(code: number): Destination | undefined {
  return destinations.find((dest) => dest.code === code);
}
