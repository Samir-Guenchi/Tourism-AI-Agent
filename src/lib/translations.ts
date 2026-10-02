export type Language = "en" | "fr" | "ar";

export const languages: { code: Language; label: string; nativeName: string; flag: string }[] = [
  { code: "en", label: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "fr", label: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "ar", label: "Arabic", nativeName: "العربية", flag: "🇩🇿" },
];

export type TranslationKeys = {
  // Navbar
  navHome: string;
  navMap: string;
  navChat: string;
  navHotels: string;
  navCars: string;
  navDining: string;
  navActivities: string;
  navTransport: string;
  navProfile: string;
  navLight: string;
  navDark: string;
  navMyPlan: string;
  navPlanEmpty: string;
  navPlanDescription: string;
  navViewFullPlan: string;

  // Profile
  profileTitle: string;
  profileSubtitle: string;
  profileGoldTraveler: string;
  profileFullName: string;
  profileEmail: string;
  profilePhone: string;
  profileLocation: string;
  profilePersonalInfo: string;
  profileMyBookings: string;
  profileBookingsDescription: string;
  profileViewAllBookings: string;
  profileBookingsTypes: string;
  profileSettings: string;
  profileAccountSettings: string;
  profileAccountDesc: string;
  profileNotifications: string;
  profileNotificationsDesc: string;
  profileLanguage: string;
  profileLanguageDesc: string;
  profileTerms: string;
  profileTermsDesc: string;
  profileShareMoments: string;
  profileSignOut: string;
  profileCancel: string;
  profileSaveChanges: string;
  profileSaving: string;
  profileUpdateInfo: string;
  profileUpdateDesc: string;

  // Language dialog
  langTitle: string;
  langDescription: string;

  // Notifications dialog
  notifTitle: string;
  notifDescription: string;
  notifPlanColor: string;
  notifShowButton: string;
  notifShowButtonDesc: string;

  // Terms
  termsTitle: string;

  // Home page
  homeDiscover: string;
  homeWithAI: string;
  homeSubtitle: string;
  homeSearchPlaceholder: string;
  homePlanMyTrip: string;
  homeWilayas: string;
  homeLanguages: string;
  homeRating: string;
  homePopularNow: string;
  homeTopDestinations: string;
  homeExploreDestinations: string;
  homeExploreAll: string;
  homeServicesTitle: string;
  homeServicesSubtitle: string;
  homeHotelsTitle: string;
  homeHotelsDesc: string;
  homeCarTitle: string;
  homeCarDesc: string;
  homeDiningTitle: string;
  homeDiningDesc: string;
  homeActivitiesTitle: string;
  homeActivitiesDesc: string;
  homeTransportTitle: string;
  homeTransportDesc: string;
  homeBrowse: string;
  homeHowItWorks: string;
  homeHowSubtitle: string;
  homeStep1Title: string;
  homeStep1Desc: string;
  homeStep2Title: string;
  homeStep2Desc: string;
  homeStep3Title: string;
  homeStep3Desc: string;
  homeTestimonials: string;
  homeTestimonialsSubtitle: string;
  homeCTA: string;
  homeCTASubtitle: string;
  homeGetStarted: string;
  homeFooterDesc: string;
  homeDestinations: string;
  homeServices: string;
  homeCompany: string;
  homePrivacy: string;
  homeTerms: string;
  homeContact: string;
  homeCopyright: string;
  homeContactTitle: string;
  homeContactText: string;

  // Services page
  servicesTitle: string;
  servicesSubtitle: string;
  servicesRestaurantsName: string;
  servicesRestaurantsDesc: string;
  servicesRestaurantsCount: string;
  servicesHotelsName: string;
  servicesHotelsDesc: string;
  servicesHotelsCount: string;
  servicesCarsName: string;
  servicesCarsDesc: string;
  servicesCarsCount: string;
  servicesTransportName: string;
  servicesTransportDesc: string;
  servicesTransportCount: string;
  servicesActivitiesName: string;
  servicesActivitiesDesc: string;
  servicesActivitiesCount: string;
  servicesExplore: string;
  servicesNeedHelp: string;
  servicesHelpDesc: string;
  servicesAskAI: string;

  // Bookings page
  bookingsTitle: string;
  bookingsSubtitle: string;
  bookingsEmpty: string;
  bookingsSearch: string;
  bookingsUpcoming: string;
  bookingsCompleted: string;
  bookingsCancelled: string;
  bookingsAll: string;
  bookingsDelete: string;

  // Common
  commonDiscover: string;
  commonAddToPlan: string;
  commonAdded: string;
  commonPerNight: string;
  commonPerPerson: string;
  commonPerDay: string;
  commonFrom: string;
  commonDetails: string;
  commonBookNow: string;
  commonSearch: string;
  commonFilter: string;
  commonSortBy: string;
  commonRating: string;
  commonReviews: string;
  commonTopRated: string;
  commonMostReviewed: string;
  commonPriceLow: string;
  commonPriceHigh: string;
  commonAll: string;
  commonAllCities: string;
  commonReadMore: string;
  commonBack: string;
  commonViewDetails: string;
  commonDZD: string;

  // Destinations page
  destHeroTitle1: string;
  destHeroTitle2: string;
  destHeroTitle3: string;
  destHeroSubtitle: string;
  destSearchPlaceholder: string;
  destStatWilayas: string;
  destStatWilayasLabel: string;
  destStatAI: string;
  destStatAILabel: string;
  destStatInfo: string;
  destStatInfoLabel: string;
  destLoadingMap: string;
  destMapUnavailable: string;
  destMapUnavailableDesc: string;
  destAbout: string;
  destRegion: string;
  destType: string;
  destHotels: string;
  destActivities: string;
  destCarRentals: string;
  destDining: string;
  destNoServices: string;
  destInPlan: string;
  destAddToPlan: string;
  destViewDetails: string;
  destChooseDestination: string;
  destChooseSubtitle: string;
  destDiscoverAlgeria: string;
  destTabAll: string;
  destTabNorth: string;
  destTabHighlands: string;
  destTabSouth: string;
  destTabCoastal: string;
  destExploreByRegion: string;
  destViewAll: string;
  destWilayas: string;
  destBackToMap: string;
  destWilayasCount: string;
  regionAll: string;
  regionNorth: string;
  regionHighlands: string;
  regionSahara: string;
  regionLittoral: string;
  destDisclaimer: string;
  destChatPlaceholderMap: string;
  destChatPlaceholderAsk: string;
  destExplorerAgent: string;
  destAskAbout: string;
  destSelectToExplore: string;
  destExploreWilaya: string;
  destSelectWilaya: string;
  destChatDescExplore: string;
  destChatDescSelect: string;
  destSuggestion1: string;
  destSuggestion2: string;
  destSuggestion3: string;
  destReadAloud: string;
  destBack: string;
  destPerNight: string;
  destDay: string;
  destSeats: string;
  destDA: string;

  // Map page
  mapSearchCity: string;
  mapLayout: string;
  mapHorizontal: string;
  mapVertical: string;
  mapLayers: string;
  mapLayerUnesco: string;
  mapLayerHistorical: string;
  mapLayerParks: string;
  mapLayerBeaches: string;
  mapLayerSki: string;
  mapLayerAirports: string;
  mapLayerTrains: string;
  mapCircuits: string;
  mapPlanYourStay: string;
  mapLinkedTo: string;
  mapHotelDetails: string;
  mapVehicleDetails: string;
  mapRestaurantDetails: string;
  mapActivityDetails: string;
  mapRemoveFromPlan: string;
  mapNoDetails: string;
  mapAutoSaving: string;
  mapLoadingPlan: string;
  mapNoItems: string;
  mapTripPreferences: string;
  mapBudget: string;
  mapLuxury: string;
  mapDaysToStay: string;
  mapPlannerAgent: string;
  mapItemsInPlan: string;
  mapPlanTrip: string;
  mapPlanTripDesc: string;
  mapSuggestionItinerary: string;
  mapSuggestionRoute: string;
  mapSuggestionHotels: string;
  mapAskAI: string;
  mapConstructingPlan: string;
  mapMappingRoutes: string;
  mapOverview: string;
  mapLegend: string;
  mapLegendCapital: string;
  mapLegendCities: string;
  mapLegendSahara: string;
  mapLegendParks: string;
  mapLegendBeaches: string;
  mapCategory: string;
  mapPrice: string;
  mapAmenities: string;
  mapRating: string;
  mapIncluded: string;
  mapSeats: string;
  mapDuration: string;
  mapDifficulty: string;
  mapCuisine: string;
  mapPriceRange: string;
  mapSpecialties: string;
  mapWilayas: string;
  mapHotels: string;
  mapActivities: string;
  mapDining: string;
  mapTransport: string;
  mapConnectedStay: string;
  mapConnectedJourney: string;
  mapConnectedExperience: string;

  // Chat page
  chatGreeting: string;
  chatSubtitle: string;
  chatAssistant: string;
  chatHello: string;
  chatExplorePrompt: string;
  chatPopular: string;
  chatInputPlaceholder: string;
  chatNewConversation: string;
  chatConversations: string;
  chatTripPlanner: string;
  chatToday: string;
  chatError: string;
  chatAlgiersItinerary: string;
  chatAlgiersItineraryDesc: string;
  chatAlgiersItineraryPrompt: string;
  chatHotelsOran: string;
  chatHotelsOranDesc: string;
  chatHotelsOranPrompt: string;
  chatConstantineDining: string;
  chatConstantineDiningDesc: string;
  chatConstantineDiningPrompt: string;
  chatTlemcenActivities: string;
  chatTlemcenActivitiesDesc: string;
  chatTlemcenActivitiesPrompt: string;

  // Services pages - common
  svcAmenities: string;
  svcFilters: string;
  svcReset: string;
  svcClear: string;
  svcShow: string;
  svcFeatured: string;
  svcViewDetails: string;
  svcSave: string;
  svcSaved: string;
  svcAdd: string;
  svcInPlan: string;
  svcResults: string;
  svcResult: string;
  svcNoMatch: string;
  svcNoMatchDesc: string;
  svcClearAll: string;
  svcAll: string;
  svcAllCities: string;
  svcStars: string;
  svcMaxPrice: string;
  svcUpTo: string;
  svcPerNight: string;
  svcPerDay: string;
  svcPerPerson: string;
  svcCities: string;

  // Hotels page
  hotelHeroSubtitle: string;
  hotelHeroTitle: string;
  hotelHeroDesc: string;
  hotelCount: string;
  hotelDestination: string;
  hotelSearchDest: string;
  hotelCheckin: string;
  hotelCheckout: string;
  hotelGuests: string;
  hotelAddGuests: string;
  hotelGuestsSuffix: string;
  hotelAmenities: string;
  hotelNight: string;
  hotelNoMatch: string;

  // Cars page
  carHeroSubtitle: string;
  carHeroTitle: string;
  carHeroDesc: string;
  carCount: string;
  carPickupLocation: string;
  carSearchLocation: string;
  carPickupDate: string;
  carReturnDate: string;
  carDays: string;
  carSelectDays: string;
  carDaysSuffix: string;
  carTransmission: string;
  carManuelle: string;
  carAutomatique: string;
  carVehicleType: string;
  carSaharaWarning: string;
  carSaharaDesc: string;
  carRecommended: string;
  carBookNow: string;
  carDay: string;
  carNoMatch: string;

  // Restaurants page
  restHeroSubtitle: string;
  restHeroTitle: string;
  restHeroDesc: string;
  restCount: string;
  restCity: string;
  restSearchCity: string;
  restCuisine: string;
  restAllCuisines: string;
  restAmbiance: string;
  restTerrace: string;
  restIndoor: string;
  restReviews: string;
  restReserve: string;
  restNoMatch: string;

  // Activities page
  actHeroSubtitle: string;
  actHeroTitle: string;
  actHeroDesc: string;
  actCount: string;
  actGuided: string;
  actHiking: string;
  actWater: string;
  actCultural: string;
  actDesert: string;
  actGroup: string;
  actNoMatch: string;
  actNoMatchDesc: string;

  // Transport page
  transTitle: string;
  transSubtitle: string;
  transFrom: string;
  transWhereFrom: string;
  transTo: string;
  transWhereTo: string;
  transDate: string;
  transAddDate: string;
  transTrains: string;
  transBuses: string;
  transFlights: string;
  transFerries: string;
  transRoutes: string;
  transOperator: string;
  transBook: string;
  transSoldOut: string;
  transNoRoutes: string;
  transNoRoutesDesc: string;

  // Detail pages - common
  detailNotFound: string;
  detailNotFoundDesc: string;
  detailBackTo: string;
  detailReviews: string;
  detailAbout: string;
  detailHighlights: string;
  detailInPlan: string;
  detailAddToPlan: string;
  detailBookNow: string;
  detailContactToBook: string;
  detailContactToReserve: string;
  detailCallReservation: string;
  detailBookingSummary: string;
  detailAdding: string;
  detailAddMyBooking: string;
  detailSimilar: string;
  detailMoreIn: string;
  detailTaxes: string;
  detailIncluded: string;
  detailTotal: string;
  detailIndividualPrice: string;
  detailGroupPrice: string;
  detailBestValue: string;
  detailSave: string;

  // Hotel detail
  detailBackHotels: string;
  detailAboutHotel: string;
  detailCheckin: string;
  detailCheckout: string;
  detailGuests: string;
  detailNights: string;
  detailMoreStaysIn: string;
  detailHotelLabel: string;
  detailGuestsLabel: string;
  detailNightsLabel: string;

  // Car detail
  detailBackCars: string;
  detailAboutVehicle: string;
  detailSpecifications: string;
  detailTransmission: string;
  detailFuel: string;
  detailSeats: string;
  detailIncludedOptions: string;
  detailKmIncluded: string;
  detailType: string;
  detailAgency: string;
  detailPricePerDay: string;
  detailSimilarVehicles: string;
  detailVehicleLabel: string;
  detailAgencyLabel: string;
  detailDaysLabel: string;
  detailRecommended: string;

  // Restaurant detail
  detailBackRestaurants: string;
  detailAboutRestaurant: string;
  detailSpecialties: string;
  detailCuisine: string;
  detailPriceRange: string;
  detailTerrace: string;
  detailHalal: string;
  detailAvailable: string;
  detailNotAvailable: string;
  detailYes: string;
  detailNo: string;
  detailReserve: string;
  detailRestaurantLabel: string;

  // Activity detail
  detailBackActivities: string;
  detailAboutActivity: string;
  detailDuration: string;
  detailGroupPriceLabel: string;
  detailDifficulty: string;
  detailDurationLabel: string;
  detailGuidedExperience: string;
  detailDifficultyLevel: string;
  detailGroupDiscount: string;
  detailExpertGuides: string;
  detailSimilarActivities: string;
  detailActivityLabel: string;
  detailParticipantsLabel: string;
  detailParticipants: string;

  // Destination/Wilaya detail
  detailBackDestinations: string;
  detailBestTime: string;
  detailIdealDuration: string;
  detailGettingThere: string;
  detailYearRound: string;
  detailDays1to3: string;
  detailByRoad: string;
  detailCarRentals: string;
  detailAvailableCount: string;
  detailExploreWithAI: string;
  detailAIRecommendations: string;
  detailAddToPlanLower: string;
  detailDetailsWithAI: string;
};

