import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
export const getCherrioData = async (url: string) => {
    const reqData = await fetch(url)
    const resData = await reqData.text()
    const $ = cheerio.load(resData);
    return $;
  }