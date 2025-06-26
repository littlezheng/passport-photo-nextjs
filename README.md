# passport-photo-nextjs

This is a passport photo processing application built with [Next.js](https://nextjs.org), initialized using [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Requirements

Ensure your local development environment has the following dependencies installed:

- **Node.js** ≥ 18.20 (It is recommended to use [nvm](https://github.com/nvm-sh/nvm) to manage Node versions)
- **npm** ≥ 10

## Environment Variables

> You can also configure environment variables on the deployment platform (e.g., Vercel), so there’s no need to hard-code them in the project.

```env
IDPHOTO_API_ENDPOINT=your_idphoto_api_endpoint
IDPHOTO_API_KEY=your_idphoto_api_key
IDPHOTO_API_SECRET=your_idphoto_api_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

## Local Development

Start the development server:

```bash
npm install
npm run dev
```

Then open your browser at: [http://localhost:3000](http://localhost:3000)

## Production Deployment

### Build the Project

```bash
npm run build
```

### Start the Production Server

```bash
npm run start
```

## One-Click Deployment to Vercel

### Prerequisites

- A [Vercel account](https://vercel.com/signup)
- The project is hosted on GitHub, GitLab, or Bitbucket

### Deployment Steps

1. Log in to the [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New" → "Project"**
3. Select the corresponding code repository — Vercel will automatically detect the Next.js project
4. Configure the environment variables (same as those in `.env`) **(this step is important!)**
5. Click **"Deploy"** and wait for the automatic build to complete

Once deployed, Vercel will provide a public URL for your project.

## References

- [Next.js Documentation](https://nextjs.org/docs) - In-depth framework features and APIs
- [Learn Next.js](https://nextjs.org/learn) - Official interactive learning course
