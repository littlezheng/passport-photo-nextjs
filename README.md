# passport-photo-nextjs

This is a passport photo processing application built with [Next.js](https://nextjs.org), initialized using [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Requirements

Ensure your local development environment has the following dependencies installed:

- **Node.js** ≥ 18.20 (It is recommended to use [nvm](https://github.com/nvm-sh/nvm) to manage Node versions)
- **npm** ≥ 10

## Environment Variables

> You can also configure environment variables on the deployment platform (e.g., Vercel), so there’s no need to hard-code them in the project.

```env
IDPHOTO_API_KEY=your_idphoto_api_key
IDPHOTO_API_SECRET=your_idphoto_api_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
NEXT_PUBLIC_PER_ADDITIONAL_PHOTO_PRICE_IN_CENT=your_per_additional_photo_price_in_cent
```

Find more environment variables in the `.env` file.

## One-Click Deploy Your Own

You can deploy your own version to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fprodonly%2Fpassport-photo-nextjs&env=IDPHOTO_API_KEY,IDPHOTO_API_SECRET,NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,NEXT_PUBLIC_PER_ADDITIONAL_PHOTO_PRICE_IN_CENT,STRIPE_SECRET_KEY&project-name=passport-photo-nextjs&repository-name=passport-photo-nextjs)

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

## References

- [Next.js Documentation](https://nextjs.org/docs) - In-depth framework features and APIs
- [Learn Next.js](https://nextjs.org/learn) - Official interactive learning course
- [Vercel Deploy Button](https://vercel.com/docs/deploy-button) - How to use the Vercel Deploy Button
