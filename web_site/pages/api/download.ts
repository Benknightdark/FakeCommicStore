// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from 'redis';
import { csrTokenCheck } from '../../helpers/csr-token-helper';

/**
 * 下載漫畫資料
 * 
 * @export
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    //await csrTokenCheck(req,res)
    const selectData=req.body
    if(selectData.length>0){
        console.log(selectData)
        const client = createClient( {
            url: `redis://${process.env['REDIS_HOST']}:${ process.env['REDIS_PORT'] }`,          
          });
        await client.connect();
        const dd=await client.lPush("commic_url:start_urls",selectData)//chapter_url
        console.log(dd)
    }
    res.status(200).json({status:"OK"})
}
