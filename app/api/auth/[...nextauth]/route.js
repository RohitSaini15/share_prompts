import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

import User from '@models/user'
import {connectToDB} from '@utils/database'

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID ?? "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET ?? ""
        })
    ],
    callbacks : {
        async session({session}){
            console.log(session)
            const sessionUser = await User.findOne({email: session.user.email})

            session.user.id = sessionUser._id.toString();

            return session;
        },

        // http://localhost:3000/api/auth/callback/google this runs after the callback
        async signIn({profile}){
            try{
                // { profile object
                //     iss: 'https://accounts.google.com',
                //     azp: '788319476181-7gjv1svanqjma1s47hra9ikojq6puccm.apps.googleusercontent.com',
                //     aud: '788319476181-7gjv1svanqjma1s47hra9ikojq6puccm.apps.googleusercontent.com',
                //     sub: '112179281294953562955',
                //     email: 'rohitrsaini45@gmail.com',
                //     email_verified: true,
                //     at_hash: 'OROwjvEXJ5t0g5BPQ7ihMg',
                //     name: 'Rohit Saini',
                //     picture: 'https://lh3.googleusercontent.com/a/ACg8ocJ9jKIzcf4P8tbl_NlydlNEscooJOHP0lRmw6_DCelj=s96-c',
                //     given_name: 'Rohit',
                //     family_name: 'Saini',
                //     locale: 'en-GB',
                //     iat: 1695877641,
                //     exp: 1695881241
                //   }
                await connectToDB();
                const userExists = await User.findOne({email:profile.email})
    
                if(!userExists){
                    await User.create({
                        email: profile.email,
                        username: profile.name.replace(" ",""),
                        image: profile.picture
                    })
                }
    
                return true
            } catch(error){
                console.log(error)
            }
        }
    }
})

export {handler as GET,handler as POST}