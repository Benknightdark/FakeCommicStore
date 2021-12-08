import NextAuth, { NextAuthOptions } from "next-auth"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "../../helpers/mongodb-client";

const options:NextAuthOptions={
    adapter: MongoDBAdapter(clientPromise),
    providers:[]
}
export default NextAuth(options);