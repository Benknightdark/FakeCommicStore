// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from 'redis';
import { getCherrioData } from '../../helpers/cheerio-helper';
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
    await csrTokenCheck(req,res)
    const selectData=req.body
    const $ = (await getCherrioData(selectData.url))
    let data:any[]=[]
    switch (selectData.id) {
        case 3:
            const imgList=$('.lazy')
            imgList.each((i,elem)=>{
                console.log(elem.attributes[1].value)
                data.push({src:elem.attributes[1].value})
            })
            break;
    
        default:
            break;
    }
    res.status(200).json(data)
}
