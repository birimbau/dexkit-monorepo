import NextAuth from "next-auth"
import TwitterProvider from "next-auth/providers/twitter"
export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_API_KEY || '',
      clientSecret: process.env.TWITTER_API_KEY_SECRET || ''
    }),
    // ...add more providers here
  ],
}
export default NextAuth(authOptions)