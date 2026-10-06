# Open Source Web GIS Project: ITI Branches Explorer

## 1. Project Overview
This project is a Web GIS application designed to manage, visualize, and dynamically add locations for Information Technology Institute (ITI) branches across Egypt. 
The application addresses the problem of spatial data fragmentation by providing a centralized spatial repository and an interactive map interface, making it easy for users to find branch locations and the specific training tracks offered at each center.

## 2. My Contribution
My contributions to this project include:
*   **GIS Data Preparation:** Locating and formatting the spatial data (coordinates and attributes) for various ITI branches.
*   **Spatial Database Setup:** Installing and configuring the PostgreSQL database, enabling the PostGIS extension, and setting up the spatial tables with appropriate geometry constraints.
*   **Architecture & Workflow Design:** Planning the data flow from the database to the backend and eventually to the web client.
*   **AI-Assisted Implementation:** Utilizing an AI agent to primarily implement the frontend (React/Leaflet) and the backend REST API (Node.js/Express) to fulfill the planned Web GIS architecture.

## 3. Web GIS Architecture
The project utilizes a lightweight, modern Web GIS architecture. Instead of relying on a heavyweight GIS server, spatial data is queried directly via a Node.js backend and served as GeoJSON to the client.

```text
QGIS (Data Preparation & Pre-processing)
       ↓
PostgreSQL / PostGIS (Spatial Database)
       ↓
Node.js / Express API (REST Backend serving GeoJSON)
       ↓
React / Leaflet (Web GIS Application)
```

## 4. Technologies
*   **GIS Desktop Software:** QGIS (used for initial data preparation and verification).
*   **Spatial Database:** PostgreSQL with the PostGIS extension.
*   **Backend/API:** Node.js, Express, `pg` (node-postgres library).
*   **Frontend:** React, React-Leaflet (Leaflet.js mapping library), Axios, Bootstrap for UI styling.

## 5. GIS Workflow
1.  **Data Preparation:** Structuring branch names, tracks, and extracting Longitude/Latitude pairs.
2.  **Spatial Database Creation:** Setting up the PostgreSQL environment and enabling the PostGIS extension.
3.  **Spatial Data Loading:** Loading the initial data into the `iti_branches` table, generating geographic point geometries from the raw coordinates.
4.  **API Configuration:** Developing a Node.js REST API to query PostGIS and dynamically format the spatial data into a standard GeoJSON format on the fly.
5.  **Web Visualization:** Consuming the GeoJSON endpoints via React and rendering the geographic features on an interactive Leaflet map.

## 6. Spatial Database
*   **Database Engine:** PostgreSQL.
*   **Spatial Extension:** PostGIS.
*   **Spatial Table:** `iti_branches`.
*   **Geometry Type:** `Point`.
*   **Coordinate Reference System (CRS):** EPSG:4326 (WGS 84).
*   **Important Attributes:** `Branch` (String), `Longitude` (Float), `Latitude` (Float), `tracks` (String).
*   **Configuration:** The backend writes to the spatial column using the PostGIS function `ST_SetSRID(ST_MakePoint(Longitude, Latitude), 4326)`.

## 7. GeoServer Configuration
**Note:** GeoServer was explicitly excluded from this architecture to maintain a lightweight stack. Instead, the Node.js Express backend directly interfaces with PostGIS. The backend acts as a spatial API, querying the database and programmatically assembling a GeoJSON `FeatureCollection` to mimic the behavior of a WFS (Web Feature Service) request.

## 8. Web GIS Integration
*   **Data Request:** The React frontend uses Axios to send HTTP `GET` requests to the `http://localhost:5000/iti_branches` endpoint.
*   **Data Consumption:** The backend responds with a properly formatted GeoJSON object.
*   **Map Display:** The React-Leaflet `MapContainer` iterates over the GeoJSON features and plots `Marker` components on an OpenStreetMap base layer.
*   **Data Insertion:** When the user submits the form, the frontend sends a `POST` request with the coordinates to the backend, which parses the payload and executes an SQL `INSERT` statement containing PostGIS geometric constructors.

## 9. Key Features
*   **Interactive Web Map:** Fluid map navigation using Leaflet and OpenStreetMap tiles.
*   **Dynamic Data Rendering:** Existing ITI branches are fetched from the database and displayed as map markers on load.
*   **Spatial Interactivity (Click-to-Add):** Users can click anywhere on the map to drop a temporary marker, which automatically populates the Longitude and Latitude coordinate fields in the sidebar form.
*   **Data Entry Form:** A user-friendly sidebar to input branch names and tracks and save new spatial points directly into the database.
*   **Real-time Updates:** The map seamlessly refreshes its markers immediately after a new branch is saved.

## 10. Project Structure
*   `backend/`: Contains the Node.js Express server (`server.js`), environment variables (`.env`), and package dependencies. Handles all database connections and GeoJSON generation.
*   `frontend/`: Contains the React application. 
    *   `src/mapComponent.jsx`: The core Web GIS component containing the Leaflet map and UI logic.
*   `Video record/`: Contains video demonstrations of the working application.

## 11. How to Run

### Prerequisites
*   Node.js (v14 or higher)
*   PostgreSQL (v12 or higher)
*   PostGIS extension installed on PostgreSQL

### Database Setup
1. Create a new PostgreSQL database named `ptp`.
2. Enable the PostGIS extension:
   ```sql
   CREATE EXTENSION postgis;
   ```
3. Create the `iti_branches` table:
   ```sql
   CREATE TABLE iti_branches (
       id SERIAL PRIMARY KEY,
       "Branch" VARCHAR(255),
       "Longitude" FLOAT,
       "Latitude" FLOAT,
       "tracks" VARCHAR(255),
       geom GEOMETRY(Point, 4326)
   );
   ```

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. The `.env` file is already configured to expect the following variables. Ensure your local postgres matches these:
   ```env
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=ptp
   DB_PASSWORD=admin
   DB_PORT=5432
   PORT=5000
   ```
4. Start the server: `node server.js`

### Frontend Setup
1. Open a new terminal and navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the React development server: `npm start`
4. The Web GIS application will automatically open in your browser at `http://localhost:3000`.
