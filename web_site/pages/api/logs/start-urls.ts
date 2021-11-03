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
        const startUrlsCount = await client.lLen(reqData['keyName'])//"chapter_url:start_urls"
        console.log(startUrlsCount)
        res.status(200).json({ count: startUrlsCount })
    } catch (error) {
        res.status(200).json({ count: 0 })
    }

}
