// Rich cultural, culinary, touristic, and traditional clothing data for Algerian Wilayas

export interface WilayaCulture {
  famousFoods: {
    name: string;
    description: string;
    tag: string;
    image?: string;
  }[];
  touristPlaces: {
    name: string;
    description: string;
    type: string;
    image?: string;
  }[];
  traditionalClothing: {
    name: string;
    description: string;
    heritageBadge?: string;
    materials?: string;
    image?: string;
  }[];
  historicalHighlight: string;
  bestTimeToVisit: string;
  aiSuggestedPrompts: string[];
}

export const wilayasCultureData: Record<string, WilayaCulture> = {
  tlemcen: {
    historicalHighlight: "Ancienne capitale du royaume Zianide, surnommée la 'Perle du Maghreb', carrefour d'art arabo-andalou et de spiritualité.",
    bestTimeToVisit: "Mars à Juin & Septembre à Novembre",
    famousFoods: [
      {
        name: "Kâak Tlemcen",
        description: "Biscuits secs parfumés à l'anis, au fenouil et à l'eau de fleur d'oranger, traditionnellement dorés et croustillants.",
        tag: "Pâtisserie emblématique",
        image: "/images/culture/food/kaak-tlemcen.webp"
      },
      {
        name: "Chorba Bayda (Blanche)",
        description: "Soupe veloutée raffinée au poulet, cannelle, pois chiches et vermicelles, liée délicatement au jaune d'œuf et jus de citron.",
        tag: "Plat de fête",
        image: "/images/culture/food/chorba-bayda.webp"
      },
      {
        name: "Tajine El Kroum & Z'tita",
        description: "Plats mijotés à la viande d'agneau, pruneaux confits ou chou farci épicé au safran et cannelle.",
        tag: "Spécialité royale",
        image: "/images/culture/food/tajine-el-kroum.webp"
      },
      {
        name: "Qalb El Louz Tlemcenien",
        description: "Gâteau de semoule fondante gorgé de miel pur et parfumé à l'eau de fleur de bigaradier locale.",
        tag: "Douceur artisanale",
        image: "/images/culture/food/qalb-el-louz.webp"
      }
    ],
    touristPlaces: [
      {
        name: "Palais Royal El Mechouar",
        description: "Splendide résidence fortifiée des rois Zianides du XIIIe siècle avec cours intérieures sculptées de stucs andalous.",
        type: "Palais historique",
        image: "/images/culture/places/el-mechouar.jpg"
      },
      {
        name: "Plateau & Forêt de Lalla Setti",
        description: "Belvédère perché offrant un panorama spectaculaire sur toute la ville, accessible en téléphérique moderne.",
        type: "Site panoramique & nature",
        image: "/images/culture/places/lalla-setti.webp"
      },
      {
        name: "Grottes Féeriques de Beni Add",
        description: "Grottes calcaires millénaires parmi les plus profondes du monde avec stalactites et stalagmites illuminées.",
        type: "Merveille naturelle",
        image: "/images/culture/places/grottes-beni-add.webp"
      },
      {
        name: "Mosquée et Minaret de Mansourah",
        description: "Imposant minaret mérinide de 38 mètres s'élevant dans les vergers d'oliviers, vestige d'une cité militaire royale.",
        type: "Monument archéologique",
        image: "/images/culture/places/mansourah.webp"
      },
      {
        name: "Sanctuaire de Sidi Boumediene",
        description: "Chef-d'œuvre de l'art hispano-mauresque abritant le tombeau du saint soufi, avec madrasa et hammam historique.",
        type: "Patrimoine spirituel",
        image: "/images/culture/places/sidi-boumediene.webp"
      }
    ],
    traditionalClothing: [
      {
        name: "Chedda Tlemcénienne",
        description: "Costume nuptial princier classé au Patrimoine Culturel Immatériel de l'UNESCO. Composé du Caftan brodé de fils d'or, d'une rangée de colliers 'Zerrouf', 'Krafache' et de la coiffe conique 'Chachia' sertie de perles baroques.",
        heritageBadge: "Patrimoine Mondial UNESCO",
        materials: "Velours royal, fil d'or Mejboud, perles fines et soie pure",
        image: "/images/culture/clothing/chedda-tlemcen.jpg"
      },
      {
        name: "Blousa Tlemcénienne (Mensoudj)",
        description: "Robe longue en tissu soyeux lamé d'or 'Mensoudj', brodée à la poitrine de perles scintillantes et de paillettes métalliques.",
        heritageBadge: "Costume citadin d'exception",
        materials: "Soie de Mansourah, fils de lurex doré et perles",
        image: "/images/culture/clothing/blousa-mensoudj.webp"
      },
      {
        name: "Caftan El Kadi",
        description: "Manteau long féminin en velours royal lourd, entièrement brodé à la main aux motifs floraux andalous au fil doré.",
        heritageBadge: "Artisanat d'art royal",
        materials: "Velours de Gênes et broderie Fetla",
        image: "/images/culture/clothing/chedda-tlemcen-luxury.jpg"
      }
    ],
    aiSuggestedPrompts: [
      "Raconte-moi l'histoire et les secrets de la Chedda Tlemcénienne classée à l'UNESCO.",
      "Quel itinéraire idéal pour visiter Tlemcen en 2 jours (Mechouar, Lalla Setti, Mansourah) ?",
      "Où déguster les meilleurs Kâaks et spécialités culinaires à Tlemcen ?"
    ]
  },

  algiers: {
    historicalHighlight: "La capitale millénaire 'El Bahdja' (La Blanche), perle de la Méditerranée avec sa Casbah classée UNESCO et ses palais ottomans.",
    bestTimeToVisit: "Toute l'année (Printemps et Automne idéaux)",
    famousFoods: [
      {
        name: "Rechta Algéroise",
        description: "Fines nouilles artisanales cuites à la vapeur, servies dans un bouillon blanc parfumé à la cannelle avec poulet et navets fondants.",
        tag: "Plat national de fête",
        image: "/images/culture/food/rechta.webp"
      },
      {
        name: "Chorba Frik",
        description: "Soupe traditionnelle au blé vert concassé (frik), agneau tendre, coriandre fraîche, menthe et épices douces.",
        tag: "Incontournable ramadanesque",
        image: "/images/culture/food/chorba-frik.webp"
      },
      {
        name: "Mhadjeb & Bourek",
        description: "Crêpes feuilletées farcies à la tomate et oignons pimentés, et cigares croustillants de pâte de brik dorée.",
        tag: "Street food savoureuse",
        image: "/images/culture/food/mhadjeb.webp"
      },
      {
        name: "Mthewem",
        description: "Boulettes de viande hachée au cumin et ail généreux, accompagnées d'amandes effilées dans une sauce veloutée.",
        tag: "Cuisine de terroir",
        image: "/images/culture/food/tajine-el-kroum.webp"
      }
    ],
    touristPlaces: [
      {
        name: "La Casbah d'Alger (UNESCO)",
        description: "Médina historique avec ruelles pavées en escalier, palais mauresques de Dey, fontaines et ateliers d'artisans cuivriers.",
        type: "Patrimoine mondial UNESCO",
        image: "/images/culture/places/casbah-alger.webp"
      },
      {
        name: "Mémorial du Martyr (Maqam Echahid)",
        description: "Monument emblématique haut de 92 mètres dominant la baie d'Alger, symbole de l'histoire et de la résistance algérienne.",
        type: "Monument national",
        image: "/images/culture/places/maqam-echahid.webp"
      },
      {
        name: "Jardin d'Essai du Hamma",
        description: "L'un des plus importants jardins botaniques de la planète, luxuriant écrin créé en 1832 abritant arbres centenaires et allées exotiques.",
        type: "Parc botanique & nature",
        image: "/images/culture/places/jardin-hamma.webp"
      },
      {
        name: "Basilique Notre-Dame d'Afrique",
        description: "Majestueuse église romano-byzantine perchée sur une falaise de 124 mètres surplombant la Méditerranée.",
        type: "Chef-d'œuvre architectural",
        image: "/images/culture/places/notre-dame-afrique.webp"
      }
    ],
    traditionalClothing: [
      {
        name: "Karakou Algérois",
        description: "Veste cintrée en velours de soie brodée au fil d'or véritable selon la technique 'Majboud' ou 'Fetla', portée avec le pantalon 'Seroual Chelqa' ou 'Seroual Mdaour'.",
        heritageBadge: "Symbole de la haute couture algéroise",
        materials: "Velours de soie, broderie fil d'or fin, satin duchesse",
        image: "/images/culture/clothing/karakou-algerois.jpg"
      },
      {
        name: "Le Hayek Mrema",
        description: "Grand voile blanc virginal tissé de soie et de lin avec la fine voilette de dentelle 'Âadjar', symbole d'élégance et de pudeur algéroise.",
        heritageBadge: "Mémoire vive d'Alger la Blanche",
        materials: "Soie grège et lin artisanal d'Alger",
        image: "/images/culture/clothing/hayek-algerois.jpg"
      }
    ],
    aiSuggestedPrompts: [
      "Quels sont les palais secrets et terrasses à ne pas rater dans la Casbah d'Alger ?",
      "Où trouver la meilleure Rechta traditionnelle et déguster un thé à la menthe à Alger ?",
      "Comment se compose le Karakou algérois traditionnel et quelle est son histoire ?"
    ]
  },

  constantine: {
    historicalHighlight: "La cité antique de Cirta, 'Ville des Ponts Suspendus' perchée sur un rocher monumental fendu par les vertigineuses gorges du Rhumel.",
    bestTimeToVisit: "Septembre à Mai",
    famousFoods: [
      {
        name: "Chakhchoukha Constantinoise",
        description: "Feuilles de pâte ultrafines émiettées, arrosées d'une sauce rouge onctueuse épicée au ras el hanout avec agneau tendre et pois chiches.",
        tag: "Plat impérial",
        image: "/images/culture/food/chakhchoukha.webp"
      },
      {
        name: "Djouzia Constantinoise",
        description: "Nougat artisanal d'exception à base de miel pur de montagne et de cerneaux de noix croquants.",
        tag: "Douceur légendaire",
        image: "/images/culture/food/djouzia.jpg"
      },
      {
        name: "Trida & Tlitli",
        description: "Pâtes carrées faites maison cuites à la vapeur, agrémentées de boulettes, d'œufs durs et de sauce blanche cannelle.",
        tag: "Haute gastronomie",
        image: "/images/culture/food/couscous-algerien.webp"
      },
      {
        name: "Djwaz El Bey & El Djery",
        description: "Ragoûts d'agneau raffinés aux cœurs d'artichauts, fèves tendres et soupe légère parfumée à la menthe séchée.",
        tag: "Recette citadine",
        image: "/images/culture/food/tajine-el-kroum.webp"
      }
    ],
    touristPlaces: [
      {
        name: "Pont Suspendu Sidi M'Cid",
        description: "Pont suspendu mythique reliant la falaise à 175 mètres au-dessus du vide, offrant des sensations et vues inoubliables.",
        type: "Chef-d'œuvre du génie civil",
        image: "/images/culture/places/pont-constantine.webp"
      },
      {
        name: "Palais d'Ahmed Bey",
        description: "Joyau architectural ottoman avec 2 000 m² de jardins intérieurs, fresques peintes, colonnes de marbre et faïences tunisiennes.",
        type: "Palais ottoman historique",
        image: "/images/culture/places/palais-ahmed-bey.webp"
      },
      {
        name: "Monument aux Morts & Pont de Sidi Rached",
        description: "Arc de triomphe perché sur le roc de Sidi M'Cid dominant la vallée et le spectaculaire viaduc aux 27 arches.",
        type: "Panorama grandiose",
        image: "/images/culture/places/pont-constantine.webp"
      },
      {
        name: "Grande Mosquée Emir Abdelkader",
        description: "L'une des plus monumentales mosquées d'Afrique du Nord, alliant marbre blanc, calligraphies arabes et minarets de 107 mètres.",
        type: "Édifice religieux remarquable",
        image: "/images/culture/places/palais-ahmed-bey.webp"
      }
    ],
    traditionalClothing: [
      {
        name: "Gandoura Qatifa Constantinoise",
        description: "Longue robe en velours sombre (bordeaux, vert impérial ou noir), brodée à la main de fils d'or massif selon l'art ancestral du 'Mejboud', représentant oiseaux et motifs floraux.",
        heritageBadge: "Joyau du patrimoine de l'Est",
        materials: "Velours royal lourd, fil d'or pur 'Mejboud'",
        image: "/images/culture/clothing/gandoura-constantinoise.jpg"
      },
      {
        name: "Mlaïa Constantinoise",
        description: "Grand manteau de soie noire porté par les femmes de Constantine en signe de recueillement et d'élégance sobre lors des sorties.",
        heritageBadge: "Élégance historique",
        materials: "Soie noire tissée main",
        image: "/images/culture/clothing/gandoura-constantinoise-luxury.jpg"
      }
    ],
    aiSuggestedPrompts: [
      "Quels sont les 8 ponts de Constantine et comment faire le tour des gorges du Rhumel ?",
      "Quelle est l'histoire fascinante du Palais d'Ahmed Bey ?",
      "Comment est fabriquée la Gandoura constantinoise au fil d'or Mejboud ?"
    ]
  },

  oran: {
    historicalHighlight: "La joyeuse 'El Bahia', capitale du Raï et cité méditerranéenne au riche métissage hispano-mauresque et art déco.",
    bestTimeToVisit: "Avril à Octobre",
    famousFoods: [
      {
        name: "Karantika (Calentica)",
        description: "Gratin chaud et fondant à base de farine de pois chiches, cumin et harissa artisanale, servi dans un pain frais croustillant.",
        tag: "Plat du peuple & culte",
        image: "/images/culture/food/karantika.webp"
      },
      {
        name: "Harira Oranaise",
        description: "Soupe onctueuse parfumée au carvi, coriandre fraîche et levain traditionnel, servie avec dattes et beignets.",
        tag: "Incontournable de l'Ouest",
        image: "/images/culture/food/chorba-frik.webp"
      },
      {
        name: "Poissons Frais du Front de Mer",
        description: "Fruits de mer grillés, rougets, sardines marinées à la chermoula et riz safrané inspiré des échanges maritimes.",
        tag: "Saveurs marines",
        image: "/images/culture/food/poisson-grille.webp"
      }
    ],
    touristPlaces: [
      {
        name: "Fort & Chapelle de Santa Cruz",
        description: "Forteresse espagnole du XVIe siècle juchée sur le mont Murdjadjo à 400 mètres d'altitude avec vue plongeante sur le golfe.",
        type: "Forteresse historique",
        image: "/images/culture/places/santa-cruz-oran.webp"
      },
      {
        name: "Front de Mer & Place du 1er Novembre",
        description: "Promenade bordée de palmiers et d'immeubles haussmanniens, théâtre et opéra d'Oran de style baroque.",
        type: "Cœur vibrant de la ville",
        image: "/images/destinations/destinations_3_31-4_chapelle_de_santa-cruz_7_jpg.webp"
      },
      {
        name: "Plages des Andalouses & Madagh",
        description: "Magnifiques criques aux eaux turquoise entourées de collines verdoyantes face à la grande bleue.",
        type: "Plages paradisiaques",
        image: "/images/culture/places/santa-cruz-oran.webp"
      }
    ],
    traditionalClothing: [
      {
        name: "Blousa Oranaise",
        description: "Robe de soie ou dentelle raffinée avec plastron richement orné de pierreries et de perles, symbole du chic oranais.",
        heritageBadge: "Élégance de l'Ouest",
        materials: "Dentelle de Calais, mousseline de soie et perles",
        image: "/images/culture/clothing/blousa-mensoudj.webp"
      },
      {
        name: "Caftan d'Oran",
        description: "Caftan moderne aux broderies légères et couleurs vives, porté lors des soirées musicales et célébrations.",
        heritageBadge: "Costume festif",
        materials: "Brocart et satin de soie",
        image: "/images/culture/clothing/chedda-tlemcen.webp"
      }
    ],
    aiSuggestedPrompts: [
      "Où écouter du vrai Raï authentique et vivre les meilleures soirées à Oran ?",
      "Quel circuit pour visiter le Fort Santa Cruz et le quartier historique de Sidi El Houari ?",
      "Quelle est l'origine de la Karantika oranaise ?"
    ]
  },

  ghardaia: {
    historicalHighlight: "La vallée du M'Zab classée UNESCO, merveille d'architecture vernaculaire millénaire ayant inspiré Le Corbusier et les plus grands architectes.",
    bestTimeToVisit: "Octobre à Avril",
    famousFoods: [
      {
        name: "Couscous aux 7 Légumes de l'Oasis",
        description: "Couscous saharien parfumé à la coriandre des sables, fenugrec et viandes mijotées sous le ksar.",
        tag: "Tradition oasienne",
        image: "/images/culture/food/couscous-algerien.webp"
      },
      {
        name: "Rfiss M'Zabi aux Dattes",
        description: "Semoule fine travaillée avec de la pâte de dattes Ghars, du beurre fermier et du lait de chèvre.",
        tag: "Douceur de l'oasis",
        image: "/images/culture/food/makroudh.webp"
      },
      {
        name: "Melfouf M'Zabi",
        description: "Brochettes de foie tendre enveloppé de fine crépine d'agneau et grillé sur la braise de palmiers.",
        tag: "Spécialité nomade",
        image: "/images/culture/food/tajine-el-kroum.webp"
      }
    ],
    touristPlaces: [
      {
        name: "Les 5 Ksars du M'Zab (UNESCO)",
        description: "Ghardaïa, Beni Isguen, Melika, Bounoura et El Atteuf : cités fortifiées en pyramide autour de leurs minarets séculaires.",
        type: "Patrimoine mondial UNESCO",
        image: "/images/culture/places/ghardaia-ksar.webp"
      },
      {
        name: "Marché Traditionnel de Ghardaïa",
        description: "Grande place à arcades où se négocient tapis mozabites faits main, épices du désert et dattes succulentes.",
        type: "Marché historique",
        image: "/images/destinations/destinations_13_ksar_ghardaia_place_march_1_jpg.webp"
      },
      {
        name: "Système Ancestral de Partage des Eaux",
        description: "Génie hydraulique médiéval répartissant équitablement les crues de l'Oued M'Zab dans la palmeraie.",
        type: "Génie écologique ancestral",
        image: "/images/culture/places/ghardaia-ksar.webp"
      }
    ],
    traditionalClothing: [
      {
        name: "Le Haïk M'Zabi (El Khemri)",
        description: "Lourd voile de laine blanche immaculée qui ne laisse paraître qu'un seul œil, symbole d'une tradition préservée depuis le XIe siècle.",
        heritageBadge: "Tradition mozabite millénaire",
        materials: "Laine blanche vierge tissée main",
        image: "/images/culture/clothing/hayek-algerois.jpg"
      },
      {
        name: "Tapis et Tissages M'Zabites",
        description: "Tapis aux motifs géométriques berbères et couleurs minérales naturelles, tissés avec patience par les artisanes des ksars.",
        heritageBadge: "Artisanat d'art UNESCO",
        materials: "Pure laine de mouton et teintures végétales",
        image: "/images/culture/clothing/melhfa-chaouia.jpg"
      }
    ],
    aiSuggestedPrompts: [
      "Pourquoi l'architecture de Ghardaïa et de la vallée du M'Zab est-elle unique au monde ?",
      "Comment se déroule la visite des ksars de Beni Isguen et El Atteuf ?",
      "Quelles sont les règles de tissage des célèbres tapis de Ghardaïa ?"
    ]
  },

  djanet: {
    historicalHighlight: "L'oasis enchanteresse du Tassili n'Ajjer (UNESCO), le plus grand musée à ciel ouvert d'art rupestre préhistorique au monde.",
    bestTimeToVisit: "Novembre à Mars",
    famousFoods: [
      {
        name: "Taguella Saharienne",
        description: "Pain traditionnel touareg cuit à même la braise et le sable chaud du désert, émietté dans un bouillon d'agneau épicé.",
        tag: "Pain rituel du désert",
        image: "/images/culture/food/couscous-algerien.webp"
      },
      {
        name: "Thé Touareg aux Trois Mousses",
        description: "La cérémonie sacrée des 3 thés : le premier amer comme la mort, le second doux comme la vie, le troisième sucré comme l'amour.",
        tag: "Cérémonie de l'hospitalité",
        image: "/images/culture/food/djouzia.jpg"
      }
    ],
    touristPlaces: [
      {
        name: "Tassili n'Ajjer & Fresques Rupestres (UNESCO)",
        description: "Plateau de grès sculpté par l'érosion avec plus de 15 000 gravures et peintures rupestres datant de 10 000 ans.",
        type: "Patrimoine mondial UNESCO",
        image: "/images/culture/places/tassili-najjer.webp"
      },
      {
        name: "La Vache qui Pleure (Tegharghart)",
        description: "Célèbre bas-relief préhistorique gravé dans la roche représentant des bovidés aux larmes émouvantes.",
        type: "Chef-d'œuvre de la préhistoire",
        image: "/images/culture/places/erg-admer.webp"
      },
      {
        name: "Dunes Rouges de l'Erg Admer",
        description: "Vagues infinies de sable doré et rougeoyant au coucher du soleil, décor de bivouacs féeriques sous la voie lactée.",
        type: "Désert de rêve",
        image: "/images/culture/places/erg-admer.webp"
      }
    ],
    traditionalClothing: [
      {
        name: "Le Chèche Indigo Touareg (Tagelmust)",
        description: "Long voile de coton teinté d'indigo naturel de 4 à 8 mètres, enveloppé autour de la tête pour protéger du vent et soleil.",
        heritageBadge: "Identité des Hommes Bleus du désert",
        materials: "Coton teinté à l'indigo traditionnel",
        image: "/images/culture/clothing/cheche-touareg.webp"
      },
      {
        name: "Gandoura Targuie & Bijoux en Argent",
        description: "Tunique ample ornée de broderies délicates portée avec la Croix du Sud (croix d'Agadez / Tassili) en argent forgé.",
        heritageBadge: "Artisanat nomade d'exception",
        materials: "Lin, coton saharien et argent pur",
        image: "/images/culture/clothing/cheche-touareg.webp"
      }
    ],
    aiSuggestedPrompts: [
      "Comment préparer un trek en bivouac dans le Tassili n'Ajjer à Djanet ?",
      "Quelle est la signification de la fresque de 'La Vache qui Pleure' ?",
      "Raconte-moi le rituel du thé touareg dans les dunes de l'Erg Admer."
    ]
  },

  batna: {
    historicalHighlight: "Cœur vibrant du massif des Aurès, terre de la reine guerrière Dihya (Kahina) et foyer de la glorieuse Révolution algérienne.",
    bestTimeToVisit: "Mars à Juin & Septembre à Novembre",
    famousFoods: [
      {
        name: "Zviti (El Batout)",
        description: "Galette chaude pilée au mortier de bois traditionnel (mahraz) avec piments forts, tomates mûres, ail et coriandre fraîche.",
        tag: "Plat piquant culte",
        image: "/images/culture/food/zviti.jpg"
      },
      {
        name: "Berkoukes Chaoui",
        description: "Gros grains de semoule roulés à la main, mijotés avec des herbes sauvages des Aurès et de la viande séchée (gueddid).",
        tag: "Plat d'hiver réconfortant",
        image: "/images/culture/food/chakhchoukha.webp"
      }
    ],
    touristPlaces: [
      {
        name: "Ruines Romaines de Timgad (UNESCO)",
        description: "La 'Pompéi de l'Afrique du Nord', colonie romaine remarquablement préservée avec arc de Trajan, théâtre et thermes grandioses.",
        type: "Site archéologique UNESCO",
        image: "/images/culture/places/timgad-batna.webp"
      },
      {
        name: "Balcons et Canyons de Ghoufi",
        description: "Spectaculaires gorges rocheuses avec maisons troglodytes accrochées à la falaise au-dessus d'une palmeraie encaissée.",
        type: "Canyon grandiose",
        image: "/images/culture/places/ghoufi.webp"
      },
      {
        name: "Mausolée Royal de Madghacen",
        description: "Plus ancien monument numide d'Afrique du Nord (IIIe siècle av. J.-C.), tombeau monumental circulaire des rois berbères.",
        type: "Monument numide antique",
        image: "/images/culture/places/timgad-batna.webp"
      }
    ],
    traditionalClothing: [
      {
        name: "La Melhfa Chaouia",
        description: "Drapé traditionnel noir ou rouge éclatant retenu aux épaules par des fibules en argent massif (Khelala), orné de broderies colorées et d'une ceinture tissée.",
        heritageBadge: "Symbole de la fierté des Aurès",
        materials: "Soie, laine fine et bijoux en argent berbère",
        image: "/images/culture/clothing/melhfa-chaouia.jpg"
      },
      {
        name: "Bijoux Chaouis en Argent",
        description: "Les colliers d'ambre, bracelets massifs (Khelkhal) et parures frontales gravés de symboles géométriques millénaires.",
        heritageBadge: "Artisanat d'orfèvrerie numide",
        materials: "Argent ciselé et corail naturel",
        image: "/images/culture/clothing/melhfa-chaouia.jpg"
      }
    ],
    aiSuggestedPrompts: [
      "Guide complet pour visiter la cité romaine de Timgad et les balcons de Ghoufi.",
      "Quelle est l'histoire de la Melhfa Chaouia et de ses fibules en argent ?",
      "Comment se prépare le fameux Zviti dans le mortier traditionnel ?"
    ]
  },

  bejaia: {
    historicalHighlight: "La prestigieuse cité médiévale de Bgayet (Bougie), phare intellectuel où Fibonacci apprit les chiffres arabes, au cœur de la Kabylie maritime.",
    bestTimeToVisit: "Mai à Octobre",
    famousFoods: [
      {
        name: "Couscous Kabyle à l'Huile d'Olive",
        description: "Semoule légère aux légumes frais de saison, pois chiches, arrosée de la meilleure huile d'olive pure des montagnes.",
        tag: "Plat traditionnel authentique",
        image: "/images/culture/food/couscous-algerien.webp"
      },
      {
        name: "Sardines Farcies de l'Oued Soummam",
        description: "Sardines fraîches ouvertes en papillon et garnies d'une marinade épicée de cumin, ail et persil.",
        tag: "Spécialité maritime",
        image: "/images/culture/food/poisson-grille.webp"
      }
    ],
    touristPlaces: [
      {
        name: "Cap Carbon & Phare Naturel",
        description: "Promontoire rocheux vertigineux doté de l'un des plus hauts phares de la Méditerranée avec singes magots en liberté.",
        type: "Site naturel marin spectaculaire",
        image: "/images/destinations/destinations_6_b_ja_a_brise_de_mer_jpg.webp"
      },
      {
        name: "Parc National de Gouraya (UNESCO)",
        description: "Réserve de biosphère dominée par le Pic des Singes, avec falaises calcaires et criques sauvages.",
        type: "Parc national & biosphère",
        image: "/images/culture/places/gouraya-bejaia.webp"
      },
      {
        name: "Porte Sarrazine & Casbah de Béjaïa",
        description: "Fortifications maritimes médiévales et vestiges du port d'où partaient les galères et les savants de Méditerranée.",
        type: "Patrimoine historique",
        image: "/images/culture/places/gouraya-bejaia.webp"
      }
    ],
    traditionalClothing: [
      {
        name: "Robe Kabyle de Béjaïa (Taqendurt)",
        description: "Robe lumineuse ornée de galons tressés multicolores (zigzags), ceinte de la 'Fouta' rayée de rouge et jaune et parée de bijoux d'argent.",
        heritageBadge: "Patrimoine vivant de Kabylie",
        materials: "Toile de coton soyeuse et rubans brodés",
        image: "/images/culture/clothing/robe-kabyle.webp"
      }
    ],
    aiSuggestedPrompts: [
      "Comment monter au Cap Carbon et au Pic des Singes à Béjaïa ?",
      "Quel a été le rôle de Béjaïa dans l'introduction des chiffres arabes en Europe ?",
      "Quelles sont les plus belles plages secrètes de la côte est de Béjaïa ?"
    ]
  },

  tiziouzou: {
    historicalHighlight: "Capitale du Djurdjura et cœur de la Kabylie, réputée pour ses villages perchés séculaires, son artisanat de poterie et de bijoux en argent.",
    bestTimeToVisit: "Avril à Novembre (Hiver pour la neige de Tikjda)",
    famousFoods: [
      {
        name: "Tikourbabine (Boules de semoule aux herbes)",
        description: "Délicates boulettes de semoule assaisonnées de menthe sauvage et piments, cuites dans un bouillon de légumes et viande.",
        tag: "Spécialité montagnarde",
        image: "/images/culture/food/couscous-algerien.webp"
      },
      {
        name: "Tahboult n'tmelaline",
        description: "Galette d'œufs moelleuse parfumée à l'huile d'olive nouvelle et arrosée de miel pur de montagne.",
        tag: "Douceur revigorante",
        image: "/images/culture/food/makroudh.webp"
      }
    ],
    touristPlaces: [
      {
        name: "Station et Sommets de Tikjda & Djurdjura",
        description: "Panoramas alpins grandioses, cédraies séculaires et pistes de randonnée menant au majestueux pic de Lalla Khedidja.",
        type: "Parc national de montagne",
        image: "/images/culture/places/tikjda-djurdjura.webp"
      },
      {
        name: "Village Typique de Beni Yenni",
        description: "Villages de montagne perchés sur les crêtes, mondialement réputés pour leurs maîtres bijoutiers en argent émaillé.",
        type: "Artisanat d'art & village typique",
        image: "/images/destinations/destinations_15_djurdjura6_jpg.webp"
      }
    ],
    traditionalClothing: [
      {
        name: "La Robe Kabyle & Fouta d'Iflissen",
        description: "Robe chatoyante aux dentelles de couleurs vives, complétée par la 'Fouta' en satin rayé et les célèbres bracelets émaillés de Beni Yenni.",
        heritageBadge: "Artisanat d'excellence",
        materials: "Satin de soie, galons brodés et émail cloisonné sur argent",
        image: "/images/culture/clothing/robe-kabyle.webp"
      },
      {
        name: "Bijoux émaillés de Beni Yenni",
        description: "Parures d'argent serties de corail rouge et rehaussées d'émaux jaune, vert et bleu turquoise selon une technique séculaire.",
        heritageBadge: "Orfèvrerie kabyle ancestrale",
        materials: "Argent massif, corail de Méditerranée et émail",
        image: "/images/culture/clothing/bijoux-kabyles.webp"
      }
    ],
    aiSuggestedPrompts: [
      "Randonner à Tikjda et dans le Djurdjura : itinéraires et conseils pratiques.",
      "Comment sont fabriqués les célèbres bijoux en argent et corail de Beni Yenni ?",
      "Recette et histoire du Tikourbabine traditionnel kabyle."
    ]
  },

  tipaza: {
    historicalHighlight: "Comptoir phénicien puis colonie romaine en bord de mer, immortalisée par Albert Camus pour sa beauté radieuse entre ruines et mer azur.",
    bestTimeToVisit: "Mars à Novembre",
    famousFoods: [
      {
        name: "Poissons Grillés du Petit Port de Tipaza",
        description: "Daurades royales, loups de mer et crevettes pêchés du jour, grillés au feu de bois avec citron frais et frites maison.",
        tag: "Saveur iodée fraîche",
        image: "/images/culture/food/poisson-grille.webp"
      }
    ],
    touristPlaces: [
      {
        name: "Ruines Romaines de Tipaza (UNESCO)",
        description: "Site archéologique côtier magique où les colonnes romaines, basiliques et sarcophages côtoient directement les vagues.",
        type: "Patrimoine mondial UNESCO",
        image: "/images/destinations/destinations_10_porte_de_tipaza_-_panoramio_jpg.webp"
      },
      {
        name: "Tombeau de la Chrétienne (Kbour er-Roumia)",
        description: "Gigantesque mausolée royal maurétanien circulaire de 60 mètres de diamètre surplombant la plaine de la Mitidja.",
        type: "Monument royal antique",
        image: "/images/culture/places/tombeau-chretienne.webp"
      }
    ],
    traditionalClothing: [
      {
        name: "Tenue Chenouie et Côtière",
        description: "Drapé blanc léger agrémenté de broderies vertes et azur, inspiré de la douceur de vivre méditerranéenne.",
        heritageBadge: "Tradition du mont Chenoua",
        materials: "Toile de coton et lin",
        image: "/images/culture/clothing/hayek-algerois.jpg"
      }
    ],
    aiSuggestedPrompts: [
      "Que disait Albert Camus sur les ruines de Tipaza et quel parcours suivre ?",
      "Quelle est la véritable histoire du Tombeau de la Chrétienne ?",
      "Où déguster les meilleurs poissons frais face au port de Tipaza ?"
    ]
  },

  biskra: {
    historicalHighlight: "La 'Reine des Ziban', porte d'or du Sahara réputée pour ses 4 millions de palmiers dattiers et ses oasis verdoyantes.",
    bestTimeToVisit: "Octobre à Avril",
    famousFoods: [
      {
        name: "Dattes Deglet Nour d'Or",
        description: "Les 'doigts de lumière', dattes mielleuses translucides réputées comme les meilleures au monde.",
        tag: "Joyau oasien",
        image: "/images/destinations/destinations_7_dattes_de_deglet_nour_tolga_wilaya_.webp"
      },
      {
        name: "Doubara Biskria",
        description: "Plat piquant revigorant de pois chiches ou fèves, généreusement relevé d'huile d'olive, piment vert, ail et tomates fraîches.",
        tag: "Plat populaire culte",
        image: "/images/culture/food/doubara.webp"
      },
      {
        name: "Chakhchoukha de Biskra",
        description: "Pâte fine cuite à la plaque, sauce rouge flamboyante aux piments de Biskra et agneau du désert.",
        tag: "Plat festif d'honneur",
        image: "/images/culture/food/chakhchoukha.webp"
      }
    ],
    touristPlaces: [
      {
        name: "Gorges d'El Kantara & Pont Romain",
        description: "Le défilé monumental où la roche rouge s'ouvre pour laisser soudainement éclater la première palmeraie du désert.",
        type: "Porte naturelle du Sahara",
        image: "/images/destinations/destinations_60_gorges_d_el_kantara_biskra01_jpg.webp"
      },
      {
        name: "Palmeraies de Tolga et Sidi Okba",
        description: "Immenses oasis ombragées abritant la mosquée historique de Sidi Okba, plus ancien monument islamique d'Algérie.",
        type: "Oasis & patrimoine",
        image: "/images/destinations/destinations_7_dattes_de_deglet_nour_tolga_wilaya_.webp"
      }
    ],
    traditionalClothing: [
      {
        name: "Gandoura et Chèche des Ziban",
        description: "Vêtements amples en lin blanc et coiffes sahariennes légères protégeant de la chaleur des oasis.",
        heritageBadge: "Style oasien",
        materials: "Coton léger et lin",
        image: "/images/culture/clothing/cheche-touareg.webp"
      }
    ],
    aiSuggestedPrompts: [
      "Qu'est-ce qui rend les dattes Deglet Nour de Biskra si exceptionnelles ?",
      "Comment visiter les impressionnantes gorges d'El Kantara ?",
      "Quelle est la recette secrète de la Doubara biskrie ?"
    ]
  }
};

