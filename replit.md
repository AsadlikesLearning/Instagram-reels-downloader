# Instagram Video Downloader

## Overview
This is a Next.js application that allows users to download Instagram videos and reels. The app provides both a web interface and an API endpoint for downloading Instagram content.

## Current Status
- **Date**: September 13, 2025
- **Status**: Fully configured and running in Replit environment
- **Frontend**: Next.js 14 application running on port 5000
- **Backend**: Built-in API routes for Instagram video processing

## Project Structure
- Next.js 14 application with TypeScript
- Frontend UI with Tailwind CSS and Radix UI components
- API endpoint at `/api/video` for downloading Instagram videos
- Rate limiting support via Upstash Redis (optional)
- Modern React with hooks and React Query for state management

## Configuration
### Development
- Port: 5000 (configured for Replit)
- Host: 0.0.0.0 (allows Replit proxy access)
- All CORS headers configured for API access

### Deployment
- Target: Autoscale (for stateless web app)
- Build: `npm run build`
- Start: `npm start`

## Features
- Download Instagram videos and reels via URL
- Clean, responsive web interface
- API endpoint for programmatic access
- Optional rate limiting with IP-based banning
- Dark/light theme support

## Dependencies
All Node.js dependencies are installed and working:
- Next.js 14, React 18, TypeScript
- UI: Tailwind CSS, Radix UI, Framer Motion
- Forms: React Hook Form with Zod validation
- State: React Query
- Optional: Upstash Redis for rate limiting

## API Usage
```bash
GET /api/video?postUrl={INSTAGRAM_URL}
```

## Recent Changes
- Configured Next.js for Replit environment
- Set up workflow on port 5000 with proper host binding
- Configured deployment settings for autoscale
- All dependencies installed and TypeScript errors resolved