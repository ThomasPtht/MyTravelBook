## My Travel Book

A web application to keep track of the cities and countries you have visited or want to visit.

Currently in development 🏗️

![login page](./public/login-page.png)
![home page](./public/home-page.png)
![map page](./public/map-page.png)
![form](./public/form.png)

### Technologies used :

- Next.js 16
- TypeScript
- Prisma ORM
- PostgreSQL
- React Query
- Zod
- React Hook Form
- Tailwind CSS
- Shadcn UI
- Authentification with NextAuth.js
- bcrypt for password hashing
- Bucket S3 to store images of destinations : Cloudflare R2
- Tests with Jest and React Testing Library
- CI/CD with GitHub Actions
- Error monitoring with Sentry
- Uptime monitoring with UptimeRobot

### Features :

- Add destinations (cities and countries)
- Mark destinations as visited or on wish list
- View list of visited destinations and wish list
- Map view of visited/wish list destinations
- User authentication

### Security :

- Security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy)
- API route protection via middleware (authentication required for POST/PUT/DELETE)
- Server-side input validation with Zod
- Password hashing with Argon2
- Ownership verification on delete operations
- Password excluded from API responses

## Cache management

- React Query is used to manage server state and caching on the client side. After mutations (add, delete), the relevant queries are invalidated to ensure the UI reflects the latest data from the server.
- example of refetching : after adding a destination, `queryClient.invalidateQueries('destinations')` is called to refetch the list of destinations.
- I manage loading and error states using the status returned by React Query hooks (`isLoading`, `isError`, etc.) to provide feedback to the user during data fetching operations.
- Defined cache for 5 minutes with staleTime to optimize performance while ensuring data is reasonably fresh. Enabled paramater stop queries if "id" is not defined to avoid unnecessary requests.

## Uploading images
Images are uploaded to Cloudflare R2, an S3-compatible object storage service. The server generates a pre-signed URL for the client to upload the image directly to R2, which improves performance and reduces server load.
- Created r-2-upload.ts file in lib to handle image uploads to R2. Initialize an S3 client with Cloudflare R2 credentials and endpoint. The function validates file type and size, uploads the file to R2 with a unique name, and returns the public URL.
    
  Required environment variables:
  - AWS_S3_API_URL
  - AWS_ACCESS_KEY_ID
  - AWS_SECRET_ACCESS_KEY
  - AWS_S3_BUCKET_NAME
  - R2_URL (public base URL for files)
  
Then use it in server action **destination-image.ts** to handle image uploads from the client. The server action checks user authentication, calls the upload function, and returns the public URL of the uploaded image.


## Setup Jest (tests unitaires)

To set up Jest for unit testing, the following dependencies were installed:

```
npm install --save-dev jest           # Test runner
npm install --save-dev @types/jest    # TypeScript types for Jest
npm install --save-dev ts-jest        # TypeScript transformer for Jest
npm install --save-dev @testing-library/react    # React component testing utilities
npm install --save-dev @testing-library/jest-dom # Extra DOM assertions
npm install --save-dev babel-jest     # Babel transformer for Jest
npm install --save-dev @babel/preset-env         # Modern JS to Node
npm install --save-dev @babel/preset-typescript  # TypeScript to JS
npm install --save-dev @babel/preset-react       # JSX/TSX to JS
```

**Configuration added :**

- a file `babel.config.js` with :
  ```js
  module.exports = {
    presets: [
      ["@babel/preset-env", { targets: { node: "current" } }],
      "@babel/preset-typescript",
      "@babel/preset-react",
    ],
  };
  ```
- In `jest.config.ts` :
  ```js
  transform: {
  	'^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
  },
  ```
  and
  ```js
  transformIgnorePatterns: [
  	'/node_modules/(?!uuid)',
  	'\\.pnp\\.[^/]+$'
  ],
  ```

## Sentry

Sentry is used to monitor errors and performance in production. It captures crashes, exceptions and slow transactions, allowing to debug issues remotely.

## Deployment

The app is deployed on **Vercel** with a **Neon** PostgreSQL database for production.

### Steps to deploy

1. Create a [Neon](https://neon.tech) project and copy the connection string.
2. In Vercel, add all environment variables from `.env`, replacing `DATABASE_URL` with the Neon connection string and `NEXTAUTH_URL` with the Vercel domain.
3. Push to your main branch — Vercel deploys automatically.
4. Run migrations and seed against the production database:

```bash
# Temporarily set DATABASE_URL to the Neon connection string in .env
npx prisma migrate deploy
npx prisma db seed
# Then restore the local DATABASE_URL
```

## NextAuth setup

- created a `next-auth.d.ts` file to extend the Session interface with a `user` object containing `id` and `username`.
- In `authOptions`, the `session` callback is configured to include `user.id` and `user.username` in the session object returned to the client.
- authOptions allows to set up the authentication providers (CredentialsProvider for email/password login) then use it in the `NextAuth` handler in `app/api/auth/[...nextauth]/route.ts`.
- Define SessionProvider in `app/layout.tsx` to wrap the app and provide session context to all components.
- In the `Header` component, the session is accessed using `useSession()`, and the username is extracted from `session.user.username` for display.
- This setup allows the app to access the authenticated user's information (like username) across components via the session.

## Security measures

- **Security headers**: Implemented via `next.config.js` to set headers like `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy`, and `Permissions-Policy`.
- **API route protection**: Middleware checks for authentication on POST/PUT/DELETE requests.
- **Server-side input validation**: Zod is used to validate incoming data on the server.
- **Password hashing**: Bcrypt is used to securely hash user passwords.
- **Rate limiting**: Implemented with Upstash Ratelimit to prevent abuse of API endpoints.
- **Ownership verification**: Ensures users can only delete their own destinations.
