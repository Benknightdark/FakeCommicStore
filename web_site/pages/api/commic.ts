// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

type Data = {
    title: string | undefined,
    image: string | undefined,
    link: string | undefined,
    modifiedDate: string | undefined,
    status: string | undefined,
    category: string | undefined,

}

/**
 * 取得特定類別裡的所有漫畫
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
    const page: string = req.query['page'].toString()
    console.log(`${url}&page=${page}`)
    const reqData = await fetch(`${url}&page=${page}`)
    const resData = await reqData.text()
    const $ = cheerio.load(resData);
    const data: Data[] = []
    $('#dmList').find('ul').children('li').each((index, element) => {
        const picDom = $(element).find('.pic')
        const link = picDom.attr('href')
        const picDomAttr = picDom.find('img').attr()
        const image = picDomAttr['src']
        const title = picDomAttr['alt']
        const modifiedDate = $(element).find('dd').find('p:nth-child(1)').find('span').text()
        const status = $(element).find('dd').find('p:nth-child(2)').find('span').text()
        const category = $(element).find('dd').find('p:nth-child(3)').find('a').text()
        data.push({
            title: title,
            image: image,
            link: link,
            modifiedDate: modifiedDate,
            status: status,
            category: category,
        })
    })
    res.status(200).json(data)
}