const en: TranslationKeys = {
  navHome: "Home",
  navMap: "Map",
  navChat: "Chat",
  navHotels: "Hotels",
  navCars: "Cars",
  navDining: "Dining",
  navActivities: "Activities",
  navTransport: "Transport",
  navProfile: "Profile",
  navLight: "Light",
  navDark: "Dark",
  navMyPlan: "My Plan",
  navPlanEmpty: "No wilayas added yet",
  navPlanDescription: "wilaya(s) in your plan",
  navViewFullPlan: "View Full Plan",

  profileTitle: "Personal Information",
  profileSubtitle: "Traveler",
  profileGoldTraveler: "Gold Traveler",
  profileFullName: "Full Name",
  profileEmail: "Email",
  profilePhone: "Phone",
  profileLocation: "Location",
  profilePersonalInfo: "Personal Information",
  profileMyBookings: "My Bookings",
  profileBookingsDescription: "View and manage your reservations",
  profileViewAllBookings: "View All Bookings",
  profileBookingsTypes: "Hotels, activities, cars, and restaurants",
  profileSettings: "Settings",
  profileAccountSettings: "Account Settings",
  profileAccountDesc: "Manage your personal information",
  profileNotifications: "Notifications",
  profileNotificationsDesc: "Configure alert preferences",
  profileLanguage: "Language",
  profileLanguageDesc: "Arabic, French, English",
  profileTerms: "Terms & Conditions",
  profileTermsDesc: "Review our terms and policies",
  profileShareMoments: "Share Travel Moments",
  profileSignOut: "Sign Out",
  profileCancel: "Cancel",
  profileSaveChanges: "Save Changes",
  profileSaving: "Saving...",
  profileUpdateInfo: "Update your personal information. Changes will be saved to your profile.",
  profileUpdateDesc: "Update your personal information.",

  langTitle: "Language",
  langDescription: "Choose your preferred language for the interface.",

  notifTitle: "Notifications",
  notifDescription: "Customize your notification and display preferences.",
  notifPlanColor: "My Plan Button Color",
  notifShowButton: "Show Plan Button",
  notifShowButtonDesc: "Show or hide the floating plan button",

  termsTitle: "Terms & Conditions",

  homeDiscover: "Discover Algeria",
  homeWithAI: "with AI",
  homeSubtitle: "Your personal AI guide that plans the perfect Algerian trip. Hotels, restaurants, activities — all tailored to you.",
  homeSearchPlaceholder: "Where do you want to go?",
  homePlanMyTrip: "Plan my trip",
  homeWilayas: "69 wilayas covered",
  homeLanguages: "3 languages",
  homeRating: "4.9 average rating",
  homePopularNow: "Popular right now",
  homeTopDestinations: "Top Destinations",
  homeExploreDestinations: "Explore the most visited places in Algeria",
  homeExploreAll: "Explore all destinations",
  homeServicesTitle: "Plan every part of your trip",
  homeServicesSubtitle: "From flights to desert camps, book it all through Texa",
  homeHotelsTitle: "Hotels",
  homeHotelsDesc: "Handpicked stays, from boutique riads to 5-star resorts.",
  homeCarTitle: "Car Rental",
  homeCarDesc: "Self-drive across the country with flexible pickups.",
  homeDiningTitle: "Dining",
  homeDiningDesc: "Couscous, tajines, and the best seaside restaurants.",
  homeActivitiesTitle: "Activities",
  homeActivitiesDesc: "Sahara treks, desert camps, and cultural tours.",
  homeTransportTitle: "Transport",
  homeTransportDesc: "Domestic flights, trains, and intercity buses.",
  homeBrowse: "Browse",
  homeHowItWorks: "How It Works",
  homeHowSubtitle: "Three simple steps to your perfect trip",
  homeStep1Title: "Chat with AI",
  homeStep1Desc: "Tell our AI agent where you want to go, your budget, and preferences.",
  homeStep2Title: "Get Recommendations",
  homeStep2Desc: "Receive personalized itineraries, hotels, and activities tailored for you.",
  homeStep3Title: "Book & Go",
  homeStep3Desc: "Confirm your bookings and embark on your Algerian adventure.",
  homeTestimonials: "What Travelers Say",
  homeTestimonialsSubtitle: "Loved by travelers",
  homeCTA: "Ready to explore Algeria?",
  homeCTASubtitle: "Let our AI plan your perfect trip. It's free, fast, and personalized.",
  homeGetStarted: "Get Started Free",
  homeFooterDesc: "The AI travel planner for Algeria. Hotels, routes, and experiences — all in one place.",
  homeDestinations: "Destinations",
  homeServices: "Services",
  homeCompany: "Company",
  homePrivacy: "Privacy",
  homeTerms: "Terms",
  homeContact: "Contact",
  homeCopyright: "© 2026 Texa. All rights reserved.",
  homeContactTitle: "Contact Us",
  homeContactText: "Have a question or feedback? Reach out to us at",

  servicesTitle: "Tourist Services",
  servicesSubtitle: "Everything you need for an unforgettable journey through Algeria",
  servicesRestaurantsName: "Restaurants",
  servicesRestaurantsDesc: "Discover authentic Algerian cuisine and international flavors",
  servicesRestaurantsCount: "20+ restaurants",
  servicesHotelsName: "Hotels & Stays",
  servicesHotelsDesc: "Find the perfect accommodation for your Algerian adventure",
  servicesHotelsCount: "15+ hotels",
  servicesCarsName: "Car Rental",
  servicesCarsDesc: "Rent a vehicle to explore Algeria at your own pace",
  servicesCarsCount: "20+ vehicles",
  servicesTransportName: "Transport",
  servicesTransportDesc: "Trains, buses, flights, and ferries across Algeria",
  servicesTransportCount: "Multiple routes",
  servicesActivitiesName: "Activities & Excursions",
  servicesActivitiesDesc: "Adventures from mountains to desert, culture to nature",
  servicesActivitiesCount: "20+ activities",
  servicesExplore: "Explore →",
  servicesNeedHelp: "Need Help Planning?",
  servicesHelpDesc: "Our AI assistant can help you plan your entire trip, from booking hotels to finding the best restaurants and activities.",
  servicesAskAI: "Ask AI Assistant",

  bookingsTitle: "My Bookings",
  bookingsSubtitle: "View and manage your reservations",
  bookingsEmpty: "No bookings found.",
  bookingsSearch: "Search bookings...",
  bookingsUpcoming: "Upcoming",
  bookingsCompleted: "Completed",
  bookingsCancelled: "Cancelled",
  bookingsAll: "All",
  bookingsDelete: "Delete",

  commonDiscover: "Discover",
  commonAddToPlan: "Add to Plan",
  commonAdded: "Added",
  commonPerNight: "/night",
  commonPerPerson: "/person",
  commonPerDay: "/day",
  commonFrom: "From",
  commonDetails: "Details",
  commonBookNow: "Book Now",
  commonSearch: "Search",
  commonFilter: "Filter",
  commonSortBy: "Sort by",
  commonRating: "Top Rated",
  commonReviews: "Most Reviewed",
  commonTopRated: "Top Rated",
  commonMostReviewed: "Most Reviewed",
  commonPriceLow: "Price: Low",
  commonPriceHigh: "Price: High",
  commonAll: "All",
  commonAllCities: "All Cities",
  commonReadMore: "Read more",
  commonBack: "Back",
  commonViewDetails: "View Details",
  commonDZD: "DZD",

  destHeroTitle1: "Discover all the",
  destHeroTitle2: "Wilayas of Algeria",
  destHeroTitle3: "with your Local Guide",
  destHeroSubtitle: "Explore the 69 wilayas, their cultural, tourist, and natural treasures. Let our local travel experts guide you to the perfect journey.",
  destSearchPlaceholder: "Ask your local guide — tell me about Algeria...",
  destStatWilayas: "69 Wilayas",
  destStatWilayasLabel: "to explore",
  destStatAI: "Local Expert",
  destStatAILabel: "to guide you",
  destStatInfo: "Full Info",
  destStatInfoLabel: "up-to-date & reliable",
  destLoadingMap: "Loading the interactive map…",
  destMapUnavailable: "Map Unavailable",
  destMapUnavailableDesc: "The interactive map requires an internet connection to load the wilaya GeoJSON data.",
  destAbout: "About",
  destRegion: "Region",
  destType: "Type",
  destHotels: "Hotels",
  destActivities: "Activities",
  destCarRentals: "Car Rentals",
  destDining: "Dining",
  destNoServices: "No services listed yet for this wilaya",
  destInPlan: "In Plan",
  destAddToPlan: "Add to Plan",
  destViewDetails: "View Details",
  destChooseDestination: "Choose Your Destination",
  destChooseSubtitle: "Select a wilaya below or tap directly on the map to explore hotels, activities, restaurants, and more.",
  destDiscoverAlgeria: "Discover Algeria",
  destTabAll: "All",
  destTabNorth: "North",
  destTabHighlands: "Highlands",
  destTabSouth: "South",
  destTabCoastal: "Coastal",
  destExploreByRegion: "Explore by Region",
  destViewAll: "View All",
  destWilayas: "Wilayas",
  destBackToMap: "Back to Map",
  destWilayasCount: "wilayas to discover",
  regionAll: "All Wilayas",
  regionNorth: "North",
  regionHighlands: "Highlands",
  regionSahara: "South",
  regionLittoral: "Coastal",
  destDisclaimer: "AI may produce inaccurate information. Always verify important details.",
  destChatPlaceholderMap: "Select a wilaya on the map to start chatting...",
  destChatPlaceholderAsk: "Ask AI about",
  destExplorerAgent: "Explorer Agent",
  destAskAbout: "Ask about",
  destSelectToExplore: "Select a wilaya to explore",
  destExploreWilaya: "Explore",
  destSelectWilaya: "Select a Wilaya",
  destChatDescExplore: "Ask me anything about hotels, activities, or things to do in",
  destChatDescSelect: "Click on any wilaya on the map to select it, then I can help you discover hotels, activities, and more.",
  destSuggestion1: "What are the best hotels here?",
  destSuggestion2: "What activities can I do?",
  destSuggestion3: "Plan a day trip for me",
  destReadAloud: "Read aloud",
  destBack: "Back",
  destPerNight: "/night",
  destDay: "/day",
  destSeats: "seats",
  destDA: "DA",

  mapSearchCity: "Search a city...",
  mapLayout: "LAYOUT",
  mapHorizontal: "Horizontal",
  mapVertical: "Vertical",
  mapLayers: "MAP LAYERS",
  mapLayerUnesco: "UNESCO Sites",
  mapLayerHistorical: "Historical",
  mapLayerParks: "National Parks",
  mapLayerBeaches: "Beaches",
  mapLayerSki: "Ski Stations",
  mapLayerAirports: "Airports",
  mapLayerTrains: "Train Stations",
  mapCircuits: "SUGGESTED CIRCUITS",
  mapPlanYourStay: "PLAN YOUR STAY",
  mapLinkedTo: "LINKED TO",
  mapHotelDetails: "HOTEL DETAILS",
  mapVehicleDetails: "VEHICLE DETAILS",
  mapRestaurantDetails: "RESTAURANT DETAILS",
  mapActivityDetails: "ACTIVITY DETAILS",
  mapRemoveFromPlan: "Remove from Plan",
  mapNoDetails: "No details available",
  mapAutoSaving: "Auto-saving...",
  mapLoadingPlan: "Loading your travel plan...",
  mapNoItems: "No items yet",
  mapTripPreferences: "TRIP PREFERENCES",
  mapBudget: "Budget",
  mapLuxury: "Luxury",
  mapDaysToStay: "Days to Stay",
  mapPlannerAgent: "Planner Agent",
  mapItemsInPlan: "item(s) in plan",
  mapPlanTrip: "Plan Your Trip",
  mapPlanTripDesc: "Ask me to generate a complete itinerary based on your plan items and preferences.",
  mapSuggestionItinerary: "Generate a 5-day itinerary",
  mapSuggestionRoute: "Optimize my route between wilayas",
  mapSuggestionHotels: "Suggest budget-friendly hotels",
  mapAskAI: "Ask AI to plan your trip...",
  mapConstructingPlan: "Constructing your plan",
  mapMappingRoutes: "Mapping routes & arranging destinations...",
  mapOverview: "Overview",
  mapLegend: "Map Legend",
  mapLegendCapital: "Capital",
  mapLegendCities: "Cities",
  mapLegendSahara: "Sahara/Oasis",
  mapLegendParks: "Parks/Mountains",
  mapLegendBeaches: "Beaches/Coast",
  mapCategory: "Category",
  mapPrice: "Price",
  mapAmenities: "Amenities",
  mapRating: "Rating",
  mapIncluded: "Included",
  mapSeats: "Seats",
  mapDuration: "Duration",
  mapDifficulty: "Difficulty",
  mapCuisine: "Cuisine",
  mapPriceRange: "Price Range",
  mapSpecialties: "Specialties",
  mapWilayas: "Wilayas",
  mapHotels: "Hotels",
  mapActivities: "Activities",
  mapDining: "Dining",
  mapTransport: "Transport",
  mapConnectedStay: "stay",
  mapConnectedJourney: "journey",
  mapConnectedExperience: "experience",

  chatGreeting: "Hello! I'm your AI travel assistant for Algeria. I can help you plan trips, find hotels, discover restaurants, and create personalized itineraries.\n\nWhere would you like to explore?",
  chatSubtitle: "AI Travel Assistant",
  chatAssistant: "AI Travel Assistant",
  chatHello: "Hello",
  chatExplorePrompt: "Where would you like to explore today? I can plan your itinerary, recommend hotels, restaurants and activities across Algeria.",
  chatPopular: "Popular",
  chatInputPlaceholder: "Ask about Algeria...",
  chatNewConversation: "New conversation",
  chatConversations: "CONVERSATIONS",
  chatTripPlanner: "Recommendation System",
  chatToday: "Today",
  chatError: "Sorry, I encountered an error. Please try again.",
  chatAlgiersItinerary: "Algiers itinerary",
  chatAlgiersItineraryDesc: "A 3-day city guide",
  chatAlgiersItineraryPrompt: "Plan me a 3-day itinerary in Algiers",
  chatHotelsOran: "Hotels in Oran",
  chatHotelsOranDesc: "Best stays for any budget",
  chatHotelsOranPrompt: "Find me a good hotel in Oran",
  chatConstantineDining: "Constantine dining",
  chatConstantineDiningDesc: "Top-rated restaurants",
  chatConstantineDiningPrompt: "What are the best restaurants in Constantine?",
  chatTlemcenActivities: "Tlemcen activities",
  chatTlemcenActivitiesDesc: "Things to see and do",
  chatTlemcenActivitiesPrompt: "What can I do in Tlemcen?",

  svcAmenities: "Amenities",
  svcFilters: "Filters",
  svcReset: "Reset",
  svcClear: "Clear",
  svcShow: "Show",
  svcFeatured: "Featured",
  svcViewDetails: "View Details",
  svcSave: "Save",
  svcSaved: "Saved",
  svcAdd: "Add",
  svcInPlan: "In Plan",
  svcResults: "results",
  svcResult: "result",
  svcNoMatch: "No results match your filters",
  svcNoMatchDesc: "Try adjusting your criteria or clearing all filters.",
  svcClearAll: "Clear all filters",
  svcAll: "All",
  svcAllCities: "All Cities",
  svcStars: "Stars",
  svcMaxPrice: "Max price",
  svcUpTo: "Up to",
  svcPerNight: "DA / night",
  svcPerDay: "DA / day",
  svcPerPerson: "DA / person",
  svcCities: "cities",

  hotelHeroSubtitle: "Accommodations · Algeria",
  hotelHeroTitle: "Hotels & Stays",
  hotelHeroDesc: "Coastal resorts, mountain retreats, and desert lodges — handpicked stays in every corner of Algeria, from the Mediterranean to the Sahara.",
  hotelCount: "hotels",
  hotelDestination: "Destination",
  hotelSearchDest: "Search a destination",
  hotelCheckin: "Check-in",
  hotelCheckout: "Check-out",
  hotelGuests: "Guests",
  hotelAddGuests: "Add guests",
  hotelGuestsSuffix: "guest(s)",
  hotelAmenities: "Amenities",
  hotelNight: "night",
  hotelNoMatch: "No hotels match your filters",

  carHeroSubtitle: "Car Rental · Algeria",
  carHeroTitle: "Find Your Ride",
  carHeroDesc: "From compact city cars to desert-ready 4x4s — choose the perfect vehicle for your Algerian adventure.",
  carCount: "vehicles",
  carPickupLocation: "Pickup location",
  carSearchLocation: "Search a location",
  carPickupDate: "Pickup date",
  carReturnDate: "Return date",
  carDays: "Days",
  carSelectDays: "Select days",
  carDaysSuffix: "day(s)",
  carTransmission: "Transmission",
  carManuelle: "Manuelle",
  carAutomatique: "Automatique",
  carVehicleType: "Vehicle type",
  carSaharaWarning: "Sahara vehicle recommended",
  carSaharaDesc: "For desert terrain, a 4x4 vehicle is strongly recommended for safety and accessibility.",
  carRecommended: "Recommended",
  carBookNow: "Book Now",
  carDay: "day",
  carNoMatch: "No vehicles match your filters",

  restHeroSubtitle: "Restaurants · Algeria",
  restHeroTitle: "Taste Algeria",
  restHeroDesc: "From historic couscous houses to seaside grills — discover the flavors of Algeria, one plate at a time.",
  restCount: "restaurants",
  restCity: "City",
  restSearchCity: "Search a city",
  restCuisine: "Cuisine",
  restAllCuisines: "All cuisines",
  restAmbiance: "Ambiance",
  restTerrace: "Terrace",
  restIndoor: "Indoor",
  restReviews: "reviews",
  restReserve: "Reserve",
  restNoMatch: "No restaurants match your filters",

  actHeroSubtitle: "Activities · Algeria",
  actHeroTitle: "Explore Beyond",
  actHeroDesc: "From Saharan dunes to mountain peaks and Mediterranean shores — curated adventures across Algeria.",
  actCount: "activities",
  actGuided: "Guided Tours",
  actHiking: "Hiking",
  actWater: "Water Sports",
  actCultural: "Cultural",
  actDesert: "Desert",
  actGroup: "Group:",
  actNoMatch: "No activities match your filters",
  actNoMatchDesc: "Try a different destination or clearing your filters.",

  transTitle: "Transport",
  transSubtitle: "Trains, buses, flights, and ferries across Algeria",
  transFrom: "From",
  transWhereFrom: "Where from?",
  transTo: "To",
  transWhereTo: "Where to?",
  transDate: "Date",
  transAddDate: "Add date",
  transTrains: "Trains",
  transBuses: "Buses",
  transFlights: "Flights",
  transFerries: "Ferries",
  transRoutes: "routes",
  transOperator: "Operator",
  transBook: "Book",
  transSoldOut: "Sold Out",
  transNoRoutes: "No routes found",
  transNoRoutesDesc: "Try different cities or transport type",

  detailNotFound: "not found",
  detailNotFoundDesc: "The item you're looking for doesn't exist.",
  detailBackTo: "Back to",
  detailReviews: "reviews",
  detailAbout: "About this",
  detailHighlights: "Highlights",
  detailInPlan: "In Plan",
  detailAddToPlan: "Add to Plan",
  detailBookNow: "Book Now",
  detailContactToBook: "Contact to Book",
  detailContactToReserve: "Contact to Reserve",
  detailCallReservation: "Call to make a reservation",
  detailBookingSummary: "Booking Summary",
  detailAdding: "Adding...",
  detailAddMyBooking: "Add to my booking",
  detailSimilar: "Similar",
  detailMoreIn: "More in",
  detailTaxes: "Taxes",
  detailIncluded: "Included",
  detailTotal: "Total",
  detailIndividualPrice: "Individual price",
  detailGroupPrice: "Group price",
  detailBestValue: "Best value",
  detailSave: "Save",

  detailBackHotels: "Back to Hotels",
  detailAboutHotel: "About this hotel",
  detailCheckin: "CHECK-IN",
  detailCheckout: "CHECK-OUT",
  detailGuests: "GUESTS",
  detailNights: "NIGHTS",
  detailMoreStaysIn: "More stays in",
  detailHotelLabel: "Hotel:",
  detailGuestsLabel: "Guests:",
  detailNightsLabel: "Nights:",

  detailBackCars: "Back to Cars",
  detailAboutVehicle: "About this vehicle",
  detailSpecifications: "Specifications",
  detailTransmission: "Transmission",
  detailFuel: "Fuel",
  detailSeats: "Seats",
  detailIncludedOptions: "Included & Options",
  detailKmIncluded: "included",
  detailType: "TYPE",
  detailAgency: "AGENCY",
  detailPricePerDay: "Price per day",
  detailSimilarVehicles: "Similar vehicles",
  detailVehicleLabel: "Vehicle:",
  detailAgencyLabel: "Agency:",
  detailDaysLabel: "Days:",
  detailRecommended: "Recommended",

  detailBackRestaurants: "Back to Restaurants",
  detailAboutRestaurant: "About this restaurant",
  detailSpecialties: "Specialties",
  detailCuisine: "Cuisine",
  detailPriceRange: "Price Range",
  detailTerrace: "Terrace",
  detailHalal: "Halal",
  detailAvailable: "Available",
  detailNotAvailable: "Not available",
  detailYes: "Yes",
  detailNo: "No",
  detailReserve: "Reserve",
  detailRestaurantLabel: "Restaurant:",

  detailBackActivities: "Back to Activities",
  detailAboutActivity: "About this activity",
  detailDuration: "Duration",
  detailGroupPriceLabel: "Group Price",
  detailDifficulty: "Difficulty",
  detailDurationLabel: "DURATION",
  detailGuidedExperience: "guided experience",
  detailDifficultyLevel: "difficulty level",
  detailGroupDiscount: "Group discount:",
  detailExpertGuides: "Expert local guides",
  detailSimilarActivities: "Similar activities",
  detailActivityLabel: "Activity:",
  detailParticipantsLabel: "Participants:",
  detailParticipants: "Participants",

  detailBackDestinations: "Back to Destinations",
  detailBestTime: "Best Time",
  detailIdealDuration: "Ideal Duration",
  detailGettingThere: "Getting There",
  detailYearRound: "Year-round",
  detailDays1to3: "1–3 days",
  detailByRoad: "By road",
  detailCarRentals: "Car Rentals",
  detailAvailableCount: "available",
  detailExploreWithAI: "Explore with AI",
  detailAIRecommendations: "Ask our AI assistant for personalized recommendations",
  detailAddToPlanLower: "Add to plan",
  detailDetailsWithAI: "Details with AI",
};

