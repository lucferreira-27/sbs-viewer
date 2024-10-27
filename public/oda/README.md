# One Piece SBS Database API

A MongoDB-powered API for accessing and searching One Piece SBS (Question & Answer) content from the manga volumes.

## Table of Contents

- [Setup](#setup)
- [Database Structure](#database-structure)
- [API Endpoints](#api-endpoints)
- [Development](#development)
- [Project Structure](#project-structure)

## Setup

### Prerequisites

- Node.js
- MongoDB Atlas account
- npm or yarn

### Installation

1. Clone the repository and install dependencies:
   git clone <repository-url>
   cd one-piece-sbs-api
   npm install

2. Configure environment:
   Create .env file with:
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/
   MONGODB_DB=SBS
   PORT=3000

3. Import data:
   npm run import

4. Start server:
   Development: npm run dev
   Production: npm start

## Database Structure

1. SBS Collection:

   - volume (number, unique)
   - summary (string)
   - chapters (array)
     - chapter (number)
     - page (number)
     - sections (array)
       - type (string)
       - id (string)
       - question
         - text (string)
         - author (string)
       - answer
         - author (string)
         - segments (array)
           - type (string)
           - text (string)
           - author (string)
           - url (string, optional)
           - caption (string, optional)

2. SBSTags Collection:
   - volume (number, unique)
   - summary (string)
   - chapters (array)
     - chapter (number)
     - page (number)
     - sections (array)
       - type (string)
       - id (string)
       - tags (string array)
       - summary (string)
       - characters (string array)

## API Endpoints

1. Get All Volumes
   GET /api/sbs/volumes
   Returns list of all volumes with basic information

2. Get Specific Volume
   GET /api/sbs/volumes/:volume
   Returns complete data for specified volume

3. Get Volume Tags
   GET /api/sbs/volumes/:volume/tags
   Returns tags and metadata for specified volume

4. Search by Character
   GET /api/sbs/search/character/:name
   Searches for character across all volumes

5. Search by Tag
   GET /api/sbs/search/tag/:tag
   Searches for specific tag across all volumes

## Development

Available Scripts:

- npm start: Start production server
- npm run dev: Start development server with nodemon
- npm run import: Import data from JSON files

Import Process Features:

- Automatic processing of Q&A and tags files
- Progress tracking and statistics
- Error handling and reporting
- Database validation
- Duplicate prevention

## Project Structure

project/
├── config/
│ └── database.js MongoDB configuration
├── models/
│ ├── SBS.js Main SBS schema
│ ├── SBSTags.js Tags schema
│ └── api/
│ ├── app.js Express application
│ └── routes/
│ └── sbs.js API routes
├── scripts/
│ └── importSBS.js Data import script
├── database/ JSON data files
├── .env Environment configuration
└── package.json Project dependencies

## Error Handling

- HTTP status codes (200, 404, 500)
- Detailed error messages
- Global error middleware
- Unhandled rejection and exception catching

Example error response:
{
"message": "Volume not found"
}

## Security

- CORS enabled
- Environment variable protection
- MongoDB connection string security
- Error message sanitization

## Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT License - See LICENSE file for details
