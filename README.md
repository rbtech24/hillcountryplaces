# Texas Hill Country Visitor Website

A comprehensive travel website showcasing the beauty and attractions of the Texas Hill Country region. This platform provides visitors with detailed information about destinations, events, attractions, and cabin accommodations in the Hill Country area.

## Features

### For Visitors
- **Destination Guides**: Explore different cities and areas within the Texas Hill Country
- **Attraction Listings**: Find wineries, natural sites, historic landmarks, and more
- **Event Calendar**: Discover upcoming events with Google Calendar integration
- **Interactive Map**: Navigate the region with an intuitive map interface
- **Cabin Rentals**: Browse and book cabin accommodations
- **Travel Blog**: Read travel tips and insider information about the Hill Country
- **AI Travel Assistant**: Get personalized recommendations and answers

### For Administrators
- **Content Management System**: Full WYSIWYG editor for all site content
- **Image Management**: Comprehensive image organization with categories
- **Calendar Integration**: Sync with Google Calendar for event management
- **Blog Management**: Create and edit travel blog posts
- **Media Embedding**: Add YouTube videos to any content section

## Technology Stack

- **Frontend**: React with TypeScript
- **UI Components**: Tailwind CSS with shadcn/ui
- **State Management**: React Query
- **Routing**: Wouter
- **Maps**: Leaflet integration
- **Editor**: TinyMCE for rich text editing
- **Backend**: Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: OpenAI API

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Installation

1. Clone the repository
```
git clone https://github.com/your-username/texas-hill-country.git
cd texas-hill-country
```

2. Install dependencies
```
npm install
```

3. Set up environment variables (create a `.env` file with the following):
```
DATABASE_URL=your-postgresql-connection-string
GOOGLE_CALENDAR_API_KEY=your-google-api-key
OPENAI_API_KEY=your-openai-api-key
```

4. Start the development server
```
npm run dev
```

### Database Setup

The project uses Drizzle ORM with PostgreSQL. Run the following to set up your database:

```
npm run db:push
```

## Admin Access

The admin dashboard is accessible at `/admin/login` with the following credentials:
- Username: hillcountry_admin
- Password: TXHillCountry2025!

## Project Structure

- `/client` - Frontend React application
- `/server` - Backend Express server
- `/shared` - Shared types and schemas
- `/public` - Static assets

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Replit](https://replit.com)
- Map data from [Leaflet](https://leafletjs.com/)
- Calendar integration with [Google Calendar API](https://developers.google.com/calendar)
- AI features powered by [OpenAI](https://openai.com/)