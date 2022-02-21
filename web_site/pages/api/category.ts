// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import { createClient } from 'redis';

type Data = {
  title: string
  link: string | undefined
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data[]>
) {
  const key: string = "categories";
  let categories: Data[] = []
  const client = createClient(
    {
      url: `redis://${process.env['REDIS_HOST']}:${process.env['REDIS_PORT']}`,
    }
  );

  await client.connect();
  const cacheData = await client.getEx(key, { "EX": 20 });
  if (cacheData != null) {
    categories = JSON.parse(cacheData)
  } else {
    const reqData = await fetch('https://www.comicun.com/')
    const resData = await reqData.text()
    const $ = cheerio.load(resData);
    $('.nav_type > dl > dd').children('a').each(function (index, element) {
      if (index != 0)
        categories.push({ title: $(element).text(), link: $(element).attr('href') })
    });
    await client.setEx(key, 20, JSON.stringify(categories))
  }
  await client.disconnect();
  res.status(200).json(categories)
}
