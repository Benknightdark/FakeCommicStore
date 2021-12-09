import NextAuth, { NextAuthOptions } from "next-auth"
// import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
// import clientPromise from "../../../helpers/mongodb-client";
import Credentials from "next-auth/providers/credentials";

const options: NextAuthOptions = {
    // adapter: MongoDBAdapter(clientPromise),
    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text",  },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // Add logic here to look up the user from the credentials supplied
                // Add logic here to look up the user from the credentials supplied
                const user = { id: 1, name: 'J Smith', email: 'jsmith@example.com' }


                // Any object returned will be saved in `user` property of the JWT
                return user


            }
        })
    ],
    debug: true,
    secret: "LlKq6ZtYbr+hTC073mAmAh9/h2HwMfsFo4hrfCx5mLg=",
    session: {
        // Choose how you want to save the user session.
        // The default is `"jwt"`, an encrypted JWT (JWE) in the session cookie.
        // If you use an `adapter` however, we default it to `"database"` instead.
        // You can still force a JWT session by explicitly defining `"jwt"`.
        // When using `"database"`, the session cookie will only contain a `sessionToken` value,
        // which is used to look up the session in the database.
        strategy: "jwt",

        // Seconds - How long until an idle session expires and is no longer valid.
        maxAge: 30 * 24 * 60 * 60, // 30 days

        // Seconds - Throttle how frequently to write to database to extend a session.
        // Use it to limit write operations. Set to 0 to always update the database.
        // Note: This option is ignored if using JSON Web Tokens
        updateAge: 24 * 60 * 60, // 24 hours
    },
    jwt: {
        // A secret to use for key generation. Defaults to the top-level `session`.
        secret: 'INp8IvdIyeMcoGAgFGoA61DdBglwwSqnXJZkgz8PSnw',
        // The maximum age of the NextAuth.js issued JWT in seconds.
        // Defaults to `session.maxAge`.
        maxAge: 60 * 60 * 24 * 30,
        // You can define your own encode/decode functions for signing and encryption
        // if you want to override the default behavior.

    },
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            console.log({ user, account, profile, email, credentials })
            return true
        },
        async redirect({ url, baseUrl }) {
            return baseUrl
        },
        async session({ session, token, user }) {
            console.log(session)
            return session
        },
        async jwt({ token, user, account, profile, isNewUser }) {
            return token
        }
    }
}
export default NextAuth(options);