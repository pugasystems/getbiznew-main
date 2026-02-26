# GetBizUSA — Frontend

The main customer-facing web application for **GetBizUSA**, a B2B business directory and marketplace platform. Built with Next.js 14, Tailwind CSS, and Radix UI.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Auth**: NextAuth.js
- **UI**: Radix UI + Tailwind CSS + shadcn/ui conventions
- **State / Data Fetching**: TanStack React Query v5
- **Forms**: React Hook Form + Zod
- **Real-time**: Socket.io client
- **Carousel**: Embla Carousel
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn or npm

### Installation

```bash
yarn install
```

### Development

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
yarn build
yarn start
```

### Lint

```bash
yarn lint
yarn lint:fix
```

## Project Structure

```
src/
├── app/          # Next.js App Router pages & layouts
├── components/   # Reusable UI components
├── assets/       # Static assets
├── lib/          # Utility libraries and API clients
├── middleware.ts # Next.js middleware (auth guards, etc.)
├── types/        # TypeScript type definitions
└── utils/        # Helper functions
```

## Environment Variables

Create a `.env.local` file in the root with the required variables:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## License

Private — All rights reserved © GetBizUSA
