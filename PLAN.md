# Tourist Hack - Full Stack Plan

> Concours IA Tour Algérie 2026 - Axe 02: Sur-Mesure

---

## Frontend Pages

| Page | Route | Description |
|---|---|---|
| HomePage | `/` | Landing page: hero, dynamic counters, top destinations carousel, how-it-works, testimonials, footer |
| ChatPage | `/chat` | AI conversation interface with 3 adaptive personas (Guide Découverte, Conseiller Culturel, Planificateur Voyage) |
| InteractiveMapPage | `/map` | Leaflet map of 58 wilayas with GeoJSON, click popups, suggested circuits overlay, layer toggles (UNESCO, beaches, mountains, Sahara) |
| ServicesPage | `/services` | Hub page linking all service sections |
| HotelsSection | `/services/hotels` | Search by city/dates/guests, filter by stars/price/amenities, hotel cards with photos/rating/pricing |
| CarRentalSection | `/services/cars` | Search by location/dates/vehicle type, filter by transmission/options, AI recommendations (4x4 for Sahara) |
| RestaurantsSection | `/services/restaurants` | Search by city/cuisine, filter by price/halal/terrace, regional specialties |
| ActivitiesSection | `/services/activities` | Guided tours, hikes, water sports, cultural events, group pricing |
| TransportSection | `/services/transport` | Train (SNTF), bus, flight (Air Algérie), ferry schedules, price comparator |
| DestinationsPage | `/destinations` | Browse all destinations with cards |
| DestinationDetail | `/destinations/:wilaya` | Single destination view with gallery, attractions, nearby services |
| ProfilePage | `/profile` | User account settings |
| BookingsPage | `/bookings` | User's reservation history |

---

## Navigation

```
[Home] [Destinations] [Services ▼] [Map] [Chat AI]    [AR][FR][EN]  [Login]
```

Services dropdown: Hotels, Cars, Restaurants, Activities, Transport

Floating AI chat button (bottom-right) on all pages with context-aware prompts.

---

## Database Tables (PostgreSQL + pgvector)

| Table | Key Columns |
|---|---|
| `destinations` | id, nom, wilaya, type, description, latitude, longitude, popularité |
| `hebergements` | id, nom, type, prix, capacité, services, disponibilité |
| `attractions` | id, nom, type, destination_id, horaires, prix_entrée |
| `evenements` | id, nom, date_debut, date_fin, destination_id, type |
| `transports` | id, type, origine, destination, horaires, prix |
| `avis_touristes` | id, destination_id, note, commentaire, date |
| `location_voitures` | id, wilaya, agence, type_vehicule, prix_jour, disponibilité |
| `restaurants` | id, nom, wilaya, type_cuisine, prix_moyen, note, specialites |
| `activites` | id, nom, wilaya, type, prix, duree, niveau_difficulte |
| `wilayas_info` | id, nom, code, region, population, sites_unesco, description |

---

## Backend Services

| Service | Role |
|---|---|
| FastAPI | REST API with JWT auth |
| LangGraph | LLM orchestration with 3 personas |
| Temporal | Async durable workflows |
| Redis | Multi-level cache |
| PostgreSQL + pgvector | Data + embeddings |

---

## MCP Servers (6)

| MCP | Tools |
|---|---|
| weather-algeria-mcp | get_current_weather, get_forecast, get_climate_info |
| heritage-algeria-mcp | get_site_info, get_unesco_sites, get_cultural_events, get_wilaya_info |
| booking-algeria-mcp | search_hotels, check_car_availability, search_restaurants, get_activities, book_guided_tour |
| maps-algeria-mcp | calculate_route, get_distance, get_nearby_places |
| safety-algeria-mcp | get_travel_advisories, get_emergency_contacts, get_health_facilities |
| cuisine-algeria-mcp | get_regional_dishes, get_restaurant_recommendations |

---

## Priority Pages to Build Now

1. **HomePage** - Landing page with hero section
2. **ChatPage** - AI chat interface
3. **InteractiveMapPage** - Map with 58 wilayas
4. **ServicesPage + HotelsSection** - Hotel search
5. **CarRentalSection** - Car rental search