const fr: TranslationKeys = {
  navHome: "Accueil",
  navMap: "Carte",
  navChat: "Discussion",
  navHotels: "Hôtels",
  navCars: "Voitures",
  navDining: "Restaurants",
  navActivities: "Activités",
  navTransport: "Transport",
  navProfile: "Profil",
  navLight: "Clair",
  navDark: "Sombre",
  navMyPlan: "Mon Plan",
  navPlanEmpty: "Aucune wilaya ajoutée",
  navPlanDescription: "wilaya(s) dans votre plan",
  navViewFullPlan: "Voir le plan complet",

  profileTitle: "Informations Personnelles",
  profileSubtitle: "Voyageur",
  profileGoldTraveler: "Voyageur Or",
  profileFullName: "Nom Complet",
  profileEmail: "Email",
  profilePhone: "Téléphone",
  profileLocation: "Localisation",
  profilePersonalInfo: "Informations Personnelles",
  profileMyBookings: "Mes Réservations",
  profileBookingsDescription: "Consulter et gérer vos réservations",
  profileViewAllBookings: "Voir toutes les réservations",
  profileBookingsTypes: "Hôtels, activités, voitures et restaurants",
  profileSettings: "Paramètres",
  profileAccountSettings: "Paramètres du Compte",
  profileAccountDesc: "Gérer vos informations personnelles",
  profileNotifications: "Notifications",
  profileNotificationsDesc: "Configurer les préférences d'alertes",
  profileLanguage: "Langue",
  profileLanguageDesc: "Arabe, Français, Anglais",
  profileTerms: "Conditions Générales",
  profileTermsDesc: "Consulter nos conditions et politiques",
  profileShareMoments: "Partager des Moments de Voyage",
  profileSignOut: "Déconnexion",
  profileCancel: "Annuler",
  profileSaveChanges: "Enregistrer",
  profileSaving: "Enregistrement...",
  profileUpdateInfo: "Mettez à jour vos informations personnelles. Les modifications seront enregistrées.",
  profileUpdateDesc: "Mettez à jour vos informations personnelles.",

  langTitle: "Langue",
  langDescription: "Choisissez votre langue préférée pour l'interface.",

  notifTitle: "Notifications",
  notifDescription: "Personnalisez vos préférences de notification et d'affichage.",
  notifPlanColor: "Couleur du bouton Mon Plan",
  notifShowButton: "Afficher le bouton Plan",
  notifShowButtonDesc: "Afficher ou masquer le bouton flottant du plan",

  termsTitle: "Conditions Générales",

  homeDiscover: "Découvrez l'Algérie",
  homeWithAI: "avec l'IA",
  homeSubtitle: "Votre guide IA personnel qui planifie le voyage algérien parfait. Hôtels, restaurants, activités — tout est adapté à vous.",
  homeSearchPlaceholder: "Où voulez-vous aller?",
  homePlanMyTrip: "Planifier mon voyage",
  homeWilayas: "69 wilayas couvertes",
  homeLanguages: "3 langues",
  homeRating: "Note moyenne de 4.9",
  homePopularNow: "Populaire en ce moment",
  homeTopDestinations: "Top Destinations",
  homeExploreDestinations: "Explorez les lieux les plus visités d'Algérie",
  homeExploreAll: "Explorer toutes les destinations",
  homeServicesTitle: "Planifiez chaque partie de votre voyage",
  homeServicesSubtitle: "Des vols aux camps du désert, réservez tout via Texa",
  homeHotelsTitle: "Hôtels",
  homeHotelsDesc: "Séjours sélectionnés, des riads boutique aux resorts 5 étoiles.",
  homeCarTitle: "Location de Voiture",
  homeCarDesc: "Conduisez à travers le pays avec des retraits flexibles.",
  homeDiningTitle: "Restaurants",
  homeDiningDesc: "Couscous, tajines et les meilleurs restaurants en bord de mer.",
  homeActivitiesTitle: "Activités",
  homeActivitiesDesc: "Randonnées dans le Sahara, camps de désert et visites culturelles.",
  homeTransportTitle: "Transport",
  homeTransportDesc: "Vols intérieurs, trains et bus interurbains.",
  homeBrowse: "Explorer",
  homeHowItWorks: "Comment ça marche",
  homeHowSubtitle: "Trois étapes simples pour votre voyage parfait",
  homeStep1Title: "Discutez avec l'IA",
  homeStep1Desc: "Dites à notre agent IA où vous voulez aller, votre budget et vos préférences.",
  homeStep2Title: "Recevez des recommandations",
  homeStep2Desc: "Recevez des itinéraires, hôtels et activités personnalisés pour vous.",
  homeStep3Title: "Réservez et partez",
  homeStep3Desc: "Confirmez vos réservations et embarquez pour votre aventure algérienne.",
  homeTestimonials: "Ce que disent les voyageurs",
  homeTestimonialsSubtitle: "Apprécié par les voyageurs",
  homeCTA: "Prêt à explorer l'Algérie?",
  homeCTASubtitle: "Laissez notre IA planifier votre voyage parfait. C'est gratuit, rapide et personnalisé.",
  homeGetStarted: "Commencer gratuitement",
  homeFooterDesc: "Le planificateur de voyage IA pour l'Algérie. Hôtels, itinéraires et expériences — tout en un seul endroit.",
  homeDestinations: "Destinations",
  homeServices: "Services",
  homeCompany: "Entreprise",
  homePrivacy: "Confidentialité",
  homeTerms: "Conditions",
  homeContact: "Contact",
  homeCopyright: "© 2026 Texa. Tous droits réservés.",
  homeContactTitle: "Contactez-nous",
  homeContactText: "Une question ou un commentaire? Contactez-nous à",

  servicesTitle: "Services Touristiques",
  servicesSubtitle: "Tout ce dont vous avez besoin pour un voyage inoubliable en Algérie",
  servicesRestaurantsName: "Restaurants",
  servicesRestaurantsDesc: "Découvrez la cuisine algérienne authentique et les saveurs internationales",
  servicesRestaurantsCount: "20+ restaurants",
  servicesHotelsName: "Hôtels & Séjours",
  servicesHotelsDesc: "Trouvez l'hébergement parfait pour votre aventure algérienne",
  servicesHotelsCount: "15+ hôtels",
  servicesCarsName: "Location de Voiture",
  servicesCarsDesc: "Louez un véhicule pour explorer l'Algérie à votre rythme",
  servicesCarsCount: "20+ véhicules",
  servicesTransportName: "Transport",
  servicesTransportDesc: "Trains, bus, vols et ferries à travers l'Algérie",
  servicesTransportCount: "Plusieurs itinéraires",
  servicesActivitiesName: "Activités & Excursions",
  servicesActivitiesDesc: "Aventures de la montagne au désert, de la culture à la nature",
  servicesActivitiesCount: "20+ activités",
  servicesExplore: "Explorer →",
  servicesNeedHelp: "Besoin d'aide pour planifier?",
  servicesHelpDesc: "Notre assistant IA peut vous aider à planifier tout votre voyage, de la réservation d'hôtels à la recherche des meilleurs restaurants et activités.",
  servicesAskAI: "Demander à l'assistant IA",

  bookingsTitle: "Mes Réservations",
  bookingsSubtitle: "Consulter et gérer vos réservations",
  bookingsEmpty: "Aucune réservation trouvée.",
  bookingsSearch: "Rechercher des réservations...",
  bookingsUpcoming: "À venir",
  bookingsCompleted: "Terminées",
  bookingsCancelled: "Annulées",
  bookingsAll: "Toutes",
  bookingsDelete: "Supprimer",

  commonDiscover: "Découvrir",
  commonAddToPlan: "Ajouter au plan",
  commonAdded: "Ajouté",
  commonPerNight: "/nuit",
  commonPerPerson: "/personne",
  commonPerDay: "/jour",
  commonFrom: "À partir de",
  commonDetails: "Détails",
  commonBookNow: "Réserver",
  commonSearch: "Rechercher",
  commonFilter: "Filtrer",
  commonSortBy: "Trier par",
  commonRating: "Mieux noté",
  commonReviews: "Plus commenté",
  commonTopRated: "Mieux noté",
  commonMostReviewed: "Plus commenté",
  commonPriceLow: "Prix: croissant",
  commonPriceHigh: "Prix: décroissant",
  commonAll: "Tous",
  commonAllCities: "Toutes les villes",
  commonReadMore: "En savoir plus",
  commonBack: "Retour",
  commonViewDetails: "Voir les détails",
  commonDZD: "DA",

  destHeroTitle1: "Découvrez toutes les",
  destHeroTitle2: "Wilayas d'Algérie",
  destHeroTitle3: "avec votre Guide Local",
  destHeroSubtitle: "Explorez les 69 wilayas, leurs trésors culturels, touristiques et naturels. Laissez nos experts locaux vous guider vers un séjour inoubliable.",
  destSearchPlaceholder: "Demandez à votre guide local — découvrez l'Algérie...",
  destStatWilayas: "69 Wilayas",
  destStatWilayasLabel: "à explorer",
  destStatAI: "Conseiller Local",
  destStatAILabel: "pour vous guider",
  destStatInfo: "Infos Complètes",
  destStatInfoLabel: "à jour & fiables",
  destLoadingMap: "Chargement de la carte interactive…",
  destMapUnavailable: "Carte Indisponible",
  destMapUnavailableDesc: "La carte interactive nécessite une connexion Internet pour charger les données GeoJSON des wilayas.",
  destAbout: "À propos",
  destRegion: "Région",
  destType: "Type",
  destHotels: "Hôtels",
  destActivities: "Activités",
  destCarRentals: "Location de Voitures",
  destDining: "Restaurants",
  destNoServices: "Aucun service répertorié pour cette wilaya",
  destInPlan: "Dans le plan",
  destAddToPlan: "Ajouter au plan",
  destViewDetails: "Voir les détails",
  destChooseDestination: "Choisissez votre destination",
  destChooseSubtitle: "Sélectionnez une wilaya ci-dessous ou appuyez directement sur la carte pour explorer les hôtels, activités, restaurants et plus.",
  destDiscoverAlgeria: "Découvrez l'Algérie",
  destTabAll: "Toutes",
  destTabNorth: "Nord",
  destTabHighlands: "Hauts Plateaux",
  destTabSouth: "Sud",
  destTabCoastal: "Littoral",
  destExploreByRegion: "Explorer par Région",
  destViewAll: "Tout voir",
  destWilayas: "Wilayas",
  destBackToMap: "Retour à la Carte",
  destWilayasCount: "wilayas à découvrir",
  regionAll: "Toutes les Wilayas",
  regionNorth: "Nord",
  regionHighlands: "Hauts Plateaux",
  regionSahara: "Sud",
  regionLittoral: "Littoral",
  destDisclaimer: "L'IA peut produire des informations inexactes. Vérifiez toujours les détails importants.",
  destChatPlaceholderMap: "Sélectionnez une wilaya sur la carte pour commencer à discuter...",
  destChatPlaceholderAsk: "Demandez à l'IA à propos de",
  destExplorerAgent: "Agent Explorateur",
  destAskAbout: "Demander à propos de",
  destSelectToExplore: "Sélectionnez une wilaya à explorer",
  destExploreWilaya: "Explorer",
  destSelectWilaya: "Sélectionnez une Wilaya",
  destChatDescExplore: "Demandez-moi tout sur les hôtels, activités ou choses à faire à",
  destChatDescSelect: "Cliquez sur une wilaya sur la carte pour la sélectionner, puis je peux vous aider à découvrir les hôtels, activités et plus.",
  destSuggestion1: "Quels sont les meilleurs hôtels ici?",
  destSuggestion2: "Quelles activités puis-je faire?",
  destSuggestion3: "Planifiez une excursion pour moi",
  destReadAloud: "Lire à voix haute",
  destBack: "Retour",
  destPerNight: "/nuit",
  destDay: "/jour",
  destSeats: "places",
  destDA: "DA",

  mapSearchCity: "Rechercher une ville...",
  mapLayout: "DISPOSITION",
  mapHorizontal: "Horizontal",
  mapVertical: "Vertical",
  mapLayers: "COUCHES DE CARTE",
  mapLayerUnesco: "Sites UNESCO",
  mapLayerHistorical: "Historique",
  mapLayerParks: "Parcs Nationaux",
  mapLayerBeaches: "Plages",
  mapLayerSki: "Stations de Ski",
  mapLayerAirports: "Aéroports",
  mapLayerTrains: "Gares ferroviaires",
  mapCircuits: "CIRCUITS SUGGÉRÉS",
  mapPlanYourStay: "PLANIFIER VOTRE SÉJOUR",
  mapLinkedTo: "LIÉ À",
  mapHotelDetails: "DÉTAILS HÔTEL",
  mapVehicleDetails: "DÉTAILS VÉHICULE",
  mapRestaurantDetails: "DÉTAILS RESTAURANT",
  mapActivityDetails: "DÉTAILS ACTIVITÉ",
  mapRemoveFromPlan: "Retirer du plan",
  mapNoDetails: "Aucun détail disponible",
  mapAutoSaving: "Enregistrement auto...",
  mapLoadingPlan: "Chargement de votre plan de voyage...",
  mapNoItems: "Aucun élément",
  mapTripPreferences: "PRÉFÉRENCES DE VOYAGE",
  mapBudget: "Budget",
  mapLuxury: "Luxe",
  mapDaysToStay: "Jours de séjour",
  mapPlannerAgent: "Agent Planificateur",
  mapItemsInPlan: "élément(s) dans le plan",
  mapPlanTrip: "Planifiez votre voyage",
  mapPlanTripDesc: "Demandez-moi de générer un itinéraire complet basé sur vos éléments de plan et préférences.",
  mapSuggestionItinerary: "Générer un itinéraire de 5 jours",
  mapSuggestionRoute: "Optimiser mon itinéraire entre les wilayas",
  mapSuggestionHotels: "Suggérer des hôtels économiques",
  mapAskAI: "Demandez à l'IA de planifier votre voyage...",
  mapConstructingPlan: "Construction de votre plan",
  mapMappingRoutes: "Cartographie des itinéraires et arrangement des destinations...",
  mapOverview: "Aperçu",
  mapLegend: "Légende de la carte",
  mapLegendCapital: "Capitale",
  mapLegendCities: "Villes",
  mapLegendSahara: "Sahara/Oasis",
  mapLegendParks: "Parcs/Montagnes",
  mapLegendBeaches: "Plages/Côte",
  mapCategory: "Catégorie",
  mapPrice: "Prix",
  mapAmenities: "Équipements",
  mapRating: "Note",
  mapIncluded: "Inclus",
  mapSeats: "Places",
  mapDuration: "Durée",
  mapDifficulty: "Difficulté",
  mapCuisine: "Cuisine",
  mapPriceRange: "Fourchette de prix",
  mapSpecialties: "Spécialités",
  mapWilayas: "Wilayas",
  mapHotels: "Hôtels",
  mapActivities: "Activités",
  mapDining: "Restaurants",
  mapTransport: "Transport",
  mapConnectedStay: "séjour",
  mapConnectedJourney: "voyage",
  mapConnectedExperience: "expérience",

  chatGreeting: "Bonjour ! Je suis votre assistant de voyage IA pour l'Algérie. Je peux vous aider à planifier des voyages, trouver des hôtels, découvrir des restaurants et créer des itinéraires personnalisés.\n\nOù souhaitez-vous explorer ?",
  chatSubtitle: "Assistant de Voyage IA",
  chatAssistant: "Assistant de Voyage IA",
  chatHello: "Bonjour",
  chatExplorePrompt: "Où souhaitez-vous explorer aujourd'hui ? Je peux planifier votre itinéraire, recommander des hôtels, restaurants et activités à travers l'Algérie.",
  chatPopular: "Populaire",
  chatInputPlaceholder: "Posez une question sur l'Algérie...",
  chatNewConversation: "Nouvelle conversation",
  chatConversations: "CONVERSATIONS",
  chatTripPlanner: "Système de Recommandation",
  chatToday: "Aujourd'hui",
  chatError: "Désolé, j'ai rencontré une erreur. Veuillez réessayer.",
  chatAlgiersItinerary: "Itinéraire Alger",
  chatAlgiersItineraryDesc: "Guide de 3 jours",
  chatAlgiersItineraryPrompt: "Planifiez-moi un itinéraire de 3 jours à Alger",
  chatHotelsOran: "Hôtels à Oran",
  chatHotelsOranDesc: "Meilleurs séjours pour tous les budgets",
  chatHotelsOranPrompt: "Trouvez-moi un bon hôtel à Oran",
  chatConstantineDining: "Restaurants à Constantine",
  chatConstantineDiningDesc: "Restaurants les mieux notés",
  chatConstantineDiningPrompt: "Quels sont les meilleurs restaurants à Constantine ?",
  chatTlemcenActivities: "Activités à Tlemcen",
  chatTlemcenActivitiesDesc: "Choses à voir et à faire",
  chatTlemcenActivitiesPrompt: "Que puis-je faire à Tlemcen ?",

  svcAmenities: "Équipements",
  svcFilters: "Filtres",
  svcReset: "Réinitialiser",
  svcClear: "Effacer",
  svcShow: "Afficher",
  svcFeatured: "En vedette",
  svcViewDetails: "Voir les détails",
  svcSave: "Enregistrer",
  svcSaved: "Enregistré",
  svcAdd: "Ajouter",
  svcInPlan: "Dans le plan",
  svcResults: "résultats",
  svcResult: "résultat",
  svcNoMatch: "Aucun résultat ne correspond à vos filtres",
  svcNoMatchDesc: "Essayez d'ajuster vos critères ou d'effacer tous les filtres.",
  svcClearAll: "Effacer tous les filtres",
  svcAll: "Tous",
  svcAllCities: "Toutes les villes",
  svcStars: "Étoiles",
  svcMaxPrice: "Prix max",
  svcUpTo: "Jusqu'à",
  svcPerNight: "DA / nuit",
  svcPerDay: "DA / jour",
  svcPerPerson: "DA / personne",
  svcCities: "villes",

  hotelHeroSubtitle: "Hébergements · Algérie",
  hotelHeroTitle: "Hôtels & Séjours",
  hotelHeroDesc: "Resorts côtiers, retraites en montagne et lodges du désert — séjours sélectionnés dans chaque coin de l'Algérie, de la Méditerranée au Sahara.",
  hotelCount: "hôtels",
  hotelDestination: "Destination",
  hotelSearchDest: "Rechercher une destination",
  hotelCheckin: "Arrivée",
  hotelCheckout: "Départ",
  hotelGuests: "Voyageurs",
  hotelAddGuests: "Ajouter des voyageurs",
  hotelGuestsSuffix: "voyageur(s)",
  hotelAmenities: "Équipements",
  hotelNight: "nuit",
  hotelNoMatch: "Aucun hôtel ne correspond à vos filtres",

  carHeroSubtitle: "Location de voiture · Algérie",
  carHeroTitle: "Trouvez votre véhicule",
  carHeroDesc: "Des citadines compactes aux 4x4 prêts pour le désert — choisissez le véhicule parfait pour votre aventure algérienne.",
  carCount: "véhicules",
  carPickupLocation: "Lieu de retrait",
  carSearchLocation: "Rechercher un lieu",
  carPickupDate: "Date de retrait",
  carReturnDate: "Date de retour",
  carDays: "Jours",
  carSelectDays: "Sélectionner les jours",
  carDaysSuffix: "jour(s)",
  carTransmission: "Transmission",
  carManuelle: "Manuelle",
  carAutomatique: "Automatique",
  carVehicleType: "Type de véhicule",
  carSaharaWarning: "Véhicule Sahara recommandé",
  carSaharaDesc: "Pour le terrain désertique, un véhicule 4x4 est fortement recommandé pour la sécurité et l'accessibilité.",
  carRecommended: "Recommandé",
  carBookNow: "Réserver",
  carDay: "jour",
  carNoMatch: "Aucun véhicule ne correspond à vos filtres",

  restHeroSubtitle: "Restaurants · Algérie",
  restHeroTitle: "Goûtez l'Algérie",
  restHeroDesc: "Des maisons de couscous historiques aux grillades en bord de mer — découvrez les saveurs de l'Algérie, un plat à la fois.",
  restCount: "restaurants",
  restCity: "Ville",
  restSearchCity: "Rechercher une ville",
  restCuisine: "Cuisine",
  restAllCuisines: "Toutes les cuisines",
  restAmbiance: "Ambiance",
  restTerrace: "Terrasse",
  restIndoor: "Intérieur",
  restReviews: "avis",
  restReserve: "Réserver",
  restNoMatch: "Aucun restaurant ne correspond à vos filtres",

  actHeroSubtitle: "Activités · Algérie",
  actHeroTitle: "Explorez au-delà",
  actHeroDesc: "Des dunes sahariennes aux sommets montagneux et rivages méditerranéens — aventures organisées à travers l'Algérie.",
  actCount: "activités",
  actGuided: "Visites guidées",
  actHiking: "Randonnée",
  actWater: "Sports nautiques",
  actCultural: "Culturel",
  actDesert: "Désert",
  actGroup: "Groupe :",
  actNoMatch: "Aucune activité ne correspond à vos filtres",
  actNoMatchDesc: "Essayez une autre destination ou effacez vos filtres.",

  transTitle: "Transport",
  transSubtitle: "Trains, bus, vols et ferries à travers l'Algérie",
  transFrom: "De",
  transWhereFrom: "D'où ?",
  transTo: "À",
  transWhereTo: "Où ?",
  transDate: "Date",
  transAddDate: "Ajouter une date",
  transTrains: "Trains",
  transBuses: "Bus",
  transFlights: "Vols",
  transFerries: "Ferries",
  transRoutes: "itinéraires",
  transOperator: "Opérateur",
  transBook: "Réserver",
  transSoldOut: "Complet",
  transNoRoutes: "Aucun itinéraire trouvé",
  transNoRoutesDesc: "Essayez d'autres villes ou type de transport",

  detailNotFound: "introuvable",
  detailNotFoundDesc: "L'élément que vous recherchez n'existe pas.",
  detailBackTo: "Retour aux",
  detailReviews: "avis",
  detailAbout: "À propos de",
  detailHighlights: "Points forts",
  detailInPlan: "Dans le plan",
  detailAddToPlan: "Ajouter au plan",
  detailBookNow: "Réserver",
  detailContactToBook: "Contacter pour réserver",
  detailContactToReserve: "Contacter pour réserver",
  detailCallReservation: "Appelez pour faire une réservation",
  detailBookingSummary: "Résumé de la réservation",
  detailAdding: "Ajout...",
  detailAddMyBooking: "Ajouter à ma réservation",
  detailSimilar: "Similaires",
  detailMoreIn: "Plus à",
  detailTaxes: "Taxes",
  detailIncluded: "Inclus",
  detailTotal: "Total",
  detailIndividualPrice: "Prix individuel",
  detailGroupPrice: "Prix groupe",
  detailBestValue: "Meilleur rapport",
  detailSave: "Économisez",

  detailBackHotels: "Retour aux hôtels",
  detailAboutHotel: "À propos de cet hôtel",
  detailCheckin: "ARRIVÉE",
  detailCheckout: "DÉPART",
  detailGuests: "VOYAGEURS",
  detailNights: "NUITS",
  detailMoreStaysIn: "Plus d'hébergements à",
  detailHotelLabel: "Hôtel :",
  detailGuestsLabel: "Voyageurs :",
  detailNightsLabel: "Nuits :",

  detailBackCars: "Retour aux voitures",
  detailAboutVehicle: "À propos de ce véhicule",
  detailSpecifications: "Spécifications",
  detailTransmission: "Transmission",
  detailFuel: "Carburant",
  detailSeats: "Places",
  detailIncludedOptions: "Inclus & Options",
  detailKmIncluded: "inclus",
  detailType: "TYPE",
  detailAgency: "AGENCE",
  detailPricePerDay: "Prix par jour",
  detailSimilarVehicles: "Véhicules similaires",
  detailVehicleLabel: "Véhicule :",
  detailAgencyLabel: "Agence :",
  detailDaysLabel: "Jours :",
  detailRecommended: "Recommandé",

  detailBackRestaurants: "Retour aux restaurants",
  detailAboutRestaurant: "À propos de ce restaurant",
  detailSpecialties: "Spécialités",
  detailCuisine: "Cuisine",
  detailPriceRange: "Gamme de prix",
  detailTerrace: "Terrasse",
  detailHalal: "Halal",
  detailAvailable: "Disponible",
  detailNotAvailable: "Non disponible",
  detailYes: "Oui",
  detailNo: "Non",
  detailReserve: "Réserver",
  detailRestaurantLabel: "Restaurant :",

  detailBackActivities: "Retour aux activités",
  detailAboutActivity: "À propos de cette activité",
  detailDuration: "Durée",
  detailGroupPriceLabel: "Prix groupe",
  detailDifficulty: "Difficulté",
  detailDurationLabel: "DURÉE",
  detailGuidedExperience: "expérience guidée",
  detailDifficultyLevel: "niveau de difficulté",
  detailGroupDiscount: "Remise groupe :",
  detailExpertGuides: "Guides locaux experts",
  detailSimilarActivities: "Activités similaires",
  detailActivityLabel: "Activité :",
  detailParticipantsLabel: "Participants :",
  detailParticipants: "Participants",

  detailBackDestinations: "Retour aux destinations",
  detailBestTime: "Meilleure période",
  detailIdealDuration: "Durée idéale",
  detailGettingThere: "Accès",
  detailYearRound: "Toute l'année",
  detailDays1to3: "1–3 jours",
  detailByRoad: "Par route",
  detailCarRentals: "Location de voitures",
  detailAvailableCount: "disponibles",
  detailExploreWithAI: "Explorez avec l'IA",
  detailAIRecommendations: "Demandez des recommandations personnalisées à notre assistant IA",
  detailAddToPlanLower: "Ajouter au plan",
  detailDetailsWithAI: "Détails avec l'IA",
};

