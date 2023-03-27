import NextAuth, { AuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import TwitterProvider from "next-auth/providers/twitter";
import { myAppsApi } from "src/services/whitelabel";

const getOptions = (req: any) => {

  return {
    // Configure one or more authentication providers
    providers: [
      TwitterProvider({
        clientId: process.env.TWITTER_API_KEY || '',
        clientSecret: process.env.TWITTER_API_KEY_SECRET || '',
      }),
      DiscordProvider({
        clientId: process.env.DISCORD_CLIENT_ID || '',
        clientSecret: process.env.DISCORD_CLIENT_SECRET || ''
      }),
    ],
    callbacks: {
      async signIn({ user, account, credentials }) {
        await myAppsApi.post('/user-credentials', { user, provider: account?.provider, credentials }, {
          headers: {
            'Authorization': `Bearer ${req.cookies.refresh_token}`
          }
        })

        return true
      },

    }


  } as AuthOptions
}


/*export const authOptions: AuthOptions = {
  
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_API_KEY || '',
      clientSecret: process.env.TWITTER_API_KEY_SECRET || '',
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET || ''
    }),

    // ...add more providers here
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      await myAppsApi.post('/user-credentials', ,{
        headers: {
          'Authorization': `Bearer ${req.cookies.ref}`
        }
      })


      console.log(user);
      console.log(account);
      console.log(email);
      console.log(credentials);
      console.log(profile);
      return true
    },

  }
}*/

export default (req: any, res: any) => NextAuth(req, res, getOptions(req))
//export default NextAuth(authOptions)