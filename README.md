# Honeywell Incident Tracker

A production-quality React application for displaying and managing incident data with responsive design and basic testing setup.

## Features

- **Responsive Design**: Table view for desktop (≥600px) and card list view for mobile (<600px)
- **Data Processing**: Fetches incidents from multiple locations, filters duplicates, and sorts by priority (ascending) and datetime (descending)
- **Priority Visualization**: Color-coded priority badges and SVG icons for High, Medium, and Low priorities

## Technology Stack

- **React 18.2.0** - Modern React with hooks
- **CSS3** - Responsive design with CSS Grid and Flexbox
- **React Testing Library** - Basic Component testing
- **Create React App** - Build tooling and development environment

**Important**: Priority icons are located in `public/img/` to ensure they are accessible via `/img/` paths in the browser.

## Installation and Setup

### Prerequisites

- Node.js 14+ and npm
- Modern web browser (Chrome recommended)

### Local Development

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Start development server**:

   ```bash
   npm start
   ```

   The application will open at `http://localhost:3000`

3. **Run tests**:

   ```bash
   # Run tests in watch mode
   npm test
   ```

### Production Build

1. **Create production build**:

   ```bash
   npm run build
   ```

## Deployment Strategy

### Static Hosting (Recommended)

The application builds to static files and can be deployed to any static hosting service:

#### Netlify

1. Connect your Git repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Deploy automatically on push to main branch

#### Vercel

1. Import your Git repository to Vercel
2. Vercel will auto-detect Create React App settings
3. Deploy automatically on push

#### AWS S3 + CloudFront

1. Run `npm run build`
2. Upload `build` folder contents to S3 bucket
3. Configure CloudFront distribution for CDN
4. Set up redirect rules for SPA routing

### Docker Deployment

```dockerfile
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Test Coverage

The application includes basic tests covering:

- Header rendering
- Desktop table view functionality
- Mobile list view functionality
- Duplicate filtering logic

## Time Spent

Approximately **4-5 hours** spent on:

- Project setup and configuration (1 hour)
- Component development (2 hours)
- Basic testing implementation (30 minutes)
- Documentation and deployment setup (1 hour)
