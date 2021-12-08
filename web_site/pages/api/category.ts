// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import clientPromise from '../../helpers/mongodb-client';

type Data = {
  title: string
  link: string | undefined
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data[]>
) {
  const reqData = await fetch('https://www.comicun.com/')
  const resData = await reqData.text()
  const $ = cheerio.load(resData);
  const categories: Data[] = []
  $('.nav_type > dl > dd').children('a').each(function (index, element) {
    if (index != 0)
      categories.push({ title: $(element).text(), link: $(element).attr('href') })
  });
  (await clientPromise).db("web_site").collection('user').insertMany([{ a: 1 }, { a: 2 }, { a: 3 }]);
  res.status(200).json(categories)
}
