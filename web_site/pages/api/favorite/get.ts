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
        const limit:number=30
        const skip:number = Number.parseInt(req.query['page']!.toString()!)*limit;
        const favoriteCollection=await (await clientPromise).db().collection("favorite")
        const findData=await favoriteCollection.find({'username':session.user?.name},{projection:{_id:0}}).skip(skip).limit(limit).toArray();
        //.skip(2).limit(10)
        res.status(200).json(findData)
    } catch (error:any) {
        res.status(500).json({"message":error.message})

    }    
}