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
    await csrTokenCheck(req, res)
    const selectData = req.body
    const $ = (await getCherrioData(selectData.url))
    let data: any[] = []
    switch (selectData.id) {
        case 1:
            const maxPage=$("[name='select1']").children().length;
            const $2 = await getCherrioData(`${selectData.url}`);
            const firstPageImage=$2('#ComicPic').attr('src');
            data.push({ src:firstPageImage })
            const p= new URL(firstPageImage!)
            let ImageFileName=p.pathname.split('/')[p.pathname.split('/').length-1];
            const rootUrl=firstPageImage!.replace(ImageFileName,'')
            for (let index = 1; index <= maxPage; index++) {
                 data.push({ src:`${rootUrl}${Number(ImageFileName.split('.')[0])+index}.jpg`})
            }
            break;
        case 3:
            const imgList = $('.lazy')
            imgList.each((i, elem) => {
                console.log(elem.attributes[1].value)
                data.push({ src: elem.attributes[1].value })
            })
            break;

        default:
            break;
    }
    res.status(200).json(data)
}
