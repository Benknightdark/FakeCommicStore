import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import clientPromise from '../../../helpers/mongodb-client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    try {
        const session = await getSession({ req })
        if(session===undefined||session===null){
            res.status(404).json({"message":"未登入"})
            return;
        }
        const favoriteCollection=await (await clientPromise).db().collection("favorite")
        req.body['username']=session?.user?.name;
        const inertData=favoriteCollection.insertOne(req.body);
        res.status(200).json(inertData)
    } catch (error:any) {
        res.status(500).json({"message":error.message})

    }    
}