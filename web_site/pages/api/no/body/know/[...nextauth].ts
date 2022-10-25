import NextAuth, { NextAuthOptions } from "next-auth"
// import Credentials from "next-auth/providers/credentials";
import CredentialsProvider from "next-auth/providers/credentials";

import clientPromise from '../../../../../helpers/mongodb-client'
const options: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text", },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {

                const collection = await (await clientPromise).db().collection('user');
                let userData = await collection.findOne({ 'username': credentials?.username, 'password': credentials?.password }, {
                    projection: {
                        _id: 0
                    }
                }) as any;
                return userData!
            }
        })
    ],
    secret: process.env.NEXTAUTH_RANDOM_KEY_SECRECT,
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
        secret: process.env.NEXTAUTH_JWT_SECRET,
        // The maximum age of the NextAuth.js issued JWT in seconds.
        // Defaults to `session.maxAge`.
        maxAge: 60 * 60 * 24 * 30,
        // You can define your own encode/decode functions for signing and encryption
        // if you want to override the default behavior.

    },
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
           user.name = (user as any).username as string
            return true
        },
        async redirect({ url, baseUrl }) {
            return baseUrl
        },
        async session({ session, token, user }) {
            return session
        },
        async jwt({ token, user, account, profile, isNewUser }) {
            return token
        }
    }
}
export default NextAuth(options);