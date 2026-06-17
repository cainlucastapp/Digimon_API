# Digi Fight

A React application for browsing, searching, and battling Digimon, built on top of the public [digi-api.com](https://digi-api.com/) Digimon API.

## Description

Digi Fight lets users explore the full roster of Digimon available through the Digi-API, view detailed profiles including stats, skills, and evolution chains, and filter or search the database to find specific Digimon. The app also includes a turn-based Battle mode, where players select a starting Digimon and fight through a series of CPU opponents, evolving their Digimon along the way.

The app was built with React, React Router, and a custom service layer for handling API requests, with all styling done in component-scoped CSS following a Digimon-inspired digital/HUD aesthetic.

## Features

- Browse a paginated list of Digimon with image, name, and ID
- Search Digimon by name
- Filter Digimon by Level and Attribute
- View a full Digimon profile, including description, skills, and evolution chains
- Navigate directly between related Digimon through their evolution lines
- Battle mode: choose a starting Digimon and fight through progressively stronger CPU opponents, with evolutions triggered on victory
- Responsive design for mobile, tablet, and desktop
- Graceful loading, error, and empty-state handling throughout

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd Digimon_API
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Open the app in your browser at the local address shown in the terminal (`http://localhost:5173`).

No API key or environment variables are required, as the Digi-API is fully public.

## API Used

This project uses the [Digi-API](https://digi-api.com/), a free public REST API for Digimon data, created by Vinicius Brito Costa.

**Base URL:** `https://digi-api.com/api/v1`

**Endpoints used:**
- `GET /digimon` — paginated, filterable list of Digimon (supports `name`, `level`, `attribute`, `page`, and `pageSize` query parameters)
- `GET /digimon/{id}` — full details for a single Digimon, including images, levels, attributes, types, fields, descriptions, skills, and evolution chains
- `GET /level` — list of all Digimon levels (e.g. Baby, Child, Adult)
- `GET /attribute` — list of all Digimon attributes (e.g. Data, Vaccine, Virus)

## Battle System

The Battle mode is a turn-based combat simulator built entirely from data available in the Digi-API, even though the API has no native stat or damage information. Stats are derived in a consistent, predictable way:

- **HP** is calculated from a Digimon's level and the length of its name.
- **Damage** is calculated as a percentage of the attacker's max HP, scaled by level, with added random variance to simulate critical hits.
- **Attribute bonuses** follow the classic Vaccine beats Virus, Virus beats Data, Data beats Vaccine triangle.
- Winning a battle evolves the player's Digimon into one of its next evolutions, with HP reset to the new form's maximum.
- The player progresses and evolves through increasingly difficult CPU opponents across multiple rounds, culminating in a final victory screen if they defeat every tier.

## Known Challenges and Limitations

- The Digi-API's list endpoint does not return level or attribute data for each entry, so filtering happens server-side, but those details are only visible once a specific Digimon's full profile is loaded.
- Reference lists (levels and attributes) are paginated by the API and required client-side merging across multiple requests.
- Evolution data in the API is not always consistent with level progression. Some Digimon have evolution paths that skip levels entirely or loop between same-tier forms. The Battle system includes specific handling to keep evolutions fair and consistent despite this.
- The API has no rate limiting, so heavier usage may occasionally lead the application to be slower than expected.

## Acknowledgements

Powered by [Vinicius Brito Costa](https://www.linkedin.com/in/vinícius-brito-costa/)'s [digi-api.com](https://digi-api.com/).

Digimon and other media relating to the franchise are registered trademarks of Bandai.