const ar: TranslationKeys = {
  navHome: "الرئيسية",
  navMap: "الخريطة",
  navChat: "المحادثة",
  navHotels: "الفنادق",
  navCars: "السيارات",
  navDining: "المطاعم",
  navActivities: "الأنشطة",
  navTransport: "النقل",
  navProfile: "الملف الشخصي",
  navLight: "فاتح",
  navDark: "داكن",
  navMyPlan: "خطتي",
  navPlanEmpty: "لم تتم إضافة ولاية بعد",
  navPlanDescription: "ولاية (ولايات) في خطتك",
  navViewFullPlan: "عرض الخطة الكاملة",

  profileTitle: "المعلومات الشخصية",
  profileSubtitle: "مسافر",
  profileGoldTraveler: "مسافر ذهبي",
  profileFullName: "الاسم الكامل",
  profileEmail: "البريد الإلكتروني",
  profilePhone: "الهاتف",
  profileLocation: "الموقع",
  profilePersonalInfo: "المعلومات الشخصية",
  profileMyBookings: "حجوزاتي",
  profileBookingsDescription: "عرض وإدارة حجوزاتك",
  profileViewAllBookings: "عرض جميع الحجوزات",
  profileBookingsTypes: "الفنادق، الأنشطة، السيارات والمطاعم",
  profileSettings: "الإعدادات",
  profileAccountSettings: "إعدادات الحساب",
  profileAccountDesc: "إدارة معلوماتك الشخصية",
  profileNotifications: "الإشعارات",
  profileNotificationsDesc: "تكوين تفضيلات التنبيه",
  profileLanguage: "اللغة",
  profileLanguageDesc: "العربية، الفرنسية، الإنجليزية",
  profileTerms: "الشروط والأحكام",
  profileTermsDesc: "مراجعة شروطنا وسياساتنا",
  profileShareMoments: "مشاركة لحظات السفر",
  profileSignOut: "تسجيل الخروج",
  profileCancel: "إلغاء",
  profileSaveChanges: "حفظ التغييرات",
  profileSaving: "جارٍ الحفظ...",
  profileUpdateInfo: "تحديث معلوماتك الشخصية. سيتم حفظ التغييرات في ملفك الشخصي.",
  profileUpdateDesc: "تحديث معلوماتك الشخصية.",

  langTitle: "اللغة",
  langDescription: "اختر لغتك المفضلة للواجهة.",

  notifTitle: "الإشعارات",
  notifDescription: "تخصيص تفضيلات الإشعارات والعرض.",
  notifPlanColor: "لون زر خطتي",
  notifShowButton: "إظهار زر الخطة",
  notifShowButtonDesc: "إظهار أو إخفاء زر الخطة العائم",

  termsTitle: "الشروط والأحكام",

  homeDiscover: "اكتشف الجزائر",
  homeWithAI: "بالذكاء الاصطناعي",
  homeSubtitle: "دليلك الشخصي بالذكاء الاصطناعي الذي يخطط الرحلة الجزائرية المثالية. الفنادق، المطاعم، الأنشطة — كلها مخصصة لك.",
  homeSearchPlaceholder: "إين تريد أن تذهب؟",
  homePlanMyTrip: "خطط رحلتي",
  homeWilayas: "ولاية مغطاة",
  homeLanguages: "3 لغات",
  homeRating: "متوسط التقييم 4.9",
  homePopularNow: "الأكثر شعبية الآن",
  homeTopDestinations: "أفضل الوجهات",
  homeExploreDestinations: "استكشف الأماكن الأكثر زيارة في الجزائر",
  homeExploreAll: "استكشاف جميع الوجهات",
  homeServicesTitle: "خطط لكل جزء من رحلتك",
  homeServicesSubtitle: "من الرحلات الجوية إلى معسكرات الصحراء، احجز كل شيء عبر تكSA",
  homeHotelsTitle: "الفنادق",
  homeHotelsDesc: "إقامات مختارة بعناية، من الرياضات البتيكية إلى منتجعات 5 نجوم.",
  homeCarTitle: "تأجير السيارات",
  homeCarDesc: "القيادة عبر البلاد مع استلام مرن.",
  homeDiningTitle: "المطاعم",
  homeDiningDesc: "الكسكسي، الطاجين وأفضل مطاعم الشاطئ.",
  homeActivitiesTitle: "الأنشطة",
  homeActivitiesDesc: "رحلات في الصحراء، معسكرات صحراوية وجولات ثقافية.",
  homeTransportTitle: "النقل",
  homeTransportDesc: "رحلات داخلية، قطارات وحافلات بين المدن.",
  homeBrowse: "استكشاف",
  homeHowItWorks: "كيف يعمل",
  homeHowSubtitle: "ثلاث خطوات بسيطة لرحلتك المثالية",
  homeStep1Title: "تحدث مع الذكاء الاصطناعي",
  homeStep1Desc: "أخبر وكيل الذكاء الاصطناعي لدينا إلى أين تريد الذهاب وميزانيتك وتفضيلاتك.",
  homeStep2Title: "احصل على توصيات",
  homeStep2Desc: "استلم خطط سفر وأنشطة مخصصة لك.",
  homeStep3Title: "احجز وانطلق",
  homeStep3Desc: "أكد حجوزاتك وانطلق في مغامرتك الجزائرية.",
  homeTestimonials: "ماذا يقول المسافرون",
  homeTestimonialsSubtitle: "محبوب من المسافرين",
  homeCTA: "هل أنت مستعد لاكتشاف الجزائر؟",
  homeCTASubtitle: "دع ذكاءنا الاصطناعي يخطط رحلتك المثالية. مجاني، سريع ومخصص.",
  homeGetStarted: "ابدأ مجاناً",
  homeFooterDesc: "مخطط رحلات بالذكاء الاصطناعي للجزائر. الفنادق، الطرق والتجارب — كلها في مكان واحد.",
  homeDestinations: "الوجهات",
  homeServices: "الخدمات",
  homeCompany: "الشركة",
  homePrivacy: "الخصوصية",
  homeTerms: "الشروط",
  homeContact: "اتصل بنا",
  homeCopyright: "© 2026 تكSA. جميع الحقوق محفوظة.",
  homeContactTitle: "اتصل بنا",
  homeContactText: "لديك سؤال أو ملاحظة؟ تواصل معنا على",

  servicesTitle: "الخدمات السياحية",
  servicesSubtitle: "كل ما تحتاجه لرحلة لا تُنسى عبر الجزائر",
  servicesRestaurantsName: "المطاعم",
  servicesRestaurantsDesc: "اكتشف المطبخ الجزائري الأصيل والنكهات العالمية",
  servicesRestaurantsCount: "20+ مطعم",
  servicesHotelsName: "الفنادق والإقامات",
  servicesHotelsDesc: "اعثر على الإقامة المثالية لمغامرتك الجزائرية",
  servicesHotelsCount: "15+ فندق",
  servicesCarsName: "تأجير السيارات",
  servicesCarsDesc: "استأجر مركبة لاستكشاف الجزائر بإيقاعك",
  servicesCarsCount: "20+ مركبة",
  servicesTransportName: "النقل",
  servicesTransportDesc: "قطارات، حافلات، رحلات جوية وعبارات عبر الجزائر",
  servicesTransportCount: "مسارات متعددة",
  servicesActivitiesName: "الأنشطة والرحلات",
  servicesActivitiesDesc: "مغامرات من الجبال إلى الصحراء، من الثقافة إلى الطبيعة",
  servicesActivitiesCount: "20+ نشاط",
  servicesExplore: "استكشاف →",
  servicesNeedHelp: "تحتاج مساعدة في التخطيط؟",
  servicesHelpDesc: "مساعدنا الذكي يمكنه مساعدتك في تخطيط رحلتك بالكامل، من حجز الفنادق إلى العثور على أفضل المطاعم والأنشطة.",
  servicesAskAI: "اسأل مساعد الذكاء الاصطناعي",

  bookingsTitle: "حجوزاتي",
  bookingsSubtitle: "عرض وإدارة حجوزاتك",
  bookingsEmpty: "لم يتم العثور على حجوزات.",
  bookingsSearch: "البحث في الحجوزات...",
  bookingsUpcoming: "القادمة",
  bookingsCompleted: "المكتملة",
  bookingsCancelled: "ملغاة",
  bookingsAll: "الكل",
  bookingsDelete: "حذف",

  commonDiscover: "استكشاف",
  commonAddToPlan: "إضافة للخطة",
  commonAdded: "تمت الإضافة",
  commonPerNight: "/ليلة",
  commonPerPerson: "/شخص",
  commonPerDay: "/يوم",
  commonFrom: "يبدأ من",
  commonDetails: "التفاصيل",
  commonBookNow: "احجز الآن",
  commonSearch: "بحث",
  commonFilter: "تصفية",
  commonSortBy: "ترتيب حسب",
  commonRating: "الأعلى تقييماً",
  commonReviews: "الأكثر تقييمات",
  commonTopRated: "الأعلى تقييماً",
  commonMostReviewed: "الأكثر تقييمات",
  commonPriceLow: "السعر: من الأقل",
  commonPriceHigh: "السعر: من الأعلى",
  commonAll: "الكل",
  commonAllCities: "جميع المدن",
  commonReadMore: "اقرأ المزيد",
  commonBack: "رجوع",
  commonViewDetails: "عرض التفاصيل",
  commonDZD: "دج",

  destHeroTitle1: "اكتشف جميع",
  destHeroTitle2: "ولايات الجزائر",
  destHeroTitle3: "مع مرشدك المحلي",
  destHeroSubtitle: "استكشف الـ 58 ولاية، كنوزها الثقافية والسياحية والطبيعية. دع خبراءنا المحليين يرشدونك نحو تجربة لا تُنسى.",
  destSearchPlaceholder: "اسأل مرشدك المحلي — اكتشف الجزائر...",
  destStatWilayas: "69 ولاية",
  destStatWilayasLabel: "لاستكشافها",
  destStatAI: "مرشد محلي",
  destStatAILabel: "لإرشادك",
  destStatInfo: "معلومات كاملة",
  destStatInfoLabel: "محدثة وموثوقة",
  destLoadingMap: "جارٍ تحميل الخريطة التفاعلية…",
  destMapUnavailable: "الخريطة غير متاحة",
  destMapUnavailableDesc: "تتطلب الخريطة التفاعلية اتصال بالإنترنت لتحميل بيانات GeoJSON للولايات.",
  destAbout: "حول",
  destRegion: "المنطقة",
  destType: "النوع",
  destHotels: "الفنادق",
  destActivities: "الأنشطة",
  destCarRentals: "تأجير السيارات",
  destDining: "المطاعم",
  destNoServices: "لم يتم بعد إدراج خدمات لهذه الولاية",
  destInPlan: "في الخطة",
  destAddToPlan: "إضافة للخطة",
  destViewDetails: "عرض التفاصيل",
  destChooseDestination: "اختر وجهتك",
  destChooseSubtitle: "حدد ولاية أدناه أو اضغط مباشرة على الخريطة لاستكشاف الفنادق والأنشطة والمطاعم والمزيد.",
  destDiscoverAlgeria: "اكتشف الجزائر",
  destTabAll: "الكل",
  destTabNorth: "الشمال",
  destTabHighlands: "الهضاب العليا",
  destTabSouth: "الجنوب",
  destTabCoastal: "الساحل",
  destExploreByRegion: "استكشف حسب المنطقة",
  destViewAll: "عرض الكل",
  destWilayas: "ولاية",
  destBackToMap: "العودة إلى الخريطة",
  destWilayasCount: "ولايات لاكتشافها",
  regionAll: "جميع الولايات",
  regionNorth: "الشمال",
  regionHighlands: "الهضاب العليا",
  regionSahara: "الجنوب",
  regionLittoral: "الساحل",
  destDisclaimer: "قد يقدم الذكاء الاصطناعي معلومات غير دقيقة. تحقق دائماً من التفاصيل المهمة.",
  destChatPlaceholderMap: "حدد ولاية على الخريطة لبدء المحادثة...",
  destChatPlaceholderAsk: "اسأل الذكاء الاصطناعي عن",
  destExplorerAgent: "وكيل الاستكشاف",
  destAskAbout: "اسأل عن",
  destSelectToExplore: "حدد ولاية لاستكشافها",
  destExploreWilaya: "استكشف",
  destSelectWilaya: "حدد ولاية",
  destChatDescExplore: "اسألني عن أي شيء يتعلق بالفنادق أو الأنشطة أو الأشياء التي يمكن فعلها في",
  destChatDescSelect: "انقر على أي ولاية على الخريطة لتحديدها، ثم يمكنني مساعدتك في اكتشاف الفنادق والأنشطة والمزيد.",
  destSuggestion1: "ما أفضل الفنادق هنا؟",
  destSuggestion2: "ما الأنشطة التي يمكنني القيام بها؟",
  destSuggestion3: "خطط لي رحلة يومية",
  destReadAloud: "القراءة بصوت عالٍ",
  destBack: "رجوع",
  destPerNight: "/ليلة",
  destDay: "/يوم",
  destSeats: "مقاعد",
  destDA: "دج",

  mapSearchCity: "ابحث عن مدينة...",
  mapLayout: "التخطيط",
  mapHorizontal: "أفقي",
  mapVertical: "عمودي",
  mapLayers: "طبقات الخريطة",
  mapLayerUnesco: "مواقع اليونسكو",
  mapLayerHistorical: "تاريخية",
  mapLayerParks: "الحدائق الوطنية",
  mapLayerBeaches: "الشواطئ",
  mapLayerSki: "محطات التزلج",
  mapLayerAirports: "المطارات",
  mapLayerTrains: "محطات القطار",
  mapCircuits: "المسارات المقترحة",
  mapPlanYourStay: "خطط إقامتك",
  mapLinkedTo: "مرتبط بـ",
  mapHotelDetails: "تفاصيل الفندق",
  mapVehicleDetails: "تفاصيل المركبة",
  mapRestaurantDetails: "تفاصيل المطعم",
  mapActivityDetails: "تفاصيل النشاط",
  mapRemoveFromPlan: "إزالة من الخطة",
  mapNoDetails: "لا تتوفر تفاصيل",
  mapAutoSaving: "جارٍ الحفظ التلقائي...",
  mapLoadingPlan: "جارٍ تحميل خطة سفرك...",
  mapNoItems: "لا توجد عناصر",
  mapTripPreferences: "تفضيلات الرحلة",
  mapBudget: "الميزانية",
  mapLuxury: "الفخامة",
  mapDaysToStay: "أيام الإقامة",
  mapPlannerAgent: "وكيل التخطيط",
  mapItemsInPlan: "عنصر (عناصر) في الخطة",
  mapPlanTrip: "خطط رحلتك",
  mapPlanTripDesc: "اطلب مني إنشاء مسار سفر كامل بناءً على عناصر خطةك وتفضيلاتك.",
  mapSuggestionItinerary: "إنشاء مسار 5 أيام",
  mapSuggestionRoute: "تحسين مساري بين الولايات",
  mapSuggestionHotels: "اقتراح فنادق اقتصادية",
  mapAskAI: "اسأل الذكاء الاصطناعي لتخطيط رحلتك...",
  mapConstructingPlan: "جارٍ بناء خطتك",
  mapMappingRoutes: "رسم خرائط المسارات وترتيب الوجهات...",
  mapOverview: "نظرة عامة",
  mapLegend: "دليل الخريطة",
  mapLegendCapital: "العاصمة",
  mapLegendCities: "المدن",
  mapLegendSahara: "الصحراء/واحة",
  mapLegendParks: "الحدائق/جبال",
  mapLegendBeaches: "شواطئ/ساحل",
  mapCategory: "الفئة",
  mapPrice: "السعر",
  mapAmenities: "المرافق",
  mapRating: "التقييم",
  mapIncluded: "مشمول",
  mapSeats: "مقاعد",
  mapDuration: "المدة",
  mapDifficulty: "الصعوبة",
  mapCuisine: "المطبخ",
  mapPriceRange: "نطاق السعر",
  mapSpecialties: "الأطباق المميزة",
  mapWilayas: "ولايات",
  mapHotels: "فنادق",
  mapActivities: "أنشطة",
  mapDining: "مطاعم",
  mapTransport: "نقل",
  mapConnectedStay: "إقامة",
  mapConnectedJourney: "رحلة",
  mapConnectedExperience: "تجربة",

  chatGreeting: "مرحباً! أنا مساعد السفر بالذكاء الاصطناعي للجزائر. يمكنني مساعدتك في تخطيط الرحلات، والبحث عن الفنادق، واكتشاف المطاعم، وإنشاء خطط سفر مخصصة.\n\nأين تريد أن تستكشف؟",
  chatSubtitle: "مساعد السفر بالذكاء الاصطناعي",
  chatAssistant: "مساعد السفر بالذكاء الاصطناعي",
  chatHello: "مرحباً",
  chatExplorePrompt: "أين تريد أن تستكشف اليوم؟ يمكنني تخطيط مسارك، وال坫يح ب الفنادق والمطاعم والأنشطة في جميع أنحاء الجزائر.",
  chatPopular: "الأشهر",
  chatInputPlaceholder: "اسأل عن الجزائر...",
  chatNewConversation: "محادثة جديدة",
  chatConversations: "المحادثات",
  chatTripPlanner: "نظام التوصيات",
  chatToday: "اليوم",
  chatError: "عذراً، واجهة خطأ. يرجى المحاولة مرة أخرى.",
  chatAlgiersItinerary: "مسار الجزائر العاصمة",
  chatAlgiersItineraryDesc: "دليل مدينة 3 أيام",
  chatAlgiersItineraryPrompt: "خطط لي مسار 3 أيام في الجزائر العاصمة",
  chatHotelsOran: "فنادق في وهران",
  chatHotelsOranDesc: "أفضل الإقامات لكل الميزانيات",
  chatHotelsOranPrompt: "ابحث لي عن فندق جيد في وهران",
  chatConstantineDining: "مطاعم قسنطينة",
  chatConstantineDiningDesc: "مطاعم الأعلى تقييماً",
  chatConstantineDiningPrompt: "ما هي أفضل المطاعم في قسنطينة؟",
  chatTlemcenActivities: "أنشطة تلمسان",
  chatTlemcenActivitiesDesc: "أشياء يمكن رؤيتها وفعلها",
  chatTlemcenActivitiesPrompt: "ما الذي يمكنني فعله في تلمسان؟",

  svcAmenities: "المرافق",
  svcFilters: "التصفيات",
  svcReset: "إعادة تعيين",
  svcClear: "مسح",
  svcShow: "عرض",
  svcFeatured: "مميز",
  svcViewDetails: "عرض التفاصيل",
  svcSave: "حفظ",
  svcSaved: "تم الحفظ",
  svcAdd: "إضافة",
  svcInPlan: "في الخطة",
  svcResults: "نتائج",
  svcResult: "نتيجة",
  svcNoMatch: "لا توجد نتائج تطابق تصفياتك",
  svcNoMatchDesc: "حاول تعديل معاييرك أو مسح جميع التصفيات.",
  svcClearAll: "مسح جميع التصفيات",
  svcAll: "الكل",
  svcAllCities: "جميع المدن",
  svcStars: "النجوم",
  svcMaxPrice: "السعر الأقصى",
  svcUpTo: "حتى",
  svcPerNight: "دج / ليلة",
  svcPerDay: "دج / يوم",
  svcPerPerson: "دج / شخص",
  svcCities: "مدن",

  hotelHeroSubtitle: "الإقامات · الجزائر",
  hotelHeroTitle: "الفنادق والإقامات",
  hotelHeroDesc: "منتجعات ساحلية، وretreats جبلية، وlodges صحراوية — إقامات مختارة في كل ركن من أركان الجزائر، من المتوسط إلى الصحراء.",
  hotelCount: "فنادق",
  hotelDestination: "الوجهة",
  hotelSearchDest: "ابحث عن وجهة",
  hotelCheckin: "تسجيل الوصول",
  hotelCheckout: "تسجيل المغادرة",
  hotelGuests: "الضيوف",
  hotelAddGuests: "إضافة ضيوف",
  hotelGuestsSuffix: "ضيف (ضيوف)",
  hotelAmenities: "المرافق",
  hotelNight: "ليلة",
  hotelNoMatch: "لا توجد فنادق تطابق تصفياتك",

  carHeroSubtitle: "تأجير السيارات · الجزائر",
  carHeroTitle: "ابحث عن سيارتك",
  carHeroDesc: "من السيارات المدينة الصغيرة إلى السيارات 4x4 الجاهزة للصحراء — اختر المركبة المثالية لمغامرتك الجزائرية.",
  carCount: "مركبات",
  carPickupLocation: "مكان الاستلام",
  carSearchLocation: "ابحث عن مكان",
  carPickupDate: "تاريخ الاستلام",
  carReturnDate: "تاريخ الإرجاع",
  carDays: "الأيام",
  carSelectDays: "اختر الأيام",
  carDaysSuffix: "يوم (أيام)",
  carTransmission: "ناقل الحركة",
  carManuelle: "يدوي",
  carAutomatique: "أوتوماتيك",
  carVehicleType: "نوع المركبة",
  carSaharaWarning: "يُنصح بمركبة صحراوية",
  carSaharaDesc: "للبԹeqerty الصحراوية، يُوصى بشدة بمركبة 4x4 للسلامة وإمكانية الوصول.",
  carRecommended: "موصى به",
  carBookNow: "احجز الآن",
  carDay: "يوم",
  carNoMatch: "لا توجد مركبات تطابق تصفياتك",

  restHeroSubtitle: "المطاعم · الجزائر",
  restHeroTitle: "ذوّق الجزائر",
  restHeroDesc: "من بيوت الكسكسي التاريخية إلى مطاعم الشاطئ — اكتشف نكهات الجزائر، طبقاً بطبق.",
  restCount: "مطاعم",
  restCity: "المدينة",
  restSearchCity: "ابحث عن مدينة",
  restCuisine: "المطبخ",
  restAllCuisines: "جميع المطابخ",
  restAmbiance: "الأجواء",
  restTerrace: "تراس",
  restIndoor: "داخلي",
  restReviews: "تقييمات",
  restReserve: "احجز",
  restNoMatch: "لا توجد مطاعم تطابق تصفياتك",

  actHeroSubtitle: "الأنشطة · الجزائر",
  actHeroTitle: "استكشف ما وراء",
  actHeroDesc: "من كثبان الصحراء إلى قمم الجبال وشواطئ البحر المتوسط — مغامرات منظمة في جميع أنحاء الجزائر.",
  actCount: "أنشطة",
  actGuided: "جولات إرشادية",
  actHiking: "المشي في الجبال",
  actWater: "الرياضات المائية",
  actCultural: "ثقافي",
  actDesert: "الصحراء",
  actGroup: "المجموعة:",
  actNoMatch: "لا توجد أنشطة تطابق تصفياتك",
  actNoMatchDesc: "جرب وجهة مختلفة أو امسح تصفياتك.",

  transTitle: "النقل",
  transSubtitle: "قطارات، حافلات، رحلات جوية وعبارات عبر الجزائر",
  transFrom: "من",
  transWhereFrom: "من أين؟",
  transTo: "إلى",
  transWhereTo: "إلى أين؟",
  transDate: "التاريخ",
  transAddDate: "أضف تاريخ",
  transTrains: "القطارات",
  transBuses: "الحافلات",
  transFlights: "الرحلات الجوية",
  transFerries: "العبارات",
  transRoutes: "مسارات",
  transOperator: "الشركة",
  transBook: "احجز",
  transSoldOut: "نفدت التذاكر",
  transNoRoutes: "لم يتم العثور على مسارات",
  transNoRoutesDesc: "جرب مدنًا أو نوع نقل مختلف",

  detailNotFound: "غير موجود",
  detailNotFoundDesc: "العنصر الذي تبحث عنه غير موجود.",
  detailBackTo: "العودة إلى",
  detailReviews: "تقييمات",
  detailAbout: "عن",
  detailHighlights: "أبرز ما في",
  detailInPlan: "في الخطة",
  detailAddToPlan: "إضافة للخطة",
  detailBookNow: "احجز الآن",
  detailContactToBook: "اتصل للحجز",
  detailContactToReserve: "اتصل للحجز",
  detailCallReservation: "اتصل لإجراء الحجز",
  detailBookingSummary: "ملخص الحجز",
  detailAdding: "جارٍ الإضافة...",
  detailAddMyBooking: "إضافة إلى حجزي",
  detailSimilar: " مشابهة",
  detailMoreIn: "المزيد في",
  detailTaxes: "الضرائب",
  detailIncluded: "مشمولة",
  detailTotal: "المجموع",
  detailIndividualPrice: "السعر للفرد",
  detailGroupPrice: "سعر المجموعة",
  detailBestValue: "أفضل قيمة",
  detailSave: "وفّر",

  detailBackHotels: "العودة للفنادق",
  detailAboutHotel: "عن هذا الفندق",
  detailCheckin: "تسجيل الوصول",
  detailCheckout: "تسجيل المغادرة",
  detailGuests: "الضيوف",
  detailNights: "الليالي",
  detailMoreStaysIn: "المزيد من الإقامات في",
  detailHotelLabel: "الفندق:",
  detailGuestsLabel: "الضيوف:",
  detailNightsLabel: "الليالي:",

  detailBackCars: "العودة للسيارات",
  detailAboutVehicle: "عن هذه المركبة",
  detailSpecifications: "المواصفات",
  detailTransmission: "ناقل الحركة",
  detailFuel: "الوقود",
  detailSeats: "المقاعد",
  detailIncludedOptions: "مشمول وخيارات",
  detailKmIncluded: "مشمول",
  detailType: "النوع",
  detailAgency: "الوكالة",
  detailPricePerDay: "السعر يومياً",
  detailSimilarVehicles: "مركبات مشابهة",
  detailVehicleLabel: "المركبة:",
  detailAgencyLabel: "الوكالة:",
  detailDaysLabel: "الأيام:",
  detailRecommended: "موصى به",

  detailBackRestaurants: "العودة للمطاعم",
  detailAboutRestaurant: "عن هذا المطعم",
  detailSpecialties: "المتخصصات",
  detailCuisine: "المطبخ",
  detailPriceRange: "نطاق السعر",
  detailTerrace: "تراس",
  detailHalal: "حلال",
  detailAvailable: "متوفر",
  detailNotAvailable: "غير متوفر",
  detailYes: "نعم",
  detailNo: "لا",
  detailReserve: "احجز",
  detailRestaurantLabel: "المطعم:",

  detailBackActivities: "العودة للأنشطة",
  detailAboutActivity: "عن هذا النشاط",
  detailDuration: "المدة",
  detailGroupPriceLabel: "سعر المجموعة",
  detailDifficulty: "الصعوبة",
  detailDurationLabel: "المدة",
  detailGuidedExperience: "تجربة إرشادية",
  detailDifficultyLevel: "مستوى الصعوبة",
  detailGroupDiscount: "خصم المجموعة:",
  detailExpertGuides: "مرشدون محترفون",
  detailSimilarActivities: "أنشطة مشابهة",
  detailActivityLabel: "النشاط:",
  detailParticipantsLabel: "المشاركون:",
  detailParticipants: "المشاركون",

  detailBackDestinations: "العودة للوجهات",
  detailBestTime: "أفضل وقت",
  detailIdealDuration: "المدة المثالية",
  detailGettingThere: "الوصول",
  detailYearRound: "على مدار السنة",
  detailDays1to3: "١-٣ أيام",
  detailByRoad: "بالطريق",
  detailCarRentals: "تأجير السيارات",
  detailAvailableCount: "متاحة",
  detailExploreWithAI: "استكشف بالذكاء الاصطناعي",
  detailAIRecommendations: "اسأل مساعدنا الذكي للحصول على توصيات مخصصة",
  detailAddToPlanLower: "إضافة للخطة",
  detailDetailsWithAI: "التفاصيل بالذكاء الاصطناعي",
};

const translations: Record<Language, TranslationKeys> = { en, fr, ar };

export function t(lang: Language, key: keyof TranslationKeys): string {
  return translations[lang]?.[key] ?? translations.en[key] ?? key;
}
