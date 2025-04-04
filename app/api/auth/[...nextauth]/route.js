import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
// import connectDb from '@/db/connectDb'
// import User from '@/models/User'

export const authoptions = NextAuth({
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET
      }),
    ],
    callbacks: {
      async signIn({ user, account }) {
         if(account.provider === "google") { 
          await connectDb()
          // Check if the user already exists in the database
          const currentUser = await User.findOne({ email: user.email }) 
          
          if(!currentUser){
            // Create a new user
            await User.create({
              email: user.email, 
              username: user.email.split("@")[0], 
            })   
          } 
          return true // Must return true for successful sign-in
         }
         return false // Prevent sign-in if conditions fail
      },
      
      async session({ session }) {
        const dbUser = await User.findOne({ email: session.user.email })
        if (dbUser) {
          session.user.name = dbUser.username
        }
        return session
      },

      async redirect({ url, baseUrl }) {
        return baseUrl // Ensures redirection to homepage
      }
    } 
})

export { authoptions as GET, authoptions as POST }