// Generic cultural fallback generator for any of the 69 official wilayas
export function getWilayaCulture(wilayaName: string, region: string = "north"): WilayaCulture {
  const key = wilayaName.toLowerCase().trim();
  if (wilayasCultureData[key]) {
    return wilayasCultureData[key];
  }

  // Smart regional fallback based on Algerian geography
  const regionLabel = region === "sahara" ? "Sahara" : region === "highlands" ? "Hauts-Plateaux" : "Nord & Littoral";

  return {
    historicalHighlight: `Wilaya historique des ${regionLabel} algériens, réputée pour ses paysages authentiques, ses traditions d'accueil et son riche patrimoine local.`,
    bestTimeToVisit: region === "sahara" ? "Octobre à Avril" : "Printemps et Été",
    famousFoods: [
      {
        name: "Couscous Traditionnel du Terroir",
        description: "Couscous roulé à la main avec légumes frais locaux, viande mijotée aux épices douces de la région.",
        tag: "Plat emblématique",
        image: "/images/culture/food/couscous-algerien.webp"
      },
      {
        name: "Pain de Campagne (Khobz Eddar / Kesra)",
        description: "Galette dorée croustillante à la semoule fine et graines de nigelle, cuite sur tajine en terre cuite.",
        tag: "Tradition boulangère",
        image: "/images/culture/food/mhadjeb.webp"
      },
      {
        name: "Plats Mijotés & Ragoûts d'Antan",
        description: "Mijotés aux herbes de montagne ou dattes selon la saison, accompagnés de thé à la menthe parfumé.",
        tag: "Saveur locale",
        image: "/images/culture/food/tajine-el-kroum.webp"
      }
    ],
    touristPlaces: [
      {
        name: `Centre Historique et Souks de ${wilayaName}`,
        description: "Marchés traditionnels et ruelles commerçantes animées proposant épices, tapis et artisanat local.",
        type: "Cœur historique",
        image: "/images/destinations/destinations_13_ksar_ghardaia_place_march_1_jpg.webp"
      },
      {
        name: "Sites Naturels & Panoramas de la Wilaya",
        description: "Points de vue spectaculaires et grands espaces naturels propices à la détente et à la découverte.",
        type: "Site naturel",
        image: "/images/destinations/destinations_15_djurdjura6_jpg.webp"
      }
    ],
    traditionalClothing: [
      {
        name: `Costume Traditionnel de ${wilayaName}`,
        description: `Tenue d'apparat régionale ornée de broderies délicates, ceintures tissées main et bijoux artisanaux reflétant l'héritage des ${regionLabel}.`,
        heritageBadge: "Patrimoine régional algérien",
        materials: "Tissus soyeux, broderies artisanales et parures d'argent",
        image: "/images/culture/clothing/chedda-tlemcen.webp"
      }
    ],
    aiSuggestedPrompts: [
      `Quels sont les plus beaux endroits à visiter à ${wilayaName} ?`,
      `Quelles spécialités culinaires et artisanales goûter à ${wilayaName} ?`,
      `Raconte-moi l'histoire et les traditions culturelles de la wilaya de ${wilayaName}.`
    ]
  };
}
