# Kartzo Frontend

This is the Next.js frontend application for **Kartzo**, a modern e-commerce platform. Built with Next.js App Router, TypeScript, Tailwind CSS, and Framer Motion for a beautiful, responsive shopping experience.

## Features

- 🛍️ **Product Catalog** - Browse products with filtering, sorting, and pagination
- 🛒 **Shopping Cart** - Add/remove items, update quantities in real-time
- 💳 **Checkout & Payment** - Secure payment integration with Razorpay
- 📦 **Order Management** - View order history and track orders
- ⭐ **Product Reviews** - Rate and review products
- 👤 **User Accounts** - Authentication, profile management, and order tracking
- 🎨 **Modern UI** - Responsive design with dark mode support
- ⚡ **Performance Optimized** - Image optimization, lazy loading, and efficient data fetching

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **UI Components**: Radix UI (shadcn/ui)
- **State Management**: React Hooks
- **API Integration**: REST API with backend server
- **Icons**: Lucide React
- **Notifications**: Sonner (Toast notifications)

## Getting Started

### Prerequisites

- Node.js 20+ and npm/yarn/pnpm
- Backend server running (Kartzo Spring Boot API)

### Installation

1. Navigate to the frontend directory:
```bash
cd web
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file in the `web` directory:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
NEXT_PUBLIC_MEDIA_ORIGIN=http://localhost:8080
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
web/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── account/            # User account pages
│   │   ├── cart/               # Shopping cart page
│   │   ├── checkout/           # Checkout page
│   │   ├── login/              # Login page
│   │   ├── product/[id]/       # Product detail pages
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/             # Reusable React components
│   │   ├── layout/             # Layout components (Header, Footer)
│   │   ├── providers/          # Context providers
│   │   ├── shop/               # E-commerce components
│   │   └── ui/                 # UI components (Button, Card, etc.)
│   ├── lib/                    # Utility functions
│   │   ├── media.ts            # Media URL helper
│   │   ├── storefront-api.ts   # API client functions
│   │   └── utils.ts            # General utilities
│   └── types/                  # TypeScript type definitions
│       └── storefront.ts       # E-commerce types
├── public/                     # Static assets
├── .env.local                  # Environment variables
├── next.config.ts              # Next.js configuration
└── package.json                # Dependencies and scripts
```

## Key Components

### Image Optimization

Images are optimized using Next.js Image component with:
- Quality settings (65-75) for faster loading
- Responsive sizes for different viewports
- Lazy loading for non-critical images
- Priority loading for hero images

### API Integration

The frontend communicates with the Kartzo backend API through:
- Server-side fetching for SEO-friendly pages
- Client-side fetching for dynamic interactions
- Proxy API route at `/api/backend/[...path]` for CORS handling

### State Management

- React Hooks for local component state
- Optimistic UI updates for better UX
- Toast notifications for user feedback

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_BACKEND_URL` | Backend API URL | `http://localhost:8080` |
| `NEXT_PUBLIC_MEDIA_ORIGIN` | Media server URL | `http://localhost:8080` |

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Tailwind CSS](https://tailwindcss.com/docs) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Reusable UI components

## Deployment

### Production Build

```bash
npm run build
npm run start
```

### Deploy to Vercel

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new):

1. Push your code to GitHub
2. Import your repository to Vercel
3. Configure environment variables
4. Deploy

Make sure to update the `NEXT_PUBLIC_BACKEND_URL` to your production backend URL.

## Important Notes

- The frontend requires the Kartzo backend (Spring Boot) to be running
- All API calls are proxied through `/api/backend/[...path]` to avoid CORS issues
- Image optimization requires proper configuration of `NEXT_PUBLIC_MEDIA_ORIGIN`
- Authentication is handled via cookies/sessions with the backend

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
