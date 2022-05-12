// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { csrTokenCheck } from '../../helpers/csr-token-helper';
import { getCherrioData } from '../../helpers/cheerio-helper';

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
    await csrTokenCheck(req, res)
    const data: Data[] = []
    const url: string = req.query['url'].toString()
    const page: string = req.query['page'].toString()
    const id: string = req.query['id'].toString();

    const $ = (await getCherrioData(`${url}&page=${page}`))
    switch (id) {
        case '1':
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
            break;
        case '2':
            let albumnsList = $('.thumb-overlay-albums');
            if (albumnsList.length === 0) {
                albumnsList = $('.thumb-overlay');
            }
            albumnsList.each((i, el) => {
                const target = $(el).find('a')
                console.log(target.attr('href'))
                console.log(target.find('img').attr('src'))
                console.log(target.find('img').attr('title'))
                console.log('------------------------------')
                data.push({
                    title: target.find('img').attr('title'),
                    image: target.find('img').attr('src'),
                    link: `https://18comic.org${target.attr('href')}`,
                    modifiedDate: '',
                    status: '',
                    category: '',
                })
            })
            break;
        case '3':
            $('.mh-item').each((i, el) => {
                const target = $(el).find('a')
                data.push({
                    title: target.attr('title'),
                    image: target.find('p').css()['background-image'].replace('url(', '').replace(')', ''),
                    //url(http://www.jjmhw.cc/static/upload/book/558/cover.jpg),
                    link: `https://www.jjmhw.cc/booklist${target.attr('href')}`,
                    modifiedDate: '',
                    status: '',
                    category: '',
                })
            })
            break;
    }
    

    res.status(200).json(data)
}
