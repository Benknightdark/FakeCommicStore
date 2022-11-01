import * as cheerio from 'cheerio';
import cloudscraper from 'cloudscraper';
import fetch from 'node-fetch';
import retry from 'promise-fn-retry';

export const getCherrioData = async (url: string) => {
  const options = {
    times: 5,
    initialDelay: 100,
  };
  const promiseFn = () => fetch(url);
  let resText = '';
  const reqData = await retry(promiseFn, options)
  if (reqData.status === 200) {
    resText = await reqData.text()
  } else {
    console.log(url)
    var options2 = {
      method: 'GET',
      url: encodeURI(url),
    };
    const d = await cloudscraper(options2);
    resText = d;
  }
  const $ = cheerio.load(resText);
  return $;
}