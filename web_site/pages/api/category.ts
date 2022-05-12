// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getCherrioData } from '../../helpers/cheerio-helper';
import { csrTokenCheck } from '../../helpers/csr-token-helper';

type Data = {
  title: string
  link: string | undefined
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data[] | any>
) {
  await csrTokenCheck(req, res)
  let categories: Data[] = []
  switch (req.query['id']) {
    case "1":
      const $1 = (await getCherrioData('https://www.comicun.com/'))
      $1('.nav_type > dl > dd').children('a').each(function (index, element) {
        if (index != 0)
          categories.push({ title: $1(element).text(), link: $1(element).attr('href') })
      });
      break;
    case "2":
      const $2 = (await getCherrioData('https://18comic.org/'))
      $2('.phoneclass').children('a').each(function (index, element) {
        categories.push({ title: $2(element).find('span').text(), link: `https://18comic.org${$2(element).attr('href')}` })
      });
      break;
    case "3":
      const $3 = (await getCherrioData('https://www.jjmhw.cc/booklist'))
      let area=-1;
      $3('#areas').find('a').each(function (index, element) {
        categories.push({ title: $3(element).text(), link: `https://www.jjmhw.cc/booklist?tag=全部&area=${area}&end=-1` })
        area=area+2
      });
      break;
  }


  res.status(200).json(categories)
}
