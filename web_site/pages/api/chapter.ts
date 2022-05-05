// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import { csrTokenCheck } from '../../helpers/csr-token-helper';

type Data = {
    title: string | undefined,
    link: string | undefined,
    checked: boolean
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
    await csrTokenCheck(req, res)
    const id: string = req.query['id'].toString();
    const url: string = req.query['url'].toString()
    const reqData = await fetch(url)
    const resData = await reqData.text()
    const $ = cheerio.load(resData);
    const data: Data[] = []
    if (id === "1") {
        $('#play_1').find('ul').children('li').each((index, element) => {

            data.push({
                title: $(element).find('a').attr('title'),
                link: $(element).find('a').attr('href'),
                checked: false
            })
        })
    } else {
        $($('.btn-toolbar')[0]).find('a').each((i, el) => {
            data.push({
                title: $(el).find('li').text(),
                link: `https://18comic.org${$(el).attr('href')}`,
                checked: false
            })
        })
    }

    res.status(200).json(data)
}
