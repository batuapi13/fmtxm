# SNMP FM Transmitter Dashboard

## Overview

This is a real-time monitoring dashboard for FM transmitter sites that uses SNMP data polling to track status and performance metrics. The application is designed for 24-hour operation environments with an industrial monitoring focus, providing mission-critical status tracking for Malaysian FM transmission sites. The dashboard features live power readings, status indicators, site mapping, and alert management for multiple transmitters across different broadcast locations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript running on Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and caching with real-time data fetching
- **UI Framework**: Tailwind CSS with shadcn/ui component library using Radix UI primitives
- **Design System**: Custom Material Design implementation optimized for industrial monitoring with dark mode as default for 24-hour operations

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **API Design**: RESTful API structure with /api prefix routing
- **Development**: Hot module replacement via Vite integration for seamless development experience
- **Type Safety**: Full-stack TypeScript with shared schema validation between client and server

### Data Storage Solutions
- **Database**: PostgreSQL configured through Drizzle ORM
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Connection**: Neon Database serverless PostgreSQL with connection pooling
- **Development Storage**: In-memory storage interface for development and testing

### Authentication and Authorization
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple
- **User Schema**: Simple username/password authentication system with UUID primary keys
- **Security**: Built-in CSRF protection and secure session handling

### UI/UX Design Philosophy
- **Dark Mode First**: Optimized for 24-hour monitoring environments with reduced eye strain
- **Status-Driven Design**: Color-coded status indicators (green=operational, amber=warning, red=error, gray=offline)
- **Information Density**: Compact layouts optimized for displaying multiple transmitter metrics simultaneously
- **Real-time Updates**: Live polling indicators and animated status updates for immediate feedback
- **Responsive Layout**: Mobile-first design with card-based layouts for different screen sizes

### Component Architecture
- **Modular Components**: Reusable UI components for transmitter cards, status indicators, power meters, and site mapping
- **Type Safety**: Comprehensive TypeScript interfaces for transmitter data, site information, and status types
- **Testing Ready**: Data-testid attributes throughout for automated testing capabilities

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling and automatic scaling
- **Drizzle ORM**: Type-safe database operations with schema validation and migration management

### UI/UX Libraries
- **Radix UI**: Accessible component primitives for complex UI interactions (dialogs, dropdowns, tooltips)
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens for industrial monitoring
- **Lucide React**: Icon library optimized for technical interfaces and status indicators
- **shadcn/ui**: Pre-built component library with consistent styling and accessibility

### Development Tools
- **Vite**: Fast build tool with hot module replacement and optimized production builds
- **ESBuild**: Fast JavaScript/TypeScript bundling for server-side code
- **TanStack Query**: Powerful data fetching and caching solution with background updates

### Fonts and Assets
- **Google Fonts**: Inter font family for high legibility in monitoring environments
- **Design Tokens**: Custom CSS variables for consistent theming across dark/light modes

### Real-time Data Integration
- **SNMP Protocol**: Designed to integrate with SNMP-enabled FM transmitter equipment for live telemetry
- **Polling System**: Configurable polling intervals for different types of transmitter data
- **Alert Management**: Status change detection and notification system for critical events