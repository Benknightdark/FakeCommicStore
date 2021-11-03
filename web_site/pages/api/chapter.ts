// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

type Data = {
    title: string | undefined,
    link: string | undefined,
    checked:boolean
}

/**
 * 取得特定類別的漫畫章節
 *
 * @export
 * @param {NextApiRequest} req
 * @param {NextApiResponse<Data[]>} res
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data[]>
) {
    const url: string = req.query['url'].toString()
    const reqData = await fetch(url)
    const resData = await reqData.text()
    const $ = cheerio.load(resData);

    const data: Data[] = []
    $('#play_1').find('ul').children('li').each((index, element) => {

        data.push({
            title: $(element).find('a').attr('title'),
            link: $(element).find('a').attr('href'),
            checked:false
        })
    })
    res.status(200).json(data)
}
