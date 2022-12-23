// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../../helpers/mongodb-client'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const inertData=await (await clientPromise).db().collection("user").insertOne(req.body);
        res.status(200).json(inertData)
    } catch (error:any) {
        res.status(500).json({"message":error.message})

    }    
}