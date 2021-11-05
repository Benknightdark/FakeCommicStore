from scrapy_redis.spiders import RedisSpider
from bs4 import BeautifulSoup
import os
import logging
from urllib.parse import urlparse
from urllib.parse import parse_qs
import redis
import os


class CommicUrlSpider(RedisSpider):
    name = 'commic_url'
    custom_settings = {
        'ROBOTSTXT_OBEY': True
    }

    def parse(self, response):
        redis_client = redis.Redis(host=os.getenv(
            'REDIS_CONNECTION_STRING'), port=os.getenv('REDIS_CONNECTION_PORT'), db=0)
        parsed_url = urlparse(response.url)
        root_url = response.url.split('?')[0]
        rootFolderName = parse_qs(parsed_url.query)['rootFolderName'][0]
        subFolderName = parse_qs(parsed_url.query)['subFolderName'][0]
        commic_res = response.text
        commic_root = BeautifulSoup(commic_res, 'lxml')
        max_page = commic_root.find(
            'select', attrs={"name": 'select1'})
        max_page_option_value = max_page.find_all('option')
        new_url_array = []
        for v in max_page_option_value:
            new_url = f"{root_url}-p-{v['value']}?index={v['value']}&rootFolderName={rootFolderName}&subFolderName={subFolderName}"
            logging.info(new_url)
            new_url_array.append(new_url)
            redis_client.lpush('chapter_url:start_urls', new_url)
        return {'data': new_url_array}
