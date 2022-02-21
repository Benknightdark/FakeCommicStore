// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from 'redis';


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const reqData = JSON.parse(req.body)
        const client = createClient(
            {
                url: `redis://${process.env['REDIS_HOST']}:${process.env['REDIS_PORT']}`,
            }
        );
        await client.connect();
        const data = await client.zCard(reqData['keyName'])//"chapter_url:requests"
        await client.disconnect()
        res.status(200).json({ count: data })
    } catch {
        res.status(200).json({ count: 0 })
    }
}
