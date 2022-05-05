// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import { createClient } from 'redis';
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
  if (req.query['id'] === "1") {
    const reqData = await fetch('https://www.comicun.com/')
    const resData = await reqData.text()
    const $ = cheerio.load(resData);
    $('.nav_type > dl > dd').children('a').each(function (index, element) {
      if (index != 0)
        categories.push({ title: $(element).text(), link: $(element).attr('href') })
    });
  } else {
    const reqData = await fetch('https://18comic.org/')
    const resData = await reqData.text()
    const $ = cheerio.load(resData);
    $('.phoneclass').children('a').each(function (index, element) {

      categories.push({ title: $(element).find('span').text(), link: `https://18comic.org${$(element).attr('href')}` })
    });
  }

  res.status(200).json(categories)
}
