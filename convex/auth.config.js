
export default {
    providers: [
      {
        domain: process.env.CONVEX_CLERK_FRONTEND_API_URL,
        applicationID: 'convex',
      },
      {
        domain: process.env.CLERK_FRONTEND_API_URL,
        applicationID: 'convex',
      },
    ],
  }