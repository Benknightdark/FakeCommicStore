// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import { csrTokenCheck } from '../../helpers/csr-token-helper';
import { getCherrioData } from '../../helpers/cheerio-helper';

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
    const url: string = req.query['url'].toString();
    const $ = (await getCherrioData(url))//cheerio.load(resData);
    const data: Data[] = []
    console.log(url)
    console.log(id)
    switch (id) {
        case "1":
            $('#play_1').find('ul').children('li').each((index, element) => {

                data.push({
                    title: $(element).find('a').attr('title'),
                    link: $(element).find('a').attr('href'),
                    checked: false
                })
            })
            break;
        case "2":
            $($('.btn-toolbar')[0]).find('a').each((i, el) => {
                data.push({
                    title: $(el).find('li').text(),
                    link: `https://18comic.org${$(el).attr('href')}`,
                    checked: false
                })
            })
            break;
        case "3":
            $('#detail-list-select').children('li').each((i,el)=>{
                const target=$(el).find('a')
                data.push({
                    title: target.text(),
                    link: `https://www.jjmhw.cc${target.attr('href')}`,
                    checked: false
                })
            })
            break;
    }


    res.status(200).json(data)
}
