// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from 'redis';
import { csrTokenCheck } from '../../../helpers/csr-token-helper';


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
  //  await csrTokenCheck(req,res)

    const page=Number.parseInt(req.query['page']!.toString()) //1
    const row=Number.parseInt(req.query['row']!.toString()) //10
    const client = createClient(
        {
            url: `redis://${process.env['REDIS_HOST']}:${process.env['REDIS_PORT']}`,
        }
    );
    await client.connect();

    const logCount = await client.lLen("chapter_url:items")//lRange
    const dataIndex=logCount
    console.log('logCount',dataIndex)
    console.log('start',dataIndex-(page*row))
    console.log('end',dataIndex-((page-1)*row))
    console.log('----------')
    const data = await client.lRange("chapter_url:items",dataIndex-(page*row) ,dataIndex-((page-1)*row)  )//lRange

    const newData=data.map(d=>JSON.parse(d))
    await client.disconnect()
    res.status(200).json({count:logCount,data:newData})
}
